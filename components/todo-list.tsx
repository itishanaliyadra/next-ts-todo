import type { TodoRecord } from "@/lib/types/todo";
import TodoCard from "./todo-card";
import TodoEmptyState from "./todo-empty-state";
import TodoSkeleton from "./todo-skeleton";

type TodoListProps = {
  todos: TodoRecord[];
  loading: boolean;
  busyTodoId: string | null;
  onEdit: (todo: TodoRecord) => void;
  onToggle: (todo: TodoRecord) => void;
  onDelete: (todo: TodoRecord) => void;
};

export default function TodoList({
  todos,
  loading,
  busyTodoId,
  onEdit,
  onToggle,
  onDelete,
}: TodoListProps) {
  if (loading) {
    return <TodoSkeleton />;
  }

  if (todos.length === 0) {
    return <TodoEmptyState />;
  }

  return (
    <div className="grid gap-4">
      {todos.map((todo) => (
        <TodoCard
          key={todo._id}
          todo={todo}
          busy={busyTodoId === todo._id}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
