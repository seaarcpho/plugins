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

export interface ScrapeResult {
  [imageProp: string]: string;
}

const IMAGE_EXTENSIONS = [".jpg", ".png", ".jpeg", ".gif"];

export async function scanFolder(
  ctx: MyContext,
  query: string,
  scrapeDefinition: ScrapeDefinition
): Promise<Partial<ScrapeResult>> {
  const queryPath = ctx.$path.resolve(scrapeDefinition.path);

  ctx.$log(
    `[PICS]: MSG: Trying to find "${scrapeDefinition.prop}" pictures of "${query}" in "${queryPath}"`
  );

  let foundImagePath: string = "";

  await ctx.$walk({
    dir: queryPath,
    extensions: IMAGE_EXTENSIONS,
    exclude: [],
    cb: async (imagePath) => {
      if (foundImagePath) {
        return;
      }

      // The file is a match if both the query and the searchTerm are found
      const itemsToMatch: MatchSource[] = [
        {
          _id: scrapeDefinition.prop,
          name: query,
        },
      ];
      if (scrapeDefinition.searchTerm) {
        itemsToMatch.push({
          _id: scrapeDefinition.prop,
          name: scrapeDefinition.searchTerm,
        });
      }

      const allSearchTermsFound =
        ctx.$matcher.filterMatchingItems(itemsToMatch, imagePath, (el) => [el.name]).length ===
        itemsToMatch.length;
      if (!allSearchTermsFound) {
        return;
      }

      foundImagePath = imagePath;
    },
  });

  if (!foundImagePath) {
    ctx.$log(`[PICS]: MSG: No "${scrapeDefinition.prop}" pictures of "${query}" in "${queryPath}"`);
    return {};
  }

  ctx.$log(
    `[PICS] MSG: Found "${scrapeDefinition.prop}" picture for "${query}": "${foundImagePath}"`
  );

  const imageId = ctx.args.dry
    ? `_would_have_created_image_${foundImagePath}`
    : await ctx.$createLocalImage(
        foundImagePath,
        `${query} ${scrapeDefinition.prop}`,
        scrapeDefinition.prop !== "extra"
      );

  if (scrapeDefinition.prop === "extra") {
    // Extra images don't need to be returned
    return {};
  }

  return {
    [scrapeDefinition.prop]: imageId,
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
  let result: ScrapeResult = {};

  const scrapePromises = scrapeDefinitions.map((definition) =>
    scanFolder(ctx, query, definition)
      .then((scanRes) => {
        Object.assign(result, scanRes);
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
