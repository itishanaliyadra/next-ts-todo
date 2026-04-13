"use client";

import CloseIcon from "@/components/close-icon";

type SnackbarProps = {
  open: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
};

export default function Snackbar({ open, type, message, onClose }: SnackbarProps) {
  if (!open) {
    return null;
  }

  const styles =
    type === "success"
      ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-50"
      : "border-rose-400/30 bg-rose-400/15 text-rose-50";

  const accent =
    type === "success"
      ? "bg-gradient-to-r from-emerald-300 to-cyan-300"
      : "bg-gradient-to-r from-rose-300 to-orange-300";

  return (
    <div
      className="fixed bottom-5 right-5 z-[60] max-w-md px-4 sm:right-6 sm:bottom-6"
      role="status"
      aria-live="polite"
    >
      <div className={`overflow-hidden rounded-2xl border shadow-[0_20px_60px_rgba(0,0,0,0.35)] ${styles}`}>
        <div className={`h-1 ${accent}`} />
        <div className="flex items-start gap-3 px-4 py-4 backdrop-blur-xl">
          <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${accent}`} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">
              {type === "success" ? "Success" : "Error"}
            </p>
            <p className="mt-1 text-sm leading-6 opacity-95">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/90 transition hover:bg-white/15"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
