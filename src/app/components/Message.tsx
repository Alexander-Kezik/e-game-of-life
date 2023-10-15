import { FC } from "react";
import clsx from "clsx";

import { Creator } from "@/app/lib/types/creator.enum";
import { isSavedMsg } from "@/app/lib/utils/isSavedMsg";
import { TO_DRAW_REGEX } from "@/app/lib/constants/regex.constants";
import { useGPTMessages } from "@/app/hooks/useGPTMessages";
import GameOfLife from "@/app/components/GameOfLife";

interface IProps {
  role: Creator;
  text: string;
  id?: string;
  owner?: string | null | undefined;
  isErrorMessage?: boolean;
  requiresDrawing?: boolean;
}

const Message: FC<IProps> = ({ role, text, owner, isErrorMessage, requiresDrawing, id }) => {
  const { localStorageMessages } = useGPTMessages(owner || "");
  const match: RegExpExecArray | null = TO_DRAW_REGEX.exec(text);

  return (
    <div className={clsx("border-b border-gray-300", role === Creator.ASSISTANT && "bg-assistant")}>
      <div
        className={clsx(
          "flex w-[740px] justify-between px-4 py-6",
          isErrorMessage && "shadow-[inset_0_0_1.5em_red] rounded-md",
        )}
      >
        {role === Creator.ASSISTANT && <div className="msg-item bg-assistant-icon">GPT</div>}
        {role === Creator.USER && <div className="msg-item bg-me-icon">ME</div>}
        <pre className="w-[653px] whitespace-pre-wrap overflow-auto">{text}</pre>
      </div>
      {localStorageMessages && !isSavedMsg(localStorageMessages, id) && requiresDrawing && (
        <div className="flex justify-center">
          <GameOfLife match={match} />
        </div>
      )}
    </div>
  );
};

export default Message;
