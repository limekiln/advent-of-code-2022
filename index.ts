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
import { ComDevice, readInstructions } from "./util/cpu";
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
  getPossibleStartingPositions,
  parseElevationMap,
  tryMove,
} from "./util/hills";
import {
  applyCopingMechanism,
  applySimpleCopingMechanism,
  getMonkeysFromString,
  throwItem,
} from "./util/monkeys";
import {
  getPlayingInstructions,
  getRoundScore,
} from "./util/rockPaperScissosrs";
import { getRopeMoves, Knot } from "./util/rope";
import {
  buildGroups,
  findCommonItems,
  getPrioSum,
  getRucksacks,
  splitRucksack,
} from "./util/rucksacks";
import {
  buildForest,
  getSceneScore,
  isTreeVisible,
  processTrees,
} from "./util/treeHouse";

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

// DAY 8
if (!currentDay || currentDay === "8") {
  console.log("--------- DAY 8 --------");
  // PART 1
  const forest = buildForest(
    readInput(path.join(INPUT_PATH, "trees_input.txt"))
  );

  processTrees(forest);

  let numberOfVisibleTrees = 0;
  forest.forEach((treeRow) =>
    treeRow.forEach((tree) => {
      if (isTreeVisible(tree)) {
        ++numberOfVisibleTrees;
      }
    })
  );
  console.log(`There are ${numberOfVisibleTrees} visible trees in the forest`);

  // PART 2
  const highestSceneScore = Math.max(
    ...forest.flatMap((treeRow) => treeRow.map(getSceneScore))
  );

  console.log(
    `The most beautiful tree has a scene score of ${highestSceneScore}`
  );

  console.log("\n");
}

// DAY 9
if (!currentDay || currentDay === "9") {
  console.log("--------- DAY 9 --------");
  // PART 1
  const ropeMoves = getRopeMoves(
    readInput(path.join(INPUT_PATH, "rope_input.txt"))
  );

  const tail = new Knot("T");
  const head = new Knot("H", tail);

  ropeMoves.forEach((move) => {
    head.move(move);
  });

  console.log(
    `The tail did visit ${tail.visitedPositions.length} locations at least once`
  );

  // PART 2
  const knot9 = new Knot("9");
  const knot8 = new Knot("8", knot9);
  const knot7 = new Knot("7", knot8);
  const knot6 = new Knot("6", knot7);
  const knot5 = new Knot("5", knot6);
  const knot4 = new Knot("4", knot5);
  const knot3 = new Knot("3", knot4);
  const knot2 = new Knot("2", knot3);
  const knot1 = new Knot("1", knot2);
  const head2 = new Knot("H", knot1);

  ropeMoves.forEach((move) => {
    head2.move(move);
  });

  console.log(
    `The long rope tail did visit ${knot9.visitedPositions.length} locations at least once`
  );

  console.log("\n");
}

// DAY 10
if (!currentDay || currentDay === "10") {
  console.log("--------- DAY 10 --------");
  // PART 1
  const instructions = readInstructions(
    readInput(path.join(INPUT_PATH, "cpu_instructions_input.txt"))
  );

  const device = new ComDevice(instructions);
  let signalPowerSum = 0;
  for (let cylce = 1; cylce <= 240; ++cylce) {
    device.incrementCylce();
    if ([20, 60, 100, 140, 180, 220].includes(cylce)) {
      signalPowerSum += device.getSignalPower();
    }
  }

  console.log(`The combined signal power is ${signalPowerSum}`);
  console.log("\n");

  // PART 2
  console.log("The screen shows: ");
  console.log(device.screen);

  console.log("\n");
}

// DAY 11
if (!currentDay || currentDay === "11") {
  console.log("--------- DAY 11 --------");
  // PART 1
  const monkeys = getMonkeysFromString(
    readInput(path.join(INPUT_PATH, "monkeys_input.txt")),
    applySimpleCopingMechanism
  ).map((monkey) => ({
    monkey,
    numberOfInspections: 0,
  }));

  // Play the game for 20 rounds
  for (let x = 0; x < 20; ++x) {
    // Let each monkey have their turn
    monkeys.forEach((monkey) => {
      const currentMonkey = monkey.monkey;
      const { items, inspectItem, getTargetMonkey } = currentMonkey;

      // Let the monkey go through all items they have
      while (items.length) {
        // Inspect the item and update its worry level
        items[0] = inspectItem(items[0]);
        monkey.numberOfInspections++;

        // Throw the item to the next monkey
        const targetMonkey = monkeys.find(
          (monkey) => monkey.monkey.name === getTargetMonkey(items[0])
        )!.monkey;
        throwItem(currentMonkey, targetMonkey);
      }
    });
  }

  const sortedMonkeys = sortBy(monkeys, (o) => o.numberOfInspections).reverse();
  const monkeyBusiness =
    sortedMonkeys[0].numberOfInspections * sortedMonkeys[1].numberOfInspections;
  console.log(`The monkey business euqals ${monkeyBusiness}`);

  // PART 2
  const monkeys2 = getMonkeysFromString(
    readInput(path.join(INPUT_PATH, "monkeys_input.txt")),
    applyCopingMechanism(9699690)
  ).map((monkey) => ({
    monkey,
    numberOfInspections: 0,
  }));

  // Play the game for 10000 rounds
  for (let x = 0; x < 10000; ++x) {
    // Let each monkey have their turn
    monkeys2.forEach((monkey) => {
      const currentMonkey = monkey.monkey;
      const { items, inspectItem, getTargetMonkey } = currentMonkey;

      // Let the monkey go through all items they have
      while (items.length) {
        // Inspect the item and update its worry level
        items[0] = inspectItem(items[0]);
        monkey.numberOfInspections++;

        // Throw the item to the next monkey
        const targetMonkey = monkeys2.find(
          (monkey) => monkey.monkey.name === getTargetMonkey(items[0])
        )!.monkey;
        throwItem(currentMonkey, targetMonkey);
      }
    });
  }

  const sortedMonkeys2 = sortBy(
    monkeys2,
    (o) => o.numberOfInspections
  ).reverse();
  const monkeyBusiness2 =
    sortedMonkeys2[0].numberOfInspections *
    sortedMonkeys2[1].numberOfInspections;
  console.log(
    `The monkey business without stress reduction euqals ${monkeyBusiness2}`
  );

  console.log("\n");
}

// DAY 12
if (!currentDay || currentDay === "12") {
  console.log("--------- DAY 12 --------");
  // PART 1
  const { elevationMap, startPosition, endPosition } = parseElevationMap(
    readInput(path.join(INPUT_PATH, "hills_input.txt"))
  );

  const shortestPathMap = [...Array(elevationMap[0].length)].map((_) => [
    ...Array(elevationMap[1].length),
  ]);

  const globalMinimum = [Number.MAX_SAFE_INTEGER];

  (["^", ">", "v", "<"] as const).forEach((direction) => {
    tryMove(
      startPosition,
      direction,
      elevationMap,
      shortestPathMap,
      endPosition,
      globalMinimum
    );
  });

  console.log(
    `The shortest way from the start to the end takes ${globalMinimum[0]} steps`
  );

  // PART 2
  const possibleStartingPositions = getPossibleStartingPositions(elevationMap);
  possibleStartingPositions.forEach((startingPosition) => {
    (["^", ">", "v", "<"] as const).forEach((direction) => {
      const newShortestPathMap = [...Array(elevationMap[0].length)].map((_) => [
        ...Array(elevationMap[1].length),
      ]);
      tryMove(
        startingPosition,
        direction,
        elevationMap,
        newShortestPathMap,
        endPosition,
        globalMinimum
      );
    });
  });

  console.log(
    `The shortest way from any start to the end takes ${globalMinimum[0]} steps`
  );
}
