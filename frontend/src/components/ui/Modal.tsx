import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-full w-full max-w-2xl overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-white p-6 shadow-[var(--color-shadow)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-[var(--color-foreground)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:bg-[var(--color-primary-soft)]"
          >
            Fermer
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
