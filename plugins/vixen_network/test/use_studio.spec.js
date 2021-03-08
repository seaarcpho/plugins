const plugin = require("../main");
const { expect } = require("chai");
const { createPluginRunner } = require("../../../context");

const runPlugin = createPluginRunner("vixen_network", plugin);

const indulgeUsResult = {
  name: "Indulge Us",
  releaseDate: 1609957800000,
  description:
    "Two tushies are better than one! Double your pleasure with European tag team Agatha and Ginebra, as they squeeze their derrieres into tight jeans for a tease then climb into bed for a fiery anal threesome.",
  actors: ["Agatha Vega", "Christian Clay", "Ginebra Bellucci"],
  custom: {
    director: "Alex Eikster",
  },
  labels: [
    "anal",
    "ass to mouth",
    "blowjob",
    "brunette",
    "cowgirl",
    "cum shot",
    "gape",
    "lingerie",
    "missionary",
    "pussy licking",
    "pussy to mouth",
    "reverse cowgirl",
    "riding",
    "sex toy",
    "threesome",
  ],
};

const fixture = [
  ["Agatha Vega, Ginebra Bellucci Indulge Us.mp4", indulgeUsResult],
  ["Indulge Us.mp4", indulgeUsResult],
];

describe("VIXEN network", () => {
  for (const [path, expected] of fixture) {
    it(`Should work for ${path}`, async () => {
      const result = await runPlugin({
        event: "sceneCreated",
        sceneName: "?????????????",
        scene: {
          _id: "xxx",
          name: "?????????????",
          path,
        },
        async $getStudio() {
          return {
            name: "TUSHY RAW",
          };
        },
      });
      expect(result.name).to.equal(expected.name);
      expect(result.releaseDate).to.equal(expected.releaseDate);
      expect(result.description).to.equal(expected.description);
      expect(result.actors).to.deep.equal(expected.actors);
      expect(result.custom).to.deep.equal(expected.custom);
      expect(result.labels).to.deep.equal(expected.labels);
      expect(result.$thumbnail).to.be.a("string").that.contains("TRIPPLE");
      expect(result.thumbnail).to.be.undefined;
      expect(result.$markers).to.have.length(0);
    });
  }
});
