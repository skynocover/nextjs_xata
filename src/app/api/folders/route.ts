import { NextResponse } from "next/server";

import { xata } from "@/database/xataClient";
import { handleAuth } from "@/auth";

export const POST = handleAuth(async (req) => {
  const userId = req.auth?.user?.id;
  const { name, parentFolderId } = await req.json();

  if (!name) {
    return NextResponse.json(
      { error: "Folder name required" },
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
});

export const DELETE = handleAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("id");
  const userId = req.auth?.user?.id;

  if (!folderId || !userId) {
    return NextResponse.json(
      { error: "Folder ID and user ID are required" },
      { status: 400 }
    );
  }

  try {
    // 檢查資料夾是否存在且屬於該用戶
    const folder = await xata.db.folders.read(folderId);
    if (!folder || folder.ownerId !== userId) {
      return NextResponse.json(
        { error: "Folder not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // 遞迴函數來刪除資料夾及其內容
    const deleteFolder = async (folderId: string): Promise<void> => {
      // 刪除該資料夾下的所有文件
      const filesToDelete = await xata.db.files.filter({ folderId }).getAll();
      for (const file of filesToDelete) {
        await xata.db.files.delete(file.xata_id);
      }

      // 獲取所有子資料夾
      const subFolders = await xata.db.folders
        .filter({ parentId: folderId })
        .getAll();

      // 遞迴刪除所有子資料夾
      for (const subFolder of subFolders) {
        await deleteFolder(subFolder.xata_id);
      }

      // 刪除當前資料夾
      await xata.db.folders.delete(folderId);
    };

    // 執行刪除操作
    await deleteFolder(folderId);

    return NextResponse.json({
      message: "Folder and its contents deleted successfully",
    });
  } catch (error) {
    console.error("Folder deletion error:", error);
    return NextResponse.json(
      { error: "Folder deletion failed" },
      { status: 500 }
    );
  }
});
