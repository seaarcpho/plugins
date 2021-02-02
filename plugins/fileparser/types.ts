import { SceneContext } from "../../types/scene";
import * as zod from "zod";

export interface MySceneContext extends SceneContext {
  args: {
    dry?: boolean;
    parseDate?: boolean;
  };
}

export type IFileParserConfigElem = zod.TypeOf<typeof fileParserSchemaElem>;

export type IFileParserConfig = zod.TypeOf<typeof configSchema>;

const fileParserSchemaElem = zod.object({
  scopeDirname: zod.boolean().optional(),
  regex: zod.string(),
  regexFlags: zod.string().optional(),
  matchesToUse: zod.array(zod.number()).optional(),
  groupsToUse: zod.array(zod.number()).optional(),
  splitter: zod.string().optional(),
});

export const configSchema = zod.object({
  studioMatcher: fileParserSchemaElem.optional(),
  nameMatcher: fileParserSchemaElem.optional(),
  actorsMatcher: fileParserSchemaElem.optional(),
  movieMatcher: fileParserSchemaElem.optional(),
  labelsMatcher: fileParserSchemaElem.optional(),
});
