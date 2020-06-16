const context = require("../../../context");
const plugin = require("../main");
const { expect } = require("chai");

describe("adultempire", () => {
  it("Should fetch covers & studio name from page", async () => {
    console.log("Fetching adultempire.com...");
    const result = await plugin({
      ...context,
      movieName: "tushy raw v5",
      args: {},
    });
    expect(result).to.be.an("object");
    expect(result.frontCover).to.be.a("string");
    expect(result.backCover).to.be.a("string");
    expect(result.studio).to.be.a("string").equal("Tushy Raw");
    expect(result.description)
      .to.be.a("string")
      .equal(
        "TUSHY.com is proud to present its newest studio TUSHY RAW. TUSHY RAW is straight to the point - hard, hot, and intense anal sex with the most beautiful women on the planet. Everything you see here is 100% real & raw. See more at TUSHYRAW.com"
      );
    expect(result.releaseDate).to.be.a("number");
    const date = new Date(result.releaseDate);
    expect(date.getDate(), 28);
    expect(date.getMonth(), 7);
    expect(date.getFullYear(), 2019);
  });

  it("Should not fetch covers etc (404)", async () => {
    console.log("Fetching adultempire.com...");
    const result = await plugin({
      ...context,
      movieName: "fasdfawbwaerawerawebr",
      args: {},
    });
    expect(result).to.deep.equal({});
  });
});
