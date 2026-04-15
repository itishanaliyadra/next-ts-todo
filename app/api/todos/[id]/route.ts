import { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/configs/dbConnection.config";
import { deleteTodoById } from "@/lib/controllers/todo/delete.controller";
import { getTodoById } from "@/lib/controllers/todo/get.controller";
import { updateTodoById } from "@/lib/controllers/todo/update.controller";
import { jsonError, jsonSuccess, respondWithError } from "@/lib/utils/api";
import { buildUpdateTodoInput } from "@/lib/utils/todo";
import { readJsonBody } from "@/lib/utils/request";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

export const GET = async (_request: NextRequest, context: Context) => {
  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid todo id", 400);
    }

    await connectDB();
    const user = await requireAuthenticatedUser(_request);
    const todo = await getTodoById(id, user._id);

    if (!todo) {
      return jsonError("Todo not found", 404);
    }

    return jsonSuccess(todo);
  } catch (error) {
    return respondWithError(error);
  }
};

export const PATCH = async (request: NextRequest, context: Context) => {
  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid todo id", 400);
    }

    await connectDB();
    const user = await requireAuthenticatedUser(request);
    const body = await readJsonBody(request);
    const input = buildUpdateTodoInput(body);

    if (!input) {
      return jsonError("Provide a valid task or status to update.", 400);
    }

    const todo = await updateTodoById(id, user._id, input);

    if (!todo) {
      return jsonError("Todo not found", 404);
    }

    return jsonSuccess(todo);
  } catch (error) {
    return respondWithError(error);
  }
};

export const DELETE = async (_request: NextRequest, context: Context) => {
  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid todo id", 400);
    }

    await connectDB();
    const user = await requireAuthenticatedUser(_request);
    const todo = await deleteTodoById(id, user._id);

    if (!todo) {
      return jsonError("Todo not found", 404);
    }

    return jsonSuccess({ deletedId: todo._id, message: "Todo deleted successfully." });
  } catch (error) {
    return respondWithError(error);
  }
};
