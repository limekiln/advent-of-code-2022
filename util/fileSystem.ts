import { Directory } from "./types";

export const convertStringsToArray = (inputString: string) =>
  inputString.split("\n");

export const parseTerminalLine = (terminalLine: string) => {
  const lineAsArray = terminalLine.split(" ");
  if (lineAsArray[0] === "$") {
    return {
      type: "COMMAND",
      directive: lineAsArray[1],
      args: lineAsArray[2],
    };
  } else if (lineAsArray[0] === "dir") {
    return {
      type: "DIRECTORY",
      name: lineAsArray[1],
    };
  }

  return {
    type: "FILE",
    size: parseInt(lineAsArray[0]),
    name: lineAsArray[1],
  };
};

export class DirTree {
  constructor(
    private _root: Directory | null = null,
    private _currentNode: Directory | null = null
  ) {}

  public get root() {
    return this._root;
  }

  public get currentNode() {
    return this._currentNode;
  }

  public set root(rootNode: Directory | null) {
    if (!rootNode) throw new Error("Root node has to be defined!");
    this._root = rootNode;
  }

  public set currentNode(currentNode: Directory | null) {
    if (!currentNode) throw new Error("Node has to be defined!");
    this._currentNode = currentNode;
  }

  initDirectory(dirName: string): Directory {
    return {
      name: dirName,
      parent: this._currentNode,
      size: 0,
      files: [],
      directories: [],
    };
  }

  initFile(name: string, size: number) {
    return {
      name,
      size,
    } as File;
  }

  public addDir(targetDir: string) {
    let newDir = this._currentNode?.directories.find(
      (dir) => dir.name === targetDir
    );

    // If that directory does not already exist, create it
    if (typeof newDir === "undefined") {
      newDir = this.initDirectory(targetDir);
      this._currentNode!.directories.push(newDir);
    }
    return newDir;
  }

  public addFile(name: string, size: number) {
    const newFile = this.initFile(name, size);
    if (!this.currentNode?.files.some((file) => file.name === name))
      this._currentNode?.files.push(newFile);
    return newFile;
  }

  public changeDir(targetDir: string) {
    if (!this._root) {
      const newRootDir = this.initDirectory(targetDir);
      this._root = newRootDir;
      this._currentNode = newRootDir;
    } else {
      // For going up, use the current node's parent
      if (targetDir === "..") {
        this._currentNode = this._currentNode!.parent;
      }

      // If a specific dir is given, add it (if necessary) and switch to it
      else {
        this._currentNode = this.addDir(targetDir);
      }
    }
  }

  private calculateDirSize(targetDir: Directory | null = this._root) {
    let dirSize = 0;
    if (targetDir) {
      dirSize =
        targetDir.files.reduce((acc, curr) => {
          acc += curr.size;
          return acc;
        }, 0) ?? 0;
    }

    targetDir?.directories.forEach((dir) => {
      dirSize += this.calculateDirSize(dir);
    });
    return dirSize;
  }

  public calculateDirSizes() {
    let nodesToCalculate = [this._root];
    while (nodesToCalculate.length) {
      const numberOfNodesToProcess = nodesToCalculate.length;
      nodesToCalculate.forEach((node) => {
        if (node) {
          node.size = this.calculateDirSize(node);
          nodesToCalculate.push(...node.directories);
        }
      });
      nodesToCalculate.splice(0, numberOfNodesToProcess);
    }
  }

  public filterNodes(fn: (node: Directory) => boolean) {
    const resultNodes = [] as Directory[];
    let nodesToCheck = [this._root];
    while (nodesToCheck.length) {
      const numberOfNodesToProcess = nodesToCheck.length;
      nodesToCheck.forEach((node) => {
        if (node) {
          if (fn(node)) {
            resultNodes.push(node);
          }
          nodesToCheck.push(...node.directories);
        }
      });
      nodesToCheck.splice(0, numberOfNodesToProcess);
    }
    return resultNodes;
  }
}
