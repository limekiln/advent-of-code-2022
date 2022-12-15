import { CrateMovement, CrateStack } from "./types";

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
): [stack: CrateStack, instructions: CrateMovement[]] => {
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
    }, {} as CrateStack);

  const instructions = instructionsString
    .split("\n")
    .map(convertInstructionArrayToObject);

  return [stack, instructions];
};

export const executeInstruction = (
  stack: CrateStack,
  instruction: CrateMovement,
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

export const getFirstCrates = (stack: CrateStack) =>
  Object.values(stack)
    .map((staple) => staple[0])
    .join("");
