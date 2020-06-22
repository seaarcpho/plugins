const context = require("../../../context");
const plugin = require("../main");
const { expect } = require("chai");

describe("PromisedScene", () => {
  it("Should have DB files with the Actor, Studio, Scene and date already", async () => {
    const result = await plugin({
      ...context,
      args: {
        ManualTouch: true,
        SceneDuplicationCheck: true,
        parseActor: true,
        parseStudio: true,
        source_settings: {
          Actors: "./plugins/PromisedScene/test/fixtures/actorsPopulated.db",
          Scenes: "./plugins/PromisedScene/test/fixtures/scenesPopulated.db",
          Studios: "./plugins/PromisedScene/test/fixtures/studiosPopulated.db",
        },
      },
      sceneName: "[New Sensations] Mia Malkova 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      scenePath:
        "Z:\\Keep\\test\\[New Sensations] Mia Malkova 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      testmode: true,
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.description).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Should return nothing because no search is completed without an Actor or Studio when manualTouch is false", async () => {
    const result = await plugin({
      ...context,
      args: {
        ManualTouch: false,
        SceneDuplicationCheck: true,
        parseActor: true,
        parseStudio: true,
        source_settings: {
          Actors: "./plugins/PromisedScene/test/fixtures/actorsPopulated.db",
          Scenes: "./plugins/PromisedScene/test/fixtures/scenesPopulated.db",
          Studios: "./plugins/PromisedScene/test/fixtures/studiosPopulated.db",
        },
      },
      sceneName: "[New Sensations] Mia Malkova 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      scenePath:
        "Z:\\Keep\\test\\[New Sensations] Mia Malkova 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      testmode: true,
    });
    expect(result).to.deep.equal({});
  });
  it("Should have DB files with Studio and Scene already -- No Actor -- ManualTouch True", async () => {
    const result = await plugin({
      ...context,
      args: {
        ManualTouch: true,
        SceneDuplicationCheck: true,
        parseActor: true,
        parseStudio: true,
        source_settings: {
          Actors: "./plugins/PromisedScene/test/fixtures/actorsUnPopulated.db",
          Scenes: "./plugins/PromisedScene/test/fixtures/scenesPopulated.db",
          Studios: "./plugins/PromisedScene/test/fixtures/studiosPopulated.db",
        },
      },
      sceneName: "[New Sensations] Mia Malkova - So Young So Sexy P.O.V. #8.mp4",
      scenePath: "Z:\\Keep\\test\\[New Sensations] Mia Malkova - So Young So Sexy P.O.V. #8.mp4",
      testmode: true,
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.description).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Should have DB files with Scene already -- No Studio or Actor -- ManualTouch True", async () => {
    const result = await plugin({
      ...context,
      args: {
        ManualTouch: true,
        SceneDuplicationCheck: true,
        parseActor: true,
        parseStudio: true,
        source_settings: {
          Actors: "./plugins/PromisedScene/test/fixtures/actorsUnPopulated.db",
          Scenes: "./plugins/PromisedScene/test/fixtures/scenesUnPopulated.db",
          Studios: "./plugins/PromisedScene/test/fixtures/studiosPopulated.db",
        },
      },
      sceneName: "[New Sensations] Mia Malkova - So Young So Sexy P.O.V. #8.mp4",
      scenePath: "Z:\\Keep\\test\\[New Sensations] Mia Malkova - So Young So Sexy P.O.V. #8.mp4",
      testmode: true,
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.description).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Should have DB files with Scene already -- No Studio or Actor -- ManualTouch false", async () => {
    const result = await plugin({
      ...context,
      args: {
        ManualTouch: true,
        SceneDuplicationCheck: true,
        parseActor: true,
        parseStudio: true,
        source_settings: {
          Actors: "./plugins/PromisedScene/test/fixtures/actorsUnPopulated.db",
          Scenes: "./plugins/PromisedScene/test/fixtures/scenesUnPopulated.db",
          Studios: "./plugins/PromisedScene/test/fixtures/studiosPopulated.db",
        },
      },
      sceneName: "[New Sensations] Mia Malkova - So Young So Sexy P.O.V. #8.mp4",
      scenePath: "Z:\\Keep\\test\\[New Sensations] Mia Malkova - So Young So Sexy P.O.V. #8.mp4",
      testmode: true,
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.description).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
});
