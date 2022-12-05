export const getCalories = (inputString: string) => {
  return inputString
    .replaceAll("\r", "")
    .split("\n")
    .map((x) => parseInt(x));
};

export const getCaloriesSums = (inputData: number[]) => {
  const calorieSums = inputData.reduce(
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
