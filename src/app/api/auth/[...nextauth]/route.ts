import NextAuth from "next-auth";

import { AUTH_OPTIONS } from "@/app/lib/constants/auth.constants";

const handler = NextAuth(AUTH_OPTIONS);

export { handler as GET, handler as POST };
