export type Monkey = {
  name: string;
  items: number[];
  inspectItem: (worryLevel: number) => number;
  getTargetMonkey: (worryLevel: number) => string;
};

export const applySimpleCopingMechanism = (worryLevel: number) =>
  worryLevel / 3;

export const applyCopingMechanism = (lcm: number) => (worryLevel: number) =>
  worryLevel % lcm;

const getInspectItemFunction = (
  functionAsString: string,
  applyCopingMechanism: (worryLevel: number) => number
) => {
  const interestingPart = functionAsString.split("old ")[1];
  const op = interestingPart.charAt(0);
  const opArg = interestingPart.split(" ")[1];
  if (op === "+") {
    if (opArg !== "old") {
      return (x: number) =>
        Math.floor(applyCopingMechanism(x + parseInt(opArg)));
    }
    return (x: number) => Math.floor(applyCopingMechanism(x + x));
  }

  if (op === "*") {
    if (opArg !== "old") {
      return (x: number) =>
        Math.floor(applyCopingMechanism(x * parseInt(opArg)));
    }
    return (x: number) => Math.floor(applyCopingMechanism(x * x));
  }

  return (x: number) => x;
};

const getThrowItemFunction = (input: string[]) => {
  const modArg = parseInt(input[0].split("by ")[1]);
  const monkeyIfDevisable = input[1].split("monkey ")[1];
  const monkeyIfNotDevisable = input[2].split("monkey ")[1];

  return (x: number) =>
    x % modArg ? `monkey${monkeyIfNotDevisable}` : `monkey${monkeyIfDevisable}`;
};

const getMonkeyFromString = (
  monkeyAsArray: string[],
  applyCopingMechanism: (worryLevel: number) => number
): Monkey => {
  const name = monkeyAsArray[0]
    .split(":")[0]
    .toLocaleLowerCase()
    .replace(" ", "");
  const items = monkeyAsArray[1]
    .split(": ")[1]
    .split(", ")
    .map((x) => parseInt(x));
  const inspectItem = getInspectItemFunction(
    monkeyAsArray[2],
    applyCopingMechanism
  );
  const getTargetMonkey = getThrowItemFunction([
    monkeyAsArray[3],
    monkeyAsArray[4],
    monkeyAsArray[5],
  ]);

  return { name, items, inspectItem, getTargetMonkey };
};

export const getMonkeysFromString = (
  multiMonkeyString: string,
  applyCopingMechanism: (worryLevel: number) => number
) =>
  multiMonkeyString
    .split("\n\n")
    .map((x) => x.split("\n").map((x) => x.trim()))
    .map((x) => getMonkeyFromString(x, applyCopingMechanism));

export const throwItem = (from: Monkey, to: Monkey) => {
  to.items.push(from.items.shift()!);
};
