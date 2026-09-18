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
    <section className="rounded-sm border border-[var(--paper-edge)] bg-[var(--paper)] p-5 shadow-[2px_5px_10px_var(--board-edge)]">
      <h2 className="font-display mb-4 text-xl font-semibold text-[var(--ink)]">Timeline</h2>

      <div className="mb-3">
        <CookFilterTabs cooks={cooks} selectedCookId={selectedCookId} onSelect={setSelectedCookId} />
      </div>

      <div className="mb-3">
        <ConflictBanner conflicts={schedule.conflicts} />
      </div>

      <ol className="divide-y divide-[var(--board-edge)]">
        {visibleEntries.map((entry) => {
          const isServe = entry.stepIds.includes(SERVE_NODE_ID);
          const primaryRecipe = isServe ? null : recipeById.get(entry.recipeIds[0] ?? "");
          const dishColor = primaryRecipe?.color ?? "#8b9096";

          return (
            <li
              key={entry.stepIds.join("+")}
              className={`flex flex-wrap items-start gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0 ${
                isServe ? "-mx-5 mt-1 border-y-0 bg-[var(--ink)] px-5 py-4 text-[var(--board)]" : ""
              }`}
            >
              <span
                className={`w-14 shrink-0 font-mono text-sm font-semibold tabular-nums ${
                  isServe ? "text-[var(--board)]" : "text-[var(--ink)]"
                }`}
              >
                {formatClockTime(entry.start)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  {isServe ? (
                    <span className="font-display inline-flex items-center gap-1 text-base font-semibold">
                      <BellIcon /> Serve
                    </span>
                  ) : (
                    <span
                      className="rounded-sm px-1.5 py-0.5 text-xs font-bold"
                      style={{ backgroundColor: dishColor, color: readableTextColor(dishColor) }}
                    >
                      {primaryRecipe?.name ?? "?"}
                    </span>
                  )}
                  <span className={isServe ? "text-sm" : "text-sm text-[var(--ink)]"}>{entry.description}</span>
                  {!isServe && <span className="text-xs text-[var(--ink-faint)]">{entry.kind}</span>}
                </p>
                {entry.equipment.length > 0 && (
                  <p
                    className={`mt-0.5 font-mono text-xs tabular-nums ${
                      isServe ? "text-[var(--board)]/70" : "text-[var(--ink-faint)]"
                    }`}
                  >
                    {entry.equipment.map((e) => (e.tempF ? `${e.resourceId} @ ${e.tempF}°F` : e.resourceId)).join(", ")}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-3">
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
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path
        d="M10 3.5c-2.2 0-3.5 1.7-3.5 4v2.2c0 .9-.3 1.7-.9 2.4l-.4.4h9.6l-.4-.4a3.4 3.4 0 0 1-.9-2.4V7.5c0-2.3-1.3-4-3.5-4Z"
        strokeLinejoin="round"
      />
      <path d="M8.3 14.8a1.9 1.9 0 0 0 3.4 0" strokeLinecap="round" />
    </svg>
  );
}
