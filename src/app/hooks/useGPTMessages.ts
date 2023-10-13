import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

import { Message } from "@/app/lib/types/message.type";
import { TO_DRAW_REGEX } from "@/app/lib/constants/regex.constants";
import { Creator } from "@/app/lib/types/creator.enum";

interface GPTMessagesHookResult {
  messageInput: RefObject<HTMLTextAreaElement | null>;
  messages: Message[];
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
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
  const messageInput = useRef<HTMLTextAreaElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [localStorageMessages, setLocalStorageMessages] = useState<Message[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const savedMessages: string | null = localStorage.getItem("gpt-messages");
    const initialMessages: Message[] = savedMessages ? JSON.parse(savedMessages) : [];
    setLocalStorageMessages(initialMessages);

    setMessages(initialMessages.filter(message => message.owner === email));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const message: string | undefined = messageInput.current?.value;
    if (!message) return;

    const userMessage: Message = {
      id: v4(),
      content: message,
      from: Creator.USER,
      owner: email,
      requiresDrawing: false,
    };

    setMessages(prev => [...prev, userMessage]);
    messageInput.current!.value = "";

    const response: Response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
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
      // isDone: false,
      from: Creator.ASSISTANT,
      content: "",
      owner: email,
      requiresDrawing: false,
    };

    setMessages(prev => [...prev, userMessage]);

    while (true) {
      const { value, done: doneReading } = await reader.read();
      const chunkValue = decoder.decode(value);

      currentResponse.content += chunkValue;
      setMessages(prev => [...prev.slice(0, -1), currentResponse]);

      if (doneReading) break;
    }

    const match: RegExpExecArray | null = TO_DRAW_REGEX.exec(currentResponse.content);
    // currentResponse.isDone = true;

    if (match) {
      currentResponse.requiresDrawing = true;
    }

    setMessages(prev => [...prev.slice(0, -1), currentResponse]);
    setIsLoading(false);
    localStorage.setItem("gpt-messages", JSON.stringify([...messages, userMessage, currentResponse]));
  };

  return { messageInput, messages, handleSubmit, isLoading, localStorageMessages, error };
}
