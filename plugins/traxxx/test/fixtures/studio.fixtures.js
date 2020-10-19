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
  // channelPriority
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
  // uniqueNames
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
  // channelSuffix
  {
    name: "when 'args.studios.channelSuffix' is not a string",
    context: {
      ...context,
      studioName: "fake",
      args: { studios: { channelPriority: true, uniqueNames: true, channelSuffix: false } },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.channelSuffix' is a string",
    context: {
      ...context,
      studioName: "fake",
      args: { studios: { channelPriority: true, uniqueNames: true, channelSuffix: "my suffix" } },
    },
    errored: false,
  },
  // networkSuffix
  {
    name: "when 'args.studios.networkSuffix' is not a string",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: false,
        },
      },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.networkSuffix' is a string",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: "my suffix",
        },
      },
    },
    errored: false,
  },
  // whitelist
  {
    name: "when 'args.studios.whitelist' is not an array",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: "my suffix",
          whitelist: false,
        },
      },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.whitelist' is not an array of strings",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: "my suffix",
          whitelist: [1],
        },
      },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.whitelist' is an array of strings",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: "my suffix",
          whitelist: ["name"],
        },
      },
    },
    errored: false,
  },
  // blacklist
  {
    name: "when 'args.studios.whitelist' is not an array",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: "my suffix",
          whitelist: ["name"],
          blacklist: false,
        },
      },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.blacklist' is not an array of strings",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: "my suffix",
          whitelist: ["name"],
          blacklist: [1],
        },
      },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.blacklist' is an array of strings",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: "my suffix",
          whitelist: ["name"],
          blacklist: ["name"],
        },
      },
    },
    errored: false,
  },
  // whitelistOverride
  {
    name: "when 'args.studios.whitelistOverride' is not an array",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: "my suffix",
          whitelist: ["name"],
          blacklist: ["name"],
          whitelistOverride: false,
        },
      },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.whitelistOverride' is not an array of strings",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: "my suffix",
          whitelist: ["name"],
          blacklist: ["name"],
          whitelistOverride: [1],
        },
      },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.whitelistOverride' is an array of strings",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: "my suffix",
          whitelist: ["name"],
          blacklist: ["name"],
          whitelistOverride: ["name"],
        },
      },
    },
    errored: false,
  },
  // blacklistOverride
  {
    name: "when 'args.studios.blacklistOverride' is not an array",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: "my suffix",
          whitelist: ["name"],
          blacklist: ["name"],
          whitelistOverride: ["name"],
          blacklistOverride: false,
        },
      },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.blacklistOverride' is not an array of strings",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: "my suffix",
          whitelist: ["name"],
          blacklist: ["name"],
          whitelistOverride: ["name"],
          blacklistOverride: [1],
        },
      },
    },
    errored: false,
  },
  {
    name: "when 'args.studios.blacklistOverride' is an array of strings",
    context: {
      ...context,
      studioName: "fake",
      args: {
        studios: {
          channelPriority: true,
          uniqueNames: true,
          channelSuffix: "my suffix",
          networkSuffix: "my suffix",
          whitelist: ["name"],
          blacklist: ["name"],
          whitelistOverride: ["name"],
          blacklistOverride: ["name"],
        },
      },
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
  // Dry
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
  // Name checks
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
  // Prop suppression > blacklist
  {
    name: "returns all properties with no whitelist/blacklist...",
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
    name: "does not return name when blacklisted",
    context: {
      ...context,
      studioName: "Evil Angel",
      args: { studios: { uniqueNames: true, channelPriority: true, blacklist: ["name"] } },
    },
    errored: false,
    result: {
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
    name: "does not return description when blacklisted",
    context: {
      ...context,
      studioName: "Evil Angel",
      args: { studios: { uniqueNames: true, channelPriority: true, blacklist: ["description"] } },
    },
    errored: false,
    result: {
      name: "Evil Angel (Channel)",
      parent: "Evil Angel (Network)",
      custom: {
        traxxx_id: 291,
        traxxx_type: "channel",
        url: "https://www.evilangel.com",
      },
    },
  },
  // Prop suppression > whitelist
  {
    name: "returns only name when whitelisted",
    context: {
      ...context,
      studioName: "Evil Angel",
      args: { studios: { uniqueNames: true, channelPriority: true, whitelist: ["name"] } },
    },
    errored: false,
    result: {
      name: "Evil Angel (Channel)",
      custom: {
        traxxx_id: 291,
        traxxx_type: "channel",
        url: "https://www.evilangel.com",
      },
    },
  },
  {
    name: "returns only description when whitelisted",
    context: {
      ...context,
      studioName: "Evil Angel",
      args: { studios: { uniqueNames: true, channelPriority: true, whitelist: ["description"] } },
    },
    errored: false,
    result: {
      description: "",
      custom: {
        traxxx_id: 291,
        traxxx_type: "channel",
        url: "https://www.evilangel.com",
      },
    },
  },
  // Prop suppression > previous plugin
  {
    name: "does not return name when in data",
    context: {
      ...context,
      studioName: "Evil Angel",
      args: { studios: { uniqueNames: true, channelPriority: true, blacklistOverride: ["name"] } },
      data: {
        name: "dummy name",
      },
    },
    errored: false,
    result: {
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
    name: "does not return description when in data",
    context: {
      ...context,
      studioName: "Evil Angel",
      args: {
        studios: { uniqueNames: true, channelPriority: true, blacklistOverride: ["description"] },
      },
      data: {
        description: "dummy description",
      },
    },
    errored: false,
    result: {
      name: "Evil Angel (Channel)",
      parent: "Evil Angel (Network)",
      custom: {
        traxxx_id: 291,
        traxxx_type: "channel",
        url: "https://www.evilangel.com",
      },
    },
  },
];
