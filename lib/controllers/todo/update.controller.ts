import { TodoModel } from "@/lib/models/todo.model";
import type { TodoUpdateInput } from "@/lib/types/todo";
import { backfillTodoDefaults, normalizeTodo } from "./shared";

export const updateTodoById = async (id: string, userId: string, input: TodoUpdateInput) => {
  const todo = await TodoModel.findOneAndUpdate(
    { _id: id, userId, isDeleted: false },
    { $set: input },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  if (todo) {
    await backfillTodoDefaults(todo);
  }

  return todo ? normalizeTodo(todo as Record<string, unknown>) : null;
};
