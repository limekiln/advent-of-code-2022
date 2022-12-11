type Instruction = {
  opCode: "noop" | "addx";
  numberOfCycles: 1 | 2;
  argument?: number;
};

type InstructionBuffer = {
  instruction: Instruction;
  finishesAtCycle: number;
};

const getInstruction = (instruction: string): Instruction => {
  const rawInstruction = instruction.split(" ");
  if (rawInstruction[0] === "noop") {
    return { opCode: "noop", numberOfCycles: 1 };
  }

  return {
    opCode: "addx",
    numberOfCycles: 2,
    argument: parseInt(rawInstruction[1]),
  };
};

export const readInstructions = (instructions: string) => {
  return instructions.split("\n").map(getInstruction);
};

export class ComDevice {
  constructor(
    private _program: Instruction[],
    private _register = 1,
    private _cycle = 0,
    private _screen = [[], [], [], [], [], []] as string[][],
    private _currentInstruction?: InstructionBuffer
  ) {}

  public get register() {
    return this._register;
  }

  public get screen() {
    return this._screen.map((line) => line.join("")).join("\n");
  }

  private process() {
    // Check if the last instruction did finish already
    if (this._currentInstruction?.finishesAtCycle === this._cycle) {
      if (this._currentInstruction.instruction.opCode === "addx") {
        this._register += this._currentInstruction.instruction.argument!;
      }
      this._currentInstruction = undefined;
    }

    // If no instruction is currently running, load a new one
    if (!this._currentInstruction && this._program.length) {
      const newInstruction = this._program.shift()!;
      this._currentInstruction = {
        finishesAtCycle: this._cycle + newInstruction?.numberOfCycles,
        instruction: newInstruction,
      };
    }
  }

  private renderPixel() {
    const sprite = [this._register - 1, this.register, this.register + 1];
    const lineIndex = (this._cycle - 1) % 40;
    const shouldRenderPixel = sprite.includes(lineIndex);
    const currentLine = Math.floor((this._cycle - 1) / 40);
    this._screen[currentLine].push(shouldRenderPixel ? "# " : ". ");
  }

  public incrementCylce() {
    this._cycle++;
    this.process();
    this.renderPixel();
  }

  public getSignalPower() {
    return this._cycle * this._register;
  }
}
