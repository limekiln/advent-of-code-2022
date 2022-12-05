import { cloneDeep } from "lodash";
import path from "path";
import { getCalories, getCaloriesSums } from "./util/calories";
import {
  checkFullOverlap,
  checkPartialOverlap,
  getCleaningPairs,
} from "./util/cleaning";
import {
  executeInstruction,
  executeInstructionBatched,
  getFirstCrates,
  getStackAndInstructions,
} from "./util/crates";
import { readInput } from "./util/fileHandling";
import {
  getPlayingInstructions,
  getRoundScore,
} from "./util/rockPaperScissosrs";
import {
  buildGroups,
  findCommonItems,
  getPrioSum,
  getRucksacks,
  splitRucksack,
} from "./util/rucksacks";

const currentDay: string | undefined = process.argv[2];
const INPUT_PATH = path.join(".", "inputs");

// DAY 1
if (!currentDay || currentDay === "1") {
  // PART 1
  const calories = getCalories(
    readInput(path.join(INPUT_PATH, "calorie_input.txt"))
  );
  const caloriesSums = getCaloriesSums(calories);
  const maxCalories = Math.max(...caloriesSums);
  console.log(`Elves with most snacks carries ${maxCalories} calories!`);

  // PART 2
  let maxCaloriesExtended = maxCalories;
  caloriesSums.splice(caloriesSums.indexOf(maxCalories), 1);
  for (let x = 0; x < 2; ++x) {
    const newMax = Math.max(...caloriesSums);
    maxCaloriesExtended += newMax;
    caloriesSums.splice(caloriesSums.indexOf(newMax), 1);
  }
  console.log(
    `The top 3 elves carrie ${maxCaloriesExtended} calories in total!`
  );
}

// DAY 2
// PART 1
if (!currentDay || currentDay === "2") {
  const playingInstructions = getPlayingInstructions(
    readInput(path.join(INPUT_PATH, "rock_paper_scissors_input.txt"))
  );

  const roundResult = getRoundScore(playingInstructions, false);
  console.log(`The score of the round is ${roundResult}`);

  // PART 2
  const realRoundResult = getRoundScore(playingInstructions, true);
  console.log(`The real score of the round is ${realRoundResult}`);
}

// DAY 3
// PART 1
if (!currentDay || currentDay === "3") {
  const rucksacks = getRucksacks(
    readInput(path.join(INPUT_PATH, "rucksacks.txt"))
  );
  const compartments = rucksacks.map(splitRucksack);
  const commonItems = compartments.flatMap(findCommonItems);
  const prioSum = getPrioSum(commonItems);
  console.log(`The sum of priorities for the shared items is ${prioSum}`);

  // PART 2
  const elveGroups = buildGroups(rucksacks);
  const badges = elveGroups.flatMap(findCommonItems);
  const prioSumBadges = getPrioSum(badges);
  console.log(`The sum of priorities for the badge items is ${prioSumBadges}`);
}

// DAY 4
// PART 1
if (!currentDay || currentDay === "4") {
  const elvePairs = getCleaningPairs(
    path.join(INPUT_PATH, "cleaning_input.txt")
  );
  const numberOfFullOverlaps = elvePairs.reduce((acc, curr) => {
    if (checkFullOverlap(curr[0], curr[1])) acc++;
    return acc;
  }, 0);
  console.log(`There are ${numberOfFullOverlaps} pairs with full overlaps`);

  // PART2
  const numberOfPartialOverlaps = elvePairs.reduce((acc, curr) => {
    if (checkPartialOverlap(curr[0], curr[1])) acc++;
    return acc;
  }, 0);
  console.log(
    `There are ${numberOfPartialOverlaps} pairs with partial overlaps`
  );
}

// DAY 5
// PART 1
if (!currentDay || currentDay === "5") {
  const [stack, instructions] = getStackAndInstructions(
    readInput(path.join(INPUT_PATH, "crates_input.txt"))
  );

  const workingStackSerial = cloneDeep(stack);
  instructions.forEach((instruction) => {
    executeInstruction(workingStackSerial, instruction);
  });
  const passPhrase = getFirstCrates(workingStackSerial);
  console.log(`The first crates will be ${passPhrase}`);

  // PART 2
  const workingStackBatched = cloneDeep(stack);
  instructions.forEach((instruction) =>
    executeInstructionBatched(workingStackBatched, instruction)
  );
  const batchedPassPhrase = getFirstCrates(workingStackBatched);
  console.log(`The first crates will be ${batchedPassPhrase}`);
}
