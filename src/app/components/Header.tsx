import { FC } from "react";
import { getServerSession, Session } from "next-auth";

import SignInButton from "@/app/components/SignInButton";
import { AUTH_OPTIONS } from "@/app/lib/constants/auth.constants";

const Header: FC = async () => {
  const session: Session | null = await getServerSession(AUTH_OPTIONS);

  return (
    <nav className="h-50 bg-cyan-300 p-3">
      <div className="w-[80%] mx-auto">
        <ul className="flex justify-end">
          <SignInButton session={session} />
        </ul>
      </div>
    </nav>
  );
};

export default Header;