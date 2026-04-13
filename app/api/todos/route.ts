import { NextRequest } from "next/server";
import { connectDB } from "@/lib/configs/dbConnection.config";
import { createTodo } from "@/lib/controllers/todo/create.controller";
import { listTodos } from "@/lib/controllers/todo/list.controller";
import { jsonError, jsonSuccess, respondWithError } from "@/lib/utils/api";
import { buildCreateTodoInput } from "@/lib/utils/todo";
import { readJsonBody } from "@/lib/utils/request";

const getPositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);

  if (Number.isNaN(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
};

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const skip = getPositiveInt(searchParams.get("skip"), 0);
    const limit = Math.min(getPositiveInt(searchParams.get("limit"), 10), 25);

    const result = await listTodos({ skip, limit });
    return jsonSuccess(result);
  } catch (error) {
    return respondWithError(error);
  }
};

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await readJsonBody(request);
    const input = buildCreateTodoInput(body);

    if (!input) {
      return jsonError("Task is required.", 400);
    }

    const todo = await createTodo(input);
    return jsonSuccess(todo, 201);
  } catch (error) {
    return respondWithError(error);
  }
};
