import * as zod from "zod";

import { SceneContext } from "../../types/scene";
import { StudioContext } from "../../types/studio";
import { ActorContext } from "./../../types/actor";
import { MovieContext } from "./../../types/movie";
import { DeepPartial } from "./../traxxx/types";

const baseScrapeDefinition = zod.object({
  path: zod.string().refine((val) => val && val.trim().length, "The path cannot be empty"),
  searchTerm: zod.string().optional(),
});

export const ArgsSchema = zod.object({
  dry: zod.boolean().optional(),
  actors: zod.array(
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
  ),
  scenes: zod.array(
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
  ),
  movies: zod.array(
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
  ),
  studios: zod.array(
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
  ),
});

export type ActorPicsSchema = zod.infer<typeof ArgsSchema.shape.actors>;

export type ScenePicsSchema = zod.infer<typeof ArgsSchema.shape.actors>;

export type MoviePicsSchema = zod.infer<typeof ArgsSchema.shape.actors>;

export type StudioPicsSchema = zod.infer<typeof ArgsSchema.shape.actors>;

export type ScrapeDefinition =
  | ActorPicsSchema[0]
  | ScenePicsSchema[0]
  | MoviePicsSchema[0]
  | StudioPicsSchema[0];

export type ArgsSchemaType = zod.infer<typeof ArgsSchema>;

export type MyValidatedContext = (ActorContext | SceneContext | MovieContext | StudioContext) & {
  args: DeepPartial<ArgsSchemaType>;
};

export type MyContext = (ActorContext | SceneContext | MovieContext | StudioContext) & {
  args: DeepPartial<ArgsSchemaType>;
};
