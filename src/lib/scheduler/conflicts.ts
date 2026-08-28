import type { EquipmentConflict, GraphNode, KitchenResourceCapacity, StepTiming } from "./types";

interface AcceptedInterval {
  stepId: string;
  start: number;
  finish: number;
  tempF?: number;
}

function usageCount(intervals: AcceptedInterval[], start: number, finish: number): number {
  return intervals.filter((iv) => iv.start < finish && start < iv.finish).length;
}

function fits(intervals: AcceptedInterval[], start: number, finish: number, capacity: number): boolean {
  return usageCount(intervals, start, finish) < capacity;
}

export interface ConflictResolution {
  timings: Record<string, StepTiming>;
  conflicts: EquipmentConflict[];
}

/**
 * Greedily resolves equipment overlaps by shifting flexible (high-slack)
 * steps earlier, minute by minute, down to their own earliest-start floor.
 * Steps with the least slack keep their default (latest-possible) time,
 * since they have no room to move. Returns a new timings map — the input
 * is left untouched.
 */
export function resolveEquipmentConflicts(
  nodes: Record<string, GraphNode>,
  timings: Record<string, StepTiming>,
  capacities: KitchenResourceCapacity[]
): ConflictResolution {
  const capacityByResource = new Map(capacities.map((c) => [c.resourceId, c.capacity]));
  const usageByResource = new Map<string, { stepId: string; tempF?: number }[]>();

  for (const node of Object.values(nodes)) {
    for (const usage of node.equipment) {
      const list = usageByResource.get(usage.resourceId) ?? [];
      list.push({ stepId: node.id, tempF: usage.tempF });
      usageByResource.set(usage.resourceId, list);
    }
  }

  const nextTimings: Record<string, StepTiming> = { ...timings };
  const conflicts: EquipmentConflict[] = [];

  for (const [resourceId, users] of usageByResource) {
    const capacity = capacityByResource.get(resourceId) ?? 1;
    const stepIds = users
      .map((u) => u.stepId)
      .sort((a, b) => nextTimings[a].slackMinutes - nextTimings[b].slackMinutes);

    const accepted: AcceptedInterval[] = [];
    for (const stepId of stepIds) {
      const timing = nextTimings[stepId];
      const duration = timing.scheduledFinish - timing.scheduledStart;
      const tempF = users.find((u) => u.stepId === stepId)?.tempF;

      let start = timing.scheduledStart;
      let placed = fits(accepted, start, start + duration, capacity);

      while (!placed && start > timing.earliestStart) {
        start -= 1;
        placed = fits(accepted, start, start + duration, capacity);
      }

      if (placed) {
        if (start !== timing.scheduledStart) {
          nextTimings[stepId] = { ...timing, scheduledStart: start, scheduledFinish: start + duration };
        }
        accepted.push({ stepId, start, finish: start + duration, tempF });
      } else {
        const overlapping = accepted.filter(
          (iv) => iv.start < timing.scheduledFinish && timing.scheduledStart < iv.finish
        );
        const tempMismatch = overlapping.some((iv) => tempF != null && iv.tempF != null && iv.tempF !== tempF);
        conflicts.push({
          resourceId,
          stepIds: [stepId, ...overlapping.map((iv) => iv.stepId)],
          reason: tempMismatch
            ? `${resourceId} is needed at conflicting temperatures at the same time — bake sequentially or pick a compromise temperature.`
            : `${resourceId} is over capacity (${capacity}) — these steps overlap with no slack left to separate them.`,
          resolved: false,
        });
        accepted.push({ stepId, start: timing.scheduledStart, finish: timing.scheduledFinish, tempF });
      }
    }
  }

  return { timings: nextTimings, conflicts };
}
