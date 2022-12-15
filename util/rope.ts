import { Direction, Movement, Position } from "./types";

export const getRopeMoves = (inputString: string) => {
  return inputString.split("\n").map((moveString) => {
    const move = moveString.split(" ");
    return {
      direction: move[0],
      numberOfSteps: parseInt(move[1]),
    } as Movement;
  });
};

export class Knot {
  constructor(private _name: string, private _nextKnot?: Knot) {}

  private _position: Position = { x: 0, y: 0 };
  private _visitedPositions: Position[] = [{ x: 0, y: 0 }];

  public get position() {
    return this._position;
  }

  public get visitedPositions() {
    return this._visitedPositions;
  }

  public get nextKnot() {
    return this._nextKnot;
  }

  public set nextKnot(knot) {
    this._nextKnot = knot;
  }

  private makeStep(direction: Direction) {
    switch (direction) {
      case "U":
        this._position.y++;
        break;
      case "D":
        this._position.y--;
        break;
      case "L":
        this._position.x--;
        break;
      case "R":
        this._position.x++;
        break;
      case "UR":
        this._position.x++;
        this._position.y++;
        break;
      case "UL":
        this._position.x--;
        this._position.y++;
        break;
      case "DR":
        this._position.x++;
        this._position.y--;
        break;
      case "DL":
        this._position.x--;
        this._position.y--;
        break;
      default:
        throw new Error("Unknown direction!");
    }

    // If the new position was not visited before, add it to the array
    if (
      !this._visitedPositions.some(
        (pos) => pos.x === this._position.x && pos.y === this._position.y
      )
    ) {
      this._visitedPositions.push({ ...this._position });
    }
  }

  public move = (move: Movement) => {
    let remainingSteps = move.numberOfSteps;
    while (remainingSteps) {
      this.makeStep(move.direction);

      // Move the connected knot as well
      if (this._nextKnot) {
        this.moveConnectedKnot();
      }
      remainingSteps--;
    }
  };

  private moveConnectedKnot() {
    if (this._nextKnot) {
      const distance = getKnotDistance(this, this._nextKnot);

      // If the head is too far away on the same row
      if (Math.abs(distance.x) > 1 && !distance.y) {
        this._nextKnot.makeStep(distance.x > 0 ? "R" : "L");
      }

      // If the head is too far away in the same column
      if (Math.abs(distance.y) > 1 && !distance.x) {
        this._nextKnot.makeStep(distance.y > 0 ? "U" : "D");
      }

      // If the head is too far away diagonally
      if (Math.abs(distance.x) + Math.abs(distance.y) > 2) {
        const directionArray = [];
        directionArray.push(distance.y > 0 ? "U" : "D");
        directionArray.push(distance.x > 0 ? "R" : "L");
        this._nextKnot.makeStep(directionArray.join("") as Direction);
      }

      this._nextKnot.moveConnectedKnot();
    }
  }
}

export const getKnotDistance = (head: Knot, tail: Knot) => {
  return {
    x: head.position.x - tail.position.x,
    y: head.position.y - tail.position.y,
  };
};
