import { NextRequest, NextResponse } from "next/server";

import { xata } from "@/database/xataClient";
import { XataFile } from "@xata.io/client";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;
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
}
