type TodoStatsProps = {
  total: number;
  pending: number;
  completed: number;
};

export default function TodoStats({ total, pending, completed }: TodoStatsProps) {
  const cards = [
    { label: "Total", value: total, accent: "from-cyan-400 to-sky-500" },
    { label: "Pending", value: pending, accent: "from-amber-300 to-orange-500" },
    { label: "Completed", value: completed, accent: "from-emerald-300 to-teal-500" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur"
        >
          <div className={`h-1.5 w-24 rounded-full bg-gradient-to-r ${card.accent}`} />
          <div className="mt-4 text-sm text-slate-300">{card.label}</div>
          <div className="mt-2 text-3xl font-semibold text-white">{card.value}</div>
        </div>
      ))}
    </div>
  );
}

