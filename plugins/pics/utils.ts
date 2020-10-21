import { MyContext } from "./types";

export interface ScrapeDefinition {
  path: string;
  outputProp: string;
}

export interface ScrapeResult {
  [imageProp: string]: string;
}

export interface ScrapeMapping {
  argProp: string;
  outputProp: string;
}

const IMAGE_EXTENSIONS = [".jpg", ".png", ".jpeg", ".gif"];

export async function scanFolder<T = { [imageProp: string]: string }>(
  ctx: MyContext,
  query: string,
  searchDir: string,
  prop: string
): Promise<T | {}> {
  const path = ctx.$path.resolve(searchDir);

  ctx.$log(`[PICS]: MSG: Trying to find ${prop} pictures of ${query} in ${path}`);

  let didFindRes = false;
  let res: T | null = null;

  await ctx.$walk({
    dir: path,
    extensions: IMAGE_EXTENSIONS,
    exclude: [],
    cb: async (imagePath) => {
      if (didFindRes) {
        return;
      }

      const isMatchingFile = imagePath.toLowerCase().includes(query.toLowerCase());
      if (!isMatchingFile) {
        return;
      }

      ctx.$log(`[PICS] MSG: Found ${prop} picture for ${query}`);

      const image = ctx.args?.dry
        ? `_would_have_created_image_${imagePath}`
        : await ctx.$createLocalImage(imagePath, query, true);

      res = ({
        [prop]: image,
      } as any) as T;
      didFindRes = true;
    },
  });

  if (!res) {
    ctx.$log(`[PICS]: MSG: No ${prop} pictures of ${query} in ${path}`);
    return {};
  }

  return res;
}

export const buildScrapeDefinitions = (
  ctx: MyContext,
  pathHolder: { [pathProp: string]: string | undefined },
  scrapeMappings: ScrapeMapping[]
): ScrapeDefinition[] => {
  if (!pathHolder) {
    return [];
  }

  // Declare a filter predicate so we can assert the return type of .filter
  const predicate = (def?: {
    path: string | undefined;
    outputProp: string;
  }): def is ScrapeDefinition => Boolean(def);

  return scrapeMappings
    .map((def) => {
      const path = pathHolder[def.argProp];
      const resolvedPath = path ? ctx.$path.resolve(path) : null;

      if (!path || !resolvedPath) {
        ctx.$log(`[PICS] MSG: no path for ${def.outputProp}, skipping`);
        return undefined;
      }

      return { path: resolvedPath, outputProp: def.outputProp };
    })
    .filter(predicate);
};

/**
 *
 * @param ctx - plugin context
 * @param queryProp - the property containing the name to search for. Ex: 'actorName'
 * @param pathsObj - the property containing the arguments for the paths
 * @param scrapeMappings - mapping from a path to a property to return
 */
export async function executeScape(
  ctx: MyContext,
  query: string,
  pathsObj: { [pathProp: string]: string | undefined },
  scrapeMappings: ScrapeMapping[]
): Promise<ScrapeResult> {
  const scrapeDefinitions = buildScrapeDefinitions(ctx, pathsObj, scrapeMappings);

  let result: ScrapeResult = {};

  const scrapePromises = scrapeDefinitions.map((definition) =>
    scanFolder(ctx, query, definition.path, definition.outputProp)
      .then((scanRes) => {
        Object.assign(result, scanRes);
      })
      .catch((err) => {
        ctx.$log(err);
        ctx.$log(`[PICS] ERR: scrape ${definition.path} for ${definition.outputProp} failed`);
        return {};
      })
  );

  await Promise.all(scrapePromises);

  return result;
}
