"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

interface IFile {
  id: string;
  name: string;
  signedUrl?: string;
}

type FileListProps = {
  files: IFile[];
};

export default function FileList({ files }: FileListProps) {
  const router = useRouter();
  const onDelete = async (id: string) => {
    try {
      await axios.delete("/api/files?id=" + id);
      router.refresh();
    } catch (error) {
      console.log({ error });
    }
  };

  const onView = async (signedUrl: string | undefined) => {
    if (signedUrl) {
      window.open(signedUrl, "_blank");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Files</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <li
            key={file.id}
            className="relative block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center truncate">
                <svg
                  className="w-6 h-6 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="truncate text-black">{file.name}</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => onView(file.signedUrl)} // 新增查看按鈕
                  className="text-green-500 hover:text-green-700 mr-2"
                  title="View file"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12h.01M12 12h.01M9 12h.01M8 16h8M21 12c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 11 2s10 4.477 10 10z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(file.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete file"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
