import OpenAI, { APIError } from "openai";
import { Stream } from "openai/streaming";
import { ChatCompletionChunk } from "openai/resources/chat/completions";
import { getServerSession, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/app/lib/constants/auth.constants";

const openai: OpenAI = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

type RequestData = {
  currentModel: string;
  message: string;
};

export async function POST(request: NextRequest, response: NextResponse) {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    return new Response("Not authorized", { status: 401 });
  }

  const { message } = (await request.json()) as RequestData;

  if (!message) {
    return new Response("No message in the request", { status: 400 });
  }

  try {
    const completion: Stream<ChatCompletionChunk> = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      stream: true,
    });

    const stream: ReadableStream<Uint8Array> = new ReadableStream({
      async start(controller: ReadableStreamDefaultController<Uint8Array>) {
        const encoder: TextEncoder = new TextEncoder();

        for await (const part of completion) {
          const text: string = part.choices[0]?.delta.content ?? "";
          const chunk: Uint8Array = encoder.encode(text);
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    return new Response(stream);
  } catch (e) {
    if (e instanceof APIError) {
      const status = e.status;
      const message = (e.error as { message: string }).message;

      switch (status) {
        case 400:
          return NextResponse.json(message, { status });
        case 401:
          return NextResponse.json(message, { status });
        case 429:
          return NextResponse.json(message, { status });
        case 500:
          return NextResponse.json(message, { status });
        case 503:
          return NextResponse.json(message, { status });
        default:
          return NextResponse.json("Unexpected error, try again later.", { status });
      }
    }

    return NextResponse.json("Unexpected error, try again later.", { status: 500 });
  }
}
