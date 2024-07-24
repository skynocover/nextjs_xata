import { NextRequest, NextResponse } from "next/server";
import type { Session } from "next-auth";

import { auth, handleAuth } from "@/auth";
import { xata } from "@/database/xataClient";

export interface NextAuthRequest extends NextRequest {
  auth: Session | null;
}

export const GET = handleAuth(async (req, res) => {
  const userId = req.auth?.user?.id;

  try {
    const todos = await xata.db.todos.filter({ userId }).getAll();
    return NextResponse.json(todos, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching todos", error: error.message },
      { status: 500 }
    );
  }
});

export const POST = handleAuth(async (req, res) => {
  const userId = req.auth?.user?.id;
  try {
    const body = await req.json();
    const newTodo = await xata.db.todos.create({ ...body, userId });
    return NextResponse.json(newTodo, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating todo", error: error.message },
      { status: 500 }
    );
  }
});

export const PUT = handleAuth(async (req, res) => {
  const userId = req.auth?.user?.id;
  try {
    const body = await req.json();
    const updatedTodo = await xata.db.todos.update(body.id, {
      ...body,
      id: undefined,
    });
    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating todo", error: error.message },
      { status: 500 }
    );
  }
});

export const DELETE = handleAuth(async (req, res) => {
  const userId = req.auth?.user?.id;
  try {
    const body = await req.json();
    await xata.db.todos.delete(body.id);
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error deleting todo", error: error.message },
      { status: 500 }
    );
  }
});
