import { v4 } from "uuid";

import { Creator } from "@/app/lib/types/creator.enum";
import { Message } from "@/app/lib/types/message.type";

export const getUserInitialMsg = (message: string, email: string): Message => {
  return {
    id: v4(),
    content: message,
    role: Creator.USER,
    owner: email,
  };
};

export const getAssistantInitialMsg = (email: string): Message => {
  return {
    id: v4(),
    role: Creator.ASSISTANT,
    content: "",
    owner: email,
    requiresDrawing: false,
  };
};
