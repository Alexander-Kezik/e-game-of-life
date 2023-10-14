"use client";

import { FC, useContext } from "react";

import { useGPTMessages } from "@/app/hooks/useGPTMessages";
import Message from "@/app/components/Message";
import { AuthContext } from "@/app/components/AuthProvider";
import Input from "@/app/components/Input";
import { Creator } from "@/app/lib/types/creator.enum";
import { Message as MessageType } from "@/app/lib/types/message.type";

const GPTPage: FC = () => {
  const { session } = useContext(AuthContext);
  const { isLoading, error, handleSubmit, messages } = useGPTMessages(session?.user?.email || "");

  return (
    <main className="pb-20">
      {session?.user?.email ? (
        <>
          <div className="w-full flex flex-col items-center gap-3 pt-6">
            {messages.map(({ from, content, requiresDrawing, id }: MessageType) => (
              <Message
                from={from}
                text={content}
                key={id}
                id={id}
                owner={session?.user?.email}
                requiresDrawing={requiresDrawing}
              />
            ))}
            {error && <Message isErrorMessage text={error} from={Creator.ASSISTANT} />}
          </div>
          <Input handleSubmit={handleSubmit} disabled={isLoading} />
        </>
      ) : (
        <h1 className="p-12 text-5xl text-center font-bold">You need to sign in</h1>
      )}
    </main>
  );
};

export default GPTPage;
