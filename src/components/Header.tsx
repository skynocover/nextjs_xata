"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const Header = () => {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          My App
        </Link>
        <div className="flex items-center">
          <ul className="flex space-x-4 mr-4">
            <li>
              <Link
                href="/todolist"
                className={`hover:text-gray-300 ${
                  pathname === "/todolist" ? "text-blue-400" : ""
                }`}
              >
                To do list
              </Link>
            </li>
            <li>
              <Link
                href="/drive"
                className={`hover:text-gray-300 ${
                  pathname === "/drive" ? "text-blue-400" : ""
                }`}
              >
                Drive
              </Link>
            </li>
          </ul>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
