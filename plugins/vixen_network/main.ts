import { Context } from "../../types/plugin";

function getJSONFromScriptTag(str: string): any {
  const jsonMatch = str.match(/{.*};/);

  let brackets = 0;
  let lastIndex = 0;

  for (let i = 0; i < jsonMatch![0].length; i++) {
    const char = jsonMatch![0].charAt(i);

    if (char == "{") brackets++;
    else if (char == "}") brackets--;

    if (brackets == 0) {
      lastIndex = i + 1;
      break;
    }
  }

  return JSON.parse(jsonMatch![0].substring(0, lastIndex));
}

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

  const result: {
    custom: Record<string, unknown>;
    $markers: { id: string; name: string; time: number }[];
    [key: string]: unknown;
  } = {
    custom: {},
    $markers: [],
  };
  $logger.verbose(`Checking VIXEN sites for "${scene.path}"`);

  const basename = $path.basename(scene.path);
  const filename = basename.replace($path.extname(basename), "");

  const site = findSite(ctx, filename);

  if (!site) {
    $logger.warn(`No VIXEN site found in "${scene.path}"`);
    return {};
  }

  const searchResults = await search(ctx, site.url, filename);

  const found = searchResults.find(({ title }) => basicMatch(ctx, filename, title));

  if (!found) {
    $logger.warn(`No result found for "${site.url}"`);
    return {};
  }

  result.name = found.title;
  result.actors = found.modelsSlugged.map(({ name }) => name).sort();
  result.description = found.description;
  result.studio = site.name;

  const args = getArgs(ctx);

  if (args.deep === false) {
    $logger.verbose("Not getting deep info");
  } else {
    const sceneUrl = site.url + found.targetUrl;
    $logger.verbose(`Getting more scene info (deep: true): ${sceneUrl}`);

    const html = (await ctx.$axios.get<string>(sceneUrl)).data;
    const scripts = html.match(
      /(<|%3C)script[\s\S]*?(>|%3E)[\s\S]*?(<|%3C)(\/|%2F)script[\s\S]*?(>|%3E)/gi
    );
    const parsed = getJSONFromScriptTag(scripts!.find((s) => s.includes("INITIAL_STATE"))!);

    const shootId = parsed.page.data[found.targetUrl].data.video;
    const scene = parsed.videos.find((video) => video.newId === shootId);

    result.custom.director = scene.directorNames;
    result.labels = scene.categories.map(({ name }) => name);

    const thumbUrl = decodeURI(scene.trippleThumbUrlSizes.mainThumb["1040w"]).replace(
      /&amp;/g,
      "&"
    );
    result.$thumbnail = thumbUrl;

    if (args.useThumbnail) {
      result.thumbnail = await ctx.$createImage(thumbUrl, `${result.name}`, true);
    }

    if (args.useChapters) {
      const chapters = scene.chapters.video as { title: string; seconds: number }[];
      for (const { title, seconds } of chapters) {
        const id = await ctx.$createMarker(title, seconds);
        result.$markers.push({
          id,
          name: title,
          time: seconds,
        });
      }
    }
  }

  if (args.dry) {
    $logger.info(`Would have returned ${$formatMessage(result)}`);
    return {};
  }

  return result;
};
