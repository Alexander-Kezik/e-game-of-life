import { FC, FormEvent, MutableRefObject } from "react";
import Image from "next/image";
import clsx from "clsx";

interface IProps {
  input: MutableRefObject<HTMLTextAreaElement | null>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
}

const Input: FC<IProps> = ({ input, handleSubmit, disabled }) => {
  return (
    <div className="flex justify-center w-full mt-16">
      <form
        onSubmit={handleSubmit} className="shadow-lg border-[1px] rounded-lg p-4 flex items-end gap-4 w-1/2">
        <textarea
          ref={input}
          placeholder="Type a message..."
          disabled={disabled}
          className="outline-none max-h-200 resize-none w-full border-none">
        </textarea>
        <button
          className={
            clsx(
              "bg-green-500 rounded-md w-10 h-10 border-none cursor-pointer flex justify-center items-center",
              disabled && "bg-red-500",
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
