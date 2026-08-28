"use client";

import { useMemo, useState } from "react";
import type { ScheduleResult, TimelineEntry } from "@/lib/scheduler";
import { SERVE_NODE_ID } from "@/lib/scheduler";
import { useRecipeStore } from "@/lib/store/recipeStore";
import { formatClockTime } from "@/lib/format";
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

  const stepLookup = useMemo(() => {
    const map = new Map<string, { assignedCook?: string }>();
    for (const recipe of recipes) {
      for (const step of recipe.steps) map.set(step.id, step);
    }
    return map;
  }, [recipes]);

  const recipeById = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);

  const visibleEntries = selectedCookId
    ? timeline.filter((entry) =>
        entry.stepIds.some((id) => stepLookup.get(id)?.assignedCook === selectedCookId)
      )
    : timeline;

  return (
    <section className="rounded-lg border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
          Unified timeline
        </h2>
        {!schedule.isFeasible && (
          <span className="text-xs font-medium text-red-600 dark:text-red-400">
            Not enough time before target — start earlier or simplify the menu
          </span>
        )}
      </div>

      <div className="mb-3">
        <CookFilterTabs cooks={cooks} selectedCookId={selectedCookId} onSelect={setSelectedCookId} />
      </div>

      <ConflictBanner conflicts={schedule.conflicts} />

      <ol className="mt-3 space-y-2">
        {visibleEntries.map((entry) => {
          const isServe = entry.stepIds.includes(SERVE_NODE_ID);
          const primaryRecipe = isServe ? null : recipeById.get(entry.recipeIds[0] ?? "");
          const node = schedule.nodes[entry.stepIds[0]];

          return (
            <li
              key={entry.stepIds.join("+")}
              className="flex items-start gap-3 rounded-md border border-black/5 p-2 dark:border-white/10"
              style={{ borderLeft: `4px solid ${primaryRecipe?.color ?? "#888"}` }}
            >
              <div className="w-16 shrink-0 pt-0.5 text-sm font-medium tabular-nums">
                {formatClockTime(entry.start)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {!isServe && (
                    <span
                      className="rounded px-1.5 py-0.5 text-xs font-medium text-white"
                      style={{ backgroundColor: primaryRecipe?.color ?? "#888" }}
                    >
                      {primaryRecipe?.name ?? "?"}
                    </span>
                  )}
                  {isServe && (
                    <span className="rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white dark:bg-white/70 dark:text-black">
                      All dishes
                    </span>
                  )}
                  <span className="text-sm">{entry.description}</span>
                  <span className="text-xs text-black/40 dark:text-white/40">
                    {node?.kind === "passive" ? "passive" : "active"}
                  </span>
                </div>
                {node?.equipment && node.equipment.length > 0 && (
                  <div className="mt-0.5 text-xs text-black/40 dark:text-white/40">
                    {node.equipment
                      .map((e) => (e.tempF ? `${e.resourceId} @ ${e.tempF}°F` : e.resourceId))
                      .join(", ")}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <StepTimer start={entry.start} finish={entry.finish} />
                {!isServe && (
                  <button
                    type="button"
                    onClick={() => addDelay(entry.stepIds[0], 5)}
                    className="text-xs text-amber-700 hover:underline dark:text-amber-400"
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
