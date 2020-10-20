import { StudioOutput } from "../../types/studio";
import { Api, buildImageUrls, EntityResult } from "./api";
import { MyStudioContext, MyValidatedStudioContext } from "./types";
import {
  getExtractionPreferenceFromName,
  normalizeStudioName,
  Preference,
  slugify,
  suppressProp,
  validateArgs,
} from "./util";

export class ChannelExtractor {
  ctx: MyValidatedStudioContext;
  channel?: EntityResult.Entity;
  network?: EntityResult.Entity;
  preference: Preference;

  /**
   * @param ctx - plugin context
   * @param input - extractor input
   * @param input.channel - the matched channel
   * @param input.network - the matched network
   * @param input.preference - if should return channel/network, or according
   * to user args
   */
  constructor(
    ctx: MyValidatedStudioContext,
    {
      channel,
      network,
      preference,
    }: {
      channel?: EntityResult.Entity;
      network?: EntityResult.Entity;
      preference: Preference;
    }
  ) {
    this.ctx = ctx;
    this.channel = channel;
    this.network = network;
    this.preference = preference;
  }

  getPreferredEntity(): EntityResult.Entity | undefined {
    if (this.preference === "channel") {
      return this.channel;
    }
    if (this.preference === "network") {
      return this.network;
    }
    if (this.channel && this.network) {
      return this.ctx.args.studios.channelPriority ? this.channel : this.network;
    }

    return this.channel || this.network;
  }

  private _getName(): Partial<{ name: string }> {
    const baseName = this.getPreferredEntity()?.name;
    if (!baseName) {
      return {};
    }

    const ignoreNameConflicts =
      this.channel?.name !== this.network?.name || !this.ctx.args.studios.uniqueNames;
    if (ignoreNameConflicts) {
      return { name: baseName };
    }

    let suffix: string = "";
    if (this.preference === "channel") {
      suffix = this.ctx.args.studios.channelSuffix;
    } else if (this.preference === "network") {
      suffix = this.ctx.args.studios.networkSuffix;
    } else if (this.channel && this.network) {
      suffix = this.ctx.args.studios.channelPriority
        ? this.ctx.args.studios.channelSuffix
        : this.ctx.args.studios.networkSuffix;
    }

    return { name: `${baseName}${suffix}` };
  }

  public getName(): Partial<{ name: string }> {
    if (suppressProp(this.ctx, "name")) {
      return {};
    }

    return this._getName();
  }

  getDescription(): Partial<{ description: string }> {
    if (suppressProp(this.ctx, "description")) {
      return {};
    }

    return { description: this.getPreferredEntity()?.description || "" };
  }

  getParent(): Partial<{ parent: string }> {
    if (suppressProp(this.ctx, "parent")) {
      return {};
    }

    const parentName = this.getPreferredEntity()?.parent?.name;
    if (!parentName) {
      return {};
    }

    if (this.getPreferredEntity()?.name === parentName) {
      if (this.ctx.args.studios.uniqueNames) {
        return { parent: `${parentName}${this.ctx.args.studios.networkSuffix}` };
      }
      this.ctx.$log(`[TRAXXX] MSG: Cannot return parent name, would conflict with current name`);
      return {};
    }

    return { parent: parentName };
  }

  async getThumbnail(): Promise<Partial<{ thumbnail: string }>> {
    if (suppressProp(this.ctx, "thumbnail")) {
      return {};
    }

    const entity = this.getPreferredEntity();
    if (!entity) {
      return {};
    }

    const imageUrls = buildImageUrls(entity);

    if (!imageUrls.thumbnail) {
      return {};
    }

    const thumbnail = this.ctx.args.dry
      ? `_would_have_created_${imageUrls.thumbnail}`
      : await this.ctx.$createImage(
          imageUrls.thumbnail,
          this._getName().name || this.ctx.studioName,
          true
        );

    return {
      thumbnail,
    };
  }

  getCustom(): Partial<{ traxxx_id: number; traxxx_type: string; url: string }> {
    return {
      traxxx_id: this.getPreferredEntity()?.id,
      traxxx_type: this.getPreferredEntity()?.type,
      url: this.getPreferredEntity()?.url,
    };
  }
}

export default async (initialContext: MyStudioContext): Promise<StudioOutput> => {
  const { $log, $throw, studioName } = initialContext;

  async function main() {
    try {
      const validatedArgs = validateArgs(initialContext);
      if (validatedArgs) {
        initialContext.args = validatedArgs;
      }
    } catch (err) {
      $throw(err);
      return {};
    }

    // Can assert all properties exist, since we just validated them above
    const ctx = initialContext as MyValidatedStudioContext;
    const args = ctx.args;

    const api = new Api(ctx);

    const preference = getExtractionPreferenceFromName(ctx, studioName);
    const slugifiedName = slugify(normalizeStudioName(ctx, studioName));

    ctx.$log(`[TRAXXX] MSG: Trying to match "${studioName}" as "${slugifiedName}"`);
    if (preference !== "none") {
      ctx.$log(`[TRAXXX] MSG: Identified as ${preference} from current name`);
    }

    const searchPromises: Promise<EntityResult.Entity | undefined>[] = [];

    // We still need to search for both channels & networks, even if
    // we know the type, so that we can tell if there would be name conflicts
    searchPromises.push(
      api
        .getChannel(slugifiedName)
        .then((res) => res.data.entity)
        .catch((err) => {
          $log(`[TRAXXX] WARN: ${err.message}`);
          $log(`[TRAXXX] WARN: Could not find/fetch channel "${studioName}"`);
          return undefined;
        })
    );
    searchPromises.push(
      api
        .getNetwork(slugifiedName)
        .then((res) => res.data.entity)
        .catch((err) => {
          $log(`[TRAXXX] WARN: ${err.message}`);
          $log(`[TRAXXX] WARN: Could not find/fetch network "${studioName}"`);
          return undefined;
        })
    );

    const [channel, network] = await Promise.all(searchPromises);

    if (!channel && !network) {
      $log(`[TRAXXX] WARN: Could not find channel or network "${studioName}" in TRAXXX`);
      return {};
    }

    const channelExtractor = new ChannelExtractor(ctx, {
      channel,
      network,
      preference,
    });

    const result: StudioOutput = {
      ...channelExtractor.getName(),
      ...channelExtractor.getDescription(),
      ...(await channelExtractor.getThumbnail()),
      ...channelExtractor.getParent(),
      custom: channelExtractor.getCustom(),
    };

    if (args.dry) {
      $log("[TRAXXX] MSG: Is 'dry' mode, would've returned:");
      $log(result);
      return {};
    }

    return result;
  }

  try {
    return main();
  } catch (err) {
    $log(err);
    $log(`[TRAXXX] ERR: Plugin failed`);
    $throw(err);
    return {};
  }
};
