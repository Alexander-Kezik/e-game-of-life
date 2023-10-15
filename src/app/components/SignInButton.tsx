"use client";

import { FC } from "react";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import clsx from "clsx";

interface IProps {
  session: Session | null;
}

const SignInButton: FC<IProps> = ({ session }) => {
  const handleAuth = () => session ? signOut() : signIn();

  return (
    <button
      onClick={handleAuth}
      className={clsx("btn-main", session ? "bg-cancel" : "bg-success")}
    >
      {session ? "Sign Out" : "Sign In"}
    </button>
  );
};

export default SignInButton;
