import baseContext from "../../../../context";
import path from "path";

const context = {
  ...baseContext,
  $createLocalImage: (path, name) => `${path} ${name}`,
};

const baseArgs = {
  actors: [],
  scenes: [],
  movies: [],
  studios: [],
};

export const basicFixtures = [
  {
    name: "throw when no event",
    context: {
      ...context,
    },
    errored: true,
    errorMessage: "cannot run plugin",
  },
  {
    name: "throws with dummy event",
    context: {
      ...context,
      event: "fake",
    },
    errored: true,
    errorMessage: "cannot run plugin",
  },
  {
    name: "throws when missing name",
    context: {
      ...context,
      actorName: "",
      args: {
        ...baseArgs,
        event: "actorCreated",
        actors: [
          {
            prop: "thumbnail",
            searchTerm: "thumbnail",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    errored: true,
    errorMessage: "cannot run plugin",
  },
  {
    name: "throws when missing event args paths",
    context: {
      ...context,
      event: "actorCreated",
      actorName: "",
      args: { ...baseArgs, actors: null },
    },
    errored: true,
    errorMessage: "schema is incorrect",
  },
  {
    name: "throws when args not conform to schema",
    context: {
      ...context,
      event: "actorCreated",
      actorName: "",
      args: {
        ...baseArgs,
        actors: [{ prop: "test", path: "./plugins/pics/test/fixtures" }],
      },
    },
    errored: true,
    errorMessage: "schema is incorrect",
  },
  {
    name: "throws when args not conform to schema 2",
    context: {
      ...context,
      event: "actorCreated",
      actorName: "",
      args: {
        ...baseArgs,
        actors: [{ prop: "test", searchTerm: "", path: "./plugins/pics/test/fixtures" }],
      },
    },
    errored: true,
    errorMessage: "schema is incorrect",
  },
  {
    name: "does not throw when args conform to schema",
    context: {
      ...context,
      event: "actorCreated",
      actorName: "test actor",
      args: {
        ...baseArgs,
        actors: [
          { prop: "thumbnail", searchTerm: "thumbnail", path: "./plugins/pics/test/fixtures" },
        ],
      },
    },
    errored: false,
  },
];

export const actorFixtures = [
  // thumbnail
  {
    name: "Should find a thumbnail",
    context: {
      ...context,
      actorName: "001",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "thumbnail",
            searchTerm: "001",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      thumbnail: context.$createLocalImage(
        path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
        "001 (thumbnail)"
      ),
    },
  },
  {
    name: "Should find another thumbnail",
    context: {
      ...context,
      actorName: "002",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "thumbnail",
            searchTerm: "002",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      thumbnail: context.$createLocalImage(
        path.resolve("./plugins/pics/test/fixtures/image002.gif"),
        "002 (thumbnail)"
      ),
    },
  },
  {
    name: "Should find when searchTerm",
    context: {
      ...context,
      actorName: "004",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "thumbnail",
            path: "./plugins/pics/test/fixtures",
            searchTerm: "dummy",
          },
        ],
      },
    },
    result: {
      thumbnail: context.$createLocalImage(
        path.resolve("./plugins/pics/test/fixtures/deep/image004-dummy.jpg"),
        "004 (thumbnail)"
      ),
    },
  },
  {
    name: "Should not find when no file with searchTerm",
    context: {
      ...context,
      actorName: "004",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "thumbnail",
            path: "./plugins/pics/test/fixtures",
            searchTerm: "not_exist",
          },
        ],
      },
    },
    result: {},
  },
  {
    name: "Should find no image",
    context: {
      ...context,
      actorName: "003",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "thumbnail",
            searchTerm: "003",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
  },
  // hero
  {
    name: "Should find hero",
    context: {
      ...context,
      actorName: "001",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "hero",
            searchTerm: "001",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      hero: context.$createLocalImage(
        path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
        "001 (hero)"
      ),
    },
  },
  {
    name: "Should not find hero",
    context: {
      ...context,
      actorName: "003",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "hero",
            searchTerm: "003",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
  },
  // Deep
  // Deep > thumbnail
  {
    name: "deep: Should find a thumbnail",
    context: {
      ...context,
      actorName: "005",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "thumbnail",
            searchTerm: "005",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      thumbnail: context.$createLocalImage(
        path.resolve("./plugins/pics/test/fixtures/deep/image005.jpg"),
        "005 (thumbnail)"
      ),
    },
  },
  {
    name: "deep: Should find another thumbnail",
    context: {
      ...context,
      actorName: "006",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "thumbnail",
            searchTerm: "006",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      thumbnail: context.$createLocalImage(
        path.resolve("./plugins/pics/test/fixtures/deep/image006.gif"),
        "006 (thumbnail)"
      ),
    },
  },
  {
    name: "deep: Should find no image",
    context: {
      ...context,
      actorName: "007",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "thumbnail",
            searchTerm: "007",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
  },
  // Deep > hero
  {
    name: "deep: Should find hero",
    context: {
      ...context,
      actorName: "005",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "hero",
            searchTerm: "005",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      hero: context.$createLocalImage(
        path.resolve("./plugins/pics/test/fixtures/deep/image005.jpg"),
        "005 (hero)"
      ),
    },
  },
  {
    name: "deep: Should not find hero",
    context: {
      ...context,
      actorName: "007",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "hero",
            searchTerm: "007",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
  },
];

export const actorCreateImageFixtures = [
  {
    name: "Should find extra, does not return in result",
    context: {
      ...context,
      actorName: "001",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "extra",
            searchTerm: "001",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
    createImageCallCount: 1,
  },
  {
    name: "Should find multple extra, does not return in result",
    context: {
      ...context,
      actorName: "001",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "extra",
            searchTerm: "001",
            path: "./plugins/pics/test/fixtures",
            getAllExtra: true,
          },
        ],
      },
    },
    result: {},
    createImageCallCount: 2,
  },
  {
    name: "Finds restricted extra, does not return in result",
    context: {
      ...context,
      actorName: "001",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "extra",
            searchTerm: "001",
            path: "./plugins/pics/test/fixtures",
            getAllExtra: true,
            blacklistTerms: ["png"],
          },
        ],
      },
    },
    result: {},
    createImageCallCount: 1,
  },
  {
    name: "Should find extra, allows empty searchTerm",
    context: {
      ...context,
      actorName: "001",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "extra",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
    createImageCallCount: 1,
  },
  {
    name: "Should not find extra",
    context: {
      ...context,
      actorName: "003",
      args: {
        ...baseArgs,
        actors: [
          {
            prop: "extra",
            searchTerm: "003",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
    createImageCallCount: 0,
  },
];

export const sceneFixtures = [
  {
    name: "Should find a thumbnail",
    context: {
      ...context,
      sceneName: "001",
      args: {
        ...baseArgs,
        scenes: [
          {
            prop: "thumbnail",
            searchTerm: "001",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      thumbnail: context.$createLocalImage(
        path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
        "001 (thumbnail)"
      ),
    },
  },
  {
    name: "Should find no image",
    context: {
      ...context,
      sceneName: "003",
      args: {
        ...baseArgs,
        scenes: [
          {
            prop: "thumbnail",
            searchTerm: "003",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
  },
];

export const movieFixtures = [
  // backCover
  {
    name: "Should find a thumbnail",
    context: {
      ...context,
      movieName: "001",
      args: {
        ...baseArgs,
        movies: [
          {
            prop: "backCover",
            searchTerm: "001",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      backCover: context.$createLocalImage(
        path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
        "001 (backCover)"
      ),
    },
  },
  {
    name: "Should find no image",
    context: {
      ...context,
      movieName: "003",
      args: {
        ...baseArgs,
        movies: [
          {
            prop: "backCover",
            searchTerm: "003",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
  },
  // frontCover
  {
    name: "Should find a frontCover 1",
    context: {
      ...context,
      movieName: "001",
      args: {
        ...baseArgs,
        movies: [
          {
            prop: "frontCover",
            searchTerm: "001",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      frontCover: context.$createLocalImage(
        path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
        "001 (frontCover)"
      ),
    },
  },
  {
    name: "Should find no frontCover 2",
    context: {
      ...context,
      movieName: "003",
      args: {
        ...baseArgs,
        movies: [
          {
            prop: "frontCover",
            searchTerm: "003",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
  },
  // spineCover
  {
    name: "Should find a spineCover 1",
    context: {
      ...context,
      movieName: "001",
      args: {
        ...baseArgs,
        movies: [
          {
            prop: "spineCover",
            searchTerm: "001",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      spineCover: context.$createLocalImage(
        path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
        "001 (spineCover)"
      ),
    },
  },
  {
    name: "Should find spineCover",
    context: {
      ...context,
      movieName: "003",
      args: {
        ...baseArgs,
        movies: [
          {
            prop: "spineCover",
            searchTerm: "003",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
  },
];

export const studioFixtures = [
  {
    name: "Should find a thumbnail",
    context: {
      ...context,
      studioName: "001",
      args: {
        ...baseArgs,
        studios: [
          {
            prop: "thumbnail",
            searchTerm: "001",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      thumbnail: context.$createLocalImage(
        path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
        "001 (thumbnail)"
      ),
    },
  },
  {
    name: "Should find no image",
    context: {
      ...context,
      studioName: "003",
      args: {
        ...baseArgs,
        studios: [
          {
            prop: "thumbnail",
            searchTerm: "003",
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
  },
];
