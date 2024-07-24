"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type CreateFolderButtonProps = {
  parentFolderId: string | null;
};

export default function CreateFolderButton({
  parentFolderId,
}: CreateFolderButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [folderName, setFolderName] = useState("");
  const router = useRouter();

  const handleCreateFolder = async () => {
    if (!folderName) return;

    setIsCreating(true);

    try {
      const { data } = await axios.post("/api/folders", {
        name: folderName,
        parentFolderId,
      });

      if (data) {
        setFolderName("");
        router.refresh();
      }
    } catch (error) {
      console.error("Folder creation error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="New folder name"
        className="border rounded px-2 py-1 text-black"
      />
      <button
        onClick={handleCreateFolder}
        disabled={isCreating}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
      >
        {isCreating ? "Creating..." : "Create Folder"}
      </button>
    </div>
  );
}
