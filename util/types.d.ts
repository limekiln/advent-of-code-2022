export type Position = {
  x: number;
  y: number;
};
export type Direction = "U" | "D" | "L" | "R" | "UR" | "UL" | "DR" | "DL";
export type Movement = {
  direction: Direction;
  numberOfSteps: number;
};

export type Instruction = {
  opCode: "noop" | "addx";
  numberOfCycles: 1 | 2;
  argument?: number;
};
export type InstructionBuffer = {
  instruction: Instruction;
  finishesAtCycle: number;
};

export type CrateStack = {
  [key: number]: string[];
};
export type CrateMovement = {
  from: number;
  to: number;
  numberOfItems: number;
};

export type PackagePair = {
  left: any[];
  right: any[];
};

type File = {
  name: string;
  size: number;
};
export type Directory = {
  name: string;
  parent: Directory | null;
  size: number;
  files: File[];
  directories: Directory[];
};

export type DirectionSymbol = "^" | "v" | "<" | ">";
export type PathMap = (string[] | undefined)[][];

export type Monkey = {
  name: string;
  items: number[];
  inspectItem: (worryLevel: number) => number;
  getTargetMonkey: (worryLevel: number) => string;
};

export type TreePosition = [number, number];
export type Tree = {
  height: number;
  position: TreePosition;
  isVisibleFrom: Record<Direction, boolean>;
  viewingDistance: Record<Direction, number>;
};
export type Forest = Tree[][];
