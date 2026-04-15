import { TodoModel } from "@/lib/models/todo.model";
import type { TodoCreateInput } from "@/lib/types/todo";

export const createTodo = async (input: TodoCreateInput, userId: string) => {
  return TodoModel.create({
    userId,
    task: input.task,
    description: input.description ?? "",
    status: input.status ?? "Pending",
    priority: input.priority ?? "Medium",
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
  });
};
