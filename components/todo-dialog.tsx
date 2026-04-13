"use client";

import { useState, type FormEvent } from "react";
import CloseIcon from "@/components/close-icon";
import SelectChevronIcon from "@/components/select-chevron-icon";
import type { TodoPriority, TodoRecord, TodoStatus } from "@/lib/types/todo";

type TodoDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  todo: TodoRecord | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    task: string;
    description: string;
    status: TodoStatus;
    priority: TodoPriority;
    dueDate: string | null;
  }) => Promise<void>;
};

const defaultTask = "";
const defaultStatus: TodoStatus = "Pending";
const defaultPriority: TodoPriority = "Medium";

const formatDateInput = (value: string | null | undefined) => {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
};

export default function TodoDialog({
  open,
  mode,
  todo,
  saving,
  onClose,
  onSubmit,
}: TodoDialogProps) {
  const [task, setTask] = useState(() => todo?.task ?? defaultTask);
  const [description, setDescription] = useState(() => todo?.description ?? "");
  const [status, setStatus] = useState<TodoStatus>(() => todo?.status ?? defaultStatus);
  const [priority, setPriority] = useState<TodoPriority>(() => todo?.priority ?? defaultPriority);
  const [dueDate, setDueDate] = useState(() => formatDateInput(todo?.dueDate));
  const [taskError, setTaskError] = useState("");

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTask = task.trim();
    if (!trimmedTask) {
      setTaskError("Please enter a task.");
      return;
    }

    setTaskError("");
    await onSubmit({
      task: trimmedTask,
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
        onClick={saving ? undefined : onClose}
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1120]/95 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
              {mode === "create" ? "New todo" : "Update todo"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              {mode === "create" ? "Add a fresh task" : "Polish the task details"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close dialog"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Task</span>
            <input
              value={task}
              onChange={(event) => {
                setTask(event.target.value);
                if (taskError) {
                  setTaskError("");
                }
              }}
              placeholder="Design the product launch checklist"
              aria-invalid={taskError ? "true" : "false"}
              className={`w-full rounded-2xl border bg-white/5 px-4 py-4 text-white outline-none transition placeholder:text-slate-400 focus:bg-white/10 ${
                taskError
                  ? "border-rose-400/60 focus:border-rose-300/80"
                  : "border-white/10 focus:border-cyan-300/60"
              }`}
            />
            {taskError ? <p className="mt-2 text-sm text-rose-200">{taskError}</p> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add a short note about what this task needs."
              rows={4}
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/60 focus:bg-white/10"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Status</span>
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as TodoStatus)}
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-4 pr-12 text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/10"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-300">
                  <SelectChevronIcon />
                </span>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Priority</span>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value as TodoPriority)}
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-4 pr-12 text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/10"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-300">
                  <SelectChevronIcon />
                </span>
              </div>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Due date</span>
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/10"
            />
          </label>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_50px_rgba(56,189,248,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : mode === "create" ? "Create todo" : "Update todo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
