import { Message } from "@/app/lib/types/message.type";

/**
 * Converts a string into Game of Life parameters.
 *
 * @param {string} arr - A string representing the initial state of the Game of Life.
 * @param {string} iterations - A string representing the number of iterations for the game.
 * @returns { initialGameOfLifeState, iterationsCount } - object containing the Game of Life parameters.
 */
export const stringToGameOfLifeParams = (
  arr: string,
  iterations: string,
): {
  initialGameOfLifeState: (0 | 1)[][];
  iterationsCount: number;
} => {
  const rows: string[] = arr.trim().split("\n");
  const initialGameOfLifeState: (0 | 1)[][] = rows.map(row =>
    row
      .replace(/\s/g, "")
      .split("")
      .map(item => parseInt(item, 10) as 0 | 1),
  );

  const iterationsCount: number = parseInt(iterations, 10);

  return { initialGameOfLifeState, iterationsCount };
};

/**
 * Converts an array of message objects into a valid GPT (Generative Pre-trained Transformer) history.
 * It removes the last message in the input array and extracts the 'role' and 'content' properties
 * of each message to create a new array of GPT message objects.
 *
 * @param {Message[]} messages - An array of message objects to be processed.
 * @returns { role; content } - An array of GPT message objects with 'role' and 'content' properties.
 */
export const toValidGPTHistory = (messages: Message[]): { role: string; content: string }[] => {
  return [
    ...messages.slice(0, -1).map(({ role, content }) => ({
      role,
      content,
    })),
  ];
};

/**
 * Removes the 'requiresDrawing' property from an array of messages.
 *
 * @param {Message[]} messages - An array of messages to process.
 * @returns {Message[]} An array of messages with the 'requiresDrawing' property removed.
 */
export const toRequiresDrawingFalse = (messages: Message[]): Message[] =>
  messages.map(item => {
    const { requiresDrawing, ...rest } = item;
    return rest;
  });
