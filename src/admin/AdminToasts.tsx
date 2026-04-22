export type ToastItem = { id: number; kind: 'ok' | 'err'; message: string };

type Props = {
  items: ToastItem[];
  onDismiss: (id: number) => void;
};

export function AdminToasts({ items, onDismiss }: Props) {
  if (!items.length) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[200] flex max-w-[min(100vw-2rem,22rem)] flex-col gap-2 sm:bottom-6 sm:right-6"
      aria-live="polite"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto rounded border px-4 py-3 text-sm shadow-lg ${
            t.kind === 'ok'
              ? 'border-brand-green/40 bg-[#0f1a12] text-cream'
              : 'border-red-500/40 bg-[#1a0f0f] text-red-100'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 flex-1 leading-snug">{t.message}</p>
            <button
              type="button"
              className="shrink-0 text-xs text-muted underline"
              onClick={() => onDismiss(t.id)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
