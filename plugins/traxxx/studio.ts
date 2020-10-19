import { StudioOutput } from "../../types/studio";
import { Api, EntityResult } from "./api";
import { MyStudioContext, MyValidatedStudioContext, DeepPartial, MyStudioArgs } from "./types";
import { normalizeStudioName, slugify } from "./util";

export const validateArgs = ({
  args,
  $throw,
  $log,
  studioName,
}: MyStudioContext): MyStudioArgs | void => {
  let validatedArgs: DeepPartial<MyStudioArgs> | undefined;
  if (args && typeof args === "object") {
    // Copy object
    validatedArgs = { ...args };
  }

  if (!studioName || typeof studioName !== "string") {
    return $throw(`Missing "studioName", cannot run plugin`);
  }

  if (!validatedArgs || typeof validatedArgs !== "object") {
    return $throw(`Missing args, cannot run plugin`);
  }

  if (!validatedArgs.studios || typeof validatedArgs.studios !== "object") {
    return $throw(`Missing arg "studios", cannot run plugin`);
  } else {
    // Copy object
    validatedArgs.studios = { ...validatedArgs.studios };
  }

  if (
    !Object.hasOwnProperty.call(validatedArgs.studios, "channelPriority") ||
    typeof validatedArgs.studios.channelPriority !== "boolean"
  ) {
    $log(`[TRAXXX] MSG: Missing "args.studios.channelPriority, setting to default: "true"`);
    validatedArgs.studios.channelPriority = true;
  }

  if (
    !Object.hasOwnProperty.call(validatedArgs.studios, "uniqueNames") ||
    typeof validatedArgs.studios.uniqueNames !== "boolean"
  ) {
    $log(`[TRAXXX] MSG: Missing "args.studios.uniqueNames, setting to default: "true"`);
    validatedArgs.studios.uniqueNames = true;
  }

  if (
    !Object.hasOwnProperty.call(validatedArgs.studios, "channelSuffix") ||
    typeof validatedArgs.studios.channelSuffix !== "string"
  ) {
    $log(`[TRAXXX] MSG: Missing "args.studios.channelSuffix", setting to default: " (Channel)"`);
    validatedArgs.studios.channelSuffix = " (Channel)";
  }

  if (
    !Object.hasOwnProperty.call(validatedArgs.studios, "networkSuffix") ||
    typeof validatedArgs.studios.networkSuffix !== "string"
  ) {
    $log(`[TRAXXX] MSG: Missing "args.studios.networkSuffix, setting to default: " (Network)"`);
    validatedArgs.studios.networkSuffix = " (Network)";
  }

  // At the end of this function, validatedArgs will have type MyStudioArgs
  // since we merged defaults
  return validatedArgs as MyStudioArgs;
};

export class ChannelExtractor {
  ctx: MyValidatedStudioContext;
  channel?: EntityResult.Entity;
  network?: EntityResult.Entity;

  constructor(
    ctx: MyValidatedStudioContext,
    channel?: EntityResult.Entity,
    network?: EntityResult.Entity
  ) {
    this.ctx = ctx;
    this.channel = channel;
    this.network = network;
  }

  getPreferredEntity(): EntityResult.Entity | undefined {
    return this.ctx.args.studios.channelPriority ? this.channel : this.network;
  }

  getName(): Partial<{ name: string }> {
    const suffix = this.ctx.args.studios.channelPriority
      ? this.ctx.args.studios.channelSuffix
      : this.ctx.args.studios.networkSuffix;

    const baseName = this.getPreferredEntity()?.name;
    if (!baseName) {
      return {};
    }

    const ignoreNameConflicts =
      this.channel?.name !== this.network?.name || !this.ctx.args.studios.uniqueNames;
    if (ignoreNameConflicts) {
      return { name: baseName };
    }

    return { name: `${baseName}${suffix}` };
  }

  getDescription(): Partial<{ description: string }> {
    return { description: this.getPreferredEntity()?.description || "" };
  }

  getParent(): Partial<{ parent: string }> {
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

  const slugifiedName = slugify(normalizeStudioName(ctx, studioName));
  ctx.$log(`[TRAXXX] MSG: Trying to match "${studioName}" as "${slugifiedName}"`);

  let channel: EntityResult.Entity | undefined;
  let network: EntityResult.Entity | undefined;

  try {
    const apiRes = await api.getChannel(slugifiedName);
    channel = apiRes.data.entity;
  } catch (err) {
    $log(`[TRAXXX] ERR: ${err.message}`);
    $log(`[TRAXXX] ERR: Could not find/fetch channel "${studioName}"`);
  }
  try {
    const apiRes = await api.getNetwork(slugifiedName);
    network = apiRes.data.entity;
  } catch (err) {
    $log(`[TRAXXX] ERR: ${err.message}`);
    $log(`[TRAXXX] ERR: Could not find/fetch network "${studioName}"`);
  }

  if (!channel && !network) {
    $log(`[TRAXXX] ERR: Could not find channel or network "${studioName}" in TRAXXX`);
    return {};
  }

  const channelExtractor = new ChannelExtractor(ctx, channel, network);

  const result: StudioOutput = {
    ...channelExtractor.getName(),
    ...channelExtractor.getDescription(),
    ...channelExtractor.getParent(),
    custom: channelExtractor.getCustom(),
  };

  if (args.dry) {
    $log("[TRAXXX] MSG: Is 'dry' mode, would've returned:");
    $log(result);
    return {};
  }

  return result;
};
