import { TodoModel } from "@/lib/models/todo.model";
import type { TodoRecord } from "@/lib/types/todo";
import { backfillTodoDefaults, buildTodoQuery, normalizeTodo, type ListTodosOptions } from "./shared";

export const listTodos = async (options: ListTodosOptions) => {
  const skip = Math.max(0, options.skip ?? 0);
  const limit = Math.max(1, options.limit ?? 10);
  const query = buildTodoQuery(options);

  const [items, total] = await Promise.all([
    TodoModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TodoModel.countDocuments(query),
  ]);

  await Promise.all(items.map((item) => backfillTodoDefaults(item)));

  return {
    items: items.map((item) => normalizeTodo(item as Record<string, unknown>)) as TodoRecord[],
    total,
    hasMore: skip + items.length < total,
    nextSkip: skip + items.length,
  };
};
