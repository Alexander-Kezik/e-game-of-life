"use client";

import { createContext, FC, ReactNode } from "react";
import { Session } from "next-auth";

interface IProps {
  children: ReactNode;
  session: Session | null;
}

export const AuthContext = createContext<{
  session: Session | null;
}>({ session: null });

const NextAuthProvider: FC<IProps> = ({ children, session }) => {
  return <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>;
};

export default NextAuthProvider;
