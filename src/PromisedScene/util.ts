import { Context } from "./../types/plugin";
/* eslint-disable func-style */
/**
 * @param answer - string to compare
 * @returns if the answer is a positive confirmation (i.e. "yes")
 */
export const isPositiveAnswer = (answer: string = ""): boolean =>
  ["y", "yes"].includes(answer.toLowerCase());

/**
 * @param timestamp - Time string to be converted to timestamp
 * @returns TODO:
 */
export function timeConverter(timestamp: number) {
  const dateNotFormatted = new Date(timestamp);

  let formattedString = dateNotFormatted.getFullYear() + "-";

  if (dateNotFormatted.getMonth() < 9) {
    formattedString += "0";
  }

  formattedString += dateNotFormatted.getMonth() + 1;

  formattedString += "-";

  if (dateNotFormatted.getDate() < 10) {
    formattedString += "0";
  }
  formattedString += dateNotFormatted.getDate();

  return formattedString;
}

/**
 * @param str - String to be cleaned of: "P.O.V." "/[^a-zA-Z0-9'/\\,(){}]/" (i should make this a file of customizable strings to clean? maybe?)
 * @param keepDate - Boolean that identifies if it should clean a string with dates or not | True = does not remove zeros in front of a number from 1 - 9
 * @returns return the string with all of the unwanted characters removed from the string
 */
export function stripStr(str: string, keepDate: boolean = false): string {
  str = str.toString();

  str = str.toLowerCase().replace("'", "");
  str = str.toLowerCase().replace(/P.O.V./gi, "pov");
  if (!keepDate) {
    str = str.toLowerCase().replace(/\b0+/g, "");
  }

  str = str.replace(/[^a-zA-Z0-9'/\\,(){}]/g, " ");

  str = str.replace(/  +/g, " ");
  return str;
}

/**
 * @param inquirer - the inquire prompting questions
 * @param testingStatus - if should just print test questions and use the param answer
 * @param $log - logger function
 * @returns the question prompt function
 */
export const createQuestionPrompter = (
  inquirer: Context["$inquirer"],
  testingStatus: boolean | undefined,
  $log: Context["$log"]
) => {
  /**
   * @param promptArgs - All of the arguments that are required for prompting a question
   * @returns the result of the question, or the inputted answer for test mode
   */
  const questionAsync = async <T>(promptArgs: object): Promise<T | { [name: string]: string }> => {
    if (testingStatus) {
      $log(`======TESTMODE ${promptArgs["name"]}====`);
      $log(`======TESTMODE Answer: ${promptArgs["testAnswer"]}`);

      return { [promptArgs["name"]]: promptArgs["testAnswer"] };
    }

    return inquirer.prompt(promptArgs);
  };

  return questionAsync;
};
