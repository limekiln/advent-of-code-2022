import { readFileSync } from "fs";

export const readInput = (inputPath: string) => readFileSync(inputPath, "utf8");
