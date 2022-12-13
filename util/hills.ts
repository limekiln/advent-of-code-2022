type Position = [number, number];
type Direction = "^" | "v" | "<" | ">";
type PathMap = (string[] | undefined)[][];

const OPPOSING_DIRECTIONS: Record<Direction, Direction> = {
  "^": "v",
  ">": "<",
  v: "^",
  "<": ">",
};

const isValidPosition = (
  possiblePosition: [number | undefined, number | undefined],
  elevationMap: number[][]
): possiblePosition is Position => {
  if (
    typeof possiblePosition[0] === "number" &&
    possiblePosition[0] >= 0 &&
    possiblePosition[0] < elevationMap.length &&
    typeof possiblePosition[1] === "number" &&
    possiblePosition[1] >= 0 &&
    possiblePosition[1] < elevationMap[0].length &&
    elevationMap[possiblePosition[0]][possiblePosition[1]]
  ) {
    return true;
  }

  return false;
};

export const parseElevationMap = (inputString: string) => {
  let startPosition: Position = [0, 0],
    endPosition: Position = [0, 0];

  const elevationMap = inputString.split("\n").map((row, rowIdx) =>
    row.split("").map((char, colIdx) => {
      let charToEval = char;
      if (char === "S") {
        startPosition = [rowIdx, colIdx];
        charToEval = "a";
      } else if (char === "E") {
        endPosition = [rowIdx, colIdx];
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
        possibleStartingPositions.push([x, y]);
      }
    }
  }

  return possibleStartingPositions;
};

export const tryMove = (
  currentPosition: Position,
  direction: Direction,
  elevationMap: number[][],
  pathMap: PathMap,
  endPosition: Position,
  globalMinimum: number[]
) => {
  const startElevation = elevationMap[currentPosition[0]][currentPosition[1]];
  const targetPosition: [number | undefined, number | undefined] =
    direction === "^"
      ? [currentPosition[0] - 1, currentPosition[1]]
      : direction === "v"
      ? [currentPosition[0] + 1, currentPosition[1]]
      : direction === "<"
      ? [currentPosition[0], currentPosition[1] - 1]
      : [currentPosition[0], currentPosition[1] + 1];

  if (isValidPosition(targetPosition, elevationMap)) {
    const targetElevation = elevationMap[targetPosition[0]][targetPosition[1]];

    // If the target position is too hight, abort
    if (targetElevation - startElevation > 1) {
      return;
    }

    // Make the step
    const currentPath =
      // cloneDeep(pathMap[currentPosition[0]][currentPosition[1]]) ?? [];
      [...(pathMap[currentPosition[0]][currentPosition[1]] ?? [])];
    currentPath.push(direction);

    if (currentPath.length >= globalMinimum[0]) {
      return;
    }

    const currentShortestPath = pathMap[targetPosition[0]][targetPosition[1]];

    // If there was no path found yet OR the new one is shorter than the previous one, use it
    if (
      !currentShortestPath ||
      currentShortestPath.length > currentPath.length
    ) {
      pathMap[targetPosition[0]][targetPosition[1]] = currentPath;
    }

    // If the current path to this position is shorter already, abort
    else {
      return;
    }

    // If the goal was reached, abort
    if (
      targetPosition[0] === endPosition[0] &&
      targetPosition[1] === endPosition[1]
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
