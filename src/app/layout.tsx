import { FC, ReactNode } from "react";
import type { Metadata } from "next";
import { NextFont } from "next/dist/compiled/@next/font";
import { Roboto } from "next/font/google";
import { getServerSession, Session } from "next-auth";

import NextAuthProvider from "@/app/components/SessionProvider";
import Header from "@/app/components/Header";
import AuthProvider from "@/app/components/AuthProvider";
import { AUTH_OPTIONS } from "@/app/lib/constants/auth.constants";

import "./globals.css";

const robotoFont: NextFont = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GPT & Game Of Life",
  description: "GPT with opportunity to generate Game Of Life images",
};

interface IProps {
  children: ReactNode;
}

const RootLayout: FC<IProps> = async ({ children }) => {
  const session: Session | null = await getServerSession(AUTH_OPTIONS);

  return (
    <html lang="en">
    <body className={robotoFont.className}>
    <NextAuthProvider>
      <AuthProvider session={session}>
        <Header />
        {children}
      </AuthProvider>
    </NextAuthProvider>
    </body>
    </html>
  );
};

export default RootLayout;
