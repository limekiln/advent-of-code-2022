type Stack = {
  [key: number]: string[];
};

type Instruction = {
  from: number;
  to: number;
  numberOfItems: number;
};

const convertInstructionArrayToObject = (instructionString: string) => {
  const instruction = instructionString.split(" ");
  return {
    from: parseInt(instruction[3]),
    to: parseInt(instruction[5]),
    numberOfItems: parseInt(instruction[1]),
  };
};

export const getStackAndInstructions = (
  inputString: string
): [stack: Stack, instructions: Instruction[]] => {
  const [stackString, instructionsString] = inputString.split("\n\n");
  const stack = stackString
    .replaceAll(/\[|\]/g, "")
    .replaceAll(/\s{4}/g, " ")
    .split("\n")
    .map((x) => x.split(" "))
    .slice(0, -1)
    .reduce((acc, curr) => {
      curr.forEach((crate, idx) => {
        if (crate !== "") {
          if (acc[idx + 1]) acc[idx + 1].push(crate);
          else acc[idx + 1] = [crate];
        }
      });
      return acc;
    }, {} as Stack);

  const instructions = instructionsString
    .split("\n")
    .map(convertInstructionArrayToObject);

  return [stack, instructions];
};

export const executeInstruction = (
  stack: Stack,
  instruction: Instruction,
  canMoveMultiple: boolean
) => {
  const itemsToMove = stack[instruction.from].splice(
    0,
    instruction.numberOfItems
  );

  // If only one item could be moved at a time, reverse the order to reflect this
  if (!canMoveMultiple) itemsToMove.reverse();
  stack[instruction.to].unshift(...itemsToMove);
};

export const getFirstCrates = (stack: Stack) =>
  Object.values(stack)
    .map((staple) => staple[0])
    .join("");
