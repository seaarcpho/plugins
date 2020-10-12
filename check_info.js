const fs = require("fs");
const path = require("path");

const pluginsFolder = path.resolve("plugins");
const IGNORE_PATHS = [path.resolve("plugins/types")];

for (const name of fs.readdirSync(pluginsFolder)) {
  const infoPath = path.resolve("plugins", name, "info.json");
  if (
    !fs.existsSync(infoPath) &&
    !IGNORE_PATHS.find((ignorePath) => infoPath.includes(ignorePath))
  ) {
    process.exit(1);
  }
  console.log(`${name} OK`);
}
process.exit(0);
