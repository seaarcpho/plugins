/* eslint-disable linebreak-style */
/* eslint-disable dot-location */
/* eslint-disable linebreak-style, camelcase */
module.exports = async ({
  event,

  $throw,

  $fs,

  $moment,

  $log,

  $axios,

  testmode,

  sceneName,

  scenePath,

  args,

  $readline,

  $createImage,
}) => {
  // Array Variable that will be returned

  const result = {};

  // Variable that is used for all the "manualTouch" questions

  const levenshtein = require("./levenshtein.js");

  const CleanPathname = stripStr(scenePath.toString());

  // Making sure that the event that triggered is the correct event

  if (event !== "sceneCreated" && event !== "sceneCustom" && testmode.status !== true) {
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
  const GettingActor = [];
  const Actor = [];

  if (args.parseActor) {
    $log(`:::::PARSE:::: Parsing Actors DB ==> ${args.source_settings.Actors}`);
    $fs
      .readFileSync(args.source_settings.Actors, "utf8")
      .split("\n")
      .forEach((line) => {
        if (line !== "") {
          const MatchActor = new RegExp(JSON.parse(line).name, "i");

          const ActorLength = MatchActor.toString().split(" ");

          if (ActorLength.length >= 2) {
            // $log(((JSON.parse(line)).name))
            const foundActorMatch = stripStr(scenePath).match(MatchActor);

            // $log(stripStr(sceneName))

            if (foundActorMatch !== null) {
              GettingActor.push(JSON.parse(line).name);
            } else {
              const AllAliases = JSON.parse(line).aliases.toString().split(",");

              AllAliases.forEach((PersonAlias) => {
                const AliasLength = PersonAlias.toString().split(" ");

                if (AliasLength.length >= 2) {
                  let MatchAliasActor = new RegExp(PersonAlias, "i");

                  let foundAliasActorMatch = stripStr(scenePath).match(MatchAliasActor);

                  if (foundAliasActorMatch !== null) {
                    GettingActor.push(JSON.parse(line).name);
                  } else {
                    const Aliasnospaces = PersonAlias.toString().replace(" ", "");

                    MatchAliasActor = new RegExp(Aliasnospaces, "i");

                    foundAliasActorMatch = stripStr(scenePath).match(MatchAliasActor);

                    if (foundAliasActorMatch !== null) {
                      GettingActor.push(JSON.parse(line).name);
                    }
                  }
                }
              });
            }
          }
        }
      });

    let Actorhighscore = 5000;
    if (GettingActor.length && Array.isArray(GettingActor)) {
      GettingActor.forEach((person) => {
        $log(`    SUCCESS: Found Actor:` + Actor);
        // This is a function that will see how many differences it will take to make the string match.
        // The lowest amount of changes means that it is probably the closest match to what we need.
        // lowest score wins :)
        const found = levenshtein(person.toString().toLowerCase(), CleanPathname);

        if (found < Actorhighscore) {
          Actorhighscore = found;

          Actor[0] = person;
        }
      });
      $log(`---> Using "best match" Actor For Search:` + Actor);
    }
  }
  // -------------------STUDIO Parse

  // This is where the plugin attempts to check for Studios using the Studios.db

  // creating a array to use for other functions

  const GettingStudio = [];

  const Studio = [];

  if (args.parseStudio) {
    $log(`:::::PARSE:::: Parsing Studios DB ==> ${args.source_settings.Studios}`);

    $fs
      .readFileSync(args.source_settings.Studios, "utf8")
      .split("\n")
      .forEach((line) => {
        if (line !== "") {
          if (JSON.parse(line).name !== null) {
            let MatchStudio = new RegExp(JSON.parse(line).name, "i");

            const foundStudioMatch = stripStr(scenePath).match(MatchStudio);

            if (foundStudioMatch !== null) {
              GettingStudio.push(JSON.parse(line).name);
            } else if (JSON.parse(line).name !== null) {
              MatchStudio = new RegExp(JSON.parse(line).name.replace(/ /g, ""), "i");

              const foundStudioMatch = stripStr(scenePath).match(MatchStudio);

              if (foundStudioMatch !== null) {
                GettingStudio.push(JSON.parse(line).name);
              }
            }
          }
        }
      });

    // this is a debug option to se see how many studios were found by just doing a simple regex
    // $log(GettingStudio);
    let studiohighscore = 5000;
    if (GettingStudio.length && Array.isArray(GettingStudio)) {
      GettingStudio.forEach((stud) => {
        $log(`    SUCCESS: Found Studio:` + stud);
        // This is a function that will see how many differences it will take to make the string match.
        // The lowest amount of changes means that it is probably the closest match to what we need.
        // lowest score wins :)
        const found = levenshtein(stud.toString().toLowerCase(), CleanPathname);

        if (found < studiohighscore) {
          studiohighscore = found;

          Studio[0] = stud;
        }
      });

      $log(`---> Using "best match" Studio For Search:` + Studio);
    }
  }
  // Try to PARSE the SceneName and determine Date

  const ddmmyyyy = stripStr(scenePath, 1).match(/\d\d \d\d \d\d\d\d/);

  const yyyymmdd = stripStr(scenePath, 1).match(/\d\d\d\d \d\d \d\d/);

  const yymmdd = stripStr(scenePath, 1).match(/\d\d \d\d \d\d/);

  let timestamp = {};

  $log(":::::PARSE:::: Parsing Date from ScenePath");
  // $log(stripStr(scenePath, 1));

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

  function timeConverter(The_timestamp) {
    const date_not_formatted = new Date(The_timestamp);

    let formatted_string = date_not_formatted.getFullYear() + "-";

    if (date_not_formatted.getMonth() < 9) {
      formatted_string += "0";
    }

    formatted_string += date_not_formatted.getMonth() + 1;

    formatted_string += "-";

    if (date_not_formatted.getDate() < 10) {
      formatted_string += "0";
    }
    formatted_string += date_not_formatted.getDate();

    return formatted_string;
  }

  // After everything has completed parsing, I run a function that will perform all of the lookups against TPDB

  const FinalCallResult = await DoASearch(Actor, Studio, timestamp);
  return FinalCallResult;

  // -------------------------------------------------------------

  // -------------------Fucntions & Async functions---------------

  // -------------------------------------------------------------

  function stripStr(str, date) {
    date = 0 || date;
    str = str.toString();

    str = str.toLowerCase().replace("'", "");
    str = str.toLowerCase().replace(/P.O.V./gi, "pov");
    if (!date) {
      str = str.toLowerCase().replace(/\b0+/g, "");
    }

    str = str.replace(/[^a-zA-Z0-9'/\\,(){}]/g, " ");

    str = str.replace(/  +/g, " ");
    return str;
  }

  /*  FemaleOnly  Freeones function
     
      async function Freeones(person) {
    
        
    
        //defining FreeOnes URL for scraping
    
        $log('[Freeones] : Searching FreeOnes for ' + person.name)
    
        let freeurl = `http://freeones.xxx/${(person.name).replace(/ /g, "-")}/profile`;
    
        
    
        
    
        $log("[Freeones] : Getting " + freeurl);
    
        //getting raw HTML of the URL defined above
    
        
    
        let freehtml = (await $axios.get(freeurl, { validateStatus: false}))
    
        //getting DOM (Document Object Model) of the HTML
    
        
    
        if (freehtml.status !== 200 || freehtml.data.length === 0) {
    
              
    
        } else {
    
          return person.name
    
        }
    
              
    
            
    
      }
    
      */

  async function ManualImport() {
    if (testmode.status) {
      $log(`:::::TESTMODE Question Enter MANUAL Info?:::: ${testmode.Questions.EnterManInfo}`);
      const Q1answer = testmode.Questions.EnterManInfo;

      const runInteractiveSearch =
        Q1answer === "y" || Q1answer === "Y" || Q1answer === "Yes" || Q1answer === "YES";

      if (!runInteractiveSearch) {
        return {};
      }

      $log(`:::::TESTMODE Question MANUAL Movie:::: ${testmode.Questions.EnterMovie}`);
      const ManualMovieanswer = testmode.Questions.EnterMovie;

      const ManualEnterMovieSearch =
        ManualMovieanswer === "y" ||
        ManualMovieanswer === "Y" ||
        ManualMovieanswer === "Yes" ||
        ManualMovieanswer === "YES";

      if (ManualEnterMovieSearch) {
        $log(`:::::TESTMODE Question MANUAL Movie Title:::: ${testmode.Questions.MovieTitle}`);
        const ManualMovieName = testmode.Questions.MovieTitle;

        if (result.movie === undefined && ManualMovieName !== "") {
          result.movie = ManualMovieName;
        }
      }
      $log(`:::::TESTMODE Question MANUAL Title:::: ${testmode.Questions.EnterSceneTitle}`);
      result.name = testmode.Questions.EnterSceneTitle;

      $log(`:::::TESTMODE Question MANUAL Date:::: ${testmode.Questions.EnterSceneDate}`);
      result.releaseDate = testmode.Questions.EnterSceneDate;
      if (result.releaseDate !== "") {
        const questYear = result.releaseDate.match(/\d\d\d\d.\d\d.\d\d/);

        $log(" MSG: Checking Date");

        if (questYear && questYear.length) {
          const date = questYear[0];

          $log(" MSG: Found => yyyymmdd");

          result.releaseDate = new Date(date.replace(".", "-")).getTime();
        }
      }

      $log(`:::::TESTMODE Question MANUAL Description:::: ${testmode.Questions.ManualDescription}`);
      result.description = testmode.Questions.ManualDescription;

      const splitactors = testmode.Questions.ManualActors;

      const AreActorsBlank = splitactors === "" || splitactors === " " || splitactors === null;

      if (!AreActorsBlank) {
        result.actors = splitactors.trim().split(",");
      }

      $log(`:::::TESTMODE Question MANUAL Studio name:::: ${testmode.Questions.EnterStudioName}`);
      const askedStudio = testmode.Questions.EnterStudioName;

      const IsStudiosBlank = askedStudio === "" || askedStudio === " " || askedStudio === null;

      if (!IsStudiosBlank) {
        result.studio = askedStudio;
      }

      return result;
    } else {
      const rl = $readline.createInterface({
        input: process.stdin,

        output: process.stdout,
      });

      const questionAsync = (question) =>
        new Promise((resolve) => {
          rl.question(question, resolve);
          if (
            question === "What are the Actors NAMES in the scene?: (seperated by Comma) " &&
            Actor !== undefined
          ) {
            for (let numofpeople = 0; numofpeople < Actor.length; numofpeople++) {
              if (numofpeople === 0) {
                rl.write(" " + Actor[numofpeople]);
              } else {
                rl.write(", " + Actor[numofpeople]);
              }
            }
          }
          if (
            question === "What Studio NAME is responsible for the scene?: " &&
            Studio[0] !== undefined
          ) {
            rl.write(" " + Studio[0]);
          }
        });

      $log(" Config ==> ManualTouch]  MSG: SET TO TRUE ");

      const Q1answer = await questionAsync(
        "Due to failed searches, would you like to MANUALLY enter information to import directly into porn-vault?: (Y/N) "
      );

      const runInteractiveSearch =
        Q1answer === "y" || Q1answer === "Y" || Q1answer === "Yes" || Q1answer === "YES";

      if (!runInteractiveSearch) {
        rl.close();
        return {};
      }

      const ManualMovieanswer = await questionAsync(
        "Is this a Scene from a Movie / Set / Collection?: (Y/N) "
      );

      const ManualEnterMovieSearch =
        ManualMovieanswer === "y" ||
        ManualMovieanswer === "Y" ||
        ManualMovieanswer === "Yes" ||
        ManualMovieanswer === "YES";

      if (ManualEnterMovieSearch) {
        const ManualMovieName = await questionAsync("What is the Title of the Movie?: ");

        if (result.movie === undefined && ManualMovieName !== "") {
          result.movie = ManualMovieName;
        }
      }

      result.name = await questionAsync("What is the TITLE of the scene?: ");

      result.releaseDate = await questionAsync(
        "What is the RELEASE DATE of the scene (YYYY.MM.DD)?: "
      );

      if (result.releaseDate !== "") {
        const questYear = result.releaseDate.match(/\d\d\d\d.\d\d.\d\d/);

        $log(" MSG: Checking Date");

        if (questYear && questYear.length) {
          const date = questYear[0];

          $log(" MSG: Found => yyyymmdd");

          result.releaseDate = new Date(date.replace(".", "-")).getTime();
        }
      }

      result.description = await questionAsync("What is the DESCRIPTION for the scene?: ");

      const splitactors = await questionAsync(
        "What are the Actors NAMES in the scene?: (seperated by Comma) "
      );

      const AreActorsBlank = splitactors === "" || splitactors === " " || splitactors === null;

      if (!AreActorsBlank) {
        result.actors = splitactors.trim().split(",");
      }

      const askedStudio = await questionAsync("What Studio NAME is responsible for the scene?: ");

      const IsStudiosBlank = askedStudio === "" || askedStudio === " " || askedStudio === null;

      if (!IsStudiosBlank) {
        result.studio = askedStudio;
      }

      rl.close();

      return result;
    }
  }

  // This function is used when we are trying to find the proper scene
  async function run(Value, AgressiveSearch) {
    AgressiveSearch = AgressiveSearch || 0;

    // Fetches a response from the link that was provided

    const tpdb_scene_search_response = await $axios.get(Value, {
      validateStatus: false,
    });

    // checking the status of the link or site, will escape if the site is down

    if (
      tpdb_scene_search_response.status !== 200 ||
      tpdb_scene_search_response.data.length === 0 ||
      testmode.TestSiteunavailable
    ) {
      $log(" ERR: TPDB API query failed");
      const manualInfo = await ManualImport();
      return manualInfo;
    }

    // Grab the content data of the fed link
    const tpdb_scene_search_content = tpdb_scene_search_response.data;

    // setting the scene index to an invalid value by default
    let correct_scene_idx = -1;

    // If a result was returned, it sets it to the first entry
    if (tpdb_scene_search_content.data.length === 1) {
      correct_scene_idx = 0;
    }

    // making a variable to store all of the titles of the found results (in case we need the user to select a scene)
    const alltitles = [];

    if (AgressiveSearch) {
      // When completing an aggressive search, We don't want "extra stuff" -- it should only have 1 result that is found!
      if (correct_scene_idx === -1) {
        $log(" ERR: TPDB Could NOT find correct scene info");

        const manualInfo = await ManualImport();
        return manualInfo;
      }
    } else {
      // list the found results and tries to match the SCENENAME to the found results.
      // all while gathering all of the titles, in case no match is found

      if (tpdb_scene_search_content.data.length > 1) {
        $log(`     SRCH: ${tpdb_scene_search_content.data.length} results found`);

        for (let idx = 0; idx < tpdb_scene_search_content.data.length; idx++) {
          const element = tpdb_scene_search_content.data[idx];

          alltitles["Title" + idx] = element.title;

          // making variables to use to elimate Actors and scenes from the search results.

          // It is better to search just the title.  We already have the actor and studio.

          let SearchedTitle = stripStr(sceneName).toString().toLowerCase();

          let MatchTitle = stripStr(alltitles["Title" + idx])
            .toString()
            .toLowerCase();

          // lets remove the actors from the scenename and the searched title -- We should already know this

          for (let j = 0; j < Actor.length; j++) {
            SearchedTitle = SearchedTitle.replace(Actor[j].toString().toLowerCase(), "");

            MatchTitle = MatchTitle.replace(Actor[j].toString().toLowerCase(), "").trim();
          }

          // lets remove the Studio from the scenename and the searched title -- We should already know this

          if (Studio[0] !== undefined) {
            SearchedTitle = SearchedTitle.replace(Studio[0].toString().toLowerCase(), "");

            SearchedTitle = SearchedTitle.replace(
              Studio[0].toString().toLowerCase().replace(" ", ""),
              ""
            );

            MatchTitle = MatchTitle.replace(Studio[0].toString().toLowerCase(), "").trim();
          }

          // Only Run a match if there is a searched title to execute a match on

          if (MatchTitle !== undefined) {
            $log(
              `     SRCH: Trying to match title: ` +
                MatchTitle.toString().trim() +
                "--> " +
                SearchedTitle.toString().trim()
            );

            MatchTitle = new RegExp(MatchTitle.toString().trim(), "i");

            if (SearchedTitle !== undefined) {
              if (SearchedTitle.toString().trim().match(MatchTitle)) {
                correct_scene_idx = idx;

                break;
              }
            }
          }
        }
      }

      // making sure the scene was found (-1 is not a proper scene value)
      if (correct_scene_idx === -1) {
        // Will provide a list back the user if no Scene was found

        if (tpdb_scene_search_content.data.length > 1 && args.ManualTouch === true) {
          $log(" ERR: TPDB Could NOT find correct scene info, here were the results");

          return alltitles;
        }

        $log(" ERR: TPDB Could NOT find correct scene info");

        const manualInfo = await ManualImport();
        return manualInfo;
      }
    }

    const tpdb_scene_search_data = tpdb_scene_search_content.data[correct_scene_idx];

    // return all of the information to TPM

    if (tpdb_scene_search_data.title !== "") {
      // Is there a duplicate scene already in the Database with that name?
      let FoundDupScene = false;
      // If i decide to do anything with duplicate scenes, this variable on the next line will come into play
      // let TheDupedScene = [];
      if (args.SceneDuplicationCheck) {
        const lines = $fs.readFileSync(args.source_settings.Scenes, "utf8").split("\n");

        let line = lines.shift();
        while (!FoundDupScene && line) {
          if (line !== "") {
            if (stripStr(JSON.parse(line).name.toString()) !== null) {
              let MatchScene = new RegExp(stripStr(JSON.parse(line).name.toString()), "gi");

              const foundSceneMatch = stripStr(tpdb_scene_search_data.title).match(MatchScene);

              if (foundSceneMatch !== null) {
                FoundDupScene = true;
                // TheDupedScene = stripStr(JSON.parse(line).name.toString());
              } else if (stripStr(JSON.parse(line).name.toString()) !== null) {
                MatchScene = new RegExp(
                  stripStr(JSON.parse(line).name.toString()).replace(/ /g, ""),
                  "gi"
                );

                const foundSceneMatch = stripStr(tpdb_scene_search_data.title).match(MatchScene);

                if (foundSceneMatch !== null) {
                  // TheDupedScene = stripStr(JSON.parse(line).name.toString());
                  FoundDupScene = true;
                }
              }
            }
          }
          line = lines.shift();
        }
      }
      if (FoundDupScene) {
        // Found a possible duplicate

        $log(" [Title Duplication check] === Found a possible duplicate title in the database");

        // Exit? Break? Return?

        result.name = tpdb_scene_search_data.title;
      } else {
        result.name = tpdb_scene_search_data.title;
      }
    }

    if (tpdb_scene_search_data.description !== "") {
      result.description = tpdb_scene_search_data.description;
    }

    if (tpdb_scene_search_data.date !== "") {
      result.releaseDate = new Date(tpdb_scene_search_data.date).getTime();
    }

    if (
      tpdb_scene_search_data.background.large !== "" &&
      tpdb_scene_search_data.background.large !== "https://cdn.metadataapi.net/default.png"
    ) {
      try {
        const thumbnailFile = await $createImage(
          tpdb_scene_search_data.background.large,

          tpdb_scene_search_data.title,

          true
        );

        result.thumbnail = thumbnailFile.toString();
      } catch (e) {
        $log("No thumbnail found");
      }
    }

    if (tpdb_scene_search_data.performers !== "") {
      /* if (args.FemaleOnly) {
    
            let Perf =[]
    
            tpdb_scene_search_data.performers.forEach((Theperson) => {
    
              
    
              let placeholdername = Freeones(Theperson).then((resultingActor) => {
    
                
    
                if(resultingActor) {
    
                  return resultingActor
    
                }
    
                          
    
              });
    
              
    
              if (placeholdername !== undefined) {
    
                Perf.push(placeholdername)
    
              }
    
                      
    
            });
    
                  
    
            const resolvedFinalArray = await Promise.all(Perf);
    
                        
    
            let ResultsActor =[];
    
            resolvedFinalArray.forEach((found) => {
    
              if (found !== undefined){
    
                ResultsActor.push(found)
    
              }
    
            });
    
            
    
            
    
            
    
          } else {
    
            
    
          }
    
            */

      result.actors = tpdb_scene_search_data.performers.map((p) => p.name);
    }

    if (tpdb_scene_search_data.site.name !== "") {
      result.studio = tpdb_scene_search_data.site.name;
    }

    $log(" Returning the results");

    return result;
  }

  // Grabs a list of all the searchable Studios or websites available in TPDB

  async function Grabsites(Metadataapisiteaddress) {
    try {
      const ResultTheListofSites = await $axios.get(Metadataapisiteaddress, {
        validateStatus: false,
      });

      if (
        ResultTheListofSites.status !== 200 ||
        ResultTheListofSites.data.length === 0 ||
        testmode.TestSiteunavailable
      ) {
        $log(" ERR: TPDB site Not Available OR the API query failed");

        return [];
      }

      const Newtpdb_site_search_content = ResultTheListofSites.data;

      // loops through all of the sites and grabs the "shortname" for the Studio or website

      const allSites = Newtpdb_site_search_content.data.map((el) => el.short_name);

      return allSites;
    } catch (err) {
      $throw(err);
    }
  }

  // The main Search function for the plugin

  async function DoASearch(SearchActor, SearchStudio, SearchFuncTimestamp) {
    // check to see if the Studio and Actor are available for searching.

    if (
      Array.isArray(SearchStudio) &&
      SearchStudio.length &&
      Array.isArray(SearchActor) &&
      SearchActor.length
    ) {
      // Grabs the searchable sites in TPM

      $log(
        " MSG: Grabbing all available Studios on Metadataapi: " +
          "https://metadataapi.net/api/sites"
      );

      const resultsOffoundStudioInAPI = await Grabsites("https://metadataapi.net/api/sites");

      const DoesSiteExist = [];

      let Comparehighscore = 5000;

      for (let spot = 0; spot < resultsOffoundStudioInAPI.length; spot++) {
        if (resultsOffoundStudioInAPI[spot] !== "") {
          const siteNoSpaces = new RegExp(resultsOffoundStudioInAPI[spot], "gi");

          const Studiowithnospaces = SearchStudio.toString().replace(/ /gi, "");

          const foundStudioInAPI = Studiowithnospaces.match(siteNoSpaces);

          if (foundStudioInAPI !== null) {
            const Levenfound = levenshtein(foundStudioInAPI.toString(), SearchStudio.toString());

            if (Levenfound < Comparehighscore) {
              Comparehighscore = Levenfound;
              DoesSiteExist[0] = foundStudioInAPI;
            }
          }
        }
      }

      if (DoesSiteExist.length !== 1) {
        if (DoesSiteExist.length === 0) {
          $log(
            " ERR: This Studio does not exist in ThePornDatabase.  No searches are possible with this Studio / Network"
          );

          const manualInfo = await ManualImport();
          return manualInfo;
        }
      }

      $log(":::::MSG: Checking TPDB for Data Extraction");

      let tpdb_scene_search_url = {};

      // making the search string based on the timespamp or not

      if (isNaN(SearchFuncTimestamp)) {
        $log(":::::MSG: Placing TPDB Search string without timestamp...");

        tpdb_scene_search_url =
          `https://metadataapi.net/api/scenes?parse=` +
          encodeURIComponent(SearchStudio) +
          "%20" +
          encodeURIComponent(SearchActor[0]);
      } else {
        $log(":::::MSG: Placing TPDB Search string");

        tpdb_scene_search_url =
          `https://metadataapi.net/api/scenes?parse=` +
          encodeURIComponent(SearchStudio) +
          "%20" +
          encodeURIComponent(SearchActor[0]) +
          "%20" +
          timeConverter(SearchFuncTimestamp);
      }

      // Grabbing the results using the "Normal" Search methods (comparing against scenename)

      $log(":::::MSG: Running TPDB Primary Search on: " + tpdb_scene_search_url);

      const GrabResults = await run(tpdb_scene_search_url);

      // Once the results have been searched, we need to do something with them
      if (GrabResults.Title0 !== undefined) {
        // Run through the list of titles and ask if they would like to choose one.
        $log("#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#");

        for (let loopspot = 0; loopspot < Object.keys(GrabResults).length; loopspot++) {
          $log(":::::|> " + loopspot + ": [" + GrabResults["Title" + loopspot] + "]");
        }

        $log(":::::|> " + Object.keys(GrabResults).length + ": ====== None of the above =====");

        $log("#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#");

        const rl = $readline.createInterface({
          input: process.stdin,

          output: process.stdout,
        });

        const questionAsync = (question) =>
          new Promise((resolve) => {
            rl.question(question, resolve);
          });

        if (testmode.status) {
          $log(
            `:::::TESTMODE MultipleChoiceResult EnterInfo:::: ${testmode.Questions.MultipleChoice}`
          );
          const MultipleSitesAnswer = testmode.Questions.MultipleChoice;

          if (MultipleSitesAnswer === "" || MultipleSitesAnswer > Object.keys(GrabResults).length) {
            $log(" ERR: Not a valid option...");

            rl.close();

            const manualInfo = await ManualImport();
            return manualInfo;
          } else if (MultipleSitesAnswer <= Object.keys(GrabResults).length) {
            const selectedtitle =
              `https://metadataapi.net/api/scenes?parse=` +
              GrabResults["Title" + MultipleSitesAnswer];

            rl.close();
            $log(" MSG: Running Aggressive-Grab Search on: " + selectedtitle);
            const Gogetit = await run(selectedtitle, 1);

            $log("====  Final Entry =====");

            for (const property in Gogetit) {
              $log(`${property}: ${Gogetit[property]}`);
            }

            return Gogetit;
          }
        } else {
          const MultipleSitesAnswer = await questionAsync(
            "Which Title would you like to use? (number): "
          );
          if (MultipleSitesAnswer === "" || MultipleSitesAnswer > Object.keys(GrabResults).length) {
            $log(" ERR: Not a valid option....");

            rl.close();

            const manualInfo = await ManualImport();
            return manualInfo;
          } else if (MultipleSitesAnswer <= Object.keys(GrabResults).length) {
            const selectedtitle =
              `https://metadataapi.net/api/scenes?parse=` +
              GrabResults["Title" + MultipleSitesAnswer];

            rl.close();
            $log(" MSG: Running Aggressive-Grab Search on: " + selectedtitle);
            const Gogetit = await run(selectedtitle, 1);

            $log("====  Final Entry =====");

            for (const property in Gogetit) {
              $log(`${property}: ${Gogetit[property]}`);
            }

            return Gogetit;
          }
        }
      } else {
        // Will return any of the values found

        $log("====  Final Entry =====");

        for (const property in GrabResults) {
          $log(`${property}: ${GrabResults[property]}`);
        }

        return GrabResults;
      }

      // If there was no studio or Actor, and the "Manual Touch" arg is set to TRUE, it will prompt you for entries manually.
    } else if (args.ManualTouch) {
      $log(" ERR:Could not find a Studio or Actor in the SceneName");

      const QuestionActor = [];

      const QuestionStudio = [];

      let QuestionDate;

      if (testmode.status) {
        $log(`:::::TESTMODE Question Enter Info:::: ${testmode.Questions.EnterInfoSearch}`);
        const Q1answer = testmode.Questions.EnterInfoSearch;

        const runInteractiveSearch =
          Q1answer === "y" || Q1answer === "Y" || Q1answer === "Yes" || Q1answer === "YES";

        if (!runInteractiveSearch) {
          const manualInfo = await ManualImport();
          return manualInfo;
        }
        $log(`:::::TESTMODE Question Enter Movie?:::: ${testmode.Questions.EnterMovie}`);
        const Movieanswer = testmode.Questions.EnterMovie;

        const EnterMovieSearch =
          Movieanswer === "y" ||
          Movieanswer === "Y" ||
          Movieanswer === "Yes" ||
          Movieanswer === "YES";

        if (EnterMovieSearch) {
          $log(`:::::TESTMODE Question Movie Title:::: ${testmode.Questions.MovieTitle}`);
          const MovieName = testmode.Questions.MovieTitle;

          if (result.movie === undefined && MovieName !== "") {
            result.movie = MovieName;
          }
        }
        $log(`:::::TESTMODE Question One Actor:::: ${testmode.Questions.EnterOneActorName}`);
        const Q2Actor = testmode.Questions.EnterOneActorName;

        QuestionActor.push(Q2Actor);
        if (!Actor.length) {
          Actor.push(Q2Actor);
        }

        $log(`:::::TESTMODE Question Studio Name:::: ${testmode.Questions.EnterStudioName}`);
        const Q3Studio = testmode.Questions.EnterStudioName;

        QuestionStudio.push(Q3Studio);
        if (!Studio.length) {
          Studio.push(Q3Studio);
        }

        $log(`:::::TESTMODE Question Date:::: ${testmode.Questions.EnterSceneDate}`);
        const Q4date = testmode.Questions.EnterSceneDate;

        if (Q4date !== "") {
          const questYear = Q4date.match(/\d\d\d\d.\d\d.\d\d/);

          $log(" MSG: Checking Date");

          if (questYear && questYear.length) {
            const date = questYear[0];

            $log(" MSG: Found => yyyymmdd");

            QuestionDate = $moment(date, "YYYY-MM-DD").valueOf();
          }
        }

        // Re run the search with user's input
        const res = await DoASearch(QuestionActor, QuestionStudio, QuestionDate);

        return res;
      } else {
        const rl = $readline.createInterface({
          input: process.stdin,

          output: process.stdout,
        });
        try {
          const questionAsync = (question) =>
            new Promise((resolve) => {
              rl.question(question, resolve);
              if (
                question === "What is ONE of the Actors NAME in the scene?: " &&
                Actor[0] !== undefined
              ) {
                rl.write(" " + Actor[0]);
              }
              if (
                question === "What Studio NAME is responsible for the scene?: " &&
                Studio[0] !== undefined
              ) {
                rl.write(" " + Studio[0]);
              }
            });
          $log(" Config ==> ManualTouch]  MSG: SET TO TRUE ");
          const Q1answer = await questionAsync(
            "Would you like to Manually Enter Scene information to search The Porn Database (TPDB)?: (Y/N) "
          );

          const runInteractiveSearch =
            Q1answer === "y" || Q1answer === "Y" || Q1answer === "Yes" || Q1answer === "YES";

          if (!runInteractiveSearch) {
            rl.close();
            const manualInfo = await ManualImport();
            return manualInfo;
          }
          const Movieanswer = await questionAsync(
            "Is this a Scene from a Movie / Set / Collection?: (Y/N) "
          );
          const EnterMovieSearch =
            Movieanswer === "y" ||
            Movieanswer === "Y" ||
            Movieanswer === "Yes" ||
            Movieanswer === "YES";

          if (EnterMovieSearch) {
            const MovieName = await questionAsync("What is the Title of the Movie?: ");

            if (result.movie === undefined && MovieName !== "") {
              result.movie = MovieName;
            }
          }
          const Q2Actor = await questionAsync("What is ONE of the Actors NAME in the scene?: ");

          QuestionActor.push(Q2Actor);
          if (Actor === undefined) {
            Actor.push(Q2Actor);
          }

          const Q3Studio = await questionAsync("What Studio NAME is responsible for the scene?: ");

          QuestionStudio.push(Q3Studio);
          if (Studio === undefined) {
            Studio.push(Q3Studio);
          }
          const Q4date = await questionAsync(
            "What is the release date (YYYY.MM.DD)?: (Blanks allowed) "
          );

          if (Q4date !== "") {
            const questYear = Q4date.match(/\d\d\d\d.\d\d.\d\d/);

            $log(" MSG: Checking Date");

            if (questYear && questYear.length) {
              const date = questYear[0];

              $log(" MSG: Found => yyyymmdd");

              QuestionDate = $moment(date, "YYYY-MM-DD").valueOf();
            }
          }

          rl.close();

          // Re run the search with user's input
          const res = await DoASearch(QuestionActor, QuestionStudio, QuestionDate);

          return res;
        } catch (error) {
          rl.close();
        }
      }
    } else {
      return {};
    }
  }
};
