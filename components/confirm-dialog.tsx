"use client";

import CloseIcon from "@/components/close-icon";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  loading,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={loading ? undefined : onClose} />

      <div className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#0b1120]/95 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-200/80">
            Confirmation
          </p>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close dialog"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          >
            <CloseIcon />
          </button>
        </div>

        <h2 className="mt-3 text-3xl font-semibold text-white">{title}</h2>
        <p className="mt-4 text-sm leading-6 text-slate-300">{description}</p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-rose-400 to-orange-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
