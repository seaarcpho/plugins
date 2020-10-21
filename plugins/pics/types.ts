import { MovieContext } from "./../../types/movie";
import { ActorContext } from "./../../types/actor";
import { DeepPartial } from "../../types/plugin";
import { SceneContext } from "../../types/scene";
import { StudioContext } from "../../types/studio";

export interface ActorSettings {
  path_thumb: string;
  path_alt: string;
  path_avatar: string;
  path_hero: string;
}

export interface Args {
  dry: boolean;
  actors: ActorSettings;
}

export interface ExtendedContext {
  args: Args;
}

export type MyValidatedContext = (ActorContext | SceneContext | MovieContext | StudioContext) &
  ExtendedContext;

export type MyContext = (ActorContext | SceneContext | MovieContext | StudioContext) &
  DeepPartial<ExtendedContext>;
