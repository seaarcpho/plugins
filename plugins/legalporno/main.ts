import { Context } from "../../types/plugin";

type MyContext = Context & { sceneName?: string };

function extractShootId(originalTitle: string): string | null {
  const sceneIdMatch = originalTitle.match(/ [a-z]+\d+/i); // detect studio prefixes
  const shootId = sceneIdMatch ? sceneIdMatch[0] : null;
  return shootId;
}

module.exports = async (ctx: MyContext): Promise<any> => {
  const { $logger, sceneName, event } = ctx;

  const args = ctx.args as Partial<{
    dry: boolean;
    useSceneId: boolean;
    deep: boolean;
  }>;

  if (!sceneName) {
    $logger.warn(`Invalid event: ${event}`);
    return {};
  }

  $logger.verbose(`Extracting shoot ID from scene name: ${sceneName}`);

  const shootId = extractShootId(sceneName);
  if (shootId) {
    const cleanShootId = shootId.trim();
    $logger.info("Extracted scene ID: " + cleanShootId);

    const result: Record<string, unknown> = {
      custom: {
        "Shoot ID": cleanShootId,
        "Scene ID": cleanShootId,
      },
    };

    if (args.useSceneId) {
      result.name = cleanShootId;
      $logger.verbose("Setting name to shoot ID");
    }

    if (args.deep === false) {
      $logger.verbose("Not getting deep info");
    } else {
      $logger.verbose(`Searching for scenes using query: ${cleanShootId}`);
      const { terms } = (
        await ctx.$axios.get<{
          terms: { type: "model" | "scene"; url: string; name: string }[];
        }>("https://www.legalporno.com/api/autocomplete/search", {
          params: {
            q: cleanShootId,
          },
        })
      ).data;

      const term = terms.find(({ name }) =>
        name.toLowerCase().includes(cleanShootId.toLowerCase())
      );

      if (!term) {
        $logger.warn(`Scene not found for shoot ID: ${cleanShootId}`);
      } else {
        const sceneUrl = term.url;
        $logger.verbose(`Getting more scene info (deep: true): ${sceneUrl}`);

        const html = (await ctx.$axios.get<string>(sceneUrl)).data;

        if (!args.useSceneId) {
          result.name = term.name;
        }

        // Scraping courtesy of traxxx (https://traxxx.me)
        const $ = ctx.$cheerio.load(html, { normalizeWhitespace: true });
        console.log($('span[title="Release date"] a').text());
        result.releaseDate = ctx.$moment
          .utc($('span[title="Release date"] a').text(), "YYYY-MM-DD")
          .valueOf();

        const [actorsElement, tagsElement, descriptionElement] = $(
          ".scene-description__row"
        ).toArray();

        result.description =
          $('meta[name="description"]')?.attr("content")?.trim() ||
          (descriptionElement && $(descriptionElement).find("dd").text().trim());
        result.actors = $(actorsElement)
          .find('a[href*="com/model"]')
          .map((_, actorElement) => $(actorElement).text())
          .toArray()
          .sort();
        result.labels = $(tagsElement)
          .find("a")
          .map((_, tagElement) => $(tagElement).text())
          .toArray()
          .sort();
      }
    }

    if (args.dry) {
      $logger.warn(`Would have returned ${ctx.$formatMessage(result)}`);
      return {};
    }
    return result;
  }

  $logger.info("No scene ID found");

  return {};
};
