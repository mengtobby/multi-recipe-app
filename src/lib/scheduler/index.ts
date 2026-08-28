import type { Recipe } from "@/types/recipe";
import { buildGraph, topologicalSort } from "./graph";
import { computeTimings } from "./timing";
import { resolveEquipmentConflicts } from "./conflicts";
import { buildTimeline, type TimelineEntry } from "./batching";
import { applyDelay, type DelayResult } from "./delay";
import { SERVE_NODE_ID, type KitchenResourceCapacity, type ScheduleResult } from "./types";

export type { ScheduleResult, GraphNode, KitchenResourceCapacity, EquipmentConflict, StepTiming } from "./types";
export type { TimelineEntry } from "./batching";
export type { DelayResult } from "./delay";
export { ScheduleCycleError, UnknownDependencyError } from "./graph";
export { SERVE_NODE_ID };

/**
 * Builds the full unified schedule for a menu: merges every recipe's steps
 * into one DAG, computes backward-from-target timing, and resolves
 * equipment conflicts where there's enough slack to do so.
 */
export function buildSchedule(
  recipes: Recipe[],
  targetEpochMinutes: number,
  options: {
    kitchenCapacities?: KitchenResourceCapacity[];
    serveBufferMinutes?: number;
    /** When you can actually start cooking; omit if unknown to skip the feasibility check. */
    nowEpochMinutes?: number;
  } = {}
): ScheduleResult {
  const { kitchenCapacities = [], serveBufferMinutes = 2, nowEpochMinutes } = options;
  const nodes = buildGraph(recipes, serveBufferMinutes);
  const order = topologicalSort(nodes);
  const { timings, minimumDurationMinutes } = computeTimings(nodes, order, targetEpochMinutes);
  const { timings: resolvedTimings, conflicts } = resolveEquipmentConflicts(nodes, timings, kitchenCapacities, order);

  const isFeasible =
    nowEpochMinutes == null ? true : targetEpochMinutes - nowEpochMinutes >= minimumDurationMinutes;

  return {
    nodes,
    timings: resolvedTimings,
    order,
    conflicts,
    kitchenCapacities,
    targetEpochMinutes,
    minimumDurationMinutes,
    isFeasible,
  };
}

export function timelineFor(schedule: ScheduleResult): TimelineEntry[] {
  return buildTimeline(schedule.nodes, schedule.timings, schedule.order);
}

/**
 * Applies a "running late" delay and re-resolves equipment conflicts
 * against the new (post-delay) times, since the cascade can introduce an
 * overlap that didn't exist before.
 */
export function delayStep(schedule: ScheduleResult, stepId: string, extraMinutes: number): ScheduleResult & { delay: DelayResult } {
  const delay = applyDelay(schedule.nodes, schedule.timings, schedule.order, stepId, extraMinutes);
  const { timings: resolvedTimings, conflicts } = resolveEquipmentConflicts(
    schedule.nodes,
    delay.timings,
    schedule.kitchenCapacities,
    schedule.order
  );
  return { ...schedule, timings: resolvedTimings, conflicts, delay };
}
