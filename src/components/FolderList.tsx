// components/FolderList.tsx
import Link from "next/link";
import { FoldersRecord } from "@/database/xata";

type FolderListProps = {
  folders: FoldersRecord[];
};

export default function FolderList({ folders }: FolderListProps) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Folders</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <li key={folder.xata_id}>
            <Link
              href={`/drive?folder=${folder.xata_id}`}
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
          </li>
        ))}
      </ul>
    </div>
  );
}
