import baseContext from "../../../../context";
import path from "path";

const context = {
  ...baseContext,
  $createLocalImage: (path) => path,
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
        actors: [
          {
            prop: "thumbnail",
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
      actorName: "",
      args: { ...baseArgs, actors: undefined },
    },
    errored: true,
    errorMessage: "cannot run plugin",
  },
  {
    name: "throws when args not conform to schema",
    context: {
      ...context,
      actorName: "",
      args: { ...baseArgs, actors: [{ prop: "test" }] },
    },
    errored: true,
    errorMessage: "cannot run plugin",
  },
  {
    name: "does not throw when args conform to schema",
    context: {
      ...context,
      event: "actorCreated",
      actorName: "test actor",
      args: { ...baseArgs, actors: [{ prop: "thumbnail", path: "./plugins/pics/test/fixtures" }] },
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      thumbnail: path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      thumbnail: path.resolve("./plugins/pics/test/fixtures/image002.gif"),
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
      thumbnail: path.resolve("./plugins/pics/test/fixtures/deep/image004-dummy.jpg"),
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      hero: path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      thumbnail: path.resolve("./plugins/pics/test/fixtures/deep/image005.jpg"),
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      thumbnail: path.resolve("./plugins/pics/test/fixtures/deep/image006.gif"),
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      hero: path.resolve("./plugins/pics/test/fixtures/deep/image005.jpg"),
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
    createImageCalled: true,
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
    createImageCalled: false,
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      thumbnail: path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      backCover: path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      frontCover: path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      spineCover: path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {
      thumbnail: path.resolve("./plugins/pics/test/fixtures/image001.jpg"),
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
            path: "./plugins/pics/test/fixtures",
          },
        ],
      },
    },
    result: {},
  },
];
