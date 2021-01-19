const plugin = require("../main");
const { expect } = require("chai");
const { createPluginRunner } = require("../../../context");

const runPlugin = createPluginRunner("legalporno-shoot-id", plugin);

const fixture = require("./basic.fixture");

describe("LP shoot ID", () => {
  for (const [sceneName, expected] of fixture) {
    it("Should not extract shoot ID", () => {
      const result = runPlugin();
      expect(typeof result === "object" && !Object.keys(result).length).to.be.true;
    });

    it("Should extract shoot ID, but not set name", async () => {
      const result = await runPlugin({
        sceneName,
      });
      expect(result).to.deep.equal({
        custom: {
          "Shoot ID": expected,
          "Scene ID": expected,
        },
      });
    });

    it("Should extract shoot ID, and set name", async () => {
      const result = await runPlugin({
        args: {
          setName: true,
        },
        sceneName,
      });
      expect(result).to.deep.equal({
        name: expected,
        custom: {
          "Shoot ID": expected,
          "Scene ID": expected,
        },
      });
    });
  }
});
