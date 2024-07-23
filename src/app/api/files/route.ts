// pages/api/files.ts
import { xata } from "@/database/xataClient";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";
import { auth } from "@/auth";

export interface NextAuthRequest extends NextRequest {
  auth: Session | null;
}

const handleAuth = (
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

export const GET = handleAuth(async (req, res) => {
  const userId = req.auth?.user?.id;
  try {
    const files = await xata.db.files.filter({ ownerId: userId }).getAll();
    return NextResponse.json(files, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching todos", error: error.message },
      { status: 500 }
    );
  }
});

export const POST = handleAuth(async (req, res) => {
  const userId = req.auth?.user?.id;
  try {
    const body = await req.json();
    const { name, folderId, content } = body;
    const newFile = await xata.db.files.create({
      name,
      folderId,
      content,
      ownerId: userId,
    });

    return NextResponse.json(newFile, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating todo", error: error.message },
      { status: 500 }
    );
  }
});
