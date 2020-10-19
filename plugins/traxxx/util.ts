import {
  DeepPartial,
  MyStudioArgs,
  MyStudioContext,
  MyValidatedStudioContext,
  StudioSettings,
} from "./types";

export const hasProp = (target: unknown, prop: string): boolean => {
  return target && typeof target === "object" && Object.hasOwnProperty.call(target, prop);
};

const DEFAULT_STUDIO_SETTINGS: StudioSettings = {
  channelPriority: true,
  uniqueNames: true,
  channelSuffix: " (Channel)",
  networkSuffix: " (Network)",
  whitelist: [],
  blacklist: [],
  whitelistOverride: [],
  blacklistOverride: [],
};

/**
 * @param ctx - plugin context
 * @returns the context with defaults args when missing, or throws
 */
export const validateArgs = ({
  args,
  $throw,
  $log,
  studioName,
}: MyStudioContext): MyStudioArgs | void => {
  let validatedArgs: DeepPartial<MyStudioArgs> | undefined;
  if (args && typeof args === "object") {
    // Copy object
    validatedArgs = { ...args };
  }

  if (!studioName || typeof studioName !== "string") {
    return $throw(`Missing "studioName", cannot run plugin`);
  }

  if (!validatedArgs || typeof validatedArgs !== "object") {
    return $throw(`Missing args, cannot run plugin`);
  }

  if (!validatedArgs.studios || typeof validatedArgs.studios !== "object") {
    $log(
      `[TRAXXX] MSG: Missing "args.studios.channelPriority, setting to default: `,
      DEFAULT_STUDIO_SETTINGS
    );
    validatedArgs.studios = DEFAULT_STUDIO_SETTINGS;
  } else {
    // Copy object
    validatedArgs.studios = { ...validatedArgs.studios };
  }

  const isInvalidStringArray = (arr: unknown): boolean =>
    !Array.isArray(arr) || !arr.every((prop) => typeof prop === "string");

  if (
    !hasProp(validatedArgs.studios, "channelPriority") ||
    typeof validatedArgs.studios.channelPriority !== "boolean"
  ) {
    $log(
      `[TRAXXX] MSG: Missing "args.studios.channelPriority, setting to default: "${DEFAULT_STUDIO_SETTINGS.channelPriority}"`
    );
    validatedArgs.studios.channelPriority = DEFAULT_STUDIO_SETTINGS.channelPriority;
  }

  if (
    !hasProp(validatedArgs.studios, "uniqueNames") ||
    typeof validatedArgs.studios.uniqueNames !== "boolean"
  ) {
    $log(
      `[TRAXXX] MSG: Missing "args.studios.uniqueNames, setting to default: "${DEFAULT_STUDIO_SETTINGS.uniqueNames}"`
    );
    validatedArgs.studios.uniqueNames = DEFAULT_STUDIO_SETTINGS.uniqueNames;
  }

  if (
    !hasProp(validatedArgs.studios, "channelSuffix") ||
    typeof validatedArgs.studios.channelSuffix !== "string"
  ) {
    $log(
      `[TRAXXX] MSG: Missing "args.studios.channelSuffix", setting to default: "${DEFAULT_STUDIO_SETTINGS.channelPriority}"`
    );
    validatedArgs.studios.channelSuffix = DEFAULT_STUDIO_SETTINGS.channelSuffix;
  }

  if (
    !hasProp(validatedArgs.studios, "networkSuffix") ||
    typeof validatedArgs.studios.networkSuffix !== "string"
  ) {
    $log(
      `[TRAXXX] MSG: Missing "args.studios.networkSuffix, setting to default: "${DEFAULT_STUDIO_SETTINGS.networkSuffix}"`
    );
    validatedArgs.studios.networkSuffix = DEFAULT_STUDIO_SETTINGS.networkSuffix;
  }

  if (validatedArgs.studios.channelSuffix === validatedArgs.studios.networkSuffix) {
    return $throw(
      `"args.studios.channelSuffix" and "args.studios.networkSuffix" are identical, cannot run plugin`
    );
  }

  if (
    !hasProp(validatedArgs.studios, "whitelist") ||
    isInvalidStringArray(validatedArgs.studios.whitelist)
  ) {
    $log(
      `[TRAXXX] MSG: Missing "args.studios.whitelist, setting to default: "${JSON.stringify(DEFAULT_STUDIO_SETTINGS.whitelist)}"`
    );
    validatedArgs.studios.whitelist = DEFAULT_STUDIO_SETTINGS.whitelist;
  }

  if (
    !hasProp(validatedArgs.studios, "blacklist") ||
    isInvalidStringArray(validatedArgs.studios.blacklist)
  ) {
    $log(
      `[TRAXXX] MSG: Missing "args.studios.blacklist, setting to default: "${JSON.stringify(DEFAULT_STUDIO_SETTINGS.blacklist)}"`
    );
    validatedArgs.studios.blacklist = DEFAULT_STUDIO_SETTINGS.blacklist;
  }

  if (
    !hasProp(validatedArgs.studios, "whitelistOverride") ||
    isInvalidStringArray(validatedArgs.studios.whitelistOverride)
  ) {
    $log(
      `[TRAXXX] MSG: Missing "args.studios.whitelistOverride, setting to default: "${JSON.stringify(DEFAULT_STUDIO_SETTINGS.whitelistOverride)}"`
    );
    validatedArgs.studios.whitelistOverride = DEFAULT_STUDIO_SETTINGS.whitelistOverride;
  }

  if (
    !hasProp(validatedArgs.studios, "blacklistOverride") ||
    isInvalidStringArray(validatedArgs.studios.blacklistOverride)
  ) {
    $log(
      `[TRAXXX] MSG: Missing "args.studios.blacklistOverride, setting to default: "${JSON.stringify(DEFAULT_STUDIO_SETTINGS.blacklistOverride)}"`
    );
    validatedArgs.studios.blacklistOverride = DEFAULT_STUDIO_SETTINGS.blacklistOverride;
  }

  // At the end of this function, validatedArgs will have type MyStudioArgs
  // since we merged defaults
  return validatedArgs as MyStudioArgs;
};

function lowercase(str: string): string {
  return str.toLowerCase();
}

/**
 * @param ctx - plugin context
 * @param name - the studio name from pv
 * @returns the studio name, without our suffixes
 */
export const normalizeStudioName = (ctx: MyValidatedStudioContext, name: string): string => {
  return name
    .replace(ctx.args.studios.channelSuffix, "")
    .replace(ctx.args.studios.networkSuffix, "");
};

export type Preference = "none" | "channel" | "network";

/**
 * @param ctx - plugin context
 * @param name - the input studio name
 * @returns how to treat the studio: channel, network, or none (according to user args)
 */
export const getExtractionPreferenceFromName = (
  ctx: MyValidatedStudioContext,
  name: string
): Preference => {
  let preference: Preference = "none";
  if (name.endsWith(ctx.args.studios.channelSuffix)) {
    preference = "channel";
  } else if (name.endsWith(ctx.args.studios.networkSuffix)) {
    preference = "network";
  }
  return preference;
};

/**
 * @param str - the string to strip
 * @returns the string without diacritics
 */
export const stripAccents = (str: string): string =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/**
 * @param str - the studio name
 * @returns the slugified version of the name
 */
export const slugify = (str: string): string => {
  // Newline for every operation for readability
  let res = str.replace(/\s/g, "");
  res = stripAccents(res);
  res = lowercase(res);
  return res;
};

export const isBlacklisted = (ctx: MyValidatedStudioContext, prop: string): boolean => {
  if (ctx.args.studios.whitelist.length) {
    return !ctx.args.studios.whitelist.includes(lowercase(prop));
  }
  return ctx.args.studios.blacklist.includes(lowercase(prop));
};

/**
 * @param ctx - plugin context
 * @param prop - the property to check
 * @returns if the property exists in the data, and has a "real" value
 */
export const propExistsInData = ({ data }: MyValidatedStudioContext, prop: string): boolean => {
  if (!hasProp(data, prop)) {
    return false;
  }
  if (
    data[prop] === undefined ||
    data[prop] === null ||
    (typeof data[prop] === "string" && data[prop].trim() === "") ||
    (Array.isArray(data[prop]) && data[prop].length === 0)
  ) {
    return false;
  }

  return true;
};

/**
 * Checks if the property was already returned by a previous plugin
 *
 * @param ctx - plugin context
 * @param prop - the property to check
 * @returns if the property should not be returned
 */
export const isOverrideBlacklisted = (ctx: MyValidatedStudioContext, prop: string): boolean => {
  if (!propExistsInData(ctx, prop)) {
    return false;
  }

  if (ctx.args.studios.whitelistOverride.length) {
    return !ctx.args.studios.whitelistOverride.includes(lowercase(prop));
  }
  return ctx.args.studios.blacklistOverride.includes(lowercase(prop));
};

/**
 * @param ctx - plugin context
 * @param prop - the property to check
 * @returns if the property should not be returned
 */
export const suppressProp = (ctx: MyValidatedStudioContext, prop: string): boolean => {
  return isBlacklisted(ctx, prop) || isOverrideBlacklisted(ctx, prop);
};
