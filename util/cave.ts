import { cloneDeep, sortBy, sortedIndexBy } from "lodash";
import { Position } from "./types";

const getPosition = (positionString: string): Position => {
  const posAsArray = positionString.split(",");
  return {
    x: parseInt(posAsArray[0]),
    y: parseInt(posAsArray[1]),
  };
};

const getOccupiedPositions = (line: Position[]) => {
  const resultPositions = [] as Position[];

  // Iterate over all points but the last
  for (let x = 0; x < line.length; ++x) {
    const currentPos = line[x];
    const nextPos = line[x + 1];

    // Add the last point if there is no other
    if (typeof nextPos === "undefined") {
      resultPositions.push(currentPos);
      break;
    }

    const isVertical = currentPos.x === nextPos.x;
    const diff = isVertical
      ? nextPos.y - currentPos.y
      : nextPos.x - currentPos.x;

    // Add all points betweem the current 2 positions
    for (
      let runningDiff = 0;
      Math.abs(runningDiff) < Math.abs(diff);
      diff >= 0 ? ++runningDiff : --runningDiff
    ) {
      resultPositions.push({
        x: currentPos.x + (isVertical ? 0 : runningDiff),
        y: currentPos.y + (isVertical ? runningDiff : 0),
      });
    }
  }

  return resultPositions;
};

export const parseCaveScan = (caveAsString: string): Position[] => {
  const rocks = caveAsString
    .split("\n")
    .map((line) => line.split(" -> ").map(getPosition))
    .flatMap(getOccupiedPositions);
  return sortBy(rocks, ["y", "x"]);
};

export const simulateSandFall = (
  rocks: Position[],
  groundLevel?: number,
  startPosition: Position = { x: 500, y: 0 }
) => {
  let currentPosition = cloneDeep(startPosition);
  while (true) {
    // Check if there is a rock somewhere below,
    let nextRock = rocks.find((rock) => {
      return rock.x === currentPosition.x && rock.y > currentPosition.y;
    });

    // If not, return "null" as indicator that it is falling into the void
    if (!nextRock) {
      // ... but only if there is no ground
      if (!groundLevel) {
        return null;
      }

      // If there is ground and the sand already reached it, stay still
      if (currentPosition.y === groundLevel - 1) {
        return currentPosition;
      }

      // Otherwise choose the ground below as next rock
      nextRock = { x: currentPosition.x, y: groundLevel };
    }

    // If so, check if the next position is a rock
    // If so try move down left or right
    if (currentPosition.y + 1 === nextRock.y) {
      // Try left
      if (
        !rocks.some(
          (rock) =>
            rock.y === currentPosition.y + 1 && rock.x === currentPosition.x - 1
        )
      ) {
        currentPosition.y++;
        currentPosition.x--;
      }
      // Try right
      else if (
        !rocks.some(
          (rock) =>
            rock.y === currentPosition.y + 1 && rock.x === currentPosition.x + 1
        )
      ) {
        currentPosition.y++;
        currentPosition.x++;
      }
      // Stay still
      else {
        return currentPosition;
      }
    } else {
      currentPosition.y = nextRock.y - 1;
    }
  }
};

export const addSandToRocks = (sandUnit: Position, rocks: Position[]) => {
  const insertionIndex = sortedIndexBy(
    rocks,
    sandUnit,
    (rock) => rock.y * 1000 + rock.x
  );

  rocks.splice(insertionIndex, 0, sandUnit);
};
