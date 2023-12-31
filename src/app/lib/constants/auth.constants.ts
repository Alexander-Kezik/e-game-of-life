import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const AUTH_OPTIONS: AuthOptions = {
  secret: process.env.AUTH_OPTIONS_KEY,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
};