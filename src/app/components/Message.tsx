import { FC, MutableRefObject, useEffect, useRef } from "react";
import clsx from "clsx";

import { Creator } from "@/app/lib/types/creator.enum";
import { useGameOfLife } from "@/app/hooks/useGameOfLife";
import { isSavedMsg } from "@/app/lib/utils/isSavedMsg";
import { TO_DRAW_REGEX } from "@/app/lib/constants/regex.constants";
import { stringToGameOfLifeParams } from "@/app/lib/utils/stringToGameOfLifeParams";
import { useGPTMessages } from "@/app/hooks/useGPTMessages";

interface IProps {
  from: Creator;
  text: string;
  id?: string;
  owner?: string | null | undefined;
  isErrorMessage?: boolean;
  requiresDrawing?: boolean;
  isDone?: boolean;
}

const Message: FC<IProps> = ({ from, text, owner, isErrorMessage, requiresDrawing, isDone, id }) => {
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement | null>(null);
  const { runGameOfLife } = useGameOfLife(canvasRef);
  const { localStorageMessages } = useGPTMessages(owner || "");

  const match: RegExpExecArray | null = TO_DRAW_REGEX.exec(text);

  useEffect(() => {
    if (
      localStorageMessages &&
      !isSavedMsg(localStorageMessages, id) &&
      match &&
      canvasRef.current &&
      from === Creator.ASSISTANT
    ) {
      console.log(match)
      const { iterationsCount, initialGameOfLifeState } = stringToGameOfLifeParams(match[1], match[2]);
      runGameOfLife(initialGameOfLifeState, iterationsCount);
    }
  }, [canvasRef.current, isDone]);

  return (
    <div
      className={clsx(
        "border-b border-gray-300 flex flex-col items-center",
        from === Creator.ASSISTANT && "bg-assistant",
      )}
    >
      <div
        className={clsx(
          "flex w-[740px] justify-between px-4 py-6",
          isErrorMessage && "shadow-[inset_0_0_1.5em_red] rounded-md",
        )}
      >
        {from === Creator.ASSISTANT && <div className="msg-item bg-assistant-icon">GPT</div>}
        {from === Creator.USER && <div className="msg-item bg-me-icon">ME</div>}
        <pre className="w-[653px] whitespace-pre-wrap overflow-auto">{text}</pre>
      </div>
      {
        localStorageMessages &&
        !isSavedMsg(localStorageMessages, id) &&
        from === Creator.ASSISTANT &&
        requiresDrawing && (
          <div>
            <canvas ref={canvasRef}></canvas>
          </div>
        )}
    </div>
  );
};

export default Message;
