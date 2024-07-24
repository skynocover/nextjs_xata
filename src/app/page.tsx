"use client";

import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-4xl flex space-x-8">
        <div
          onClick={() => navigateTo("/todolist")}
          className="w-1/2 h-64 bg-blue-500 rounded-lg shadow-lg flex items-center justify-center cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
        >
          <span className="text-white text-3xl font-bold">Todo List</span>
        </div>
        <div
          onClick={() => navigateTo("/drive")}
          className="w-1/2 h-64 bg-green-500 rounded-lg shadow-lg flex items-center justify-center cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
        >
          <span className="text-white text-3xl font-bold">Drive</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
