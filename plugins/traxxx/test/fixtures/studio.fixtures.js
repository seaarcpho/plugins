import context from "../../../../context";

export const validationFixtures = [
  {
    name: "when no 'studioName'",
    context: {
      ...context,
      args: {},
    },
    errored: true,
    errorMessage: "cannot run plugin",
  },
  {
    name: "when no 'args.studios'",
    context: {
      ...context,
      studioName: "fake",
      args: {},
    },
    errored: true,
    errorMessage: "cannot run plugin",
  },
  {
    name: "when 'args.studios.channelPriority' is missing",
    context: {
      ...context,
      studioName: "fake",
      args: { studios: {} },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.channelPriority' is not a boolean",
    context: {
      ...context,
      studioName: "fake",
      args: { studios: { channelPriority: "not a boolean" } },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.channelPriority' is a boolean",
    context: {
      ...context,
      studioName: "fake",
      args: { studios: { channelPriority: true } },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.uniqueNames' is missing",
    context: {
      ...context,
      studioName: "fake",
      args: { studios: { uniqueNames: "not a boolean" } },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.uniqueNames' is not a boolean",
    context: {
      ...context,
      studioName: "fake",
      args: { studios: { channelPriority: true, uniqueNames: "not a boolean" } },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.uniqueNames' is a boolean",
    context: {
      ...context,
      studioName: "fake",
      args: { studios: { channelPriority: true, uniqueNames: true } },
    },
    errored: false,
  },
];

const EvilAngelChannelUniqueNames = {
  name: "Evil Angel (Channel)",
  description: "",
  parent: "Evil Angel (Network)",
  custom: {
    traxxx_id: 291,
    traxxx_type: "channel",
    url: "https://www.evilangel.com",
  },
};

export const defaultArgsResultFixtures = [
  {
    name: "does not find fake name",
    context: {
      ...context,
      studioName: "fake",
      args: { studios: {} },
    },
    errored: false,
    result: {},
  },
  {
    name: "does find simple studio",
    context: {
      ...context,
      studioName: "Evil Angel",
      args: { studios: {} },
    },
    errored: false,
    result: EvilAngelChannelUniqueNames,
  },
  {
    name: "does find simple studio, no spaces",
    context: {
      ...context,
      studioName: "EvilAngel",
      args: { studios: {} },
    },
    errored: false,
    result: EvilAngelChannelUniqueNames,
  },
  {
    name: "does find simple studio, multiple spaces",
    context: {
      ...context,
      studioName: "  Evil  Angel  ",
      args: { studios: {} },
    },
    errored: false,
    result: EvilAngelChannelUniqueNames,
  },
  {
    name: "does find simple studio, with accents",
    context: {
      ...context,
      studioName: "Évïl Ângel",
      args: {
        studios: {},
      },
    },
    errored: false,
    result: EvilAngelChannelUniqueNames,
  },
];

export const genericResultFixtures = [
  {
    name: "returns nothing with fake studio, when dry: true",
    context: {
      ...context,
      studioName: "fake",
      args: { dry: true, studios: {} },
    },
    errored: false,
    result: {},
  },
  {
    name: "returns nothing with real studio, when dry: true",
    context: {
      ...context,
      studioName: "Evil Angel",
      args: { dry: true, studios: {} },
    },
    errored: false,
    result: {},
  },
  {
    name: "returns channel name w/ suffix, when uniqueNames: true",
    context: {
      ...context,
      studioName: "Evil Angel",
      args: { studios: { uniqueNames: true, channelPriority: true } },
    },
    errored: false,
    result: {
      name: "Evil Angel (Channel)",
      description: "",
      parent: "Evil Angel (Network)",
      custom: {
        traxxx_id: 291,
        traxxx_type: "channel",
        url: "https://www.evilangel.com",
      },
    },
  },
  {
    name: "returns basic channel name, when uniqueNames: false",
    context: {
      ...context,
      studioName: "Evil Angel",
      args: { studios: { uniqueNames: false, channelPriority: true } },
    },
    errored: false,
    result: {
      // No 'parent' in result on purpose, since no unique names,
      // and they would conflict
      name: "Evil Angel",
      description: "",
      custom: {
        traxxx_id: 291,
        traxxx_type: "channel",
        url: "https://www.evilangel.com",
      },
    },
  },
  {
    name: "returns network name w/ suffix, when uniqueNames: true, channelPriority: false",
    context: {
      ...context,
      studioName: "Evil Angel",
      args: { studios: { uniqueNames: true, channelPriority: false } },
    },
    errored: false,
    result: {
      name: "Evil Angel (Network)",
      description:
        "Welcome to the award winning Evil Angel website, home to the most popular pornstars of today, yesterday and tomorrow in their most extreme and hardcore porn scenes to date. We feature almost 30 years of rough sex videos and hardcore anal porn like you've never seen before, and have won countless AVN and XBiz awards including 'Best Site' and 'Best Studio'.",
      parent: "Gamma Entertainment",
      custom: {
        traxxx_id: 28,
        traxxx_type: "network",
        url: "https://www.evilangel.com",
      },
    },
  },
  {
    name: "returns basic network name, when uniqueNames: false, channelPriority: false",
    context: {
      ...context,
      studioName: "Evil Angel",
      args: { studios: { uniqueNames: false, channelPriority: false } },
    },
    errored: false,
    result: {
      name: "Evil Angel",
      description:
        "Welcome to the award winning Evil Angel website, home to the most popular pornstars of today, yesterday and tomorrow in their most extreme and hardcore porn scenes to date. We feature almost 30 years of rough sex videos and hardcore anal porn like you've never seen before, and have won countless AVN and XBiz awards including 'Best Site' and 'Best Studio'.",
      parent: "Gamma Entertainment",
      custom: {
        traxxx_id: 28,
        traxxx_type: "network",
        url: "https://www.evilangel.com",
      },
    },
  },
];
