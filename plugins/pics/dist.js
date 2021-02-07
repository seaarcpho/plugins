'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("./utils");
const eventScrapers = [
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
        events: ["movieCreated", "movieCustom"],
        queryProp: "movieName",
        definitionObj: "movies",
    },
    {
        events: ["studioCreated", "studioCustom"],
        queryProp: "studioName",
        definitionObj: "studios",
    },
];
module.exports = (ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const eventScraperDefinition = eventScrapers.find((scraper) => scraper.events.includes(ctx.event));
    if (!eventScraperDefinition) {
        ctx.$throw(`Uh oh. You shouldn't use the plugin for this type of event "${ctx.event}", cannot run plugin`);
        return {};
    }
    const res = utils_1.validateArgs(ctx);
    if (res !== true) {
        ctx.$logger.error(`"args" schema is incorrect`);
        ctx.$throw(res);
        return {};
    }
    const query = ctx[eventScraperDefinition.queryProp];
    if (!query) {
        ctx.$throw(`Did not receive name to search for. Expected a string from ${eventScraperDefinition.queryProp}`);
        return {};
    }
    const scrapeDefs = ctx.args[eventScraperDefinition.definitionObj];
    if (!scrapeDefs || !Array.isArray(scrapeDefs) || !scrapeDefs.length) {
        ctx.$throw(`Arguments did not contain object with paths to search for. Expected "args.${eventScraperDefinition.definitionObj}"`);
        return {};
    }
    const scrapeResult = yield utils_1.executeScape(ctx, query, scrapeDefs);
    if ((_a = ctx.args) === null || _a === void 0 ? void 0 : _a.dry) {
        ctx.$logger.info(`Is 'dry' mode, would've returned: ${ctx.$formatMessage(scrapeResult)}`);
        return {};
    }
    const finalResult = {};
    for (const [prop, image] of utils_1.entries(scrapeResult)) {
        if (prop !== "extra" && typeof image === "string") {
            finalResult[prop] = yield ctx.$createLocalImage(image, `${query} (${prop})`, true);
        }
        else if (Array.isArray(image)) {
            for (const extraImage of image) {
                yield ctx.$createLocalImage(extraImage, `${query} (extra)`, false);
            }
        }
    }
    return finalResult;
});
