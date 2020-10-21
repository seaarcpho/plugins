import baseContext from "../../../../context";

const LOCAL_IMAGE_ID = "local_image";

const context = {
  ...baseContext,
  $createLocalImage: () => LOCAL_IMAGE_ID,
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
        actors: {
          path_thumb: "./plugins/pics/test/fixtures",
        },
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
      args: {
        actors: undefined,
      },
    },
    errored: true,
    errorMessage: "cannot run plugin",
  },
];

export const actorFixtures = [
  {
    name: "Should find a thumbnail",
    context: {
      ...context,
      actorName: "001",
      args: {
        actors: {
          path_thumb: "./plugins/pics/test/fixtures",
        },
      },
    },
    result: {
      thumbnail: LOCAL_IMAGE_ID,
    },
  },
  {
    name: "Should find no image",
    context: {
      ...context,
      actorName: "003",
      args: {
        actors: {
          path_thumb: "./plugins/pics/test/fixtures",
        },
      },
    },
    result: {},
  },
  {
    name: "Should find a thumbnail 2",
    context: {
      ...context,
      actorName: "001",
      args: {
        actors: {
          path_hero: "./plugins/pics/test/fixtures",
        },
      },
    },
    result: {
      hero: LOCAL_IMAGE_ID,
    },
  },
  {
    name: "Should find no image 2",
    context: {
      ...context,
      actorName: "003",
      args: {
        actors: {
          path_hero: "./plugins/pics/test/fixtures",
        },
      },
    },
    result: {},
  },
];

export const sceneFixtures = [
  {
    name: "Should find a thumbnail",
    context: {
      ...context,
      sceneName: "001",
      args: {
        scenes: {
          path_thumb: "./plugins/pics/test/fixtures",
        },
      },
    },
    result: {
      thumbnail: LOCAL_IMAGE_ID,
    },
  },
  {
    name: "Should find no image",
    context: {
      ...context,
      sceneName: "003",
      args: {
        scenes: {
          path_thumb: "./plugins/pics/test/fixtures",
        },
      },
    },
    result: {},
  },
];

export const movieFixtures = [
  // path_back_cover
  {
    name: "Should find a thumbnail",
    context: {
      ...context,
      movieName: "001",
      args: {
        movies: {
          path_back_cover: "./plugins/pics/test/fixtures",
        },
      },
    },
    result: {
      backCover: LOCAL_IMAGE_ID,
    },
  },
  {
    name: "Should find no image",
    context: {
      ...context,
      movieName: "003",
      args: {
        movies: {
          path_back_cover: "./plugins/pics/test/fixtures",
        },
      },
    },
    result: {},
  },
  // path_front_cover
  {
    name: "Should find a thumbnail 2",
    context: {
      ...context,
      movieName: "001",
      args: {
        movies: {
          path_front_cover: "./plugins/pics/test/fixtures",
        },
      },
    },
    result: {
      frontCover: LOCAL_IMAGE_ID,
    },
  },
  {
    name: "Should find no image 2",
    context: {
      ...context,
      movieName: "003",
      args: {
        movies: {
          path_front_cover: "./plugins/pics/test/fixtures",
        },
      },
    },
    result: {},
  },
  // path_spine_cover
  {
    name: "Should find a thumbnail 3",
    context: {
      ...context,
      movieName: "001",
      args: {
        movies: {
          path_spine_cover: "./plugins/pics/test/fixtures",
        },
      },
    },
    result: {
      spineCover: LOCAL_IMAGE_ID,
    },
  },
  {
    name: "Should find no image 3",
    context: {
      ...context,
      movieName: "003",
      args: {
        movies: {
          path_spine_cover: "./plugins/pics/test/fixtures",
        },
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
        studios: {
          path_thumb: "./plugins/pics/test/fixtures",
        },
      },
    },
    result: {
      thumbnail: LOCAL_IMAGE_ID,
    },
  },
  {
    name: "Should find no image",
    context: {
      ...context,
      studioName: "003",
      args: {
        studios: {
          path_thumb: "./plugins/pics/test/fixtures",
        },
      },
    },
    result: {},
  },
];
