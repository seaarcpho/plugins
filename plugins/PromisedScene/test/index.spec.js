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
      testmode: {
        Questions: {
          EnterInfoSearch: "",
          EnterManInfo: "",
          EnterMovie: "",
          EnterOneActorName: "",
          EnterSceneDate: "",
          EnterSceneTitle: "",
          EnterStudioName: "",
          ManualActors: "",
          ManualDescription: "",
          MovieTitle: "",
          MultipleChoice: "",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Should return nothing because no search is completed with no parsed Actor or Studio when manualTouch is false", async () => {
    const result = await plugin({
      ...context,
      args: {
        ManualTouch: false,
        SceneDuplicationCheck: true,
        parseActor: true,
        parseStudio: true,
        source_settings: {
          Actors: "./plugins/PromisedScene/test/fixtures/actorsUnPopulated.db",
          Scenes: "./plugins/PromisedScene/test/fixtures/scenesPopulated.db",
          Studios: "./plugins/PromisedScene/test/fixtures/studiosUnPopulated.db",
        },
      },
      sceneName: "[New Sensations] Mia Malkova 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      scenePath:
        "Z:\\Keep\\test\\[New Sensations] Mia Malkova 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      testmode: {
        Questions: {
          EnterInfo: "Should not ask",
          EnterMovie: "Should not ask",
          EnterOneActorName: "Should not ask",
          EnterSceneDate: "Should not ask",
          EnterSceneTitle: "Should not ask",
          EnterStudioName: "Should not ask",
          ManualActors: "Should not ask",
          ManualDescription: "Should not ask",
          MovieTitle: "Should not ask",
          MultipleChoice: "Should not ask",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.deep.equal({});
  });
  it("Should have DB files with Studio and Scene already -- No Actor -- ManualTouch True -- Should find with correct answers", async () => {
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
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "n",
          EnterMovie: "n",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "2013.10.10",
          EnterSceneTitle: "So Young So Sexy P.O.V. #8 - Scene 2",
          EnterStudioName: "New Sensations",
          ManualActors: "Mia Malkova, Mike Adriano",
          ManualDescription:
            "stud lovin'. Cum watch Mia Malkova work this hard cock to explosion of warm man chowder all across her face!",
          MovieTitle: "So Young So Sexy P.O.V. #8",
          MultipleChoice: "0",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Should have DB files with Scene already -- No Studio or Actor -- ManualTouch True -- Should find with correct answers", async () => {
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
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "n",
          EnterMovie: "y",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "2013.10.10",
          EnterSceneTitle: "So Young So Sexy P.O.V. #8 - Scene 2",
          EnterStudioName: "New Sensations",
          ManualActors: "Mia Malkova,Mike Adriano",
          ManualDescription:
            "stud lovin'. Cum watch Mia Malkova work this hard cock to explosion of warm man chowder all across her face!",
          MovieTitle: "So Young So Sexy P.O.V. #8",
          MultipleChoice: "0",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Should have DB files with Scene already but return nothing, no questions -- No Studio or Actor parsed", async () => {
    const result = await plugin({
      ...context,
      args: {
        ManualTouch: false,
        SceneDuplicationCheck: true,
        parseActor: true,
        parseStudio: true,
        source_settings: {
          Actors: "./plugins/PromisedScene/test/fixtures/actorsUnPopulated.db",
          Scenes: "./plugins/PromisedScene/test/fixtures/scenesPopulated.db",
          Studios: "./plugins/PromisedScene/test/fixtures/studiosUnPopulated.db",
        },
      },
      sceneName: "[New Sensations] Mia Malkova - So Young So Sexy P.O.V. #8.mp4",
      scenePath: "Z:\\Keep\\test\\[New Sensations] Mia Malkova - So Young So Sexy P.O.V. #8.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "n",
          EnterMovie: "y",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "2013.10.10",
          EnterSceneTitle: "So Young So Sexy P.O.V. #8 - Scene 2",
          EnterStudioName: "New Sensations",
          ManualActors: "Mia Malkova,Mike Adriano",
          ManualDescription:
            "stud lovin'. Cum watch Mia Malkova work this hard cock to explosion of warm man chowder all across her face!",
          MovieTitle: "So Young So Sexy P.O.V. #8",
          MultipleChoice: "0",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.deep.equal({});
  });
  it("Should have DB files with Scene already but return nothing, no spaces in title, no questions -- No Studio or Actor parsed", async () => {
    const result = await plugin({
      ...context,
      args: {
        ManualTouch: false,
        SceneDuplicationCheck: true,
        parseActor: true,
        parseStudio: true,
        source_settings: {
          Actors: "./plugins/PromisedScene/test/fixtures/actorsUnPopulated.db",
          Scenes: "./plugins/PromisedScene/test/fixtures/scenesPopulated.db",
          Studios: "./plugins/PromisedScene/test/fixtures/studiosUnPopulated.db",
        },
      },
      sceneName: "[New Sensations] Mia Malkova - So Young So Sexy P.O.V. #8.mp4",
      scenePath: "Z:\\Keep\\test\\[New Sensations] Mia Malkova -SoYoungSoSexyP.O.V.#8.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "n",
          EnterMovie: "y",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "2013.10.10",
          EnterSceneTitle: "SoYoungSoSexyP.O.V.#8-Scene2",
          EnterStudioName: "New Sensations",
          ManualActors: "Mia Malkova,Mike Adriano",
          ManualDescription:
            "stud lovin'. Cum watch Mia Malkova work this hard cock to explosion of warm man chowder all across her face!",
          MovieTitle: "So Young So Sexy P.O.V. #8",
          MultipleChoice: "0",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.deep.equal({});
  });
  it("Should allow manual input, no movie, no search -- Unpopulated databases", async () => {
    const result = await plugin({
      ...context,
      args: {
        ManualTouch: true,
        SceneDuplicationCheck: false,
        parseActor: true,
        parseStudio: true,
        source_settings: {
          Actors: "./plugins/PromisedScene/test/fixtures/actorsUnPopulated.db",
          Scenes: "./plugins/PromisedScene/test/fixtures/scenesUnPopulated.db",
          Studios: "./plugins/PromisedScene/test/fixtures/studiosUnPopulated.db",
        },
      },
      sceneName: "[New Sensations] Mia Malkova 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      scenePath:
        "Z:\\Keep\\test\\[New Sensations] Mia Malkova 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "n",
          EnterManInfo: "y",
          EnterMovie: "n",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "2013.10.10",
          EnterSceneTitle: "So Young So Sexy P.O.V. #8 - Scene 2",
          EnterStudioName: "New Sensations",
          ManualActors: "Mia Malkova, Mike Adriano",
          ManualDescription:
            "stud lovin'. Cum watch Mia Malkova work this hard cock to explosion of warm man chowder all across her face!",
          MovieTitle: "",
          MultipleChoice: "",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Should allow manual input, with movie, no search -- Unpopulated databases", async () => {
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
          Studios: "./plugins/PromisedScene/test/fixtures/studiosUnPopulated.db",
        },
      },
      sceneName: "[New Sensations] Mia Malkova 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      scenePath:
        "Z:\\Keep\\test\\[New Sensations] Mia Malkova 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "n",
          EnterManInfo: "y",
          EnterMovie: "y",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "2013.10.10",
          EnterSceneTitle: "So Young So Sexy P.O.V. #8 - Scene 2",
          EnterStudioName: "New Sensations",
          ManualActors: "Mia Malkova, Mike Adriano",
          ManualDescription:
            "stud lovin'. Cum watch Mia Malkova work this hard cock to explosion of warm man chowder all across her face!",
          MovieTitle: "So Young So Sexy P.O.V. #8",
          MultipleChoice: "",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.movie).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Should grab an alias for an actor Madison Swan = Mia Malkova", async () => {
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
      sceneName: "[New Sensations] Madison Swan 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      scenePath:
        "Z:\\Keep\\test\\[New Sensations] Madison Swan 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "n",
          EnterManInfo: "n",
          EnterMovie: "n",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "2013.10.10",
          EnterSceneTitle: "So Young So Sexy P.O.V. #8 - Scene 2",
          EnterStudioName: "New Sensations",
          ManualActors: "Mia Malkova, Mike Adriano",
          ManualDescription:
            "stud lovin'. Cum watch Mia Malkova work this hard cock to explosion of warm man chowder all across her face!",
          MovieTitle: "",
          MultipleChoice: "",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Should grab an alias with no spaces for an actor Madison Swan = Mia Malkova", async () => {
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
      sceneName: "[New Sensations] MadisonSwan 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      scenePath:
        "Z:\\Keep\\test\\[New Sensations] MadisonSwan 2013.10.10 - So Young So Sexy P.O.V. #8.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "n",
          EnterManInfo: "n",
          EnterMovie: "n",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "2013.10.10",
          EnterSceneTitle: "So Young So Sexy P.O.V. #8 - Scene 2",
          EnterStudioName: "New Sensations",
          ManualActors: "Mia Malkova, Mike Adriano",
          ManualDescription:
            "stud lovin'. Cum watch Mia Malkova work this hard cock to explosion of warm man chowder all across her face!",
          MovieTitle: "",
          MultipleChoice: "",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Search and Grab a scene with multiple parsed Actors, run a search and match based on title of scene - testing YY-MM-DD", async () => {
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
      sceneName:
        "[New Sensations] Riley Nixon, Mia Malkova 16.04.08 - Makes the Heart Skip a Beat.mp4",
      scenePath:
        "Z:\\Keep\\test\\[New Sensations] Riley Nixon, Mia Malkova 16.04.08 - Makes the Heart Skip a Beat.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "n",
          EnterMovie: "n",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "16.04.08",
          EnterSceneTitle: "Makes the Heart Skip a Beat",
          EnterStudioName: "New Sensations",
          ManualActors: "Mia Malkova, Riley Nixon",
          ManualDescription:
            "stud lovin'. Cum watch Mia Malkova work this hard cock to explosion of warm man chowder all across her face!",
          MovieTitle: "",
          MultipleChoice: "",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Search and Grab a Scene that has multiple parsed Studios - testing ddmmyyyy", async () => {
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
      sceneName: "[Bangbros clips] Mia Malkova 04.01.2016 - Flexible while getting pounded.mp4",
      scenePath:
        "Z:\\Keep\\test\\[Bangbros clips] Mia Malkova 04.01.2016 - Flexible while getting pounded.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "n",
          EnterMovie: "n",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "04.01.2016",
          EnterSceneTitle: "Flexible while getting pounded",
          EnterStudioName: "Banbros clips",
          ManualActors: "Mia Malkova",
          ManualDescription:
            "stud lovin'. Cum watch Mia Malkova work this hard cock to explosion of warm man chowder all across her face!",
          MovieTitle: "",
          MultipleChoice: "",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Search and Grab a Scene that has multiple parsed Studios with no spaces - testing ddmmyyyy", async () => {
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
      sceneName: "[Bangbrosclips] Mia Malkova 04.01.2016 - Flexible while getting pounded.mp4",
      scenePath:
        "Z:\\Keep\\test\\[Bangbrosclips] Mia Malkova 04.01.2016 - Flexible while getting pounded.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "n",
          EnterMovie: "n",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "04.01.2016",
          EnterSceneTitle: "Flexible while getting pounded",
          EnterStudioName: "Bangbrosclips",
          ManualActors: "Mia Malkova",
          ManualDescription:
            "stud lovin'. Cum watch Mia Malkova work this hard cock to explosion of warm man chowder all across her face!",
          MovieTitle: "",
          MultipleChoice: "",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Wrong Query Search because of Actress Typo but should still allow ManualTouch", async () => {
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
      sceneName: "[Bangbrosclips] Mia Malkova 04.01.2016 - Flexible while getting pounded.mp4",
      scenePath:
        "Z:\\Keep\\test\\[Bangbrosclips] Mia Malkova 04.01.2016 - Flexible while getting pounded.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "y",
          EnterMovie: "n",
          EnterOneActorName: "Mi Malkova",
          EnterSceneDate: "2016.01.04",
          EnterSceneTitle: "Flexible while getting pounded",
          EnterStudioName: "Bangbros clips",
          ManualActors: "Mia Malkova",
          ManualDescription:
            "stud lovin'. Cum watch Mia Malkova work this hard cock to explosion of warm man chowder all across her face!",
          MovieTitle: "",
          MultipleChoice: "",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Select a scene from a list of returned searches", async () => {
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
      sceneName: "[New Sensations] Mia Malkova",
      scenePath: "Z:\\Keep\\test\\[New Sensations] Mia Malkova.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "n",
          EnterMovie: "n",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "",
          EnterSceneTitle: "New Sensations Mia Malkova",
          EnterStudioName: "New Sensations",
          ManualActors: "",
          ManualDescription: "",
          MovieTitle: "",
          MultipleChoice: "3",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Select a wrong option a list of returned searches, no results returned because no manual input", async () => {
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
      sceneName: "[New Sensations] Mia Malkova",
      scenePath: "Z:\\Keep\\test\\[New Sensations] Mia Malkova.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "n",
          EnterMovie: "n",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "",
          EnterSceneTitle: "New Sensations Mia Malkova",
          EnterStudioName: "New Sensations",
          ManualActors: "",
          ManualDescription: "",
          MovieTitle: "",
          MultipleChoice: "34",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.deep.equal({});
  });
  it("list of returned searches, let the script find the title within the path name", async () => {
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
      sceneName: "[New Sensations] Mia Malkova - So Young So Sexy P.O.V. #08.mp4",
      scenePath: "Z:\\Keep\\test\\[New Sensations] Mia Malkova So Young So Sexy P.O.V. #08.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "n",
          EnterMovie: "n",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "",
          EnterSceneTitle: "",
          EnterStudioName: "New Sensations",
          ManualActors: "",
          ManualDescription: "",
          MovieTitle: "",
          MultipleChoice: "",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.be.an("object");
    expect(result.description).to.be.a("string");
    expect(result.releaseDate).to.be.a("number");
    expect(result.thumbnail).to.be.a("string");
    expect(result.actors).to.be.a("Array");
    expect(result.studio).to.be.a("string");
  });
  it("Select a scene from a list of returned searches, error out because too many results after agressive search, chose not to enter manual info", async () => {
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
      sceneName: "[New Sensations] Mia Malkova",
      scenePath: "Z:\\Keep\\test\\[New Sensations] Mia Malkova.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "n",
          EnterMovie: "n",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "",
          EnterSceneTitle: "New Sensations Mia Malkova",
          EnterStudioName: "New Sensations",
          ManualActors: "",
          ManualDescription: "",
          MovieTitle: "",
          MultipleChoice: "2",
        },
        TestSiteunavailable: false,
        status: true,
      },
    });
    expect(result).to.deep.equal({});
  });
  it("TPD not available and should not return anything because Manualinfo is = n", async () => {
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
      sceneName: "[New Sensations] Mia Malkova",
      scenePath: "Z:\\Keep\\test\\[New Sensations] Mia Malkova 2013.10.10.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "n",
          EnterMovie: "n",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "",
          EnterSceneTitle: "New Sensations Mia Malkova",
          EnterStudioName: "New Sensations",
          ManualActors: "",
          ManualDescription: "",
          MovieTitle: "",
          MultipleChoice: "3",
        },
        TestSiteunavailable: true,
        status: true,
      },
    });
    expect(result).to.deep.equal({});
  });
  it("TPD does not support that specific studio return blank because no manual input", async () => {
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
      sceneName: "[Colette] Mia Malkova",
      scenePath: "Z:\\Keep\\test\\[Colette] Mia Malkova.mp4",
      testmode: {
        Questions: {
          EnterInfoSearch: "y",
          EnterManInfo: "n",
          EnterMovie: "n",
          EnterOneActorName: "Mia Malkova",
          EnterSceneDate: "",
          EnterSceneTitle: "Colette Mia Malkova",
          EnterStudioName: "Colette",
          ManualActors: "",
          ManualDescription: "",
          MovieTitle: "",
          MultipleChoice: "3",
        },
        TestSiteunavailable: true,
        status: true,
      },
    });
    expect(result).to.deep.equal({});
  });
});
