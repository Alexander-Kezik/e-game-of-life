"use client";

import { FC, useContext } from "react";

import { useGPTMessages } from "@/app/hooks/useGPTMessages";
import Message from "@/app/components/Message";
import { AuthContext } from "@/app/components/AuthProvider";
import Input from "@/app/components/Input";
import { Creator } from "@/app/lib/types/creator.enum";
import { Message as MessageType } from "@/app/lib/types/message.type";
import ClearHistoryBtn from "@/app/components/ClearHistoryBtn";

const GPTPage: FC = () => {
  const { session } = useContext(AuthContext);
  const { isLoading, error, sendMessage, messages, clearMessages } = useGPTMessages(session?.user?.email || "");

  return (
    <main className="pb-20">
      {session?.user?.email ? (
        <>
          <ClearHistoryBtn clearMessages={clearMessages} />
          <div className="w-full flex flex-col items-center gap-3 pt-6">
            {messages.map(({ role, content, requiresDrawing, id }: MessageType) => (
              <Message
                role={role}
                text={content}
                key={id}
                id={id}
                owner={session?.user?.email}
                requiresDrawing={requiresDrawing}
              />
            ))}
            {error && <Message isErrorMessage text={error} role={Creator.ASSISTANT} />}
          </div>
          <Input sendMessage={sendMessage} disabled={isLoading} />
        </>
      ) : (
        <h1 className="p-12 text-5xl text-center font-bold">You need to sign in</h1>
      )}
    </main>
  );
};

export default GPTPage;
