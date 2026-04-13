"use client";

import { useCallback, useEffect, useState } from "react";
import ConfirmDialog from "@/components/confirm-dialog";
import InfiniteScroll from "@/components/infinite-scroll";
import Snackbar from "@/components/snackbar";
import TodoDialog from "@/components/todo-dialog";
import TodoList from "@/components/todo-list";
import TodoStats from "@/components/todo-stats";
import type { TodoPriority, TodoRecord, TodoStatus } from "@/lib/types/todo";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

type TodoPageResponse = {
  items: TodoRecord[];
  total: number;
  hasMore: boolean;
  nextSkip: number;
};

type DialogState =
  | { mode: "create"; todo: null }
  | { mode: "edit"; todo: TodoRecord }
  | null;

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

const mergeUniqueTodos = (current: TodoRecord[], incoming: TodoRecord[]) => {
  const byId = new Map<string, TodoRecord>();

  for (const todo of current) {
    byId.set(todo._id, todo);
  }

  for (const todo of incoming) {
    byId.set(todo._id, todo);
  }

  return Array.from(byId.values());
};

type TodoFormPayload = {
  task: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;
};

export default function TodoApp() {
  const [todos, setTodos] = useState<TodoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextSkip, setNextSkip] = useState(0);
  const [busyTodoId, setBusyTodoId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [dialogKey, setDialogKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<TodoRecord | null>(null);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
  }, []);

  const openCreateDialog = useCallback(() => {
    setDialogKey((current) => current + 1);
    setDialog({ mode: "create", todo: null });
  }, []);

  const openEditDialog = useCallback((todo: TodoRecord) => {
    setDialogKey((current) => current + 1);
    setDialog({ mode: "edit", todo });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(null);
  }, []);

  const fetchPage = useCallback(async (skip: number, append: boolean) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`/api/todos?skip=${skip}&limit=5`, { cache: "no-store" });
      const body = (await response.json()) as ApiResponse<TodoPageResponse>;

      if (!response.ok || !body.success || !body.data) {
        throw new Error(body.message || "Failed to load todos");
      }

      const page = body.data;
      setTodos((current) => (append ? mergeUniqueTodos(current, page.items) : mergeUniqueTodos([], page.items)));
      setHasMore(page.hasMore);
      setNextSkip(page.nextSkip);
    } catch (fetchError) {
      showToast("error", getErrorMessage(fetchError));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [showToast]);

  useEffect(() => {
    void fetchPage(0, false);
  }, [fetchPage]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const createTodo = useCallback(
    async ({ task, description, status, priority, dueDate }: TodoFormPayload) => {
      try {
        setSaving(true);

        const response = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task, description, status, priority, dueDate }),
        });

        const body = (await response.json()) as ApiResponse<TodoRecord>;
        if (!response.ok || !body.success) {
          throw new Error(body.message || "Could not create todo");
        }

        closeDialog();
        showToast("success", "Todo created successfully.");
        await fetchPage(0, false);
      } catch (createError) {
        showToast("error", getErrorMessage(createError));
      } finally {
        setSaving(false);
      }
    },
    [closeDialog, fetchPage, showToast]
  );

  const updateTodo = useCallback(
    async ({ task, description, status, priority, dueDate }: TodoFormPayload) => {
      if (!dialog || dialog.mode !== "edit") {
        return;
      }

      try {
        setSaving(true);

        const response = await fetch(`/api/todos/${dialog.todo._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task, description, status, priority, dueDate }),
        });

        const body = (await response.json()) as ApiResponse<TodoRecord>;
        if (!response.ok || !body.success) {
          throw new Error(body.message || "Could not update todo");
        }

        closeDialog();
        showToast("success", "Todo updated successfully.");
        await fetchPage(0, false);
      } catch (updateError) {
        showToast("error", getErrorMessage(updateError));
      } finally {
        setSaving(false);
      }
    },
    [closeDialog, dialog, fetchPage, showToast]
  );

  const handleSubmit = async (payload: TodoFormPayload) => {
    if (dialog?.mode === "create") {
      await createTodo(payload);
      return;
    }

    if (dialog?.mode === "edit") {
      await updateTodo(payload);
    }
  };

  const toggleTodo = useCallback(
    async (todo: TodoRecord) => {
      try {
        setBusyTodoId(todo._id);

        const response = await fetch(`/api/todos/${todo._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: todo.status === "Completed" ? "Pending" : "Completed",
          }),
        });

        const body = (await response.json()) as ApiResponse<TodoRecord>;
        if (!response.ok || !body.success) {
          throw new Error(body.message || "Could not update todo");
        }

        setTodos((current) =>
          current.map((item) => (item._id === todo._id ? (body.data as TodoRecord) : item))
        );
        showToast("success", "Todo status updated.");
      } catch (toggleError) {
        showToast("error", getErrorMessage(toggleError));
      } finally {
        setBusyTodoId(null);
      }
    },
    [showToast]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setBusyTodoId(deleteTarget._id);

      const response = await fetch(`/api/todos/${deleteTarget._id}`, {
        method: "DELETE",
      });

      const body = (await response.json()) as ApiResponse<null>;
      if (!response.ok || !body.success) {
        throw new Error(body.message || "Could not delete todo");
      }

      setDeleteTarget(null);
      showToast("success", "Todo deleted successfully.");
      await fetchPage(0, false);
    } catch (deleteError) {
      showToast("error", getErrorMessage(deleteError));
    } finally {
      setBusyTodoId(null);
    }
  }, [deleteTarget, fetchPage, showToast]);

  const total = todos.length;
  const completed = todos.filter((todo) => todo.status === "Completed").length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.16),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#081121_45%,_#0f172a_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col gap-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_100px_rgba(2,6,23,0.6)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
                Todo Atlas
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                A visually rich task board with a calm, modern workflow.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Create, update, and track todos with a polished interface, responsive layout, and
                clean API-backed persistence.
              </p>
            </div>

            <div className="grid gap-3 sm:min-w-[280px]">
              <button
                type="button"
                onClick={openCreateDialog}
                className="rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-6 py-4 text-sm font-semibold text-slate-950 shadow-[0_24px_70px_rgba(56,189,248,0.35)] transition hover:brightness-110"
              >
                Add Todo
              </button>
              <div className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-200">
                {completionRate}% completed today
              </div>
            </div>
          </div>

          <div className="mt-8">
            <TodoStats total={total} pending={pending} completed={completed} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_360px]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_100px_rgba(2,6,23,0.45)] backdrop-blur-xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
                Tasks
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Your live todo list</h2>
            </div>

            <div className="mt-6">
              <InfiniteScroll
                hasMore={hasMore}
                loading={loading}
                loadingMore={loadingMore}
                onLoadMore={() => void fetchPage(nextSkip, true)}
              >
                <TodoList
                  todos={todos}
                  loading={loading}
                  busyTodoId={busyTodoId}
                  onEdit={openEditDialog}
                  onToggle={(todo) => void toggleTodo(todo)}
                  onDelete={(todo) => setDeleteTarget(todo)}
                />
              </InfiniteScroll>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,11,24,0.96),rgba(14,20,39,0.92))] p-6 shadow-[0_30px_100px_rgba(2,6,23,0.45)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-200/80">
              Mission control
            </p>

            <div className="mt-5 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-300">Completion rate</p>
                  <h2 className="mt-1 text-3xl font-semibold text-white">{completionRate}%</h2>
                </div>

                <div className="relative h-24 w-24 rounded-full bg-slate-900/70 p-2">
                  <div
                    className="flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.22),transparent_65%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,15,30,0.98))] text-sm font-semibold text-white"
                    style={{
                      backgroundImage: `conic-gradient(#22d3ee ${completionRate * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                    }}
                  >
                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-slate-950/95 text-sm font-semibold text-white">
                      {completed}/{total || 0}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Pending</span>
                  <span className="font-medium text-white">{pending}</span>
                </div>
                <div className="h-2 rounded-full bg-white/8">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 transition-all duration-300"
                    style={{ width: `${total === 0 ? 0 : (pending / total) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Completed</span>
                  <span className="font-medium text-white">{completed}</span>
                </div>
                <div className="h-2 rounded-full bg-white/8">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 transition-all duration-300"
                    style={{ width: `${total === 0 ? 0 : (completed / total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Fast lane</div>
                <div className="mt-2 text-lg font-semibold text-white">Create and update in one tap</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  The dialog-driven flow keeps actions focused and the list stays visually calm.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-violet-200/70">Stack</div>
                <div className="mt-2 text-lg font-semibold text-white">
                  Next.js + TypeScript + MongoDB + Mongoose
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  The typed API, controllers, and model layer stay separate so the codebase
                  remains easy to grow.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <TodoDialog
        key={dialog ? `${dialogKey}-${dialog.mode === "edit" ? dialog.todo._id : "create"}` : "closed"}
        open={dialog !== null}
        mode={dialog?.mode ?? "create"}
        todo={dialog?.mode === "edit" ? dialog.todo : null}
        saving={saving}
        onClose={closeDialog}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this todo?"
        description={
          deleteTarget
            ? `This will archive "${deleteTarget.task}" from the active list. You can recreate it later if needed.`
            : "This will remove the selected todo from the active list."
        }
        confirmLabel="Delete todo"
        loading={busyTodoId !== null && deleteTarget?._id === busyTodoId}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <Snackbar
        open={toast !== null}
        type={toast?.type ?? "success"}
        message={toast?.message ?? ""}
        onClose={() => setToast(null)}
      />
    </main>
  );
}
