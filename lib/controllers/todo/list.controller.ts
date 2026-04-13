import { TodoModel } from "@/lib/models/todo.model";
import type { TodoRecord } from "@/lib/types/todo";
import { backfillTodoDefaults, normalizeTodo, type ListTodosOptions } from "./shared";

export const listTodos = async (options: ListTodosOptions = {}) => {
  const skip = Math.max(0, options.skip ?? 0);
  const limit = Math.max(1, options.limit ?? 10);

  const [items, total] = await Promise.all([
    TodoModel.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TodoModel.countDocuments({ isDeleted: false }),
  ]);

  await Promise.all(items.map((item) => backfillTodoDefaults(item)));

  return {
    items: items.map((item) => normalizeTodo(item as Record<string, unknown>)) as TodoRecord[],
    total,
    hasMore: skip + items.length < total,
    nextSkip: skip + items.length,
  };
};
