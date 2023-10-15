import OpenAI, { APIError } from "openai";
import { Stream } from "openai/streaming";
import { ChatCompletionChunk } from "openai/resources/chat/completions";
import { getServerSession, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { AUTH_OPTIONS } from "@/app/lib/constants/auth.constants";
import { Message } from "@/app/lib/types/message.type";

const openai: OpenAI = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

type RequestData = {
  message: string;
  history: Message[];
};

export async function POST(request: NextRequest, response: NextResponse) {
  const session: Session | null = await getServerSession(AUTH_OPTIONS);

  if (!session) {
    return NextResponse.json("Not authorized", { status: 401 });
  }

  const { message, history } = (await request.json()) as RequestData;

  if (!message) {
    return NextResponse.json("No message in the request", { status: 400 });
  }

  try {
    const completion: Stream<ChatCompletionChunk> = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [...history, { role: "user", content: message }],
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
      const status: number | undefined = e.status;
      const message: string = (e.error as { message: string }).message;

      switch (status) {
        case 400:
          return NextResponse.json("You can send 4096 tokens tops", { status });
        case 401:
          return NextResponse.json("Invalid API key", { status });
        case 429:
          return NextResponse.json("3 requests per minute allowed, try after 20 seconds", { status });
        case 500:
          return NextResponse.json("Server error while processing your request, try again later", { status });
        case 503:
          return NextResponse.json("GPT is currently unavailable or overloaded, try again later", { status });
        default:
          return NextResponse.json("Unexpected error, try again later.", { status });
      }
    }

    return NextResponse.json("Unexpected error, try again later.", { status: 500 });
  }
}
