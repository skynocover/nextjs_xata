"use client";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const TodoListPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  useEffect(() => {
    if (session) {
      axios.get("/api/todos").then((response: any) => setTodos(response.data));
    } else {
      if (status !== "loading") {
        router.push("/api/auth/signin");
      }
    }
  }, [session]);

  const addTodo = async (title: string) => {
    const { data } = await axios.post("/api/todos", {
      title,
      completed: false,
    });
    setTodos([...todos, data]);
    setNewTodo("");
  };

  const updateTodo = async (id: string, completed: boolean) => {
    const response = await axios.put("/api/todos", { id, completed });
    setTodos(todos.map((todo) => (todo.xata_id === id ? response.data : todo)));
  };

  const deleteTodo = async (id: string) => {
    await axios.delete("/api/todos", { data: { id } });
    setTodos(todos.filter((todo) => todo.xata_id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-gray-900 dark:text-gray-100">
      <h1 className="mb-4 text-2xl font-bold text-center">Todos</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Add new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && addTodo((e.target as HTMLInputElement).value)
          }
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
        />
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.xata_id}
            className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 border rounded shadow dark:border-gray-700"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => updateTodo(todo.xata_id, !todo.completed)}
                className="mr-2"
              />
              <span className={todo.completed ? "line-through" : ""}>
                {todo.title}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.xata_id)}
              className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoListPage;
