import { useEffect, useState } from "react";

import { Message } from "@/app/lib/types/message.type";
import { TO_DRAW_REGEX } from "@/app/lib/constants/regex.constants";
import { getItem, resetItems, setItem } from "@/app/lib/utils/localStorageHelpers";
import { getAssistantInitialMsg, getUserInitialMsg } from "@/app/lib/utils/initialMessages";
import { GPT_MESSAGES_KEY } from "@/app/lib/constants/localStorageKeys.constants";
import { toRequiresDrawingFalse, toValidGPTHistory } from "@/app/lib/utils/transformers";
import { VERCEL_TIMEOUT_IN_MILLISEC } from "@/app/lib/constants/vercel.constants";

interface GPTMessagesHookResult {
  messages: Message[];
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  isLoading: boolean;
  error: string;
}

/**
 * Custom hook for managing GPT messages, including user input, responses, and initial local storage.
 *
 * @param {string} email - The user's email for message ownership.
 * @returns {GPTMessagesHookResult} An object with properties and functions related to GPT messages handling.
 */
export function useGPTMessages(email: string): GPTMessagesHookResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const initialMessages: Message[] = getItem(GPT_MESSAGES_KEY) || [];
    const filteredMessages: Message[] = initialMessages.filter(message => message.owner === email);

    setMessages(toRequiresDrawingFalse(filteredMessages));
  }, [email]);

  const clearMessages = () => {
    resetItems(GPT_MESSAGES_KEY);
    setMessages([]);
  };

  const readStream = async (response: Response, userMessage: Message) => {
    const data: ReadableStream<Uint8Array> | null = response.body;
    if (!data) return;

    const reader: ReadableStreamDefaultReader<Uint8Array> = data.getReader();
    const decoder: TextDecoder = new TextDecoder();

    if (!response.ok) {
      const { value } = await reader.read();
      setError(JSON.parse(decoder.decode(value)));
      setIsLoading(false);

      return;
    }

    const currentResponse: Message = getAssistantInitialMsg(email);
    setMessages(prev => [...prev, userMessage]);

    const timer = setTimeout(() => {
      setError("The maximum response waiting time has been exceeded");
      setIsLoading(false);

      reader.cancel();
    }, VERCEL_TIMEOUT_IN_MILLISEC);

    while (true) {
      const { value, done } = await reader.read();
      const chunkValue = decoder.decode(value);

      currentResponse.content += chunkValue;
      setMessages(prev => [...prev.slice(0, -1), currentResponse]);

      if (done) {
        clearTimeout(timer);
        break;
      }
    }

    if (TO_DRAW_REGEX.exec(currentResponse.content)) {
      currentResponse.requiresDrawing = true;
      setMessages(prev => [...toRequiresDrawingFalse(prev.slice(0, -1)), currentResponse]);
    }

    setItem(GPT_MESSAGES_KEY, [...messages, userMessage, currentResponse]);
    setIsLoading(false);
  };

  const sendMessage = async (message: string) => {
    if (!message) return;

    setIsLoading(true);
    setError("");

    const userMessage: Message = getUserInitialMsg(message, email);
    setMessages(prev => [...prev, userMessage]);

    const response: Response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        history: toValidGPTHistory(messages),
        message,
      }),
    });

    await readStream(response, userMessage);
  };

  return { messages, sendMessage, isLoading, error, clearMessages };
}
