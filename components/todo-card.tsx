import type { TodoRecord } from "@/lib/types/todo";

const priorityStyles = {
  Low: "bg-sky-400/15 text-sky-100 border-sky-400/20",
  Medium: "bg-amber-400/15 text-amber-100 border-amber-400/20",
  High: "bg-rose-400/15 text-rose-100 border-rose-400/20",
} as const;

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

type TodoCardProps = {
  todo: TodoRecord;
  busy: boolean;
  onEdit: (todo: TodoRecord) => void;
  onToggle: (todo: TodoRecord) => void;
  onDelete: (todo: TodoRecord) => void;
};

export default function TodoCard({ todo, busy, onEdit, onToggle, onDelete }: TodoCardProps) {
  const completed = todo.status === "Completed";

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border p-5 transition duration-300 ${
        completed
          ? "border-emerald-400/30 bg-[linear-gradient(180deg,rgba(6,95,70,0.22),rgba(8,15,30,0.9))]"
          : "border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(10,14,25,0.92))]"
      } ${busy ? "opacity-70" : "hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => onToggle(todo)}
          className={`mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
            completed
              ? "border-emerald-400/40 bg-emerald-400 text-slate-950"
              : "border-white/10 bg-slate-900/80 text-white hover:border-cyan-300/60"
          }`}
          aria-label={completed ? "Mark as pending" : "Mark as completed"}
          disabled={busy}
        >
          {completed ? "✓" : "○"}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] ${
                completed
                  ? "bg-emerald-400/15 text-emerald-200"
                  : "bg-cyan-400/15 text-cyan-100"
              }`}
            >
              {todo.status}
            </span>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${priorityStyles[todo.priority]}`}
            >
              {todo.priority}
            </span>
            <span className="text-xs text-slate-400">
              Created {formatDate(todo.createdAt)}
            </span>
          </div>

          <h3
            className={`mt-3 text-lg font-semibold text-white ${
              completed ? "line-through decoration-emerald-300/60 decoration-2" : ""
            }`}
          >
            {todo.task}
          </h3>

          {todo.description ? (
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {todo.description}
            </p>
          ) : (
            <p className="mt-2 text-sm leading-6 text-slate-500">No description added.</p>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Due Date
              </div>
              <div className="mt-1 text-sm font-medium text-white">
                {todo.dueDate ? formatDate(todo.dueDate) : "Not set"}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Priority
              </div>
              <div className="mt-1 text-sm font-medium text-white">{todo.priority}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onEdit(todo)}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/50 hover:bg-cyan-400/10"
          disabled={busy}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(todo)}
          className="inline-flex items-center rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:border-rose-300/40 hover:bg-rose-400/20"
          disabled={busy}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
