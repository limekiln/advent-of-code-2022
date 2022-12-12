// export class Monkey {
//   constructor(
//     private _name: string,
//     private _items: number[],
//     private _inspectItem: () => void,
//     private _throwItem: () => void
//   ){};

//   private numberOfInspections = 0;

//   public get name() {
//     return this._name;
//   }
// }

export type Monkey = {
  name: string;
  items: number[];
  inspectItem: (worryLevel: number) => number;
  getTargetMonkey: (worryLevel: number) => string;
};

const getInspectItemFunction = (functionAsString: string) => {
  const interestingPart = functionAsString.split("old ")[1];
  const op = interestingPart.charAt(0);
  const opArg = interestingPart.split(" ")[1];
  if (op === "+") {
    if (opArg !== "old") {
      return (x: number) => Math.floor((x + parseInt(opArg)) / 3);
    }
    return (x: number) => Math.floor((x + x) / 3);
  }

  if (op === "*") {
    if (opArg !== "old") {
      return (x: number) => Math.floor((x * parseInt(opArg)) / 3);
    }
    return (x: number) => Math.floor((x * x) / 3);
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

const getMonkeyFromString = (monkeyAsArray: string[]): Monkey => {
  const name = monkeyAsArray[0]
    .split(":")[0]
    .toLocaleLowerCase()
    .replace(" ", "");
  const items = monkeyAsArray[1]
    .split(": ")[1]
    .split(", ")
    .map((x) => parseInt(x));
  const inspectItem = getInspectItemFunction(monkeyAsArray[2]);
  const getTargetMonkey = getThrowItemFunction([
    monkeyAsArray[3],
    monkeyAsArray[4],
    monkeyAsArray[5],
  ]);

  return { name, items, inspectItem, getTargetMonkey };
};

export const getMonkeysFromString = (multiMonkeyString: string) =>
  multiMonkeyString
    .split("\n\n")
    .map((x) => x.split("\n").map((x) => x.trim()))
    .map(getMonkeyFromString);

export const throwItem = (from: Monkey, to: Monkey) => {
  to.items.push(from.items.shift()!);
};
