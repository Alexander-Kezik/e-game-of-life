import { FC, FormEvent, KeyboardEvent, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import { PREPARED_PROMPT } from "@/app/lib/constants/prompt.constants";

interface IProps {
  sendMessage: (message: string) => void;
  disabled: boolean;
}

const Input: FC<IProps> = ({ sendMessage, disabled }) => {
  const [input, setInput] = useState<string>("");

  const sendAndClear = () => {
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendAndClear();
    }
  };

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendAndClear();
  };

  return (
    <div className="flex justify-center w-full mt-16 fixed bottom-0 bg-white">
      <form onSubmit={handleSendMessage} className="shadow-lg border-[1px] rounded-lg p-4 flex items-end gap-4 w-1/2">
        <textarea
          value={input}
          onKeyDown={handleKeyDown}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={disabled}
          className="outline-none max-h-200 resize-none w-full border-none"
        ></textarea>
        <button
          className={clsx(
            "rounded-md w-12 h-10 border-none flex justify-center items-center",
            disabled && "cursor-not-allowed bg-red-500",
            !disabled && "bg-success cursor-pointer",
          )}
          disabled={disabled}
        >
          <Image src="/send_icon.png" alt="send prompt" width={20} height={20} />
        </button>
        <button
          type="button"
          onClick={() => sendMessage(PREPARED_PROMPT)}
          className={clsx(
            "rounded-md w-40 h-10 border-none flex justify-center items-center text-white",
            disabled && "cursor-not-allowed bg-red-500",
            !disabled && "bg-amber-500 cursor-pointer",
          )}
          disabled={disabled}
        >
          PLAY GAME
        </button>
      </form>
    </div>
  );
};

export default Input;
