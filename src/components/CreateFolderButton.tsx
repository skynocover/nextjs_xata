// components/CreateFolderButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CreateFolderButtonProps = {
  userId: string;
  parentFolderId: string | null;
};

export default function CreateFolderButton({
  userId,
  parentFolderId,
}: CreateFolderButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [folderName, setFolderName] = useState("");
  const router = useRouter();

  const handleCreateFolder = async () => {
    if (!folderName) return;

    setIsCreating(true);

    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: folderName,
          userId,
          parentFolderId,
        }),
      });

      if (response.ok) {
        setFolderName("");
        router.refresh();
      } else {
        console.error("Folder creation failed");
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
        className="border rounded px-2 py-1"
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
