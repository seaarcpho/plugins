const actorHandler = require("./actor");
const movieHandler = require("./movie");

module.exports = async (ctx) => {
  const { movieName, actorName } = ctx;
  if (movieName) {
    return movieHandler(ctx);
  }
  if (actorName) {
    return actorHandler(ctx);
  }
  ctx.$throw("Uh oh. You shouldn't use the plugin for this type of event");
};
