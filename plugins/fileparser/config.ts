import { Context, DeepPartial } from "../../types/plugin";
import { existsSync } from "fs";
import { MySceneContext } from "./types";
import { readFileSync } from "fs";
import { configSchema, IFileParserConfig } from "./types";
import YAML from "yaml";

const configFilename = "parserconfig";

const configYAMLFilename = `${configFilename}.yaml`;
const configJSONFilename = `${configFilename}.json`;

export async function findAndLoadSceneConfig(
  ctx: MySceneContext
): Promise<IFileParserConfig | undefined> {
  const configFile = findConfig(ctx, ctx.$path.dirname(ctx.scenePath || "/"));

  if (configFile) {
    ctx.$logger.info(`Loading parser config from: ${configFile}`);

    let loadedConfig: IFileParserConfig;
    if (ctx.$path.extname(configFile).toLowerCase() === ".yaml") {
      loadedConfig = YAML.parse(readFileSync(configFile, "utf-8")) as IFileParserConfig;
    } else {
      loadedConfig = JSON.parse(readFileSync(configFile, "utf-8")) as IFileParserConfig;
    }

    const validationError = isValidConfig(loadedConfig);
    if (validationError !== true) {
      ctx.$logger.warn(
        `Invalid config schema in "${validationError.location}". Double check your config and retry.`
      );
      ctx.$logger.error(validationError.error.message);
      return;
    }

    return loadedConfig;
  }

  // No config found
  return;
}

// Lookikng for a config file, starting from dirPath and going up the parents chain until the base library path is reached.
const findConfig = (ctx: Context, dirName: string): string | undefined => {
  try {
    const configFileYAML = ctx.$path.format({ dir: dirName, base: configYAMLFilename });
    if (existsSync(configFileYAML)) {
      ctx.$logger.verbose(`Config file found: ${configFileYAML}`);
      return configFileYAML;
    }

    const configFileJSON = ctx.$path.format({ dir: dirName, base: configJSONFilename });
    if (existsSync(configFileJSON)) {
      ctx.$logger.verbose(`Config file found: ${configFileJSON}`);
      return configFileJSON;
    }

    if (dirName === ctx.$library || dirName === "/") {
      ctx.$logger.verbose(`Could not find a config file in the library.`);
      return;
    } else {
      // Config file not yet found => continues looking in parent dir
      const parentDir = ctx.$path.resolve(dirName, "..");
      return findConfig(ctx, parentDir);
    }
  } catch (error) {
    ctx.$logger.error(`Error finding config file: ${error}. Stopped looking.`);
    return;
  }
};

export function isValidConfig(val: unknown): true | { location: string; error: Error } {
  let generalError: Error | null = null;
  let location: string = "root";

  try {
    configSchema.parse(val);
  } catch (err) {
    generalError = err as Error;
  }

  const config = val as DeepPartial<IFileParserConfig>;
  try {
    location = "actorsMatcher";
    if (config?.actorsMatcher?.regexFlags && !config?.actorsMatcher?.regexFlags.includes("g")) {
      throw new Error(
        "Incorrect regexFlags value: it must contain the 'g' flag that is mandatory for the plugin to work."
      );
    }
    location = "nameMatcher";
    if (config?.nameMatcher?.regexFlags && !config?.nameMatcher?.regexFlags.includes("g")) {
      throw new Error(
        "Incorrect regexFlags value: it must contain the 'g' flag that is mandatory for the plugin to work."
      );
    }
    location = "movieMatcher";
    if (config?.movieMatcher?.regexFlags && !config?.movieMatcher?.regexFlags.includes("g")) {
      throw new Error(
        "Incorrect regexFlags value: it must contain the 'g' flag that is mandatory for the plugin to work."
      );
    }
    location = "studioMatcher";
    if (config?.studioMatcher?.regexFlags && !config?.studioMatcher?.regexFlags.includes("g")) {
      throw new Error(
        "Incorrect regexFlags value: it must contain the 'g' flag that is mandatory for the plugin to work."
      );
    }
    location = "labelsMatcher";
    if (config?.labelsMatcher?.regexFlags && !config?.labelsMatcher?.regexFlags.includes("g")) {
      throw new Error(
        "Incorrect regexFlags value: it must contain the 'g' flag that is mandatory for the plugin to work."
      );
    }
  } catch (err) {
    return {
      location: location,
      error: err as Error,
    };
  }

  return generalError ? { location: location, error: generalError } : true;
}
