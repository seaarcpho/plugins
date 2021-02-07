'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const studio_1 = tslib_1.__importDefault(require("./studio"));
module.exports = (ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!ctx.args || typeof ctx.args !== "object") {
        ctx.$throw(`Missing args, cannot run plugin`);
        return {};
    }
    if (ctx.event === "studioCreated" || ctx.event === "studioCustom") {
        return studio_1.default(ctx);
    }
    ctx.$throw("Uh oh. You shouldn't use the plugin for this type of event");
    return {};
});
