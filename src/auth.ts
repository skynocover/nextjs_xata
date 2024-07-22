import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { XataAdapter } from "@auth/xata-adapter";
import { XataClient } from "@/database/xata"; // Or wherever you've chosen for the generated client

export const { auth, handlers, signIn, signOut } = NextAuth({
  // adapter: XataAdapter(xataClient),
  providers: [Google],
  logger: {
    // error: (code, ...message) => {
    //   console.error(code, message);
    // },
    // warn: (code, ...message) => {
    //   console.warn(code, JSON.stringify(message));
    // },
    // debug: (code, ...message) => {
    //   console.debug(code, JSON.stringify(message));
    // },
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
