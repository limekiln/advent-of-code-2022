export type TreePosition = [number, number];

export type Tree = {
  height: number;
  position: TreePosition;
  isVisibleFrom: Record<Direction, boolean>;
  viewingDistance: Record<Direction, number>;
};

export type Forest = Tree[][];

export enum Direction {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  TOP = "TOP",
  BOTTOM = "BOTTOM",
}

const plantTree = (height: number, position: TreePosition): Tree => ({
  height,
  position,
  isVisibleFrom: {
    BOTTOM: false,
    LEFT: false,
    RIGHT: false,
    TOP: false,
  },
  viewingDistance: {
    BOTTOM: 0,
    LEFT: 0,
    RIGHT: 0,
    TOP: 0,
  },
});

export const buildForest = (inputString: string) => {
  return inputString
    .split("\n")
    .filter(Boolean)
    .map((treeRow, rowIdx) =>
      treeRow
        .split("")
        .map((treeHeight, colIdx) =>
          plantTree(parseInt(treeHeight), [rowIdx, colIdx])
        )
    );
};

export const getForestDimensions = (forest: Forest) => [
  forest.length,
  forest[0].length,
];

export const isTreeSmallerOrEqual = (trees: Tree[], targetTree: Tree) => {
  const otherTreeHeights = trees.map((tree) => tree.height);
  return otherTreeHeights.some((treeHeight) => treeHeight >= targetTree.height);
};

export const getViewingDistance = (trees: Tree[], targetTree: Tree) => {
  const otherTreeHeights = trees.map((tree) => tree.height);
  let distance = 0;

  otherTreeHeights.every((height) => {
    ++distance;
    if (height >= targetTree.height) {
      return false;
    }
    return true;
  });

  return distance;
};

export const extractTreeLine = (
  idx: number,
  rowOrCol: "ROW" | "COL",
  forest: Forest
) => {
  if (rowOrCol === "ROW") return forest[idx];

  return forest.map((treeRow) => treeRow[idx]);
};

export const getAdjacentTrees = (tree: Tree, forest: Forest) => {
  // Extract current column
  let treeLine = extractTreeLine(tree.position[1], "COL", forest);
  // Get all trees above the current one
  const treesAbove = treeLine.slice(0, tree.position[0]);
  // Get all trees under the current one
  const treesBelow = treeLine.slice(tree.position[0] + 1, treeLine.length);

  // Extract current row
  treeLine = extractTreeLine(tree.position[0], "ROW", forest);
  // Get all trees above the current one
  const treesLeft = treeLine.slice(0, tree.position[1]);
  // Get all trees under the current one
  const treesRight = treeLine.slice(tree.position[1] + 1, treeLine.length);

  return [treesAbove, treesBelow, treesLeft, treesRight] as const;
};

export const setTreeVisibility = (
  tree: Tree,
  adjacentTrees: readonly [Tree[], Tree[], Tree[], Tree[]]
) => {
  const [treesAbove, treesBelow, treesLeft, treesRight] = adjacentTrees;

  tree.isVisibleFrom.TOP = !isTreeSmallerOrEqual(treesAbove, tree);
  tree.isVisibleFrom.BOTTOM = !isTreeSmallerOrEqual(treesBelow, tree);
  tree.isVisibleFrom.LEFT = !isTreeSmallerOrEqual(treesLeft, tree);
  tree.isVisibleFrom.RIGHT = !isTreeSmallerOrEqual(treesRight, tree);
};

export const setViewingDistance = (
  tree: Tree,
  adjacentTrees: readonly [Tree[], Tree[], Tree[], Tree[]]
) => {
  const [treesAbove, treesBelow, treesLeft, treesRight] = adjacentTrees;

  tree.viewingDistance.TOP = getViewingDistance(treesAbove.reverse(), tree);
  tree.viewingDistance.BOTTOM = getViewingDistance(treesBelow, tree);
  tree.viewingDistance.LEFT = getViewingDistance(treesLeft.reverse(), tree);
  tree.viewingDistance.RIGHT = getViewingDistance(treesRight, tree);
};

export const isTreeVisible = (tree: Tree) => {
  return Object.values(tree.isVisibleFrom).some(Boolean);
};

export const getSceneScore = (tree: Tree) =>
  Object.values(tree.viewingDistance).reduce((acc, curr) => {
    acc *= curr;
    return acc;
  }, 1);

export const processTrees = (forest: Forest) => {
  for (let x = 0; x < forest.length; ++x) {
    for (let y = 0; y < forest[0].length; ++y) {
      const tree = forest[x][y];
      setTreeVisibility(tree, getAdjacentTrees(tree, forest));
      setViewingDistance(tree, getAdjacentTrees(tree, forest));
    }
  }
};
