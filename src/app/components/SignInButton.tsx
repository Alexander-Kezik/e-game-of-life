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
          className="p-2 border-none cursor-pointer rounded-md text-white bg-red-600">
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => signIn()}
          className="p-2 border-none cursor-pointer rounded-md text-white bg-green-500">
          Sign In
        </button>
      )}
    </>
  );
};

export default SignInButton;