import levenshtein from "./levenshtein";
import { MyContext } from "./types";
import { escapeRegExp, ignoreDbLine, stripStr } from "./util";

export const parseActor = (ctx: MyContext): string | null => {
  if (!ctx.args?.parseActor || !ctx.args?.source_settings?.Actors) {
    return null;
  }
  const cleanScenePath = stripStr(ctx.scenePath);

  const allDbActors: string[] = [];
  let parsedDbActor: string | null = null;

  ctx.$log(`[PDS] PARSE: Parsing Actors DB ==> ${ctx.args.source_settings.Actors}`);
  ctx.$fs
    .readFileSync(ctx.args.source_settings.Actors, "utf8")
    .split("\n")
    .forEach((line) => {
      if (ignoreDbLine(line)) {
        return;
      }

      const matchActor = new RegExp(escapeRegExp(JSON.parse(line).name), "i");

      const actorLength = matchActor.toString().split(" ");

      if (actorLength.length < 2) {
        return;
      }

      const foundActorMatch = cleanScenePath.match(matchActor);

      if (foundActorMatch !== null) {
        allDbActors.push(JSON.parse(line).name);
        return;
      }

      const allAliases: string[] = JSON.parse(line).aliases.toString().split(",");

      allAliases.forEach((personAlias) => {
        const aliasLength = personAlias.toString().split(" ");

        if (aliasLength.length < 2) {
          return;
        }

        let matchAliasActor = new RegExp(escapeRegExp(personAlias), "i");

        let foundAliasActorMatch = cleanScenePath.match(matchAliasActor);

        if (foundAliasActorMatch !== null) {
          allDbActors.push("alias:" + JSON.parse(line).name);
        } else {
          const aliasNoSpaces = personAlias.toString().replace(" ", "");

          matchAliasActor = new RegExp(escapeRegExp(aliasNoSpaces), "i");

          foundAliasActorMatch = cleanScenePath.match(matchAliasActor);

          if (foundAliasActorMatch !== null) {
            allDbActors.push("alias:" + JSON.parse(line).name);
          }
        }
      });
    });

  let actorHighScore = 5000;
  if (allDbActors.length && Array.isArray(allDbActors)) {
    allDbActors.forEach((person) => {
      // This is a function that will see how many differences it will take to make the string match.
      // The lowest amount of changes means that it is probably the closest match to what we need.
      // lowest score wins :)
      let foundAnAlias = false;
      if (person.includes("alias:")) {
        person = person.toString().replace("alias:", "").trim();
        foundAnAlias = true;
      }
      const found = levenshtein(person.toString().toLowerCase(), cleanScenePath);

      if (found < actorHighScore) {
        actorHighScore = found;

        parsedDbActor = person;
      }
      if (foundAnAlias) {
        ctx.$log(`[PDS] PARSE: SUCCESS Found Actor-Alias: ${JSON.stringify(person)}`);
      } else {
        ctx.$log(`[PDS] PARSE: SUCCESS Found Actor: ${JSON.stringify(person)}`);
      }
    });
    ctx.$log(
      `[PDS] PARSE: End of parse. Using "best match" Actor For Search: ${JSON.stringify(
        parsedDbActor
      )}`
    );
  }

  return parsedDbActor;
};

export const parseStudio = (ctx: MyContext): string | null => {
  if (!ctx.args?.parseStudio || !ctx.args?.source_settings?.Studios) {
    return null;
  }
  ctx.$log(
    `[PDS] PARSE: Parsing Studios DB ==> ${JSON.stringify(ctx.args.source_settings.Studios)}`
  );

  const cleanScenePath = stripStr(ctx.scenePath);

  const allDbStudios: string[] = [];
  let parsedDbStudio: string | null = null;

  ctx.$fs
    .readFileSync(ctx.args.source_settings.Studios, "utf8")
    .split("\n")
    .forEach((line) => {
      if (ignoreDbLine(line)) {
        return;
      }

      if (!JSON.parse(line).name) {
        return;
      }
      let matchStudio = new RegExp(escapeRegExp(JSON.parse(line).name), "i");

      const foundStudioMatch = cleanScenePath.match(matchStudio);

      if (foundStudioMatch !== null) {
        allDbStudios.push(JSON.parse(line).name);
      } else if (JSON.parse(line).name !== null) {
        matchStudio = new RegExp(escapeRegExp(JSON.parse(line).name.replace(/ /g, "")), "i");

        const foundStudioMatch = cleanScenePath.match(matchStudio);

        if (foundStudioMatch !== null) {
          allDbStudios.push(JSON.parse(line).name);
        }
      }

      if (!JSON.parse(line).aliases) {
        return;
      }

      const allStudioAliases = JSON.parse(line).aliases.toString().split(",");

      allStudioAliases.forEach((studioAlias) => {
        if (studioAlias) {
          let matchAliasStudio = new RegExp(escapeRegExp(studioAlias), "i");

          let foundAliasStudioMatch = cleanScenePath.match(matchAliasStudio);

          if (foundAliasStudioMatch !== null) {
            allDbStudios.push("alias:" + JSON.parse(line).name);
          } else {
            const aliasNoSpaces = studioAlias.toString().replace(" ", "");

            matchAliasStudio = new RegExp(escapeRegExp(aliasNoSpaces), "i");

            foundAliasStudioMatch = cleanScenePath.match(matchAliasStudio);

            if (foundAliasStudioMatch !== null) {
              allDbStudios.push("alias:" + JSON.parse(line).name);
            }
          }
        }
      });
    });
  // this is a debug option to se see how many studios were found by just doing a simple regex
  // $log(GettingStudio);
  let studioHighScore = 5000;
  if (allDbStudios.length && Array.isArray(allDbStudios)) {
    let foundStudioAnAlias = false;
    let instanceFoundStudioAnAlias = false;
    allDbStudios.forEach((stud) => {
      if (stud.includes("alias:")) {
        stud = stud.toString().replace("alias:", "").trim();
        instanceFoundStudioAnAlias = true;
      }

      // This is a function that will see how many differences it will take to make the string match.
      // The lowest amount of changes means that it is probably the closest match to what we need.
      // lowest score wins :)
      const found = levenshtein(stud.toString().toLowerCase(), cleanScenePath);

      if (found < studioHighScore) {
        studioHighScore = found;

        parsedDbStudio = stud;
        foundStudioAnAlias = instanceFoundStudioAnAlias;
      }
      if (foundStudioAnAlias) {
        ctx.$log(`[PDS] PARSE:\tSUCCESS: Found Studio-Alias: ${JSON.stringify(parsedDbStudio)}`);
      } else {
        ctx.$log(`[PDS] PARSE:\tSUCCESS: Found Studio: ${JSON.stringify(parsedDbStudio)}`);
      }
    });

    ctx.$log(
      `[PDS] PARSE:\tUsing "best match" Studio For Search: ${JSON.stringify(parsedDbStudio)}`
    );
  }

  return parsedDbStudio;
};

export const parseTimestamp = (ctx: MyContext): number | null => {
  const cleanScenePath = stripStr(ctx.scenePath, true);

  const ddmmyyyy = cleanScenePath.match(/\d\d \d\d \d\d\d\d/);
  const yyyymmdd = cleanScenePath.match(/\d\d\d\d \d\d \d\d/);
  const yymmdd = cleanScenePath.match(/\d\d \d\d \d\d/);

  ctx.$log("[PDS] PARSE: Parsing Date from ScenePath");

  if (yyyymmdd && yyyymmdd.length) {
    const date = yyyymmdd[0].replace(" ", ".");

    ctx.$log("[PDS] PARSE:\tSUCCESS: Found => yyyymmdd");

    return ctx.$moment(date, "YYYY-MM-DD").valueOf();
  }
  if (ddmmyyyy && ddmmyyyy.length) {
    const date = ddmmyyyy[0].replace(" ", ".");

    ctx.$log("[PDS] PARSE:\tSUCCESS: Found => ddmmyyyy");

    return ctx.$moment(date, "DD-MM-YYYY").valueOf();
  }
  if (yymmdd && yymmdd.length) {
    const date = yymmdd[0].replace(" ", ".");

    ctx.$log("[PDS] PARSE:\tSUCCESS: Found => yymmdd");

    return ctx.$moment(date, "YY-MM-DD").valueOf();
  }

  ctx.$log("[PDS] PARSE:\tFAILED: Could not find a date in the ScenePath");
  return null;
};
