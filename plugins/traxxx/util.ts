import { MyValidatedStudioContext } from "./types";

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
  return stripAccents(str).replace(/\s/g, "").toLocaleLowerCase();
};
