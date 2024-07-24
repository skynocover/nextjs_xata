import { xata } from "@/database/xataClient";
import { NextResponse } from "next/server";
import { XataFile } from "@xata.io/client";

import { handleAuth } from "@/auth";

export const POST = handleAuth(async (req, res) => {
  const userId = req.auth?.user?.id;
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const folderId = formData.get("folderId") as string | null;

  if (!file || !userId) {
    return NextResponse.json(
      { error: "File and userId are required" },
      { status: 400 }
    );
  }

  try {
    const encodedFileName = encodeURIComponent(file.name);
    const newFile = new File([file], encodedFileName, { type: file.type });

    await xata.db.files.create({
      content: [XataFile.fromBlob(newFile)],
      name: file.name,
      folderId: folderId ? folderId : null,
      ownerId: userId,
    });

    return NextResponse.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
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
