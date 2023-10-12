"use client";

import { FC, useContext } from "react";
import { signIn } from "next-auth/react";

import { useGPTMessages } from "@/app/hooks/useGPTMessages";
import Message from "@/app/components/Message";
import { AuthContext } from "@/app/components/AuthProvider";
import Input from "@/app/components/Input";
import { Creator } from "@/app/lib/types/creator.enum";
import { Message as MessageType } from "@/app/lib/types/message.type";


const GPTPage: FC = () => {
  const { session } = useContext(AuthContext);

  if (!session?.user?.email) {
    return signIn();
  }

  const { isLoading, error, messageInput, handleSubmit, messages } = useGPTMessages("session.user.email");

  return (
    <main className="pb-12">
      <div className="w-full mx-2 flex flex-col items-start gap-3 pt-6 last:mb-6 md:mx-auto md:max-w-3xl">
        {messages.map(({ from, content, requiresDrawing, isDone, id }: MessageType) =>
          <Message
            from={from}
            text={content}
            key={id}
            id={id}
            owner={session?.user?.email}
            requiresDrawing={requiresDrawing}
            isDone={isDone}
          />,
        )}
        {error && <Message
          isErrorMessage
          text={error}
          from={Creator.ASSISTANT}
        />}
      </div>
      <Input input={messageInput} handleSubmit={handleSubmit} disabled={isLoading} />
    </main>
  );
};

export default GPTPage;
