import { useMemo } from "react";
import {
  ScheduleCycleError,
  UnknownDependencyError,
  applyDelays,
  buildSchedule,
  timelineFor,
  type ScheduleResult,
  type TimelineEntry,
} from "@/lib/scheduler";
import { toEpochMinutes } from "@/lib/format";
import type { Recipe } from "@/types/recipe";
import { useRecipeStore } from "./recipeStore";
import { useNowEpochMinutes } from "./useNow";

/** Turns an internal step id into the description a person actually typed, for error messages. */
function describeSteps(recipes: Recipe[], stepIds: string[]): string {
  const byId = new Map(recipes.flatMap((r) => r.steps).map((s) => [s.id, s.description]));
  return stepIds.map((id) => byId.get(id) ?? "a removed step").join(" → ");
}

function messageFor(err: unknown, recipes: Recipe[]): string {
  if (err instanceof ScheduleCycleError) {
    return `These steps depend on each other in a loop, so there's no valid order to cook them in: ${describeSteps(recipes, err.cycleStepIds)}. Remove one of the "depends on" links to fix it.`;
  }
  if (err instanceof UnknownDependencyError) {
    return `"${describeSteps(recipes, [err.stepId])}" depends on a step that no longer exists. Open it and re-pick its "depends on" list.`;
  }
  return err instanceof Error ? err.message : "Could not build a schedule from these recipes.";
}

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
      return { schedule: null, timeline: [], error: messageFor(err, recipes) };
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
