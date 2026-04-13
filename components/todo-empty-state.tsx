export default function TodoEmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-2xl font-bold text-slate-950 shadow-[0_20px_60px_rgba(34,211,238,0.2)]">
        +
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">No todos yet</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Start your list with a single task. The interface will update instantly once you add one.
      </p>
    </div>
  );
}

