interface StepTimerProps {
  start: number;
  finish: number;
  now: number;
}

/** Live countdown/elapsed indicator for a step that's in progress or upcoming. */
export function StepTimer({ start, finish, now }: StepTimerProps) {
  if (now < start) {
    return (
      <span key="upcoming" className="whitespace-nowrap font-mono text-xs tabular-nums text-[var(--ink-faint)]">
        starts in {start - now} min
      </span>
    );
  }
  if (now < finish) {
    return (
      <span
        key="active"
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border border-[var(--green)] bg-[var(--green-surface)] px-2 py-0.5 font-mono text-xs font-medium tabular-nums text-[var(--green)]"
        style={{ animation: "stamp-in 260ms ease-out" }}
      >
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-[var(--green)]"
          style={{ animation: "live-pulse 1.6s ease-in-out infinite" }}
        />
        {finish - now} min left
      </span>
    );
  }
  return (
    <span key="done" className="whitespace-nowrap font-mono text-xs tabular-nums text-[var(--ink-faint)] line-through">
      done
    </span>
  );
}
