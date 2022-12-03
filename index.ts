import path from "path";
import { getCaloriesSums } from "./calories";
import { getRoundScore } from "./rockPaperScissosrs";

const currentDay: string | undefined = process.argv[2];

// DAY 1
if (!currentDay || currentDay === "1") {
  // Get max sum of calories of all elves
  const caloriesSums = getCaloriesSums(
    path.join(".", "inputs", "calorie_input.txt")
  );
  const maxCalories = Math.max(...caloriesSums);
  console.log(`Elves with most snacks carries ${maxCalories} calories!`);

  // Get max sum of calories carried by top 3 elves
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
if (!currentDay || currentDay === "2") {
  const roundResult = getRoundScore(
    path.join(".", "inputs", "rock_paper_scissors_input.txt"),
    false
  );
  console.log(`The score of the round is ${roundResult}`);

  const realRoundResult = getRoundScore(
    path.join(".", "inputs", "rock_paper_scissors_input.txt"),
    true
  );
  console.log(`The real score of the round is ${realRoundResult}`);
}
