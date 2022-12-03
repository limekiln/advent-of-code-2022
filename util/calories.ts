import { readFileSync } from "fs";

export const getCaloriesSums = (inputPath: string) => {
  const parsedContent = readFileSync(inputPath, "utf8")
    .replaceAll("\r", "")
    .split("\n")
    .map((x) => parseInt(x));

  const calorieSums = parsedContent.reduce(
    (acc, curr) => {
      if (!Number.isNaN(curr)) {
        acc.tmp += curr;
      } else {
        acc.result.push(acc.tmp);
        acc.tmp = 0;
      }
      return acc;
    },
    {
      result: [] as number[],
      tmp: 0,
    }
  ).result;

  return calorieSums;
};
