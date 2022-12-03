import path from "path";
import { getCaloriesSums } from "./util/calories";
import { getRoundScore } from "./util/rockPaperScissosrs";
import {
  buildGroups,
  findCommonItems,
  getCharPrio,
  getPrioSum,
  getRucksacks,
  splitRucksack,
} from "./util/rucksacks";

const currentDay: string | undefined = process.argv[2];
const INPUT_PATH = path.join(".", "inputs");

// DAY 1
if (!currentDay || currentDay === "1") {
  // PART 1
  const caloriesSums = getCaloriesSums(
    path.join(INPUT_PATH, "calorie_input.txt")
  );
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
  const roundResult = getRoundScore(
    path.join(INPUT_PATH, "rock_paper_scissors_input.txt"),
    false
  );
  console.log(`The score of the round is ${roundResult}`);

  // PART 2
  const realRoundResult = getRoundScore(
    path.join(".", "inputs", "rock_paper_scissors_input.txt"),
    true
  );
  console.log(`The real score of the round is ${realRoundResult}`);
}

// DAY 3
// PART 1
if (!currentDay || currentDay === "3") {
  const rucksacks = getRucksacks(path.join(INPUT_PATH, "rucksacks.txt"));
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
