import { useMemo } from "react";
import { applyDelays, buildSchedule, timelineFor, type ScheduleResult, type TimelineEntry } from "@/lib/scheduler";
import { toEpochMinutes } from "@/lib/format";
import { useRecipeStore } from "./recipeStore";
import { useNowEpochMinutes } from "./useNow";

export interface DerivedSchedule {
  schedule: ScheduleResult | null;
  timeline: TimelineEntry[];
  error: string | null;
}

/**
 * Builds the schedule from recipes/kitchen/target/delays — the expensive
 * part (graph + timing + conflict resolution) — independent of the
 * ticking clock, so a live "now" doesn't force a full rebuild.
 */
function useBaseSchedule(): DerivedSchedule {
  const recipes = useRecipeStore((s) => s.recipes);
  const kitchenResources = useRecipeStore((s) => s.kitchenResources);
  const targetDateTime = useRecipeStore((s) => s.targetDateTime);
  const delays = useRecipeStore((s) => s.delays);

  return useMemo(() => {
    const targetEpochMinutes = toEpochMinutes(targetDateTime);
    if (targetEpochMinutes == null || recipes.length === 0) {
      return { schedule: null, timeline: [], error: null };
    }

    try {
      const built = buildSchedule(recipes, targetEpochMinutes, {
        kitchenCapacities: kitchenResources.map((r) => ({ resourceId: r.id, capacity: r.capacity })),
      });
      const schedule = applyDelays(built, delays);
      return { schedule, timeline: timelineFor(schedule), error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not build a schedule from these recipes.";
      return { schedule: null, timeline: [], error: message };
    }
  }, [recipes, kitchenResources, targetDateTime, delays]);
}

export function useSchedule(): DerivedSchedule {
  const base = useBaseSchedule();
  const nowEpochMinutes = useNowEpochMinutes();

  return useMemo(() => {
    if (!base.schedule) return base;
    const isFeasible =
      base.schedule.targetEpochMinutes - nowEpochMinutes >= base.schedule.minimumDurationMinutes;
    if (isFeasible === base.schedule.isFeasible) return base;
    return { ...base, schedule: { ...base.schedule, isFeasible } };
  }, [base, nowEpochMinutes]);
}
