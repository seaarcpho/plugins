const plugin = require("../main");
const { expect } = require("chai");
const { createPluginRunner } = require("../../../context");

const runPlugin = createPluginRunner("vixen_network", plugin);

const fixture = [
  [
    "Agatha Vega, Ginebra Bellucci Indulge Us Tushy Raw [facial, threesome].mp4",
    {
      name: "Indulge Us",
      description:
        "Two tushies are better than one! Double your pleasure with European tag team Agatha and Ginebra, as they squeeze their derrieres into tight jeans for a tease then climb into bed for a fiery anal threesome.",
      actors: ["Agatha Vega", "Ginebra Bellucci"],
    },
  ],
  [
    "Agatha Vega, Ginebra Bellucci Indulge Us TushyRaw [facial, threesome].mp4",
    {
      name: "Indulge Us",
      description:
        "Two tushies are better than one! Double your pleasure with European tag team Agatha and Ginebra, as they squeeze their derrieres into tight jeans for a tease then climb into bed for a fiery anal threesome.",
      actors: ["Agatha Vega", "Ginebra Bellucci"],
    },
  ],
  [
    "Agatha Vega, Ginebra Bellucci Indulge Us Tushyraw [facial, threesome].mp4",
    {
      name: "Indulge Us",
      description:
        "Two tushies are better than one! Double your pleasure with European tag team Agatha and Ginebra, as they squeeze their derrieres into tight jeans for a tease then climb into bed for a fiery anal threesome.",
      actors: ["Agatha Vega", "Ginebra Bellucci"],
    },
  ],
  [
    "Avery Cristy Jill Kassidy Wild And Wet Vixen.avi",
    {
      name: "Wild And Wet",
      description:
        "Double your trouble with Avery and Jill - two naughty girls who will stop at nothing to get a man’s attention. Nobody needs to know, and when these ladies pounce, you won’t know what hit you.",
      actors: ["Avery Cristy", "Jill Kassidy", "Michael Stefano"],
    },
  ],
];

describe("VIXEN network", () => {
  for (const [path, expected] of fixture) {
    it(`Should work for ${path}`, async () => {
      const result = await runPlugin({
        event: "sceneCreated",
        sceneName: "?????????????",
        scene: {
          name: "?????????????",
          path,
        },
      });
      expect(result).to.deep.equal(expected);
    });
  }
});
