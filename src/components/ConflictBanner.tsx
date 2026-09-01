import type { EquipmentConflict } from "@/lib/scheduler";

interface ConflictBannerProps {
  conflicts: EquipmentConflict[];
}

export function ConflictBanner({ conflicts }: ConflictBannerProps) {
  if (conflicts.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-sm border-2 border-[var(--amber)] bg-[var(--amber-surface)] py-3 pl-16 pr-3 text-sm text-[var(--amber-ink)]">
      <div
        aria-hidden
        className="font-stamp absolute left-3 top-1/2 -translate-y-1/2 -rotate-12 rounded-full border-[3px] border-[var(--amber-ink)] px-2 py-1 text-[10px] uppercase tracking-wide text-[var(--amber-ink)]"
        style={{ opacity: 0.85 }}
      >
        Hold
      </div>
      <p className="mb-1 flex items-center gap-2 font-semibold">
        <HazardIcon />
        Equipment conflicts need your attention
      </p>
      <ul className="list-inside list-disc space-y-1">
        {conflicts.map((conflict, i) => (
          <li key={`${conflict.resourceId}-${i}`}>{conflict.reason}</li>
        ))}
      </ul>
    </div>
  );
}

function HazardIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M10 2.5 18.5 17H1.5L10 2.5Z" strokeLinejoin="round" />
      <path d="M10 8v4" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
