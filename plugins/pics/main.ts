import { ActorContext, ActorOutput } from "../../types/actor";
import { MovieContext, MovieOutput } from "../../types/movie";
import { SceneContext } from "../../types/scene";
import { StudioContext } from "../../types/studio";
import { MyContext, ScrapeDefinition } from "../pics/types";
import { executeScape, validateArgs } from "./utils";

interface ScrapeEventDefinition {
  events: string[];
  queryProp: string;
  definitionObj: string;
}

const eventScrapers: ScrapeEventDefinition[] = [
  {
    events: ["actorCreated", "actorCustom"],
    queryProp: "actorName",
    definitionObj: "actors",
  },
  {
    events: ["sceneCreated", "sceneCustom"],
    queryProp: "sceneName",
    definitionObj: "scenes",
  },
  {
    events: ["movieCreated", "movieCustom"], // Anticipate custom movie event
    queryProp: "movieName",
    definitionObj: "movies",
  },
  {
    events: ["studioCreated", "studioCustom"],
    queryProp: "studioName",
    definitionObj: "studios",
  },
];

module.exports = async (
  ctx: (ActorContext | SceneContext | MovieContext | StudioContext) & MyContext
): Promise<ActorOutput | MovieOutput | undefined> => {
  const eventScraperDefinition = eventScrapers.find((scraper) =>
    scraper.events.includes(ctx.event)
  );
  if (!eventScraperDefinition) {
    ctx.$throw(
      `[PICS] ERR: Uh oh. You shouldn't use the plugin for this type of event "${ctx.event}", cannot run plugin`
    );
    return {};
  }

  const res = validateArgs(ctx.args);
  if (res !== true) {
    ctx.$log(res.message);
    ctx.$throw(`[PICS] ERR: "args" schema is incorrect`);
    return {};
  }

  const query = ctx[eventScraperDefinition.queryProp] as string | undefined;
  if (!query) {
    ctx.$throw(
      `[PICS] ERR: Did not receive name to search for. Expected a string from ${eventScraperDefinition.queryProp}`
    );
    return {};
  }

  const scrapeDefs = ctx.args[eventScraperDefinition.definitionObj] as
    | unknown
    | ScrapeDefinition[]
    | undefined;
  if (!scrapeDefs || !Array.isArray(scrapeDefs) || !scrapeDefs.length) {
    ctx.$throw(
      `[PICS] ERR: Arguments did not contain object with paths to search for. Expected "args.${eventScraperDefinition.definitionObj}"`
    );
    return {}; // return for type compatibility
  }

  const result = await executeScape(ctx, query, scrapeDefs);

  if (ctx.args?.dry) {
    ctx.$log("[PICS] MSG: Is 'dry' mode, would've returned:");
    ctx.$log(result);
    return {};
  }

  return result;
};
