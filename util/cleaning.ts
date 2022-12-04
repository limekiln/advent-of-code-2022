import { readFileSync } from "fs";

const convertStringRangeToArray = (range: string) => {
  const rangeBounds = range.split("-").map((x) => parseInt(x));
  const ret = [] as number[];
  for (let i = rangeBounds[0]; i <= rangeBounds[1]; ++i) ret.push(i);
  return ret;
};

export const getCleaningPairs = (inputPath: string) => {
  const parsedInput = readFileSync(inputPath, "utf8")
    .split("\n")
    .map((pair) => pair.split(","))
    .map((x) => x.map(convertStringRangeToArray));
  return parsedInput;
};

export const checkFullOverlap = (range1: number[], range2: number[]) => {
  return (
    (range1.at(0)! <= range2.at(0)! && range1.at(-1)! >= range2.at(-1)!) ||
    (range2.at(0)! <= range1.at(0)! && range2.at(-1)! >= range1.at(-1)!)
  );
};

export const checkPartialOverlap = (range1: number[], range2: number[]) => {
  return (
    (range1.at(-1)! >= range2[0] && range1.at(-1)! <= range2.at(-1)!) ||
    (range1.at(0)! >= range2[0] && range1.at(0)! <= range2.at(-1)!) ||
    (range2.at(-1)! >= range1[0] && range2.at(-1)! <= range1.at(-1)!) ||
    (range2.at(0)! >= range1[0] && range2.at(0)! <= range1.at(-1)!)
  );
};
