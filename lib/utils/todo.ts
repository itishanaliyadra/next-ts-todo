import type {
  TodoCreateInput,
  TodoPriority,
  TodoStatus,
  TodoUpdateInput,
} from "@/lib/types/todo";

const TODO_STATUSES: TodoStatus[] = ["Pending", "Completed"];
const TODO_PRIORITIES: TodoPriority[] = ["Low", "Medium", "High"];

export const isTodoStatus = (value: unknown): value is TodoStatus => {
  return typeof value === "string" && TODO_STATUSES.includes(value as TodoStatus);
};

export const isTodoPriority = (value: unknown): value is TodoPriority => {
  return typeof value === "string" && TODO_PRIORITIES.includes(value as TodoPriority);
};

export const normalizeTask = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const normalizeDescription = (value: unknown) => {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
};

export const normalizeDueDate = (value: unknown) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

export const buildCreateTodoInput = (body: unknown): TodoCreateInput | null => {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;
  const task = normalizeTask(payload.task);

  if (!task) {
    return null;
  }

  const description = normalizeDescription(payload.description);

  if (description === null) {
    return null;
  }

  const input: TodoCreateInput = { task, description };

  if (isTodoStatus(payload.status)) {
    input.status = payload.status;
  }

  if (isTodoPriority(payload.priority)) {
    input.priority = payload.priority;
  }

  const dueDate = normalizeDueDate(payload.dueDate);
  if (dueDate === null) {
    return null;
  }
  if (dueDate !== undefined) {
    input.dueDate = dueDate;
  }

  return input;
};

export const buildUpdateTodoInput = (body: unknown): TodoUpdateInput | null => {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;
  const input: TodoUpdateInput = {};

  if (payload.task !== undefined) {
    const task = normalizeTask(payload.task);

    if (!task) {
      return null;
    }

    input.task = task;
  }

  if (payload.description !== undefined) {
    const description = normalizeDescription(payload.description);

    if (description === null) {
      return null;
    }

    input.description = description;
  }

  if (payload.status !== undefined) {
    if (!isTodoStatus(payload.status)) {
      return null;
    }

    input.status = payload.status;
  }

  if (payload.priority !== undefined) {
    if (!isTodoPriority(payload.priority)) {
      return null;
    }

    input.priority = payload.priority;
  }

  if (payload.dueDate !== undefined) {
    const dueDate = normalizeDueDate(payload.dueDate);

    if (dueDate === null) {
      input.dueDate = null;
    } else if (dueDate !== undefined) {
      input.dueDate = dueDate;
    }
  }

  return Object.keys(input).length > 0 ? input : null;
};
