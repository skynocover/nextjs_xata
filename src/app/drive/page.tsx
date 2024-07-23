// app/drive/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FileList from "@/components/FileList";
import { xata } from "@/database/xataClient";
import FolderList from "@/components/FolderList";
import UploadButton from "@/components/UploadButton";
import CreateFolderButton from "@/components/CreateFolderButton";

export default async function DrivePage({
  searchParams,
}: {
  searchParams: { folder?: string };
}) {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const currentFolderId = searchParams.folder || null;

  const folders = await xata.db.folders
    .filter({
      ownerId: session.user.id,
      parentId: currentFolderId,
    })
    .getMany();

  const files = await xata.db.files
    .filter({
      ownerId: session.user.id,
      folderId: currentFolderId,
    })
    .getMany();

  const currentFolder = currentFolderId
    ? await xata.db.folders.read(currentFolderId)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {currentFolder ? currentFolder.name : "My Drive"}
      </h1>
      <div className="flex space-x-4 mb-6">
        <UploadButton
          userId={session.user.id || ""}
          folderId={currentFolderId || ""}
        />
        <CreateFolderButton
          userId={session.user.id || ""}
          parentFolderId={currentFolderId}
        />
      </div>
      <FolderList folders={folders} />
      <FileList files={files} />
    </div>
  );
}
