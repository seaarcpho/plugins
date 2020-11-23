import * as zod from "zod";

import { SceneContext } from "../../types/scene";
import { StudioContext } from "../../types/studio";
import { ActorContext } from "./../../types/actor";
import { MovieContext } from "./../../types/movie";
import { DeepPartial } from "./../traxxx/types";

const baseScrapeDefinition = zod.object({
  path: zod.string().refine((val) => val && val.trim().length, "The path cannot be empty"),
  searchTerm: zod.string().optional(),
  getAllExtra: zod.boolean().optional(),
});

const ActorConf = zod.array(
  baseScrapeDefinition
    .extend({
      prop: zod.enum(["thumbnail", "altThumbnail", "avatar", "hero", "extra"]),
    })
    .refine(
      ({ prop, searchTerm }) => {
        if (prop !== "extra" && !searchTerm) {
          return false;
        }
        return true;
      },
      {
        message: '"searchTerm" is required for non "extra" images',
      }
    )
);

const SceneConf = zod.array(
  baseScrapeDefinition
    .extend({
      prop: zod.enum(["thumbnail", "extra"]),
    })
    .refine(
      ({ prop, searchTerm }) => {
        if (prop !== "extra" && !searchTerm) {
          return false;
        }
        return true;
      },
      {
        message: '"searchTerm" is required for non "extra" images',
      }
    )
);

const MovieConf = zod.array(
  baseScrapeDefinition
    .extend({
      prop: zod.enum(["backCover", "frontCover", "spineCover", "extra"]),
    })
    .refine(
      ({ prop, searchTerm }) => {
        if (prop !== "extra" && !searchTerm) {
          return false;
        }
        return true;
      },
      {
        message: '"searchTerm" is required for non "extra" images',
      }
    )
);

const StudioConf = zod.array(
  baseScrapeDefinition
    .extend({
      prop: zod.enum(["thumbnail", "extra"]),
    })
    .refine(
      ({ prop, searchTerm }) => {
        if (prop !== "extra" && !searchTerm) {
          return false;
        }
        return true;
      },
      {
        message: '"searchTerm" is required for non "extra" images',
      }
    )
);

export const ArgsSchema = zod.object({
  dry: zod.boolean().optional(),
  actors: ActorConf.optional(),
  scenes: SceneConf.optional(),
  movies: MovieConf.optional(),
  studios: StudioConf.optional(),
});

export type ActorPicsSchema = zod.infer<typeof ArgsSchema.shape.actors>;

export type ScenePicsSchema = zod.infer<typeof ArgsSchema.shape.actors>;

export type MoviePicsSchema = zod.infer<typeof ArgsSchema.shape.actors>;

export type StudioPicsSchema = zod.infer<typeof ArgsSchema.shape.actors>;

export type ScrapeDefinition =
  | zod.infer<typeof ActorConf>[0]
  | zod.infer<typeof SceneConf>[0]
  | zod.infer<typeof MovieConf>[0]
  | zod.infer<typeof StudioConf>[0];

export type ArgsSchemaType = zod.infer<typeof ArgsSchema>;

export type MyValidatedContext = (ActorContext | SceneContext | MovieContext | StudioContext) & {
  args: DeepPartial<ArgsSchemaType>;
};

export type MyContext = (ActorContext | SceneContext | MovieContext | StudioContext) & {
  args: DeepPartial<ArgsSchemaType>;
};
