"use client";

import { FC } from "react";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

interface IProps {
  session: Session | null;
}

const SignInButton: FC<IProps> = ({ session }) => {
  return (
    <>
      {session ? (
        <button
          onClick={() => signOut()}
          className="btn-main bg-cancel">
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => signIn()}
          className="btn-main bg-success">
          Sign In
        </button>
      )}
    </>
  );
};

export default SignInButton;