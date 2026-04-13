import { TodoModel } from "@/lib/models/todo.model";
import { backfillTodoDefaults, normalizeTodo } from "./shared";

export const getTodoById = async (id: string) => {
  const todo = await TodoModel.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (todo) {
    await backfillTodoDefaults(todo);
  }

  return todo ? normalizeTodo(todo as Record<string, unknown>) : null;
};
