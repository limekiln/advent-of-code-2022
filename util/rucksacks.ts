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

export const findCommonItem = (itemList1: string[], itemList2: string[]) => [
  ...new Set(itemList1.filter((item) => itemList2.includes(item))),
];

export const findCommonItems = (items: string[][]) => {
  return [
    ...new Set(
      items[0]
        .map((item) => {
          for (let i = 1; i < items.length; ++i) {
            // If any list does not contain the item, break out
            if (!items[i].includes(item)) {
              break;
            }

            // If the last list is reached, the item is a common one
            if (i === items.length - 1) {
              return item;
            }
          }
        })
        .filter(Boolean) as string[]
    ),
  ];
};

export const getRucksacks = (inputString: string) => {
  return inputString.split("\n");
};

export const buildGroups = (rucksacks: string[]) =>
  rucksacks.reduce(
    (acc, curr) => {
      if (acc.counter === 3) {
        acc.counter = 0;
        acc.currentIndex += 1;
      }

      Array.isArray(acc.result[acc.currentIndex])
        ? acc.result[acc.currentIndex].push(curr.split(""))
        : (acc.result[acc.currentIndex] = [curr.split("")]);

      acc.counter++;

      return acc;
    },
    { result: [] as string[][][], currentIndex: 0, counter: 0 }
  ).result;

export const getPrioSum = (charList: string[]) =>
  charList.reduce((acc, curr) => {
    acc += getCharPrio(curr);
    return acc;
  }, 0);
