const levenshtein = require("./levenshtein.js");
const util = require("./util");

module.exports = async ({
  event,
  $throw,
  $fs,
  $moment,
  $log,
  $axios,
  testMode,
  sceneName,
  scenePath,
  args,
  $inquirer,
  $createImage,
}) => {
  const testingStatus = testMode ? testMode.status : false;
  const testingTheSiteStatus = testMode ? testMode.testSiteUnavailable : false;

  // Array Variable that will be returned
  const result = {};

  // Variable that is used for all the "manualTouch" questions

  const cleanPathname = util.stripStr(scenePath.toString());

  // Making sure that the event that triggered is the correct event

  if (event !== "sceneCreated" && event !== "sceneCustom" && testingStatus !== true) {
    $throw(" ERR: Plugin used for unsupported event");
  }

  // Checking all of the arguments are set in the plugin

  if (args.source_settings === undefined) {
    $throw(" ERR: Missing source_settings in plugin args");
  }

  if (args.parseActor === undefined) {
    $throw(" ERR: Missing ParseActor in plugin args");
  }

  if (args.parseStudio === undefined) {
    $throw(" ERR: Missing parseStudio in plugin args");
  }

  if (args.ManualTouch === undefined) {
    $throw(" ERR: Missing ManualTouch in plugin args");
  }

  if (args.SceneDuplicationCheck === undefined) {
    $throw(" ERR: Missing SceneDuplicationCheck in plugin args");
  }

  $log(` MSG: STARTING to analyze scene: ${scenePath}`);
  // -------------------ACTOR Parse

  // This is where the plugin attempts to check for Actors using the Actors.db

  // creating a array to use for other functions
  const gettingActor = [];
  const actor = [];

  if (args.parseActor) {
    $log(`:::::PARSE:::: Parsing Actors DB ==> ${args.source_settings.Actors}`);
    $fs
      .readFileSync(args.source_settings.Actors, "utf8")
      .split("\n")
      .forEach((line) => {
        if (!line) {
          return;
        }

        const matchActor = new RegExp(JSON.parse(line).name, "i");

        const actorLength = matchActor.toString().split(" ");

        if (actorLength.length < 2) {
          return;
        }

        // $log(((JSON.parse(line)).name))
        const foundActorMatch = util.stripStr(scenePath).match(matchActor);

        // $log(util.stripStr(sceneName))

        if (foundActorMatch !== null) {
          gettingActor.push(JSON.parse(line).name);
          return;
        }

        const allAliases = JSON.parse(line).aliases.toString().split(",");

        allAliases.forEach((personAlias) => {
          const aliasLength = personAlias.toString().split(" ");

          if (aliasLength.length < 2) {
            return;
          }

          let matchAliasActor = new RegExp(personAlias, "i");

          let foundAliasActorMatch = util.stripStr(scenePath).match(matchAliasActor);

          if (foundAliasActorMatch !== null) {
            gettingActor.push(JSON.parse(line).name);
          } else {
            const aliasNoSpaces = personAlias.toString().replace(" ", "");

            matchAliasActor = new RegExp(aliasNoSpaces, "i");

            foundAliasActorMatch = util.stripStr(scenePath).match(matchAliasActor);

            if (foundAliasActorMatch !== null) {
              gettingActor.push(JSON.parse(line).name);
            }
          }
        });
      });

    let actorHighscore = 5000;
    if (gettingActor.length && Array.isArray(gettingActor)) {
      gettingActor.forEach((person) => {
        // This is a function that will see how many differences it will take to make the string match.
        // The lowest amount of changes means that it is probably the closest match to what we need.
        // lowest score wins :)
        const found = levenshtein(person.toString().toLowerCase(), cleanPathname);

        if (found < actorHighscore) {
          actorHighscore = found;

          actor[0] = person;
        }
        $log(`    SUCCESS: Found Actor:` + actor);
      });
      $log(`---> Using "best match" Actor For Search:` + actor);
    }
  }
  // -------------------STUDIO Parse

  // This is where the plugin attempts to check for Studios using the Studios.db

  // creating a array to use for other functions

  const gettingStudio = [];

  const studio = [];

  if (args.parseStudio) {
    $log(`:::::PARSE:::: Parsing Studios DB ==> ${args.source_settings.Studios}`);

    $fs
      .readFileSync(args.source_settings.Studios, "utf8")
      .split("\n")
      .forEach((line) => {
        if (!line) {
          return;
        }

        if (!JSON.parse(line).name) {
          return;
        }

        let matchStudio = new RegExp(JSON.parse(line).name, "i");

        const foundStudioMatch = util.stripStr(scenePath).match(matchStudio);

        if (foundStudioMatch !== null) {
          gettingStudio.push(JSON.parse(line).name);
        } else if (JSON.parse(line).name !== null) {
          matchStudio = new RegExp(JSON.parse(line).name.replace(/ /g, ""), "i");

          const foundStudioMatch = util.stripStr(scenePath).match(matchStudio);

          if (foundStudioMatch !== null) {
            gettingStudio.push(JSON.parse(line).name);
          }
        }
      });

    // this is a debug option to se see how many studios were found by just doing a simple regex
    // $log(GettingStudio);
    let studiohighscore = 5000;
    if (gettingStudio.length && Array.isArray(gettingStudio)) {
      gettingStudio.forEach((stud) => {
        // This is a function that will see how many differences it will take to make the string match.
        // The lowest amount of changes means that it is probably the closest match to what we need.
        // lowest score wins :)
        const found = levenshtein(stud.toString().toLowerCase(), cleanPathname);

        if (found < studiohighscore) {
          studiohighscore = found;

          studio[0] = stud;
        }
        $log(`    SUCCESS: Found Studio:` + stud);
      });

      $log(`---> Using "best match" Studio For Search:` + studio);
    }
  }
  // Try to PARSE the SceneName and determine Date

  const ddmmyyyy = util.stripStr(scenePath, true).match(/\d\d \d\d \d\d\d\d/);

  const yyyymmdd = util.stripStr(scenePath, true).match(/\d\d\d\d \d\d \d\d/);

  const yymmdd = util.stripStr(scenePath, true).match(/\d\d \d\d \d\d/);

  let timestamp = {};

  $log(":::::PARSE:::: Parsing Date from ScenePath");
  // $log(util.stripStr(scenePath, true));

  if (yyyymmdd && yyyymmdd.length) {
    const date = yyyymmdd[0].replace(" ", ".");

    $log("   SUCCESS: Found => yyyymmdd");

    timestamp = $moment(date, "YYYY-MM-DD").valueOf();
  } else if (ddmmyyyy && ddmmyyyy.length) {
    const date = ddmmyyyy[0].replace(" ", ".");

    $log("   SUCCESS: Found => ddmmyyyy");

    timestamp = $moment(date, "DD-MM-YYYY").valueOf();
  } else if (yymmdd && yymmdd.length) {
    const date = yymmdd[0].replace(" ", ".");

    $log("   SUCCESS: Found => yymmdd");

    timestamp = $moment(date, "YY-MM-DD").valueOf();
  } else {
    $log("   FAILED: Could not find a date in the ScenePath");
  }

  // Function that is called to convert a found date into a timestamp.

  // After everything has completed parsing, I run a function that will perform all of the lookups against TPDB

  const finalCallResult = await doASearch(actor, studio, timestamp);
  return finalCallResult;

  // -------------------------------------------------------------

  // -------------------Fucntions & Async functions---------------

  // -------------------------------------------------------------
  /**
   * Standard block of manual questions that prompt the user for input
   * @returns {Promise<string[]|object>} either an array of all questions that need to be import manually
   */
  async function manualImport() {
    const questionAsync = util.createQuestionPrompter($inquirer, testingStatus, $log);

    $log(" Config ==> ManualTouch]  MSG: SET TO TRUE ");

    const Q1Answer = await questionAsync(
      {
        type: "input",
        name: "ManualEnter",
        message:
          "Due to failed searches, would you like to MANUALLY enter information to import directly into porn-vault?: (Y/N) ",
      },
      "TESTMODE Question Enter MANUAL Info?",
      testMode && testMode.questions ? testMode.questions.enterManInfo : ""
    );

    const runInteractiveSearch = util.isPositiveAnswer(Q1Answer.ManualEnter);

    if (!runInteractiveSearch) {
      return {};
    }

    const manualMovieAnswer = await questionAsync(
      {
        type: "input",
        name: "IsMovie",
        message: "Is this a Scene from a Movie / Set / Collection?: (Y/N) ",
      },
      "TESTMODE Question MANUAL Movie",
      testMode && testMode.questions ? testMode.questions.enterMovie : ""
    );

    const manualEnterMovieSearch = util.isPositiveAnswer(manualMovieAnswer.IsMovie);

    if (manualEnterMovieSearch) {
      const manualMovieName = await questionAsync(
        {
          type: "input",
          name: "TitleofMovie",
          message: "What is the Title of the Movie?: ",
        },
        "TESTMODE Question MANUAL Movie Title",
        testMode && testMode.questions ? testMode.questions.movieTitle : ""
      );

      if (result.movie === undefined && manualMovieName.TitleofMovie !== "") {
        result.movie = manualMovieName.TitleofMovie;
      }
    }

    const manualEnterTitleScene = await questionAsync(
      {
        type: "input",
        name: "TitleofScene",
        message: "What is the TITLE of the scene?: ",
      },
      "TESTMODE Question MANUAL Title",
      testMode && testMode.questions ? testMode.questions.enterSceneTitle : ""
    );

    result.title = manualEnterTitleScene.TitleofScene;

    const manualEnterReleaseDateScene = await questionAsync(
      {
        type: "input",
        name: "ReleaseDateofScene",
        message: "What is the RELEASE DATE of the scene (YYYY.MM.DD)?: ",
      },
      "TESTMODE Question MANUAL Date",
      testMode && testMode.questions ? testMode.questions.enterSceneDate : ""
    );

    result.releaseDate = manualEnterReleaseDateScene.ReleaseDateofScene;

    if (result.releaseDate !== "") {
      const questYear = result.releaseDate.match(/\d\d\d\d.\d\d.\d\d/);

      $log(" MSG: Checking Date");

      if (questYear && questYear.length) {
        const date = questYear[0];

        $log(" MSG: Found => yyyymmdd");

        result.releaseDate = $moment(date, "YYYY-MM-DD").valueOf();
      }
    }

    const manualEnterDescriptionOfScene = await questionAsync(
      {
        type: "input",
        name: "DescriptionOfScene",
        message: "What is the DESCRIPTION for the scene?: ",
      },
      "TESTMODE Question MANUAL Description",
      testMode && testMode.questions ? testMode.questions.manualDescription : ""
    );

    result.description = manualEnterDescriptionOfScene.DescriptionOfScene;

    const splitactors = await questionAsync(
      {
        type: "input",
        name: "ActorsOfScene",
        message: `What are the Actors NAMES in the scene?: (seperated by Comma)`,
        default() {
          return `${actor.length ? ` ${actor.join(", ")}` : ""}`;
        },
      },
      "TESTMODE Question MANUAL actor names",
      testMode && testMode.questions ? testMode.questions.manualActors : ""
    );

    const areActorsBlank = !splitactors.ActorsOfScene || !splitactors.ActorsOfScene.trim();

    if (!areActorsBlank) {
      result.actors = splitactors.ActorsOfScene.trim().split(",");
    }

    const askedStudio = await questionAsync(
      {
        type: "input",
        name: "StudioOfScene",
        message: `What Studio NAME is responsible for the scene?:`,
        default() {
          return `${studio[0] ? ` ${studio[0]}` : ""}`;
        },
      },
      "TESTMODE Question MANUAL Studio name",
      testMode && testMode.questions ? testMode.questions.enterStudioName : ""
    );

    const isStudioBlank =
      askedStudio.StudioOfScene === "" ||
      askedStudio.StudioOfScene === " " ||
      askedStudio.StudioOfScene === null;

    if (!isStudioBlank) {
      result.studio = askedStudio.StudioOfScene;
    }

    return result;
  }

  /**
   * Retrieves the scene titles or details from TPDB
   *
   * @param {string} value - a TPDB url to a scene
   * @param {boolean} agressiveSearch - if the search does not only have 1 result, if this should run a manual import instead of trying to get titles
   * @returns {Promise<string[]|object>} either an array of all the possible Porn Database search results, or a data object for the proper "found" scene
   */
  async function run(value, agressiveSearch = false) {
    const tpdbSceneSearchResponse = await $axios.get(value, {
      validateStatus: false,
    });

    // checking the status of the link or site, will escape if the site is down

    if (
      tpdbSceneSearchResponse.status !== 200 ||
      tpdbSceneSearchResponse.data.length === 0 ||
      (testingTheSiteStatus !== undefined && testingTheSiteStatus)
    ) {
      $log(" ERR: TPDB API query failed");

      if (testingStatus && !testingTheSiteStatus) {
        $log("!! This will impact the test if it was not expecting a failure !!");
      }

      const manualInfo = await manualImport();
      return manualInfo;
    }

    // Grab the content data of the fed link
    const tpdbSceneSearchContent = tpdbSceneSearchResponse.data;

    // setting the scene index to an invalid value by default
    let correctSceneIdx = -1;

    // If a result was returned, it sets it to the first entry
    if (tpdbSceneSearchContent.data.length === 1) {
      correctSceneIdx = 0;
    }

    // making a variable to store all of the titles of the found results (in case we need the user to select a scene)
    const alltitles = [];

    // When completing an aggressive search, We don't want "extra stuff" -- it should only have 1 result that is found!
    if (agressiveSearch && correctSceneIdx === -1) {
      $log(" ERR: TPDB Could NOT find correct scene info");

      const manualInfo = await manualImport();
      return manualInfo;
    } else {
      // list the found results and tries to match the SCENENAME to the found results.
      // all while gathering all of the titles, in case no match is found

      if (tpdbSceneSearchContent.data.length > 1) {
        $log(`     SRCH: ${tpdbSceneSearchContent.data.length} results found`);

        for (let idx = 0; idx < tpdbSceneSearchContent.data.length; idx++) {
          const element = tpdbSceneSearchContent.data[idx];

          alltitles["Title" + idx] = { Title: element.title, id: element.id };

          // making variables to use to elimate Actors and scenes from the search results.

          // It is better to search just the title.  We already have the actor and studio.

          let searchedTitle = util.stripStr(sceneName).toString().toLowerCase();

          let matchTitle = util
            .stripStr(alltitles["Title" + idx].Title)
            .toString()
            .toLowerCase();

          // lets remove the actors from the scenename and the searched title -- We should already know this

          for (let j = 0; j < actor.length; j++) {
            searchedTitle = searchedTitle.replace(actor[j].toString().toLowerCase(), "");

            matchTitle = matchTitle.replace(actor[j].toString().toLowerCase(), "").trim();
          }

          // lets remove the Studio from the scenename and the searched title -- We should already know this

          if (studio[0] !== undefined) {
            searchedTitle = searchedTitle.replace(studio[0].toString().toLowerCase(), "");

            searchedTitle = searchedTitle.replace(
              studio[0].toString().toLowerCase().replace(" ", ""),
              ""
            );

            matchTitle = matchTitle.replace(studio[0].toString().toLowerCase(), "").trim();
          }

          // Only Run a match if there is a searched title to execute a match on

          if (matchTitle !== undefined) {
            $log(
              `     SRCH: Trying to match TPD title: ` +
                matchTitle.toString().trim() +
                " --with--> " +
                searchedTitle.toString().trim()
            );

            matchTitle = new RegExp(matchTitle.toString().trim(), "i");

            if (searchedTitle !== undefined) {
              if (searchedTitle.toString().trim().match(matchTitle)) {
                correctSceneIdx = idx;

                break;
              }
            }
          }
        }
      }

      // making sure the scene was found (-1 is not a proper scene value)
      if (correctSceneIdx === -1) {
        // Will provide a list back the user if no Scene was found

        if (tpdbSceneSearchContent.data.length > 1 && args.ManualTouch === true) {
          $log(" ERR: TPDB Could NOT find correct scene info, here were the results");

          return alltitles;
        }

        $log(" ERR: TPDB Could NOT find correct scene info");

        const manualInfo = await manualImport();
        return manualInfo;
      }
    }

    const tpdbSceneSearchData = tpdbSceneSearchContent.data[correctSceneIdx];

    // return all of the information to TPM

    if (tpdbSceneSearchData.title !== "") {
      // Is there a duplicate scene already in the Database with that name?
      let foundDupScene = false;
      // If i decide to do anything with duplicate scenes, this variable on the next line will come into play
      // let TheDupedScene = [];
      if (args.SceneDuplicationCheck) {
        const lines = $fs.readFileSync(args.source_settings.Scenes, "utf8").split("\n");

        let line = lines.shift();
        while (!foundDupScene && line) {
          if (!line || !util.stripStr(JSON.parse(line).name.toString())) {
            line = lines.shift();
            continue;
          }

          let matchScene = new RegExp(util.stripStr(JSON.parse(line).name.toString()), "gi");

          const foundSceneMatch = util.stripStr(tpdbSceneSearchData.title).match(matchScene);

          if (foundSceneMatch !== null) {
            foundDupScene = true;
            // TheDupedScene = util.stripStr(JSON.parse(line).name.toString());
          } else if (util.stripStr(JSON.parse(line).name.toString()) !== null) {
            matchScene = new RegExp(
              util.stripStr(JSON.parse(line).name.toString()).replace(/ /g, ""),
              "gi"
            );

            const foundSceneMatch = util.stripStr(tpdbSceneSearchData.title).match(matchScene);

            if (foundSceneMatch !== null) {
              // TheDupedScene = util.stripStr(JSON.parse(line).name.toString());
              foundDupScene = true;
            }
          }

          line = lines.shift();
        }
      }
      if (foundDupScene) {
        // Found a possible duplicate

        $log(" [Title Duplication check] === Found a possible duplicate title in the database");

        // Exit? Break? Return?

        result.name = tpdbSceneSearchData.title;
      } else {
        result.name = tpdbSceneSearchData.title;
      }
    }

    if (tpdbSceneSearchData.description !== "") {
      result.description = tpdbSceneSearchData.description;
    }

    if (tpdbSceneSearchData.date !== "") {
      result.releaseDate = new Date(tpdbSceneSearchData.date).getTime();
    }

    if (
      tpdbSceneSearchData.background.large !== "" &&
      tpdbSceneSearchData.background.large !== "https://cdn.metadataapi.net/default.png"
    ) {
      try {
        const thumbnailFile = await $createImage(
          tpdbSceneSearchData.background.large,

          tpdbSceneSearchData.title,

          true
        );

        result.thumbnail = thumbnailFile.toString();
      } catch (e) {
        $log("No thumbnail found");
      }
    }

    if (tpdbSceneSearchData.performers !== "") {
      result.actors = tpdbSceneSearchData.performers.map((p) => p.name);
    }

    if (tpdbSceneSearchData.site.name !== "") {
      if (studio.length) {
        result.studio = studio.toString().trim();
      } else {
        result.studio = tpdbSceneSearchData.site.name;
      }
    }

    $log(" Returning the results");

    return result;
  }

  /**
   * Grabs a list of all the searchable Studios or websites available in TPDB
   *
   * @param {string} Metadataapisiteaddress - The URL API that has the sites hosted on TPD
   * @returns {Promise<object>} either an array of all the Porn Database hosted sites, or no data
   */
  async function grabSites(Metadataapisiteaddress) {
    try {
      const resultTheListofSites = await $axios.get(Metadataapisiteaddress, {
        validateStatus: false,
      });

      if (
        resultTheListofSites.status !== 200 ||
        resultTheListofSites.data.length === 0 ||
        (testingTheSiteStatus !== undefined && testingTheSiteStatus)
      ) {
        $log(" ERR: TPDB site Not Available OR the API query failed");

        if (testingStatus && !testingTheSiteStatus) {
          $log("!! This will impact the test if it was not expecting a failure !!");
        }

        return [];
      }

      const newTpdbSiteSearchContent = resultTheListofSites.data;

      // loops through all of the sites and grabs the "shortname" for the Studio or website

      const allSites = newTpdbSiteSearchContent.data.map((el) => el.short_name);

      return allSites;
    } catch (err) {
      $throw(err);
    }
  }

  /**
   * The (Backbone) main Search function for the plugin
   *
   * @param {string} searchActor - The URL API that has the sites hosted on TPD
   * @param {string} searchStudio - The URL API that has the sites hosted on TPD
   * @param {number} searchFuncTimestamp - The URL API that has the sites hosted on TPD
   * @returns {Promise<object>} return the proper scene information (either through manual questions or automatically)
   */
  async function doASearch(searchActor, searchStudio, searchFuncTimestamp) {
    // check to see if the Studio and Actor are available for searching.

    if (
      Array.isArray(searchStudio) &&
      searchStudio.length &&
      Array.isArray(searchActor) &&
      searchActor.length
    ) {
      // Grabs the searchable sites in TPM

      $log(
        " MSG: Grabbing all available Studios on Metadataapi: " +
          "https://metadataapi.net/api/sites"
      );

      const resultsOffoundStudioInAPI = await grabSites("https://metadataapi.net/api/sites");

      let doesSiteExist;

      let compareHighscore = 5000;

      for (let spot = 0; spot < resultsOffoundStudioInAPI.length; spot++) {
        if (resultsOffoundStudioInAPI[spot] !== "") {
          const siteNoSpaces = new RegExp(resultsOffoundStudioInAPI[spot], "gi");

          const studioWithNoSpaces = searchStudio.toString().replace(/ /gi, "");

          const foundStudioInAPI = studioWithNoSpaces.match(siteNoSpaces);

          if (foundStudioInAPI !== null) {
            const levenFound = levenshtein(foundStudioInAPI.toString(), searchStudio.toString());

            if (levenFound < compareHighscore) {
              compareHighscore = levenFound;
              doesSiteExist = foundStudioInAPI;
            }
          }
        }
      }

      if (!doesSiteExist) {
        $log(
          " ERR: This Studio does not exist in ThePornDatabase.  No searches are possible with this Studio / Network"
        );

        const manualInfo = await manualImport();
        return manualInfo;
      }

      $log(":::::MSG: Checking TPDB for Data Extraction");

      let tpdbSceneSearchUrl = "";

      // making the search string based on the timespamp or not

      if (isNaN(searchFuncTimestamp)) {
        $log(":::::MSG: Placing TPDB Search string without timestamp...");

        tpdbSceneSearchUrl =
          `https://metadataapi.net/api/scenes?parse=` +
          encodeURIComponent(searchStudio) +
          "%20" +
          encodeURIComponent(searchActor[0]);
      } else {
        $log(":::::MSG: Placing TPDB Search string");

        tpdbSceneSearchUrl =
          `https://metadataapi.net/api/scenes?parse=` +
          encodeURIComponent(searchStudio) +
          "%20" +
          encodeURIComponent(searchActor[0]) +
          "%20" +
          util.timeConverter(searchFuncTimestamp);
      }

      // Grabbing the results using the "Normal" Search methods (comparing against scenename)

      $log(":::::MSG: Running TPDB Primary Search on: " + tpdbSceneSearchUrl);

      const grabResults = await run(tpdbSceneSearchUrl);
      // Once the results have been searched, we need to do something with them
      if (grabResults && Array.isArray(grabResults)) {
        // Run through the list of titles and ask if they would like to choose one.
        $log("#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#");

        const listing = [];
        const justtitles = [];
        for (let loopspot = 0; loopspot < Object.keys(grabResults).length; loopspot++) {
          listing.push(grabResults["Title" + loopspot].Title);
          justtitles.push(grabResults["Title" + loopspot].Title);
        }

        const questionAsync = util.createQuestionPrompter($inquirer, testingStatus, $log);
        listing.push(new $inquirer.Separator());
        listing.push("== None of the above == ");
        listing.push("== Manual Search == ");

        const multipleSitesAnswer = await questionAsync(
          {
            type: "rawlist",
            name: "SearchedTitles",
            message: "Which Title would you like to use?",
            choices: listing,
          },
          "TESTMODE MultipleChoiceResult EnterInfo",
          testMode && testMode.questions ? testMode.questions.multipleChoice : "",
          grabResults
        );

        const findresultindex = justtitles.indexOf(multipleSitesAnswer.SearchedTitles.trim());

        if (findresultindex < 0) {
          if (args.ManualTouch) {
            const manualInfo = await manualImport();
            return manualInfo;
          } else {
            return {};
          }
        } else if (findresultindex <= listing.length - 3) {
          const selectedtitle =
            `https://metadataapi.net/api/scenes?parse=` +
            grabResults["Title" + listing.indexOf(multipleSitesAnswer.SearchedTitles)].id;

          $log(" MSG: Running Aggressive-Grab Search on: " + selectedtitle);
          const goGetIt = await run(selectedtitle, true);

          $log("====  Final Entry =====");

          for (const property in goGetIt) {
            $log(`${property}: ${goGetIt[property]}`);
          }

          return goGetIt;
        }
      } else if (grabResults && typeof grabResults === "object") {
        // Will return any of the values found

        $log("====  Final Entry =====");

        for (const property in grabResults) {
          $log(`${property}: ${grabResults[property]}`);
        }

        return grabResults;
      }

      // If there was no studio or Actor, and the "Manual Touch" arg is set to TRUE, it will prompt you for entries manually.
    } else if (args.ManualTouch) {
      $log(" ERR:Could not find a Studio or Actor in the SceneName");

      const questionActor = [];

      const questionStudio = [];

      let questionDate;

      try {
        const questionAsync = util.createQuestionPrompter($inquirer, testingStatus, $log);

        $log(" Config ==> ManualTouch]  MSG: SET TO TRUE ");
        const Q1Answer = await questionAsync(
          {
            type: "input",
            name: "ManualSearch",
            message:
              "Would you like to Manually Enter Scene information to search The Porn Database (TPDB)?: (Y/N) ",
          },
          `TESTMODE Question Enter Info`,
          testMode && testMode.questions ? testMode.questions.enterInfoSearch : ""
        );

        const runInteractiveSearch = util.isPositiveAnswer(Q1Answer.ManualSearch);

        if (!runInteractiveSearch) {
          const manualInfo = await manualImport();
          return manualInfo;
        }

        const Movieanswer = await questionAsync(
          {
            type: "input",
            name: "MovieSearch",
            message: "Is this a Scene from a Movie / Set / Collection?: (Y/N) ",
          },
          "TESTMODE Question Enter Movie?",
          testMode && testMode.questions ? testMode.questions.enterMovie : ""
        );
        const enterMovieSearch = util.isPositiveAnswer(Movieanswer.MovieSearch);

        if (enterMovieSearch) {
          const movieName = await questionAsync(
            {
              type: "input",
              name: "ManualMovieTitleSearch",
              message: "What is the Title of the Movie?: ",
            },
            "TESTMODE Question Movie Title",
            testMode && testMode.questions ? testMode.questions.movieTitle : ""
          );

          if (result.movie === undefined && movieName.ManualMovieTitleSearch !== "") {
            result.movie = movieName.ManualMovieTitleSearch;
          }
        }
        const Q2Actor = await questionAsync(
          {
            type: "input",
            name: "ManualActorSearch",
            message: `What is ONE of the Actors NAME in the scene?:`,
            default() {
              return `${actor[0] ? ` ${actor[0]}` : ""}`;
            },
          },
          "TESTMODE Question One Actor",
          testMode && testMode.questions ? testMode.questions.enterOneActorName : ""
        );

        questionActor.push(Q2Actor.ManualActorSearch);
        if (actor.length) {
          actor.push(Q2Actor.ManualActorSearch);
        }

        const Q3Studio = await questionAsync(
          {
            type: "input",
            name: "ManualStudioSearch",
            message: `What Studio NAME is responsible for the scene?:`,
            default() {
              return `${studio[0] ? ` ${studio[0]}` : ""}`;
            },
          },
          "TESTMODE Question Studio Name",
          testMode && testMode.questions ? testMode.questions.enterStudioName : ""
        );

        questionStudio.push(Q3Studio.ManualStudioSearch);
        if (studio.length) {
          studio.push(Q3Studio.ManualStudioSearch);
        }
        const Q4date = await questionAsync(
          {
            type: "input",
            name: "ManualDateSearch",
            message: "What is the release date (YYYY.MM.DD)?: (Blanks allowed) ",
          },
          "TESTMODE Question Date",
          testMode && testMode.questions ? testMode.questions.enterSceneDate : ""
        );

        if (Q4date.ManualDateSearch !== "") {
          const questYear = Q4date.ManualDateSearch.match(/\d\d\d\d.\d\d.\d\d/);

          $log(" MSG: Checking Date");

          if (questYear && questYear.length) {
            const date = questYear[0];

            $log(" MSG: Found => yyyymmdd");

            questionDate = $moment(date, "YYYY-MM-DD").valueOf();
          }
        }

        // Re run the search with user's input
        const res = await doASearch(questionActor, questionStudio, questionDate);

        return res;
      } catch (error) {
        $log("Something went wrong asking for search questions");
      }
    } else {
      return {};
    }
  }
};
