const context = require("../../../context");
const plugin = require("../main");
const { expect } = require("chai");

function search(args = {}) {
  return plugin({
    ...context,
    actorName: "Zoe Bloom",
    args,
  });
}

describe("freeones", () => {
  it("Search 'Zoe Bloom'", async () => {
    console.log("Fetching freeones.xxx...");
    const result = await search({
      dry: false,
      blacklist: [],
      useImperial: false,
      useAvatarAsThumbnail: false,
    });
    expect(result.custom).to.deep.equal({
      "hair color": "Brown",
      "eye color": "Green",
      ethnicity: "Caucasian",
      height: 157,
      weight: 50,
      birthplace: "Pittsburgh, PA",
      zodiac: "Aries",
      measurements: "32A-24-35",
    });
    expect(result.nationality).to.equal("US");
    expect(result.bornOn).to.be.a("number");
    expect(result.labels).to.have.length.greaterThan(0);
    expect(result.labels).to.contain("Brown Hair");
    expect(result.labels).to.contain("Green Eyes");
    expect(result.labels).to.contain("Caucasian");
  });

  it("Search 'Zoe Bloom' but without measurements", async () => {
    console.log("Fetching freeones.xxx...");
    const result = await search({
      dry: false,
      blacklist: ["measurements"],
      useImperial: false,
      useAvatarAsThumbnail: false,
    });
    expect(result.custom).to.deep.equal({
      "hair color": "Brown",
      "eye color": "Green",
      ethnicity: "Caucasian",
      height: 157,
      weight: 50,
      birthplace: "Pittsburgh, PA",
      zodiac: "Aries",
    });
    expect(result.nationality).to.equal("US");
    expect(result.bornOn).to.be.a("number");
    expect(result.labels).to.have.length.greaterThan(0);
    expect(result.labels).to.contain("Brown Hair");
    expect(result.labels).to.contain("Green Eyes");
    expect(result.labels).to.contain("Caucasian");
  });
});
