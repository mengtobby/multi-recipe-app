import type { EquipmentConflict } from "@/lib/scheduler";

interface ConflictBannerProps {
  conflicts: EquipmentConflict[];
}

export function ConflictBanner({ conflicts }: ConflictBannerProps) {
  if (conflicts.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-950/40 dark:text-amber-200">
      <p className="mb-1 font-semibold">Equipment conflicts need your attention</p>
      <ul className="list-inside list-disc space-y-1">
        {conflicts.map((conflict, i) => (
          <li key={`${conflict.resourceId}-${i}`}>{conflict.reason}</li>
        ))}
      </ul>
    </div>
  );
}
