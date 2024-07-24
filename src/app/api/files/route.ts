import { xata } from "@/database/xataClient";
import { NextResponse } from "next/server";
import { handleAuth } from "@/auth";

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

export const DELETE = handleAuth(async (req, res) => {
  const userId = req.auth?.user?.id;
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("id");

    if (!fileId) {
      return NextResponse.json(
        { message: "File ID is required" },
        { status: 400 }
      );
    }

    const file = await xata.db.files.read(fileId);

    if (!file) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    if (file.ownerId !== userId) {
      return NextResponse.json(
        { message: "Unauthorized to delete this file" },
        { status: 403 }
      );
    }

    await xata.db.files.delete(fileId);

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error deleting file", error: error.message },
      { status: 500 }
    );
  }
});
