'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const actor_1 = tslib_1.__importDefault(require("./actor"));
const movie_1 = tslib_1.__importDefault(require("./movie"));
module.exports = (ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (ctx.movieName) {
        return movie_1.default(ctx);
    }
    if (ctx.actorName) {
        return actor_1.default(ctx);
    }
    ctx.$throw("Uh oh. You shouldn't use the plugin for this type of event");
});
