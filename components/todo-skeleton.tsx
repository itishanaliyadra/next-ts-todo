export default function TodoSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 animate-pulse rounded-2xl bg-white/10" />
            <div className="flex-1 space-y-3">
              <div className="h-3 w-28 animate-pulse rounded-full bg-white/10" />
              <div className="h-6 w-2/3 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <div className="h-10 w-20 animate-pulse rounded-full bg-white/10" />
            <div className="h-10 w-20 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

