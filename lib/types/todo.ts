export type TodoStatus = "Pending" | "Completed";
export type TodoPriority = "Low" | "Medium" | "High";

export type TodoRecord = {
  _id: string;
  task: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TodoCreateInput = {
  task: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: string | null;
};

export type TodoUpdateInput = {
  task?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: string | null;
};
