import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

import FileList from "@/components/FileList";
import { xata } from "@/database/xataClient";
import FolderList from "@/components/FolderList";
import UploadButton from "@/components/UploadButton";
import CreateFolderButton from "@/components/CreateFolderButton";
import Breadcrumb from "@/components/Breadcrumb";
import { XataClient } from "@/database/xata";

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

  const { files, folders } = await getFoldersAndFiles(
    xata,
    session,
    currentFolderId
  );

  const currentFolder = currentFolderId
    ? await xata.db.folders.read(currentFolderId)
    : null;

  const folderPath = currentFolder
    ? await getFolderPath(currentFolder.xata_id)
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {currentFolder ? currentFolder.name : "Root"}
          </h1>
          <Breadcrumb path={folderPath} userName={session.user.name} />
        </div>
        <div className="text-right"></div>
      </div>
      <div className="flex space-x-4 mb-6">
        <UploadButton
          userId={session.user.id || ""}
          folderId={currentFolderId || ""}
        />
        <CreateFolderButton parentFolderId={currentFolderId} />
      </div>
      <FolderList
        folders={folders.map((folder) => {
          return {
            id: folder.xata_id,
            name: folder.name || "",
          };
        })}
      />
      <FileList
        files={files.map((file) => {
          return {
            id: file.xata_id,
            name: file.name || "",
            signedUrl: file.content?.[0].signedUrl,
          };
        })}
      />
    </div>
  );
}

const getFolderPath = async (
  folderId: string
): Promise<{ id: string; name: string }[]> => {
  const path: { id: string; name: string }[] = [];
  let currentFolder = await xata.db.folders.read(folderId);

  while (currentFolder) {
    path.unshift({ id: currentFolder.xata_id, name: currentFolder.name || "" });
    currentFolder = currentFolder.parentId
      ? await xata.db.folders.read(currentFolder.parentId)
      : null;
  }

  return path;
};

type Filter = {
  ownerId: string;
  [key: string]: any;
};

// 創建一個輔助函數來生成過濾器
const createFilter = (
  ownerId: string,
  parentIdOrFolderId: string | null,
  idField: string
): Filter => {
  const filter: Filter = { ownerId };
  if (parentIdOrFolderId === null) {
    filter[`$notExists`] = idField;
  } else {
    filter[idField] = parentIdOrFolderId;
  }
  return filter;
};

// 主函數
const getFoldersAndFiles = async (
  xata: XataClient,
  session: Session,
  currentFolderId: string | null
) => {
  const folderFilter = createFilter(
    session.user!.id!,
    currentFolderId,
    "parentId"
  );
  const fileFilter = createFilter(
    session.user!.id!,
    currentFolderId,
    "folderId"
  );

  const [folders, files] = await Promise.all([
    xata.db.folders.select(["name", "xata_id"]).filter(folderFilter).getMany(),
    xata.db.files
      .select(["content.signedUrl", "content.id", "name"])
      .filter(fileFilter)
      .getMany(),
  ]);

  return { folders, files };
};
