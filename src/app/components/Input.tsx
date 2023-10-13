import { FC, FormEvent, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

interface IProps {
  handleSubmit: (message: string) => void;
  disabled: boolean;
}

const Input: FC<IProps> = ({ handleSubmit, disabled }) => {
  const [input, setInput] = useState<string>("");

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(input);
    setInput("");
  };

  return (
    <div className="flex justify-center w-full mt-16">
      <form
        onSubmit={handleFormSubmit} className="shadow-lg border-[1px] rounded-lg p-4 flex items-end gap-4 w-1/2">
        <textarea
          value={input}
          name="prompt"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={disabled}
          className="outline-none max-h-200 resize-none w-full border-none">
        </textarea>
        <button
          className={
            clsx(
              "bg-success rounded-md w-10 h-10 border-none cursor-pointer flex justify-center items-center",
              disabled && "cursor-not-allowed",
            )}
          disabled={disabled}
        >
          <Image src="/send_icon.png" alt="send prompt" width={20} height={20} />
        </button>
      </form>
    </div>
  );
};

export default Input;
