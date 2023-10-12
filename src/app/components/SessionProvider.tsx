"use client";

import { SessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const NextAuthProvider: FC<IProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;
