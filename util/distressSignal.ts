import { result } from "lodash";

type PackagePair = {
  left: any[];
  right: any[];
};

const findClosingBracketIndex = (input: string) => {
  if (!input.startsWith("[")) {
    throw new Error("Input has to start with an opening array bracket");
  }

  let cnt = 1;
  for (let idx = 1; idx < input.length; ++idx) {
    if (input[idx] === "[") {
      cnt++;
    } else if (input[idx] === "]") {
      cnt--;
    }
    if (cnt === 0) {
      return idx;
    }
  }
  return -1;
};

const arrayStringToArray = (input: string, array: any[]) => {
  // Check if valid array string
  if (!(input.at(0) === "[") && !(input.at(-1) === "]")) {
    throw new Error("Invalid array string!");
  }

  // Strip outer brackets
  const stringSlice = input.slice(1, input.length - 1);

  // Iterate over the remaining string
  for (let idx = 0; idx < stringSlice.length; ++idx) {
    // If no new array begins, push it to the ret array
    if (stringSlice[idx] !== "[" && stringSlice[idx] !== "]") {
      let digits = [];
      while (stringSlice[idx]?.match(/[0-9]/)?.length) {
        if (stringSlice[idx] !== ",") {
          digits.push(stringSlice[idx]);
          ++idx;
        }
      }
      array.push(parseInt(digits.join("")));
    }

    // If a new array is started, get the substring, make a recursive call and update index
    else {
      const newArray = [] as any[];
      array.push(newArray);
      const closingBracketIndex = findClosingBracketIndex(
        stringSlice.slice(idx)
      );
      if (closingBracketIndex === -1) {
        throw new Error("Could not find matching closing bracket");
      }
      const subArr = stringSlice.slice(idx, idx + closingBracketIndex + 1);
      arrayStringToArray(subArr, newArray);
      idx = idx + closingBracketIndex + 1;
    }
  }
};

export const getPackagePairs = (inputString: string) => {
  return inputString.split("\n\n").map((pair) => {
    const left = [] as any[];
    const right = [] as any[];
    const stringPair = pair.split("\n");

    arrayStringToArray(stringPair[0], left);
    arrayStringToArray(stringPair[1], right);

    return { left, right } as PackagePair;
  });
};

const compareValues = (left: any, right: any) => {
  if (typeof left === "number" && typeof right === "number") {
    if (left !== right) {
      return left < right;
    } else {
      return null;
    }
  }

  if (typeof left === "undefined") {
    return typeof right === "undefined" ? null : true;
  }
  if (typeof right === "undefined") {
    return false;
  }

  const leftCompare = Array.isArray(left) ? left : [left];
  const rightCompare = Array.isArray(right) ? right : [right];

  return hasCorrectOrder({ left: leftCompare, right: rightCompare });
};

export const hasCorrectOrder = (pair: PackagePair) => {
  let isRightOrder = null as boolean | null;
  let idx = 0;

  while (isRightOrder === null && idx < pair.left.length + 1) {
    isRightOrder = compareValues(pair.left[idx], pair.right[idx]);
    idx++;
  }
  return isRightOrder;
};
