import { Message } from "@/app/lib/types/message.type";

/**
 * Checks if a message with the specified ID exists in the array of initial local storage messages.
 * @param {Message[]} initialMessages - An array of initial messages.
 * @param {string | undefined} id - The identifier of the message to check.
 * @returns {boolean} Returns true if a message with the specified ID is found, otherwise returns false.
 */
export const isSavedMsg = (initialMessages: Message[], id: string | undefined): boolean => {
  console.log(initialMessages)
  console.log(id)
  return initialMessages.some(msg => msg.id === id);
};
