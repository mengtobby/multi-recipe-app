import { useNowEpochMinutes } from "@/lib/store/useNow";

interface StepTimerProps {
  start: number;
  finish: number;
}

/** Live countdown/elapsed indicator for a step that's in progress or upcoming. */
export function StepTimer({ start, finish }: StepTimerProps) {
  const now = useNowEpochMinutes();

  if (now < start) {
    return <span className="text-xs text-black/40 dark:text-white/40">starts in {start - now} min</span>;
  }
  if (now < finish) {
    return (
      <span className="text-xs font-medium text-green-700 dark:text-green-400">
        in progress — {finish - now} min left
      </span>
    );
  }
  return <span className="text-xs text-black/30 dark:text-white/30">done</span>;
}
