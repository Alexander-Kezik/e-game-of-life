import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
  secret: process.env.AUTH_OPTIONS_KEY,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };