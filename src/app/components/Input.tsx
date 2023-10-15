import { FC, FormEvent, KeyboardEvent, useState } from "react";
import Image from "next/image";

import { PREPARED_PROMPT } from "@/app/lib/constants/prompt.constants";
import SendBtn from "@/app/components/SendBtn";

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
        <SendBtn disabled={disabled} className="w-10 h-10">
          <Image src="/send_icon.png" alt="send prompt" width={20} height={20} />
        </SendBtn>
      </form>
      <SendBtn disabled={disabled} onClick={() => sendMessage(PREPARED_PROMPT)} className="p-4 ml-2">
        PLAY GAME
      </SendBtn>
    </div>
  );
};

export default Input;
