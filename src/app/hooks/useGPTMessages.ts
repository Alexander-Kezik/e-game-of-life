import { useEffect, useState } from "react";
import { v4 } from "uuid";

import { Message } from "@/app/lib/types/message.type";
import { TO_DRAW_REGEX } from "@/app/lib/constants/regex.constants";
import { Creator } from "@/app/lib/types/creator.enum";

interface GPTMessagesHookResult {
  messages: Message[];
  handleSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
  localStorageMessages: Message[] | null;
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
  const [localStorageMessages, setLocalStorageMessages] = useState<Message[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const savedMessages: string | null = localStorage.getItem("gpt-messages");
    const initialMessages: Message[] = savedMessages ? JSON.parse(savedMessages) : [];
    setLocalStorageMessages(initialMessages);

    setMessages(initialMessages.filter(message => message.owner === email));
  }, [email]);

  const handleSubmit = async (message: string) => {
    setIsLoading(true);
    setError("");

    if (!message) return;

    const userMessage: Message = {
      id: v4(),
      content: message,
      from: Creator.USER,
      owner: email,
      requiresDrawing: false,
    };

    setMessages(prev => [...prev, userMessage]);

    const response: Response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

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

    const currentResponse: Message = {
      id: v4(),
      from: Creator.ASSISTANT,
      content: "",
      owner: email,
      requiresDrawing: false,
    };

    setMessages(prev => [...prev, userMessage]);

    while (true) {
      const { value, done } = await reader.read();
      const chunkValue = decoder.decode(value);

      currentResponse.content += chunkValue;
      setMessages(prev => [...prev.slice(0, -1), currentResponse]);

      if (done) break;
    }

    if (TO_DRAW_REGEX.exec(currentResponse.content)) {
      currentResponse.requiresDrawing = true;
    }

    setMessages(prev => [...prev.slice(0, -1), currentResponse]);
    setIsLoading(false);
    localStorage.setItem("gpt-messages", JSON.stringify([...messages, userMessage, currentResponse]));
  };

  return { messages, handleSubmit, isLoading, localStorageMessages, error };
}
