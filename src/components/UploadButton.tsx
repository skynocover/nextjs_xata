// components/UploadButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UploadButtonProps = {
  userId: string;
  folderId: string | null;
};

export default function UploadButton({ userId, folderId }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (folderId) {
      formData.append("folderId", folderId);
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label
        htmlFor="fileUpload"
        className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {isUploading ? "Uploading..." : "Upload File"}
      </label>
      <input
        id="fileUpload"
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
    </div>
  );
}
