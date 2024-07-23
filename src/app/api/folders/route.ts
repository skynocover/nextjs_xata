// app/api/folders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { xata } from "@/database/xataClient";

export async function POST(req: NextRequest) {
  const { name, userId, parentFolderId } = await req.json();

  if (!name || !userId) {
    return NextResponse.json(
      { error: "Folder name and userId are required" },
      { status: 400 }
    );
  }

  try {
    const newFolder = await xata.db.folders.create({
      name,
      ownerId: userId,
      parentId: parentFolderId ? parentFolderId : null,
    });

    return NextResponse.json({
      message: "Folder created successfully",
      folder: newFolder,
    });
  } catch (error) {
    console.error("Folder creation error:", error);
    return NextResponse.json(
      { error: "Folder creation failed" },
      { status: 500 }
    );
  }
}
