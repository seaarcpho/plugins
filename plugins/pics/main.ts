import { ActorContext, ActorOutput } from "../../types/actor";
import { MovieContext, MovieOutput } from "../../types/movie";
import { SceneContext } from "../../types/scene";
import { StudioContext } from "../../types/studio";
import { MyContext } from "../pics/types";
import { executeScape, ScrapeMapping } from "./utils";

interface ScrapeEventDefinition {
  queryProp: string;
  events: string[];
  argPathsObjProp: string;
  scrapeMappings: ScrapeMapping[];
}

const eventScrapers: ScrapeEventDefinition[] = [
  {
    events: ["actorCreated", "actorCustom"],
    queryProp: "actorName",
    argPathsObjProp: "actors",
    scrapeMappings: [
      {
        argProp: "path_thumb",
        outputProp: "thumbnail",
      },
      {
        argProp: "path_alt",
        outputProp: "altThumbnail",
      },
      {
        argProp: "path_avatar",
        outputProp: "avatar",
      },
      {
        argProp: "path_hero",
        outputProp: "hero",
      },
    ],
  },
  {
    events: ["sceneCreated", "sceneCustom"],
    queryProp: "sceneName",
    argPathsObjProp: "scenes",
    scrapeMappings: [
      {
        argProp: "path_thumb",
        outputProp: "thumbnail",
      },
    ],
  },
  {
    events: ["movieCustom"],
    queryProp: "movieName",
    argPathsObjProp: "movies",
    scrapeMappings: [
      {
        argProp: "path_back_cover",
        outputProp: "backCover",
      },
      {
        argProp: "path_front_cover",
        outputProp: "frontCover",
      },
      {
        argProp: "path_spine_cover",
        outputProp: "spineCover",
      },
    ],
  },
  {
    events: ["studioCreated", "studioCustom"],
    queryProp: "studioName",
    argPathsObjProp: "studios",
    scrapeMappings: [
      {
        argProp: "path_thumb",
        outputProp: "thumbnail",
      },
    ],
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
      "[PICS] ERR: Uh oh. You shouldn't use the plugin for this type of event, cannot run plugin"
    );
    return {};
  }

  const query = ctx[eventScraperDefinition.queryProp] as string | undefined;
  if (!query) {
    ctx.$throw(
      `[PICS] ERR: Did not receive name to search for. Expected a string from ${eventScraperDefinition.queryProp}`
    );
    return {};
  }

  const pathsObj = ctx.args?.[eventScraperDefinition.argPathsObjProp];
  if (!pathsObj) {
    ctx.$throw(
      `[PICS] ERR: Arguments did not contain object with paths to search for. Expected "args.${eventScraperDefinition.argPathsObjProp}"`
    );
    return {}; // return for type compatibility
  }

  const result = await executeScape(ctx, query, pathsObj, eventScraperDefinition.scrapeMappings);

  if (ctx.args?.dry) {
    ctx.$log("[PICS] MSG: Is 'dry' mode, would've returned:");
    ctx.$log(result);
    return {};
  }

  return result;
};
