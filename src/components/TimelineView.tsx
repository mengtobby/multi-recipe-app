"use client";

import { useMemo, useState } from "react";
import type { ScheduleResult, TimelineEntry } from "@/lib/scheduler";
import { SERVE_NODE_ID } from "@/lib/scheduler";
import { useRecipeStore } from "@/lib/store/recipeStore";
import { formatClockTime } from "@/lib/format";
import { toMapById } from "@/lib/collections";
import { useNowEpochMinutes } from "@/lib/store/useNow";
import { readableTextColor } from "@/lib/color";
import { CookFilterTabs } from "./CookFilterTabs";
import { StepTimer } from "./StepTimer";
import { ConflictBanner } from "./ConflictBanner";

interface TimelineViewProps {
  schedule: ScheduleResult;
  timeline: TimelineEntry[];
}

export function TimelineView({ schedule, timeline }: TimelineViewProps) {
  const recipes = useRecipeStore((s) => s.recipes);
  const cooks = useRecipeStore((s) => s.cooks);
  const addDelay = useRecipeStore((s) => s.addDelay);
  const [selectedCookId, setSelectedCookId] = useState<string | null>(null);
  const now = useNowEpochMinutes();

  const stepLookup = useMemo(() => {
    const map = new Map<string, { assignedCook?: string }>();
    for (const recipe of recipes) {
      for (const step of recipe.steps) map.set(step.id, step);
    }
    return map;
  }, [recipes]);

  const recipeById = useMemo(() => toMapById(recipes), [recipes]);

  const visibleEntries = selectedCookId
    ? timeline.filter((entry) =>
        entry.stepIds.some((id) => stepLookup.get(id)?.assignedCook === selectedCookId)
      )
    : timeline;

  return (
    <section className="relative rounded-sm border border-[var(--paper-edge)] bg-[var(--paper)] p-4 pt-6 shadow-[2px_5px_10px_var(--board-edge)]">
      <svg
        aria-hidden
        viewBox="0 0 32 18"
        className="absolute -top-3 left-4 h-4 w-7"
        style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.35))" }}
      >
        <defs>
          <linearGradient id="clip-grad-timeline" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--frame-light)" />
            <stop offset="55%" stopColor="var(--frame)" />
            <stop offset="100%" stopColor="var(--frame-dark)" />
          </linearGradient>
        </defs>
        <path d="M3 13 L9 2 H23 L29 13 Z" fill="url(#clip-grad-timeline)" stroke="var(--frame-dark)" strokeWidth="1" />
        <path d="M6 11.5 L10.5 3.5" stroke="var(--frame-label)" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
        <rect x="12.5" y="5" width="7" height="10" rx="1.2" fill="var(--frame-dark)" />
        <rect x="13.6" y="6" width="1.2" height="8" rx="0.6" fill="var(--frame-light)" opacity="0.6" />
      </svg>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-stamp text-lg text-[var(--ink)]">Order rail</h2>
        {!schedule.isFeasible && (
          <span className="flex items-center gap-2 rounded-sm border-2 border-[var(--red)] bg-[var(--red-surface)] px-2 py-1 text-xs font-semibold text-[var(--red-ink)]">
            <span className="font-stamp -rotate-6 rounded-full border-2 border-[var(--red-ink)] px-1.5 py-px text-[9px] uppercase tracking-wide text-[var(--red-ink)]">
              Stop
            </span>
            Not enough time before target — start earlier or simplify the menu
          </span>
        )}
      </div>

      <div className="mb-3">
        <CookFilterTabs cooks={cooks} selectedCookId={selectedCookId} onSelect={setSelectedCookId} />
      </div>

      <div className="mb-3">
        <ConflictBanner conflicts={schedule.conflicts} />
      </div>

      <ol className="relative mt-4">
        <svg
          className="pointer-events-none absolute left-4 top-2 bottom-2 -ml-3 w-6"
          viewBox="0 0 24 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="rail-rod" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--frame-dark)" />
              <stop offset="45%" stopColor="var(--frame-light)" />
              <stop offset="100%" stopColor="var(--frame-dark)" />
            </linearGradient>
          </defs>
          <line
            x1="12"
            y1="0"
            x2="12"
            y2="100"
            stroke="url(#rail-rod)"
            strokeWidth="5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength={1000}
            strokeDasharray={1000}
            style={{ animation: "spine-draw 900ms ease-out forwards" }}
          />
        </svg>

        {visibleEntries.map((entry) => {
          const isServe = entry.stepIds.includes(SERVE_NODE_ID);
          const primaryRecipe = isServe ? null : recipeById.get(entry.recipeIds[0] ?? "");

          return (
            <li key={entry.stepIds.join("+")} className="relative mb-4 flex items-start last:mb-0">
              <div className="flex w-8 shrink-0 justify-center pt-2.5">
                {/* a ring clipped around the steel rail, in the dish's ticket-stock color */}
                <svg viewBox="0 0 20 20" className="h-4 w-4" style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.35))" }} aria-hidden>
                  <circle
                    cx="10"
                    cy="10"
                    r="7"
                    fill="none"
                    stroke={isServe ? "var(--ink)" : primaryRecipe?.color ?? "#8b9096"}
                    strokeWidth="3.5"
                  />
                </svg>
              </div>

              {/* the clip's arm: the ticket visibly hangs from the rail rather than sitting beside it */}
              <span className="mt-[1.05rem] h-0.5 w-3 shrink-0 bg-[var(--frame-light)]" aria-hidden />

              <div
                className={`flex-1 rounded-sm border-x border-b p-2.5 ${
                  isServe ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--board)]" : "border-[var(--board-edge)]"
                }`}
                style={{
                  borderTop: `2px dashed ${isServe ? "var(--ink)" : "var(--board-edge)"}`,
                  backgroundColor: isServe
                    ? undefined
                    : `color-mix(in srgb, ${primaryRecipe?.color ?? "#8b9096"} 16%, var(--board))`,
                }}
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className={`w-14 shrink-0 font-mono text-sm font-medium tabular-nums ${
                      isServe ? "text-[var(--board)]" : "text-[var(--ink)]"
                    }`}
                  >
                    {formatClockTime(entry.start)}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    {!isServe && (
                      <span
                        className="shrink-0 rounded-sm px-1.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: primaryRecipe?.color ?? "#8b9096",
                          color: readableTextColor(primaryRecipe?.color ?? "#8b9096"),
                        }}
                      >
                        {primaryRecipe?.name ?? "?"}
                      </span>
                    )}
                    {isServe && (
                      <span className="font-stamp inline-flex shrink-0 items-center gap-1 rounded-sm bg-[var(--board)] px-2 py-0.5 text-xs text-[var(--ink)]">
                        <BellIcon /> Serve
                      </span>
                    )}
                    <span className={isServe ? "text-sm font-medium" : "text-sm text-[var(--ink)]"}>
                      {entry.description}
                    </span>
                    {!isServe && <span className="text-xs text-[var(--ink-faint)]">{entry.kind}</span>}
                  </div>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pl-[4.25rem]">
                  <span
                    className={`font-mono text-xs tabular-nums ${
                      isServe ? "text-[var(--board)]/70" : "text-[var(--ink-faint)]"
                    }`}
                  >
                    {entry.equipment
                      .map((e) => (e.tempF ? `${e.resourceId} @ ${e.tempF}°F` : e.resourceId))
                      .join(", ")}
                  </span>
                  <div className="flex items-center gap-3">
                    <StepTimer start={entry.start} finish={entry.finish} now={now} />
                    {!isServe && (
                      <button
                        type="button"
                        onClick={() => addDelay(entry.stepIds[0], 5)}
                        className="whitespace-nowrap text-xs font-medium text-[var(--amber-text)] underline decoration-dotted underline-offset-4 hover:text-[var(--ink)]"
                      >
                        +5 min late
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M10 3.5c-2.2 0-3.5 1.7-3.5 4v2.2c0 .9-.3 1.7-.9 2.4l-.4.4h9.6l-.4-.4a3.4 3.4 0 0 1-.9-2.4V7.5c0-2.3-1.3-4-3.5-4Z" strokeLinejoin="round" />
      <path d="M8.3 14.8a1.9 1.9 0 0 0 3.4 0" strokeLinecap="round" />
    </svg>
  );
}
