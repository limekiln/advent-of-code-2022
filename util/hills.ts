import { DirectionSymbol, PathMap, Position } from "./types";

const OPPOSING_DIRECTIONS: Record<DirectionSymbol, DirectionSymbol> = {
  "^": "v",
  ">": "<",
  v: "^",
  "<": ">",
};

const isValidPosition = (
  possiblePosition: { x: number | undefined; y: number | undefined },
  elevationMap: number[][]
): possiblePosition is Position => {
  if (
    typeof possiblePosition.x === "number" &&
    possiblePosition.x >= 0 &&
    possiblePosition.x < elevationMap.length &&
    typeof possiblePosition.y === "number" &&
    possiblePosition.y >= 0 &&
    possiblePosition.y < elevationMap[0].length &&
    elevationMap[possiblePosition.x][possiblePosition.y]
  ) {
    return true;
  }

  return false;
};

export const parseElevationMap = (inputString: string) => {
  let startPosition: Position = { x: 0, y: 0 },
    endPosition: Position = { x: 0, y: 0 };

  const elevationMap = inputString.split("\n").map((row, rowIdx) =>
    row.split("").map((char, colIdx) => {
      let charToEval = char;
      if (char === "S") {
        startPosition.x = rowIdx;
        startPosition.y = colIdx;
        charToEval = "a";
      } else if (char === "E") {
        endPosition.x = rowIdx;
        endPosition.y = colIdx;
        charToEval = "z";
      }
      return charToEval.charCodeAt(0) - "a".charCodeAt(0) + 1;
    })
  );

  return { elevationMap, startPosition, endPosition };
};

export const getPossibleStartingPositions = (
  elevationMap: number[][],
  elevationLevel = 1
) => {
  const possibleStartingPositions = [] as Position[];
  for (let x = 0; x < elevationMap.length; ++x) {
    for (let y = 0; y < elevationMap[0].length; ++y) {
      if (elevationMap[x][y] === elevationLevel) {
        possibleStartingPositions.push({ x, y });
      }
    }
  }

  return possibleStartingPositions;
};

export const tryMove = (
  currentPosition: Position,
  direction: DirectionSymbol,
  elevationMap: number[][],
  pathMap: PathMap,
  endPosition: Position,
  globalMinimum: number[]
) => {
  const startElevation = elevationMap[currentPosition.x][currentPosition.y];
  const targetPosition: Position =
    direction === "^"
      ? { x: currentPosition.x - 1, y: currentPosition.y }
      : direction === "v"
      ? { x: currentPosition.x + 1, y: currentPosition.y }
      : direction === "<"
      ? { x: currentPosition.x, y: currentPosition.y - 1 }
      : { x: currentPosition.x, y: currentPosition.y + 1 };

  if (isValidPosition(targetPosition, elevationMap)) {
    const targetElevation = elevationMap[targetPosition.x][targetPosition.y];

    // If the target position is too hight, abort
    if (targetElevation - startElevation > 1) {
      return;
    }

    // Make the step
    const currentPath =
      // cloneDeep(pathMap[currentPosition[0]][currentPosition[1]]) ?? [];
      [...(pathMap[currentPosition.x][currentPosition.y] ?? [])];
    currentPath.push(direction);

    if (currentPath.length >= globalMinimum[0]) {
      return;
    }

    const currentShortestPath = pathMap[targetPosition.x][targetPosition.y];

    // If there was no path found yet OR the new one is shorter than the previous one, use it
    if (
      !currentShortestPath ||
      currentShortestPath.length > currentPath.length
    ) {
      pathMap[targetPosition.x][targetPosition.y] = currentPath;
    }

    // If the current path to this position is shorter already, abort
    else {
      return;
    }

    // If the goal was reached, abort
    if (
      targetPosition.x === endPosition.x &&
      targetPosition.y === endPosition.y
    ) {
      if (!globalMinimum[0] || globalMinimum[0] > currentPath.length) {
        globalMinimum[0] = currentPath.length;
      }
      return;
    }

    // Check steps in next directions, excluding going back
    (["^", ">", "v", "<"] as const)
      .filter((dir) => dir !== OPPOSING_DIRECTIONS[direction])
      .forEach((filteredDir) => {
        tryMove(
          targetPosition,
          filteredDir,
          elevationMap,
          pathMap,
          endPosition,
          globalMinimum
        );
      });
  }

  return;
};
