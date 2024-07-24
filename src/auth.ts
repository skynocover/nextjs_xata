import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
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

export interface NextAuthRequest extends NextRequest {
  auth: Session | null;
}

export const handleAuth = (
  handler: (req: NextAuthRequest, res: any) => Promise<NextResponse>
) => {
  return auth(async (req, res) => {
    if (!req.auth) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    return handler(req, res);
  });
};
