import { readFileSync } from "fs";

const checkUpperCase = (char: string) => char.toUpperCase() === char;

export const getCharPrio = (char: string) => {
  const rawPrio = char.charCodeAt(0);

  // Make sure prio of lower case chars start at 1 and upper case chars at 27
  return checkUpperCase(char) ? rawPrio - 38 : rawPrio - 96;
};

export const splitRucksack = (rucksack: string) => [
  rucksack.slice(0, Math.ceil(rucksack.length / 2)).split(""),
  rucksack.slice(Math.ceil(rucksack.length / 2)).split(""),
];

export const findCommonItems = (compartments: string[][]) => [
  ...new Set(compartments[0].filter((item) => compartments[1].includes(item))),
];

export const getRucksacks = (inputPath: string) => {
  return readFileSync(inputPath, "utf8").split("\n");
};
