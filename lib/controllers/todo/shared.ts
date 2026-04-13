import { TodoModel } from "@/lib/models/todo.model";
import type { TodoPriority, TodoRecord } from "@/lib/types/todo";

export type ListTodosOptions = {
  skip?: number;
  limit?: number;
};

export type TodoLikeRecord = Record<string, unknown> & {
  _id: unknown;
};

const isValidDateValue = (value: unknown) => {
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  if (typeof value === "string") {
    return !Number.isNaN(new Date(value).getTime());
  }

  return false;
};

export const buildTodoDefaultsPatch = (todo: TodoLikeRecord) => {
  const patch: Record<string, unknown> = {};

  if (typeof todo.description !== "string") {
    patch.description = "";
  }

  if (todo.status !== "Pending" && todo.status !== "Completed") {
    patch.status = "Pending";
  }

  if (todo.priority !== "Low" && todo.priority !== "Medium" && todo.priority !== "High") {
    patch.priority = "Medium";
  }

  if (todo.dueDate !== null && todo.dueDate !== undefined && !isValidDateValue(todo.dueDate)) {
    patch.dueDate = null;
  } else if (todo.dueDate === undefined) {
    patch.dueDate = null;
  }

  if (typeof todo.isDeleted !== "boolean") {
    patch.isDeleted = false;
  }

  if (
    todo.deletedAt !== null &&
    todo.deletedAt !== undefined &&
    !isValidDateValue(todo.deletedAt)
  ) {
    patch.deletedAt = null;
  } else if (todo.deletedAt === undefined) {
    patch.deletedAt = null;
  }

  return patch;
};

export const backfillTodoDefaults = async (todo: TodoLikeRecord) => {
  const patch = buildTodoDefaultsPatch(todo);

  if (Object.keys(patch).length === 0) {
    return;
  }

  await TodoModel.updateOne({ _id: todo._id }, { $set: patch });
};

export const normalizeTodo = (todo: Record<string, unknown>): TodoRecord => {
  const dueDateValue = todo.dueDate;
  const deletedAtValue = todo.deletedAt;

  return {
    _id: String(todo._id),
    task: typeof todo.task === "string" ? todo.task : "",
    description: typeof todo.description === "string" ? todo.description : "",
    status: todo.status === "Completed" ? "Completed" : "Pending",
    priority:
      todo.priority === "Low" || todo.priority === "Medium" || todo.priority === "High"
        ? (todo.priority as TodoPriority)
        : "Medium",
    dueDate:
      dueDateValue instanceof Date
        ? dueDateValue.toISOString()
        : typeof dueDateValue === "string"
          ? dueDateValue
          : null,
    isDeleted: Boolean(todo.isDeleted),
    deletedAt:
      deletedAtValue instanceof Date
        ? deletedAtValue.toISOString()
        : typeof deletedAtValue === "string"
          ? deletedAtValue
          : null,
    createdAt:
      todo.createdAt instanceof Date
        ? todo.createdAt.toISOString()
        : typeof todo.createdAt === "string"
          ? todo.createdAt
          : new Date().toISOString(),
    updatedAt:
      todo.updatedAt instanceof Date
        ? todo.updatedAt.toISOString()
        : typeof todo.updatedAt === "string"
          ? todo.updatedAt
          : new Date().toISOString(),
  };
};
