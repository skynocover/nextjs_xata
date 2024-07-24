"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface IFolder {
  id: string;
  name: string;
}

type FolderListProps = {
  folders: IFolder[];
};

export default function FolderList({ folders }: FolderListProps) {
  const router = useRouter();
  const onDelete = async (id: string) => {
    try {
      await axios.delete("/api/folders?id=" + id);
      router.refresh();
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Folders</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <li key={folder.id} className="relative">
            <Link
              href={`/drive?folder=${folder.id}`}
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <span className="truncate text-black">{folder.name}</span>
              </div>
            </Link>
            <button
              onClick={() => onDelete(folder.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Delete folder"
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
          </li>
        ))}
      </ul>
    </div>
  );
}
