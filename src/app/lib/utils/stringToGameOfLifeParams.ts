/**
 * Converts a string into Game of Life parameters.
 *
 * @param arr - A string representing the initial state of the Game of Life.
 * @param iterations - A string representing the number of iterations for the game.
 * @returns An object containing the Game of Life parameters.
 */
export const stringToGameOfLifeParams = (arr: string, iterations: string) => {
  const rows: string[] = arr.trim().split("\n");
  const initialGameOfLifeState: (0 | 1)[][] = rows.map(row => row.split("").map(
    item => (parseInt(item, 10) as 0 | 1)),
  );

  const iterationsCount: number = parseInt(iterations, 10);

  return { initialGameOfLifeState, iterationsCount }
};
