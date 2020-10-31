import { AxiosResponse } from "axios";

import { SceneOutput } from "../../types/scene";
import { Api } from "./api";
import { parseActor, parseStudio, parseTimestamp } from "./parse";
import { MyContext, SceneResult } from "./types";
import {
  checkSceneExistsInDb,
  createQuestionPrompter,
  isPositiveAnswer,
  manualTouchChoices,
  matchSceneResultToSearch,
  normalizeSceneResultData,
  timeConverter,
} from "./util";

module.exports = async (ctx: MyContext): Promise<SceneOutput> => {
  const { event, $throw, $moment, $log, testMode, scenePath, args, $inquirer, $createImage } = ctx;

  /**
   * If makeChoices() was already run (for test mode only)
   */
  let didRunMakeChoices = false;

  // Making sure that the event that triggered is the correct event
  if (event !== "sceneCreated" && event !== "sceneCustom") {
    $throw("ERR: Plugin used for unsupported event");
  }

  // Checking all of the arguments are set in the plugin

  if (!Object.hasOwnProperty.call(args, "source_settings")) {
    $throw("ERR: Missing source_settings in plugin args");
  }

  if (!Object.hasOwnProperty.call(args, "parseActor")) {
    $throw("ERR: Missing parseActor in plugin args");
  }

  if (!Object.hasOwnProperty.call(args, "parseStudio")) {
    $throw("ERR: Missing parseStudio in plugin args");
  }

  if (!Object.hasOwnProperty.call(args, "manualTouch")) {
    $throw("ERR: Missing manualTouch in plugin args");
  }

  if (!Object.hasOwnProperty.call(args, "sceneDuplicationCheck")) {
    $throw("ERR: Missing sceneDuplicationCheck in plugin args");
  }

  const tpdbApi = new Api(ctx);

  $log(`[PDS] MSG: STARTING to analyze scene: ${JSON.stringify(scenePath)}`);

  const parsedDbActor = parseActor(ctx);
  const parsedDbStudio = parseStudio(ctx);
  const parsedTimestamp = parseTimestamp(ctx);

  // After everything has completed parsing, I run a function that will perform all of the lookups against TPDB

  let searchTitle: string | undefined = "";
  let searchActors = parsedDbActor ? [parsedDbActor] : [];
  let searchStudio = parsedDbStudio ?? undefined;
  let searchTimestamp: number | undefined = parsedTimestamp ?? undefined;
  let userMovie: string | undefined;

  if (!Array.isArray(searchActors) || !searchActors.length || !searchStudio) {
    $log(
      "[PDS] ERR: Could not find a Studio or Actor in the SceneName for an initial search. Will prompt user for action"
    );
    const action = await makeChoices();
    if (action === manualTouchChoices.MANUAL_ENTER) {
      const res = await manualImport();
      return res;
    }
    if (action === manualTouchChoices.SEARCH) {
      const userSearchChoices = await getNextSearchChoices();
      searchTitle = userSearchChoices.title;
      searchActors = userSearchChoices.actors || [];
      searchStudio = userSearchChoices.studio;
      searchTimestamp = userSearchChoices.timestamp;
      userMovie = userSearchChoices.movie;
    }
    // Else continue execution
  }

  const gotResultOrExit = false;
  do {
    const searchResult = await doASearch({
      title: searchTitle,
      actors: searchActors,
      studio: searchStudio,
      timestamp: searchTimestamp,
    });
    if (searchResult) {
      if (!searchResult.movie) {
        searchResult.movie = userMovie;
      }

      logResultObject(searchResult);

      if (!args?.manualTouch) {
        return searchResult;
      }

      const questionAsync = createQuestionPrompter($inquirer, testMode?.status, $log);
      const { correctImportInfo: resultsConfirmation } = await questionAsync<{
        correctImportInfo: string;
      }>({
        type: "input",
        name: "correctImportInfo",
        message: "Is this the correct scene details to import? (y/N)",
        testAnswer: testMode ? testMode.correctImportInfo : "",
      });

      if (isPositiveAnswer(resultsConfirmation)) {
        if (searchResult.thumbnail) {
          searchResult.thumbnail = await $createImage(
            searchResult.thumbnail,
            searchResult.name || "",
            true
          );
        }

        return searchResult;
      }
    }

    const action = await makeChoices();
    if (!action || action === manualTouchChoices.NOTHING) {
      // Search already "failed" & user wants to do nothing => exit with no data
      return {};
    }
    if (action === manualTouchChoices.MANUAL_ENTER) {
      const res = await manualImport();
      logResultObject(res);
      return res;
    }
    if (action === manualTouchChoices.SEARCH) {
      const userSearchChoices = await getNextSearchChoices();
      searchTitle = userSearchChoices.title;
      searchActors = userSearchChoices.actors || [];
      searchStudio = userSearchChoices.studio;
      searchTimestamp = userSearchChoices.timestamp;
      userMovie = userSearchChoices.movie;
    }
  } while (gotResultOrExit);

  return {};

  // -------------------------------------------------------------

  // -------------------Functions & Async functions---------------

  // -------------------------------------------------------------

  /**
   * Logs all the properties of the object
   *
   * @param results - the result object
   */
  function logResultObject(results: SceneOutput): void {
    $log("[PDS] MSG: ====  Final Entry =====");

    for (const property in results) {
      if (property === "releaseDate") {
        $log(`${property}: ${timeConverter(results[property] ?? 0)}`);
      } else {
        $log(`${property}: ${results[property]}`);
      }
    }
  }

  /**
   * Standard block of manual questions that prompt the user for input
   * @returns either an array of all questions that need to be import manually
   */
  async function manualImport(): Promise<SceneOutput> {
    const questionAsync = createQuestionPrompter($inquirer, testMode?.status, $log);

    const result: SceneOutput = {};

    const { isMovie: manualMovieAnswer } = await questionAsync<{ isMovie: string }>({
      type: "input",
      name: "isMovie",
      message: "Is this a Scene from a Movie / Set / Collection?: (y/N) ",
      testAnswer: testMode?.questionAnswers?.enterMovie ?? "",
    });

    const manualEnterMovieSearch = isPositiveAnswer(manualMovieAnswer);

    if (manualEnterMovieSearch) {
      const { titleOfMovie: manualMovieName } = await questionAsync<{ titleOfMovie: string }>({
        type: "input",
        name: "titleOfMovie",
        message: "What is the Title of the Movie?: ",
        testAnswer: testMode?.questionAnswers?.movieTitle ?? "",
      });

      if (manualMovieName) {
        result.movie = manualMovieName;
      }
    }

    const { titleOfScene: manualEnterTitleScene } = await questionAsync<{ titleOfScene: string }>({
      type: "input",
      name: "titleOfScene",
      message: "What is the TITLE of the scene?: ",
      testAnswer: testMode?.questionAnswers?.enterSceneTitle ?? "",
    });

    result.name = manualEnterTitleScene;

    const { releaseDateOfScene: manualEnterReleaseDateScene } = await questionAsync<{
      releaseDateOfScene: string;
    }>({
      type: "input",
      name: "releaseDateOfScene",
      message: "What is the RELEASE DATE of the scene (YYYY.MM.DD)?: ",
      testAnswer: testMode?.questionAnswers?.enterSceneDate ?? "",
    });

    if (manualEnterReleaseDateScene) {
      const questYear = manualEnterReleaseDateScene.toString().match(/\d\d\d\d.\d\d.\d\d/);

      $log("[PDS] MSG: Checking Date");

      if (questYear && questYear.length) {
        const date = questYear[0];

        $log("[PDS] MSG: Found => yyyymmdd");

        result.releaseDate = $moment(date, "YYYY-MM-DD").valueOf();
      }
    }

    const { descriptionOfScene: manualEnterDescriptionOfScene } = await questionAsync<{
      descriptionOfScene: string;
    }>({
      type: "input",
      name: "descriptionOfScene",
      message: "What is the DESCRIPTION for the scene?: ",
      testAnswer: testMode?.questionAnswers?.manualDescription ?? "",
    });

    result.description = manualEnterDescriptionOfScene;

    const { actorsOfScene: splitActors } = await questionAsync<{ actorsOfScene: string }>({
      type: "input",
      name: "actorsOfScene",
      message: `What are the Actors NAMES in the scene?: (separated by Comma)`,
      testAnswer: testMode?.questionAnswers?.manualActors ?? "",
      default() {
        return searchActors ? ` ${searchActors.join(",")}` : "";
      },
    });

    if (splitActors && splitActors.trim()) {
      result.actors = splitActors.trim().split(",");
    }

    const { studioOfScene: askedStudio } = await questionAsync<{ studioOfScene: string }>({
      type: "input",
      name: "studioOfScene",
      message: `What Studio NAME is responsible for the scene?:`,
      testAnswer: testMode?.questionAnswers?.enterStudioName ?? "",
      default() {
        return searchStudio ? ` ${searchStudio}` : "";
      },
    });

    if (askedStudio && askedStudio.trim()) {
      result.studio = askedStudio;
    }

    return result;
  }

  async function getNextSearchChoices(): Promise<
    Partial<{
      title: string;
      actors: string[];
      studio: string;
      timestamp: number;
      movie: string;
    }>
  > {
    let userTimestamp: number | undefined;
    let userMovie: string | undefined;
    let userActors: string[] = [];

    const questionAsync = createQuestionPrompter($inquirer, testMode?.status, $log);

    const { movieSearch: movieAnswer } = await questionAsync<{ movieSearch: string }>({
      type: "input",
      name: "movieSearch",
      message: "Is this a Scene from a Movie / Set / Collection?: (y/N) ",
      testAnswer: testMode?.questionAnswers?.enterMovie ?? "",
    });
    const enterMovieSearch = isPositiveAnswer(movieAnswer);

    if (enterMovieSearch) {
      const { manualMovieTitleSearch: movieName } = await questionAsync<{
        manualMovieTitleSearch: string;
      }>({
        type: "input",
        name: "manualMovieTitleSearch",
        message: "What is the Title of the Movie?: ",
        testAnswer: testMode?.questionAnswers?.movieTitle ?? "",
      });

      if (movieName) {
        userMovie = movieName;
      }
    }

    const { titleOfScene: manualEnterTitleScene } = await questionAsync<{ titleOfScene: string }>({
      type: "input",
      name: "titleOfScene",
      message: "What is the TITLE of the scene?: ",
      testAnswer: testMode?.questionAnswers?.enterSceneTitle ?? "",
    });

    const { manualActorSearch: Q2Actor } = await questionAsync<{ manualActorSearch: string }>({
      type: "input",
      name: "manualActorSearch",
      message: `What is ONE of the Actors NAME in the scene?:`,
      testAnswer: testMode?.questionAnswers?.enterOneActorName ?? "",
      default() {
        return searchActors ? ` ${searchActors.join(",")}` : "";
      },
    });

    if (Q2Actor && Q2Actor.trim()) {
      if (Q2Actor.includes(",")) {
        userActors = Q2Actor.split(",").map((str) => str.trim());
      } else {
        userActors = [Q2Actor.trim()];
      }
    }

    const { manualStudioSearch: Q3Studio } = await questionAsync<{
      manualStudioSearch: string;
    }>({
      type: "input",
      name: "manualStudioSearch",
      message: `What Studio NAME is responsible for the scene?:`,
      testAnswer: testMode?.questionAnswers?.enterStudioName ?? "",
      default() {
        return searchStudio ? ` ${searchStudio}` : "";
      },
    });

    const { manualDateSearch: Q4date } = await questionAsync<{ manualDateSearch: string }>({
      type: "input",
      name: "manualDateSearch",
      message: "What is the release date (YYYY.MM.DD)?: (Blanks allowed) ",
      testAnswer: testMode?.questionAnswers?.enterSceneDate ?? "",
      default() {
        if (!searchTimestamp) {
          return "";
        }
        const dottedTimestamp = timeConverter(searchTimestamp).replace("-", ".");
        if (dottedTimestamp && !isNaN(+dottedTimestamp)) {
          return ` ${dottedTimestamp}`;
        }
        return "";
      },
    });

    if (Q4date) {
      const questYear = Q4date.match(/\d\d\d\d.\d\d.\d\d/);

      $log(" MSG: Checking Date");

      if (questYear && questYear.length) {
        const date = questYear[0];

        $log(" MSG: Found => yyyymmdd");

        userTimestamp = $moment(date, "YYYY-MM-DD").valueOf();
      }
    }

    return {
      title: manualEnterTitleScene,
      actors: userActors,
      studio: Q3Studio,
      timestamp: userTimestamp,
      movie: userMovie,
    };
  }

  /**
   * Provides 3 choices to be completed:
   * 1. search again => Completes a manual Search of The Porn Database
   * 2. manual info => plugin returns "manualImport"
   * 3. Do nothing => plugin does not return any results (empty object)
   * @returns
   */
  async function makeChoices(): Promise<string> {
    if (!args?.manualTouch) {
      $log(`[PDS] MSG: "manualTouch" disabled, will continue plugin with current queries`);
      return manualTouchChoices.NOTHING;
    }

    // If testmode is running, we do not want to run makeChoices() more than once,
    // or the test will have an infinite loop
    if (didRunMakeChoices && testMode) {
      return manualTouchChoices.NOTHING;
    }

    try {
      const questionAsync = createQuestionPrompter($inquirer, testMode?.status, $log);

      $log(`[PDS] MSG: "manualTouch" is enabled, prompting user for action`);
      const { choices: Q1Answer } = await questionAsync<{ choices: string }>({
        type: "rawlist",
        name: "choices",
        message: "Would you like to:",
        testAnswer: testMode?.questionAnswers?.enterInfoSearch ?? "",
        choices: Object.values(manualTouchChoices),
      });

      didRunMakeChoices = true;

      if (!Object.values(manualTouchChoices).includes(Q1Answer)) {
        $throw("User did not select a choice, will consider exit");
        return manualTouchChoices.NOTHING;
      }

      return Q1Answer;
    } catch (error) {
      $log("Something went wrong asking for search questions", error);
    }

    return manualTouchChoices.NOTHING;
  }

  /**
   * Retrieves the scene titles or details from TPDB
   *
   * @param parseQueryOrId - what tpdb should parse
   * @param aggressiveSearch - if the search does not only have 1 result, if this should run a manual import instead of trying to get titles
   * @returns either an array of all the possible Porn Database search results, or a data object for the proper "found" scene or null if
   * nothing at all was found
   */
  async function runSceneSearch(
    parseQueryOrId: string,
    searchType: "parse" | "id",
    aggressiveSearch = false
  ): Promise<SceneResult.SceneData[] | null> {
    try {
      let apiRes:
        | AxiosResponse<SceneResult.SceneListResult>
        | AxiosResponse<SceneResult.SingleSceneResult>
        | null = null;
      if (searchType === "parse") {
        apiRes = await tpdbApi.parseScene(parseQueryOrId);
      } else if (searchType === "id") {
        apiRes = await tpdbApi.getSceneById(parseQueryOrId);
      }

      if (!apiRes?.data || testMode?.testSiteUnavailable) {
        $throw("ERR: TPDB API: received no data");
        return null; // for type compatibility
      }

      const sceneList = Array.isArray(apiRes.data.data) ? apiRes.data.data : [apiRes.data.data];

      // When completing an aggressive search, We don't want "extra stuff" -- it should only have 1 result that is found!
      if (aggressiveSearch && sceneList.length !== 1) {
        $throw("ERR: TPDB Could NOT find correct scene info, or too many results");
        return null; // for type compatibility
      }

      // list the found results and tries to match the SCENENAME to the found results.
      const matchedScene: SceneResult.SceneData | null = matchSceneResultToSearch(
        ctx,
        sceneList,
        searchActors,
        searchStudio
      );

      if (!matchedScene) {
        $log("[PDS] ERR: TPDB Could NOT find correct scene info");
        return sceneList;
      }

      checkSceneExistsInDb(ctx, matchedScene.title);

      $log("[PDS] MSG: Returning the results for user selection");

      return [matchedScene];
    } catch (err) {
      $log("[PDS] ERR: TPDB API query failed");
      if (testMode?.status && !testMode?.testSiteUnavailable) {
        $log("!! This will impact the test if it was not expecting a failure !!");
      }

      return null;
    }
  }

  /**
   * The (Backbone) main Search function for the plugin
   *
   * @param searchActors - The URL API that has the sites hosted on TPD
   * @param searchStudio - The URL API that has the sites hosted on TPD
   * @param searchFuncTimestamp - The URL API that has the sites hosted on TPD
   * @returns return the proper scene information (either through manual questions or automatically)
   * or null if there were no results, too many results
   */
  async function doASearch({
    title,
    actors,
    studio,
    timestamp,
  }: Partial<{
    title: string;
    actors: string[];
    studio: string;
    timestamp: number;
  }>): Promise<SceneOutput | null> {
    async function mergeSearchResult(rawScene: SceneResult.SceneData): Promise<SceneOutput> {
      const sceneData = normalizeSceneResultData(rawScene);

      if (
        (!sceneData.actors || !sceneData.actors.length) &&
        Array.isArray(actors) &&
        actors.length
      ) {
        sceneData.actors = actors;
      }
      if (studio) {
        // Always apply existing studio
        sceneData.studio = studio;
      }

      return sceneData;
    }

    // TODO: sometimes title search does not work
    // const queries = [title, actors, studio];
    const queries = [actors, studio];
    if (timestamp && !Number.isNaN(timestamp)) {
      queries.push(timeConverter(timestamp));
    }
    const initialQuery = queries.reduce(
      (acc: string, query: string | string[] | undefined): string => {
        if (Array.isArray(query)) {
          return [acc, query].flat().filter(Boolean).join(" ");
        }
        if (query) {
          return [acc, query].filter(Boolean).join(" ");
        }
        return acc;
      },
      ""
    );

    $log(`[PDS] MSG: Running TPDB Primary Search on: ${JSON.stringify(initialQuery)}`);
    const primarySceneSearchResult = await runSceneSearch(initialQuery, "parse", false);

    if (!primarySceneSearchResult) {
      $log("[PDS] MSG: Did not find any possible matches for primary search");
      return null;
    }

    if (Array.isArray(primarySceneSearchResult) && primarySceneSearchResult.length === 1) {
      return mergeSearchResult(primarySceneSearchResult[0]);
    }

    const hasMultiplePossibleMatches =
      Array.isArray(primarySceneSearchResult) && primarySceneSearchResult.length > 1;

    if (!hasMultiplePossibleMatches) {
      $log("[PDS] MSG: Did not find any possible matches for primary search");
      return null;
    }

    $log("[PDS] MSG: Scene is possibly one of multiple search results");

    if (!args.manualTouch) {
      $log("[PDS] MSG: MaunalTouch is disabled, cannot automatically choose from multiple results");
      return null;
    }

    // Run through the list of titles and ask if they would like to choose one.
    $log("#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#");

    const answersList: string[] = [];
    const possibleTitles: string[] = [];

    for (const scene of primarySceneSearchResult) {
      answersList.push(scene.title);
      possibleTitles.push(scene.title);
    }

    const questionAsync = createQuestionPrompter($inquirer, testMode?.status, $log);
    answersList.push((new $inquirer.Separator() as any) as string);
    answersList.push("== None of the above == ");

    const { searchedTitles: multipleSitesAnswer } = await questionAsync<{
      searchedTitles: string;
    }>({
      type: "rawlist",
      name: "searchedTitles",
      message: "Which Title would you like to use?",
      testAnswer: testMode?.questionAnswers?.multipleChoice ?? "",
      choices: answersList,
    });

    const findResultIndex = possibleTitles.indexOf(multipleSitesAnswer.trim());
    const userSelectedScene: SceneResult.SceneData | undefined =
      primarySceneSearchResult[findResultIndex];

    if (!userSelectedScene || !userSelectedScene.id) {
      $log("[PDS] MSG: User did not select a scene, exiting secondary search");
      return null;
    }

    $log(
      `[PDS] MSG: Running Aggressive-Grab Search on: ${JSON.stringify({
        id: userSelectedScene.id,
        title: userSelectedScene.title,
      })}`
    );
    const secondarySceneSearchResult = await runSceneSearch(userSelectedScene.id, "id", true);

    if (!secondarySceneSearchResult) {
      $log("[PDS] ERR: Failed to find secondary result");
      return null;
    }

    if (
      secondarySceneSearchResult &&
      Array.isArray(secondarySceneSearchResult) &&
      secondarySceneSearchResult.length === 1
    ) {
      return mergeSearchResult(secondarySceneSearchResult[0]);
    }

    return null;
  }
};
