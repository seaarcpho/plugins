import { MatchSource } from "../../types/plugin";
import { MyContext, ScrapeDefinition, ArgsSchema } from "./types";

export const validateArgs = (args): true | Error => {
  try {
    ArgsSchema.parse(args);
  } catch (err) {
    return err as Error;
  }
  return true;
};

export type ScrapeResult = Partial<
  {
    [key in Exclude<ScrapeDefinition["prop"], "extra">]: string;
  }
> & { extra: string[] };

type SingleScrapeResult = {
  [key in Exclude<ScrapeDefinition["prop"], "extra">]: string;
} & { extra: string[] };

const IMAGE_EXTENSIONS = [".jpg", ".png", ".jpeg", ".gif"];

export async function scanFolder(
  ctx: MyContext,
  query: string,
  scrapeDefinition: ScrapeDefinition
): Promise<Partial<SingleScrapeResult>> {
  const queryPath = ctx.$path.resolve(scrapeDefinition.path);

  ctx.$log(
    `[PICS]: MSG: Trying to find "${scrapeDefinition.prop}" pictures of "${query}" in "${queryPath}"`
  );

  const foundImagePaths: string[] = [];

  await ctx.$walk({
    dir: queryPath,
    extensions: IMAGE_EXTENSIONS,
    exclude: [],
    cb: async (imagePath) => {
      // The file is a match if both the query and all searchTerms are found
      // while no blacklisted terms are found
      const itemsToMatch: MatchSource[] = [query, ...(scrapeDefinition.searchTerms || [])].map(
        (el) => ({
          _id: `${scrapeDefinition.prop} ${el}`,
          name: el,
        })
      );
      const blacklistedItems: MatchSource[] = (scrapeDefinition.blacklistTerms || []).map(
        (str) => ({
          _id: str,
          name: str,
        })
      );

      const isMatch =
        ctx.$matcher.filterMatchingItems(itemsToMatch, imagePath, (el) => [el.name]).length ===
          itemsToMatch.length &&
        !ctx.$matcher.filterMatchingItems(blacklistedItems, imagePath, (el) => [el.name]).length;
      if (!isMatch) {
        return;
      }

      foundImagePaths.push(imagePath);
      if (scrapeDefinition.prop !== "extra" || !scrapeDefinition.getAllExtra) {
        // Returning a truthy value will stop the walk
        return true;
      }
    },
  });

  if (!foundImagePaths.length) {
    ctx.$log(`[PICS]: MSG: No "${scrapeDefinition.prop}" pictures of "${query}" in "${queryPath}"`);
    return {};
  }

  ctx.$log(
    `[PICS] MSG: Found ${foundImagePaths.length} "${
      scrapeDefinition.prop
    }" picture(s) for "${query}": ${JSON.stringify(foundImagePaths)}`
  );

  return {
    [scrapeDefinition.prop]:
      scrapeDefinition.prop === "extra" ? foundImagePaths : foundImagePaths[0],
  };
}

/**
 *
 * @param ctx - plugin context
 * @param query - the item name to search for
 * @param scrapeDefinitions - definition of scrape props
 */
export async function executeScape(
  ctx: MyContext,
  query: string,
  scrapeDefinitions: ScrapeDefinition[]
): Promise<ScrapeResult> {
  let result: ScrapeResult = { extra: [] };

  const scrapePromises = scrapeDefinitions.map((definition) =>
    scanFolder(ctx, query, definition)
      .then((scanRes) => {
        const image = scanRes[definition.prop];
        if (definition.prop !== "extra" && image && typeof image === "string") {
          result[definition.prop] = image;
        } else if (scanRes.extra) {
          if (definition.getAllExtra) {
            result.extra.push(...scanRes.extra);
          } else {
            result.extra = scanRes.extra;
          }
        }
      })
      .catch((err) => {
        ctx.$log(err);
        ctx.$log(`[PICS] ERR: scrape "${definition.prop}" in "${definition.path}" failed`);
        return {};
      })
  );

  await Promise.all(scrapePromises);

  return result;
}

export const entries = Object.entries as <T>(o: T) => [Extract<keyof T, string>, T[keyof T]][];
