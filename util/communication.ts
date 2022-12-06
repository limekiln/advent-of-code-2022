export const convertStringToArray = (inputString: string) =>
  inputString.split("");

export const getSignalWindow = (
  buffer: string[],
  startIndex: number,
  windowSize = 4
) => buffer.slice(startIndex, startIndex + windowSize);

export const checkIfFlag = (bufferWindow: string[]) =>
  bufferWindow.length === [...new Set(bufferWindow)].length;
