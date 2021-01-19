import { Context } from "../../types/plugin";

type MyContext = Context & { sceneName?: string } & { scene: { path: string } };

const sites = [
  {
    name: "BLACKED RAW",
    url: "http://blackedraw.com",
  },
  {
    name: "BLACKED",
    url: "http://blacked.com",
  },
  {
    name: "TUSHY RAW",
    url: "http://tushyraw.com",
  },
  {
    name: "TUSHY",
    url: "http://tushy.com",
  },
  {
    name: "VIXEN",
    url: "http://vixen.com",
  },
  {
    name: "DEEPER",
    url: "http://deeper.com",
  },
];

function getArgs(ctx: MyContext) {
  return ctx.args as Record<string, unknown>;
}

async function search(ctx: MyContext, siteUrl: string, query: string) {
  const url = `${siteUrl}/api/search/__autocomplete`;
  ctx.$logger.debug(`GET ${url}`);
  const res = await ctx.$axios.get(url, {
    params: {
      q: query,
    },
  });
  return res.data.data.videos as {
    title: string;
    description: string;
    modelsSlugged: { name: string; slugged: string }[];
    targetUrl: string;
  }[];
}

function basicMatch(ctx: MyContext, a: string, b: string) {
  const stripString = <string>getArgs(ctx).stripString || "[^a-zA-Z0-9'/\\,()[\\]{}-]";
  const stripRegex = new RegExp(stripString, "g");

  function normalize(str: string) {
    return str.trim().toLocaleLowerCase().replace(stripRegex, "");
  }

  return normalize(a).includes(normalize(b));
}

function findSite(ctx: MyContext, name: string) {
  return sites.find((site) => {
    ctx.$logger.debug(`Compare "${name}" <-> "${site.name}"`);
    return basicMatch(ctx, name, site.name);
  });
}

module.exports = async (ctx: MyContext): Promise<any> => {
  const { $logger, sceneName, scene, event, $formatMessage, $path } = ctx;

  if (!sceneName) {
    $logger.error(`Invalid event: ${event}`);
    return {};
  }

  const result: Record<string, unknown> = {};
  $logger.verbose(`Checking VIXEN sites for "${scene.path}"`);

  const basename = $path.basename(scene.path);
  const filename = basename.replace($path.extname(basename), "");

  const site = findSite(ctx, filename);

  if (!site) {
    $logger.warn(`No VIXEN site found in "${scene.path}"`);
    return {};
  }

  const searchResults = await search(ctx, site.url, filename);

  const firstResult = searchResults[0];

  if (!firstResult) {
    $logger.warn(`No result found for "${site.url}"`);
    return {};
  }

  if (!basicMatch(ctx, filename, firstResult.title)) {
    $logger.warn(`Found result "${firstResult.title}", but does not actually match`);
    return {};
  }

  result.name = firstResult.title;
  result.actors = firstResult.modelsSlugged.map((model) => model.name).sort();
  result.description = firstResult.description;

  // TODO: Use firstResult.targetUrl to scrape more data

  const args = getArgs(ctx);
  if (args.dry) {
    $logger.info(`Would have returned ${$formatMessage(result)}`);
    return {};
  }

  return result;
};
