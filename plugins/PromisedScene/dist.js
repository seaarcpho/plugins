'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const api_1 = require("./api");
const parse_1 = require("./parse");
const util_1 = require("./util");
module.exports = (ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { event, scenePath, sceneName, $throw, $logger, $formatMessage, testMode, args, $inquirer, $createImage, } = ctx;
    let didRunMakeChoices = false;
    if (event !== "sceneCreated" && event !== "sceneCustom") {
        $throw("Plugin used for unsupported event");
    }
    if (!Object.hasOwnProperty.call(args, "useTitleInSearch")) {
        $logger.warn("Missing useTitleInSearch in plugin args!");
    }
    if (!Object.hasOwnProperty.call(args, "alwaysUseSingleResult")) {
        $logger.warn("Missing alwaysUseSingleResult in plugin args!");
    }
    if (!Object.hasOwnProperty.call(args, "source_settings")) {
        $throw("Missing source_settings in plugin args");
    }
    if (!Object.hasOwnProperty.call(args, "parseActor")) {
        $throw("Missing parseActor in plugin args");
    }
    if (!Object.hasOwnProperty.call(args, "parseStudio")) {
        $throw("Missing parseStudio in plugin args");
    }
    if (!Object.hasOwnProperty.call(args, "parseDate")) {
        $throw("Missing parseStudio in plugin args");
    }
    if (!Object.hasOwnProperty.call(args, "manualTouch")) {
        $throw("Missing manualTouch in plugin args");
    }
    if (!Object.hasOwnProperty.call(args, "sceneDuplicationCheck")) {
        $throw("Missing sceneDuplicationCheck in plugin args");
    }
    const tpdbApi = new api_1.Api(ctx);
    $logger.info(`STARTING to analyze scene: ${JSON.stringify(scenePath)}`);
    const parsedDbActor = parse_1.parseSceneActor(ctx);
    const parsedDbStudio = parse_1.parseSceneStudio(ctx);
    const parsedTimestamp = parse_1.parseSceneTimestamp(ctx);
    let searchTitle = sceneName;
    let searchActors = parsedDbActor ? [parsedDbActor] : [];
    let searchStudio = parsedDbStudio !== null && parsedDbStudio !== void 0 ? parsedDbStudio : undefined;
    let searchTimestamp = parsedTimestamp !== null && parsedTimestamp !== void 0 ? parsedTimestamp : undefined;
    let userMovie;
    let extra;
    const gotResultOrExit = false;
    do {
        const searchResult = yield doASearch({
            title: searchTitle,
            actors: searchActors,
            studio: searchStudio,
            timestamp: searchTimestamp,
            extra,
        });
        if (searchResult) {
            if (!searchResult.movie && userMovie) {
                searchResult.movie = userMovie;
            }
            const confirmedData = yield confirmFinalEntry(searchResult);
            if (confirmedData) {
                return confirmedData;
            }
        }
        const action = yield makeChoices();
        if (!action || action === util_1.manualTouchChoices.NOTHING) {
            return {};
        }
        else if (action === util_1.manualTouchChoices.MANUAL_ENTER) {
            const manualData = yield manualImport();
            const confirmedData = yield confirmFinalEntry(manualData);
            if (confirmedData) {
                return confirmedData;
            }
        }
        else if (action === util_1.manualTouchChoices.SEARCH) {
            const userSearchChoices = yield getNextSearchChoices();
            searchTitle = userSearchChoices.title;
            searchActors = userSearchChoices.actors || [];
            searchStudio = userSearchChoices.studio;
            searchTimestamp = userSearchChoices.timestamp;
            userMovie = userSearchChoices.movie;
            extra = userSearchChoices.extra;
        }
    } while (!gotResultOrExit);
    return {};
    function logResultObject(results) {
        var _a;
        $logger.info("====  Final Entry =====");
        const logObj = Object.assign({}, results);
        if (logObj.releaseDate) {
            logObj.releaseDate = util_1.timestampToString((_a = logObj.releaseDate) !== null && _a !== void 0 ? _a : 0);
        }
        $logger.info(JSON.stringify(logObj, null, 2));
    }
    function confirmFinalEntry(sceneData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            logResultObject(sceneData);
            if (!(args === null || args === void 0 ? void 0 : args.manualTouch)) {
                if (sceneData.thumbnail) {
                    try {
                        sceneData.thumbnail = yield $createImage(sceneData.thumbnail, sceneData.name || "", true);
                    }
                    catch (err) {
                        $logger.error(`Could not download scene thumbnail ${$formatMessage(err)}`);
                        delete sceneData.thumbnail;
                    }
                }
                return sceneData;
            }
            const questionAsync = util_1.createQuestionPrompter($inquirer, testMode === null || testMode === void 0 ? void 0 : testMode.status, $logger);
            const { correctImportInfo: resultsConfirmation } = yield questionAsync({
                type: "input",
                name: "correctImportInfo",
                message: "Is this the correct scene details to import? (y/N)",
                testAnswer: testMode ? testMode.correctImportInfo : "",
            });
            if (util_1.isPositiveAnswer(resultsConfirmation)) {
                if (sceneData.thumbnail) {
                    try {
                        sceneData.thumbnail = yield $createImage(sceneData.thumbnail, sceneData.name || "", true);
                    }
                    catch (err) {
                        $logger.error(`Could not download scene thumbnail ${$formatMessage(err)}`);
                        delete sceneData.thumbnail;
                    }
                }
                return sceneData;
            }
            return null;
        });
    }
    function manualImport() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const questionAsync = util_1.createQuestionPrompter($inquirer, testMode === null || testMode === void 0 ? void 0 : testMode.status, $logger);
            const result = {};
            const { isMovie: manualMovieAnswer } = yield questionAsync({
                type: "input",
                name: "isMovie",
                message: "Is this a Scene from a Movie / Set / Collection?: (y/N) ",
                testAnswer: (_b = (_a = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _a === void 0 ? void 0 : _a.enterMovie) !== null && _b !== void 0 ? _b : "",
            });
            const manualEnterMovieSearch = util_1.isPositiveAnswer(manualMovieAnswer);
            if (manualEnterMovieSearch) {
                const { titleOfMovie: manualMovieName } = yield questionAsync({
                    type: "input",
                    name: "titleOfMovie",
                    message: "What is the Title of the Movie?: ",
                    testAnswer: (_d = (_c = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _c === void 0 ? void 0 : _c.movieTitle) !== null && _d !== void 0 ? _d : "",
                });
                if (manualMovieName) {
                    result.movie = manualMovieName;
                }
            }
            const { titleOfScene: manualEnterTitleScene } = yield questionAsync({
                type: "input",
                name: "titleOfScene",
                message: "What is the TITLE of the scene?: ",
                testAnswer: (_f = (_e = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _e === void 0 ? void 0 : _e.enterSceneTitle) !== null && _f !== void 0 ? _f : "",
            });
            result.name = manualEnterTitleScene;
            const { releaseDateOfScene: manualEnterReleaseDateScene } = yield questionAsync({
                type: "input",
                name: "releaseDateOfScene",
                message: "What is the RELEASE DATE of the scene (YYYY.MM.DD / DD.MM.YYYY / YY.MM.DD)?: ",
                testAnswer: (_h = (_g = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _g === void 0 ? void 0 : _g.enterSceneDate) !== null && _h !== void 0 ? _h : "",
            });
            if (manualEnterReleaseDateScene) {
                const parsedDate = util_1.dateToTimestamp(ctx, manualEnterReleaseDateScene);
                if (parsedDate) {
                    result.releaseDate = parsedDate;
                }
            }
            const { descriptionOfScene: manualEnterDescriptionOfScene } = yield questionAsync({
                type: "input",
                name: "descriptionOfScene",
                message: "What is the DESCRIPTION for the scene?: ",
                testAnswer: (_k = (_j = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _j === void 0 ? void 0 : _j.manualDescription) !== null && _k !== void 0 ? _k : "",
            });
            result.description = manualEnterDescriptionOfScene;
            const { actorsOfScene: splitActors } = yield questionAsync({
                type: "input",
                name: "actorsOfScene",
                message: `What are the Actors NAMES in the scene?: (separated by Comma)`,
                testAnswer: (_m = (_l = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _l === void 0 ? void 0 : _l.manualActors) !== null && _m !== void 0 ? _m : "",
                default() {
                    return searchActors ? ` ${searchActors.join(",")}` : "";
                },
            });
            if (splitActors && splitActors.trim()) {
                result.actors = splitActors.trim().split(",");
            }
            const { studioOfScene: askedStudio } = yield questionAsync({
                type: "input",
                name: "studioOfScene",
                message: `What Studio NAME is responsible for the scene?:`,
                testAnswer: (_p = (_o = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _o === void 0 ? void 0 : _o.enterStudioName) !== null && _p !== void 0 ? _p : "",
                default() {
                    return searchStudio ? ` ${searchStudio}` : "";
                },
            });
            if (askedStudio && askedStudio.trim()) {
                result.studio = askedStudio;
            }
            return result;
        });
    }
    function getNextSearchChoices() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let userTitle;
            let userTimestamp;
            let userMovie;
            let userActors = [];
            const questionAsync = util_1.createQuestionPrompter($inquirer, testMode === null || testMode === void 0 ? void 0 : testMode.status, $logger);
            const { movieSearch: movieAnswer } = yield questionAsync({
                type: "input",
                name: "movieSearch",
                message: "Is this a Scene from a Movie / Set / Collection?: (y/N) ",
                testAnswer: (_b = (_a = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _a === void 0 ? void 0 : _a.enterMovie) !== null && _b !== void 0 ? _b : "",
            });
            const enterMovieSearch = util_1.isPositiveAnswer(movieAnswer);
            if (enterMovieSearch) {
                const { manualMovieTitleSearch: movieName } = yield questionAsync({
                    type: "input",
                    name: "manualMovieTitleSearch",
                    message: "What is the Title of the Movie?: ",
                    testAnswer: (_d = (_c = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _c === void 0 ? void 0 : _c.movieTitle) !== null && _d !== void 0 ? _d : "",
                });
                if (movieName) {
                    userMovie = movieName;
                }
            }
            if (args.useTitleInSearch) {
                const { titleOfScene: manualEnterTitleScene } = yield questionAsync({
                    type: "input",
                    name: "titleOfScene",
                    message: "What is the TITLE of the scene?: ",
                    testAnswer: (_f = (_e = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _e === void 0 ? void 0 : _e.enterSceneTitle) !== null && _f !== void 0 ? _f : "",
                });
                if (manualEnterTitleScene && manualEnterTitleScene.trim()) {
                    userTitle = manualEnterTitleScene.trim();
                }
            }
            const { manualActorSearch: Q2Actor } = yield questionAsync({
                type: "input",
                name: "manualActorSearch",
                message: `What is ONE of the Actors NAME in the scene?:`,
                testAnswer: (_h = (_g = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _g === void 0 ? void 0 : _g.enterOneActorName) !== null && _h !== void 0 ? _h : "",
                default() {
                    return searchActors ? ` ${searchActors.join(",")}` : "";
                },
            });
            if (Q2Actor && Q2Actor.trim()) {
                if (Q2Actor.includes(",")) {
                    userActors = Q2Actor.split(",").map((str) => str.trim());
                }
                else {
                    userActors = [Q2Actor.trim()];
                }
            }
            const { manualStudioSearch: Q3Studio } = yield questionAsync({
                type: "input",
                name: "manualStudioSearch",
                message: `What Studio NAME is responsible for the scene?:`,
                testAnswer: (_k = (_j = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _j === void 0 ? void 0 : _j.enterStudioName) !== null && _k !== void 0 ? _k : "",
                default() {
                    return searchStudio ? ` ${searchStudio}` : "";
                },
            });
            const { extra } = yield questionAsync({
                type: "input",
                name: "extra",
                message: `What else should be in the search?:`,
                testAnswer: (_m = (_l = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _l === void 0 ? void 0 : _l.extra) !== null && _m !== void 0 ? _m : "",
            });
            const { manualDateSearch: Q4date } = yield questionAsync({
                type: "input",
                name: "manualDateSearch",
                message: "What is the release date (YYYY.MM.DD / DD.MM.YYYY / YY.MM.DD)?: (Blanks allowed) ",
                testAnswer: (_p = (_o = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _o === void 0 ? void 0 : _o.enterSceneDate) !== null && _p !== void 0 ? _p : "",
                default() {
                    if (!searchTimestamp) {
                        return "";
                    }
                    const dottedTimestamp = util_1.timestampToString(searchTimestamp).replace("-", ".");
                    if (dottedTimestamp && !isNaN(+dottedTimestamp)) {
                        return ` ${dottedTimestamp}`;
                    }
                    return "";
                },
            });
            if (Q4date) {
                const parsedDate = util_1.dateToTimestamp(ctx, Q4date);
                if (parsedDate) {
                    userTimestamp = parsedDate;
                }
            }
            return {
                title: userTitle,
                actors: userActors,
                studio: Q3Studio,
                timestamp: userTimestamp,
                movie: userMovie,
                extra,
            };
        });
    }
    function makeChoices() {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(args === null || args === void 0 ? void 0 : args.manualTouch)) {
                $logger.verbose(`"manualTouch" disabled, will continue plugin with current queries`);
                return util_1.manualTouchChoices.NOTHING;
            }
            if (didRunMakeChoices && testMode) {
                return util_1.manualTouchChoices.NOTHING;
            }
            try {
                const questionAsync = util_1.createQuestionPrompter($inquirer, testMode === null || testMode === void 0 ? void 0 : testMode.status, $logger);
                $logger.info(`"manualTouch" is enabled, prompting user for action`);
                const { choices: Q1Answer } = yield questionAsync({
                    type: "rawlist",
                    name: "choices",
                    message: "Would you like to:",
                    testAnswer: (_b = (_a = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _a === void 0 ? void 0 : _a.enterInfoSearch) !== null && _b !== void 0 ? _b : "",
                    choices: Object.values(util_1.manualTouchChoices),
                });
                didRunMakeChoices = true;
                if (!Object.values(util_1.manualTouchChoices).includes(Q1Answer)) {
                    $throw("User did not select a choice, will consider exit");
                    return util_1.manualTouchChoices.NOTHING;
                }
                return Q1Answer;
            }
            catch (error) {
                $logger.error(`Something went wrong asking for search questions ${$formatMessage(error)}`);
            }
            return util_1.manualTouchChoices.NOTHING;
        });
    }
    function doASearch({ title, actors, studio, timestamp, }) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            function mergeSearchResult(rawScene) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    util_1.checkSceneExistsInDb(ctx, rawScene.title);
                    const sceneData = util_1.normalizeSceneResultData(rawScene);
                    if ((!sceneData.actors || !sceneData.actors.length) &&
                        Array.isArray(actors) &&
                        actors.length) {
                        sceneData.actors = actors;
                    }
                    if (studio) {
                        sceneData.studio = studio;
                    }
                    return sceneData;
                });
            }
            const queries = [actors, studio, extra];
            if (args.useTitleInSearch) {
                queries.unshift(title);
            }
            if (!queries.flat().filter(Boolean).join("")) {
                $logger.warn("Did not have any parameters to do primary search");
                return null;
            }
            if (timestamp && !Number.isNaN(timestamp)) {
                queries.push(util_1.timestampToString(timestamp));
            }
            const initialQuery = queries.flat().filter(Boolean).join(" ");
            if (!initialQuery) {
                $logger.warn("Did not have any parameters to do primary search");
                return null;
            }
            let sceneList = [];
            try {
                $logger.verbose(`Running TPDB Primary Search on: ${JSON.stringify(initialQuery)}`);
                const apiRes = yield tpdbApi.parseScene(initialQuery);
                if (!(apiRes === null || apiRes === void 0 ? void 0 : apiRes.data) || (testMode === null || testMode === void 0 ? void 0 : testMode.testSiteUnavailable)) {
                    $throw("TPDB API: received no data");
                    return null;
                }
                sceneList = Array.isArray(apiRes.data.data) ? apiRes.data.data : [apiRes.data.data];
            }
            catch (err) {
                $logger.error(`TPDB API query failed ${$formatMessage(err)}`);
                if ((testMode === null || testMode === void 0 ? void 0 : testMode.status) && !(testMode === null || testMode === void 0 ? void 0 : testMode.testSiteUnavailable)) {
                    $logger.warn("!! This will impact the test if it was not expecting a failure !!");
                }
                return null;
            }
            if (!sceneList.length) {
                $logger.error("Did not find any results from TPDB");
                return null;
            }
            const matchedScene = util_1.matchSceneResultToSearch(ctx, sceneList, searchActors, searchStudio);
            if (matchedScene) {
                return mergeSearchResult(matchedScene);
            }
            else if (args.alwaysUseSingleResult && sceneList.length === 1) {
                $logger.verbose(`Did not match results to scene, but only 1 result was found and "alwaysUseSingleResult" is enabled. Returning it`);
                return mergeSearchResult(sceneList[0]);
            }
            $logger.error("Did not match any of the titles from TPDB");
            $logger.info("Scene is possibly one of multiple search results");
            if (!args.manualTouch) {
                $logger.info("ManualTouch is disabled, cannot automatically choose from multiple results");
                return null;
            }
            $logger.info("#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#");
            const answersList = [];
            const possibleTitles = [];
            for (const scene of sceneList) {
                answersList.push(scene.title);
                possibleTitles.push(scene.title);
            }
            const questionAsync = util_1.createQuestionPrompter($inquirer, testMode === null || testMode === void 0 ? void 0 : testMode.status, $logger);
            answersList.push(new $inquirer.Separator());
            answersList.push("== None of the above == ");
            const { searchedTitles: multipleSitesAnswer } = yield questionAsync({
                type: "rawlist",
                name: "searchedTitles",
                message: "Which Title would you like to use?",
                testAnswer: (_b = (_a = testMode === null || testMode === void 0 ? void 0 : testMode.questionAnswers) === null || _a === void 0 ? void 0 : _a.multipleChoice) !== null && _b !== void 0 ? _b : "",
                choices: answersList,
            });
            const findResultIndex = possibleTitles.indexOf(multipleSitesAnswer.trim());
            const userSelectedScene = sceneList[findResultIndex];
            if (!userSelectedScene) {
                $logger.info("User did not select a scene, exiting scene selection");
                return null;
            }
            return mergeSearchResult(userSelectedScene);
        });
    }
});
