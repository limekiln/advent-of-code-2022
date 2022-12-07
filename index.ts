import { cloneDeep, sortBy } from "lodash";
import path from "path";

import { getCalories, getCaloriesSums } from "./util/calories";
import {
  checkFullOverlap,
  checkPartialOverlap,
  getCleaningPairs,
} from "./util/cleaning";
import {
  checkIfFlag,
  convertStringToArray,
  getSignalWindow,
} from "./util/communication";
import {
  executeInstruction,
  getFirstCrates,
  getStackAndInstructions,
} from "./util/crates";
import { readInput } from "./util/fileHandling";
import {
  convertStringsToArray,
  DirTree,
  parseTerminalLine,
} from "./util/fileSystem";
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
  console.log("--------- DAY 1 --------");
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
  console.log("\n");
}

// DAY 2
if (!currentDay || currentDay === "2") {
  console.log("--------- DAY 2 --------");
  // PART 1
  const playingInstructions = getPlayingInstructions(
    readInput(path.join(INPUT_PATH, "rock_paper_scissors_input.txt"))
  );

  const roundResult = getRoundScore(playingInstructions, false);
  console.log(`The score of the round is ${roundResult}`);

  // PART 2
  const realRoundResult = getRoundScore(playingInstructions, true);
  console.log(`The real score of the round is ${realRoundResult}`);

  console.log("\n");
}

// DAY 3
if (!currentDay || currentDay === "3") {
  console.log("--------- DAY 3 --------");
  // PART 1
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

  console.log("\n");
}

// DAY 4
if (!currentDay || currentDay === "4") {
  console.log("--------- DAY 4 --------");
  // PART 1
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

  console.log("\n");
}

// DAY 5
if (!currentDay || currentDay === "5") {
  console.log("--------- DAY 5 --------");
  // PART 1
  const [stack, instructions] = getStackAndInstructions(
    readInput(path.join(INPUT_PATH, "crates_input.txt"))
  );

  const workingStackSerial = cloneDeep(stack);
  instructions.forEach((instruction) => {
    executeInstruction(workingStackSerial, instruction, false);
  });
  const passPhrase = getFirstCrates(workingStackSerial);
  console.log(`The first crates will be ${passPhrase}`);

  // PART 2
  const workingStackBatched = cloneDeep(stack);
  instructions.forEach((instruction) =>
    executeInstruction(workingStackBatched, instruction, true)
  );
  const batchedPassPhrase = getFirstCrates(workingStackBatched);
  console.log(`The first crates will be ${batchedPassPhrase}`);

  console.log("\n");
}

// DAY 6
if (!currentDay || currentDay === "6") {
  console.log("--------- DAY 6 --------");
  // PART 1
  const message = convertStringToArray(
    readInput(path.join(INPUT_PATH, "communication_input.txt"))
  );
  const windowStartIndex = message.findIndex((_char, idx) => {
    const window = getSignalWindow(message, idx);
    return checkIfFlag(window);
  });
  const numberOfSymbols = windowStartIndex + 4;
  console.log(`Found first marker after character ${numberOfSymbols}`);

  // PART 2
  const filteredMessage = message.slice(numberOfSymbols);
  const messageStartIndex = filteredMessage.findIndex((_char, idx) => {
    const window = getSignalWindow(filteredMessage, idx, 14);
    return checkIfFlag(window);
  });
  const numberOfMessageSymbols = messageStartIndex + 14 + numberOfSymbols;
  console.log(
    `Found first message marker after character ${numberOfMessageSymbols}`
  );

  console.log("\n");
}

// DAY 7
if (!currentDay || currentDay === "7") {
  console.log("--------- DAY 7 --------");
  // PART 1
  const instructions = convertStringsToArray(
    readInput(path.join(INPUT_PATH, "file_system_input.txt"))
  );

  const fileSystem = new DirTree();

  instructions.forEach((instruction) => {
    const parsedInstruction = parseTerminalLine(instruction);
    if (
      parsedInstruction.type === "COMMAND" &&
      parsedInstruction.directive === "cd"
    ) {
      fileSystem.changeDir(parsedInstruction.args);
    } else if (parsedInstruction.type === "FILE") {
      fileSystem.addFile(parsedInstruction.name!, parsedInstruction.size!);
    } else if (parsedInstruction.type === "DIRECTORY") {
      fileSystem.addDir(parsedInstruction.name!);
    }
  });

  fileSystem.calculateDirSizes();
  const smallDirs = fileSystem.filterNodes((node) => node.size <= 100000);
  const sumSmallDirs = smallDirs.reduce((acc, curr) => {
    acc += curr.size;
    return acc;
  }, 0);
  console.log(`The sum of the small directories is ${sumSmallDirs}`);

  // PART 2
  const DISK_SPACE_TOTAL = 70000000;
  const DISK_SPACE_NECESSARY = 30000000;

  const usedDiskSpace = fileSystem.root?.size ?? 0;
  const freeDiskSpace = DISK_SPACE_TOTAL - usedDiskSpace;
  const missingDiskSpace = DISK_SPACE_NECESSARY - freeDiskSpace;

  const deletionCandidates = sortBy(
    fileSystem.filterNodes((node) => node.size >= missingDiskSpace),
    ["size"]
  );
  console.log(
    `Directory ${deletionCandidates[0].name} has to be deleted to free up ${deletionCandidates[0].size} units`
  );

  console.log("\n");
}
