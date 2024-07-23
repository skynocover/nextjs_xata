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
    async session({ session, token, user }) {
      // 確保 token.sub 包含用戶的 ID
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },

    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
