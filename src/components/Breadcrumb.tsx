import Link from "next/link";

type BreadcrumbProps = {
  userName: string | null | undefined;
  path: { id: string; name: string }[];
};

export default function Breadcrumb({ path, userName }: BreadcrumbProps) {
  return (
    <nav className="text-sm breadcrumbs">
      <ul className="flex">
        <li>
          <Link href="/drive" className="text-blue-500 hover:underline">
            {userName}'s Drive
          </Link>
        </li>
        {path.map((folder, index) => (
          <li key={folder.id}>
            <span className="mx-2">/</span>
            {index === path.length - 1 ? (
              <span>{folder.name}</span>
            ) : (
              <Link
                href={`/drive?folder=${folder.id}`}
                className="text-blue-500 hover:underline"
              >
                {folder.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
