import { useMemo } from "react";
import { buildSchedule, delayStep, timelineFor, type ScheduleResult, type TimelineEntry } from "@/lib/scheduler";
import { useRecipeStore } from "./recipeStore";
import { useNowEpochMinutes } from "./useNow";

export interface DerivedSchedule {
  schedule: ScheduleResult | null;
  timeline: TimelineEntry[];
  error: string | null;
}

/** Converts a `<input type="datetime-local">` value to minutes since epoch. */
export function toEpochMinutes(dateTimeLocal: string): number | null {
  if (!dateTimeLocal) return null;
  const ms = new Date(dateTimeLocal).getTime();
  return Number.isNaN(ms) ? null : Math.round(ms / 60000);
}

export function fromEpochMinutes(epochMinutes: number): Date {
  return new Date(epochMinutes * 60000);
}

export function useSchedule(): DerivedSchedule {
  const recipes = useRecipeStore((s) => s.recipes);
  const kitchenResources = useRecipeStore((s) => s.kitchenResources);
  const targetDateTime = useRecipeStore((s) => s.targetDateTime);
  const delays = useRecipeStore((s) => s.delays);
  const nowEpochMinutes = useNowEpochMinutes();

  return useMemo(() => {
    const targetEpochMinutes = toEpochMinutes(targetDateTime);
    if (targetEpochMinutes == null || recipes.every((r) => r.steps.length === 0)) {
      return { schedule: null, timeline: [], error: null };
    }

    try {
      let schedule = buildSchedule(recipes, targetEpochMinutes, {
        kitchenCapacities: kitchenResources.map((r) => ({ resourceId: r.id, capacity: r.capacity })),
        nowEpochMinutes,
      });

      for (const [stepId, extraMinutes] of Object.entries(delays)) {
        if (extraMinutes > 0 && schedule.timings[stepId]) {
          schedule = delayStep(schedule, stepId, extraMinutes);
        }
      }

      return { schedule, timeline: timelineFor(schedule), error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not build a schedule from these recipes.";
      return { schedule: null, timeline: [], error: message };
    }
  }, [recipes, kitchenResources, targetDateTime, delays, nowEpochMinutes]);
}
