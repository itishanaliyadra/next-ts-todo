import { TodoModel } from "@/lib/models/todo.model";
import { backfillTodoDefaults, normalizeTodo } from "./shared";

export const deleteTodoById = async (id: string) => {
  const todo = await TodoModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    },
    {
      new: true,
    }
  ).lean();

  if (todo) {
    await backfillTodoDefaults(todo);
  }

  return todo ? normalizeTodo(todo as Record<string, unknown>) : null;
};
