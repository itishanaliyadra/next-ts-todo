import { TodoModel } from "@/lib/models/todo.model";
import type { TodoCreateInput } from "@/lib/types/todo";

export const createTodo = async (input: TodoCreateInput) => {
  return TodoModel.create({
    task: input.task,
    description: input.description ?? "",
    status: input.status ?? "Pending",
    priority: input.priority ?? "Medium",
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
  });
};
