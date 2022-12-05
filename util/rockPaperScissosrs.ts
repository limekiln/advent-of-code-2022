enum ShapePoints {
  "X" = 1,
  "Y" = 2,
  "Z" = 3,
}

enum ResultPoints {
  "LOOSE" = 0,
  "DRAW" = 3,
  "WIN" = 6,
}

enum NecessaryResult {
  "X" = ResultPoints.LOOSE,
  "Y" = ResultPoints.DRAW,
  "Z" = ResultPoints.WIN,
}

export enum ShapePairResults {
  "AX" = ResultPoints.DRAW,
  "AY" = ResultPoints.WIN,
  "AZ" = ResultPoints.LOOSE,
  "BX" = ResultPoints.LOOSE,
  "BY" = ResultPoints.DRAW,
  "BZ" = ResultPoints.WIN,
  "CX" = ResultPoints.WIN,
  "CY" = ResultPoints.LOOSE,
  "CZ" = ResultPoints.DRAW,
}

const resultsByShape = {
  A: {
    X: ShapePoints.Z,
    Y: ShapePoints.X,
    Z: ShapePoints.Y,
  },
  B: {
    X: ShapePoints.X,
    Y: ShapePoints.Y,
    Z: ShapePoints.Z,
  },
  C: {
    X: ShapePoints.Y,
    Y: ShapePoints.Z,
    Z: ShapePoints.X,
  },
};

export const getPlayingInstructions = (inputString: string) => {
  return inputString.replaceAll(" ", "").split("\n") as Array<
    keyof typeof ShapePairResults
  >;
};

export const getRoundScore = (
  inputData: Array<keyof typeof ShapePairResults>,
  decrtypt: boolean
) => {
  let roundResult = 0;

  if (!decrtypt) {
    roundResult = inputData.reduce((acc, curr) => {
      acc += ShapePairResults[curr];
      acc += ShapePoints[curr.at(1) as keyof typeof ShapePoints];
      return acc;
    }, 0);
  } else {
    roundResult = inputData.reduce((acc, curr) => {
      acc += NecessaryResult[curr.at(1) as keyof typeof NecessaryResult];
      acc +=
        resultsByShape[curr.at(0) as "A" | "B" | "C"][
          curr.at(1) as "X" | "Y" | "Z"
        ];
      return acc;
    }, 0);
  }

  return roundResult;
};
