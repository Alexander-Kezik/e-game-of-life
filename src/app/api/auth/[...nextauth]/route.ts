import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/constants/auth.constants";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
