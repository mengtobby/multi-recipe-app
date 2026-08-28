import { SERVE_NODE_ID, type GraphNode, type StepTiming } from "./types";

export interface DelayResult {
  timings: Record<string, StepTiming>;
  /** Steps whose scheduled time actually moved as a result of the delay. */
  affectedStepIds: string[];
  /** How many minutes the final serve time slipped past its target, if any. */
  targetOverrunMinutes: number;
}

/**
 * "I'm running late" mode: a step is taking `extraMinutes` longer than
 * planned. Pushes its finish out and cascades the delay forward to any
 * dependent step (in any recipe) whose scheduled start would now precede
 * its prerequisite's new finish time. Returns a new timings map — the
 * input is left untouched.
 */
export function applyDelay(
  nodes: Record<string, GraphNode>,
  timings: Record<string, StepTiming>,
  order: string[],
  stepId: string,
  extraMinutes: number
): DelayResult {
  const next: Record<string, StepTiming> = { ...timings };
  const affected = new Set<string>([stepId]);

  const delayed = next[stepId];
  next[stepId] = { ...delayed, scheduledFinish: delayed.scheduledFinish + extraMinutes };

  const startIndex = order.indexOf(stepId);
  for (let i = startIndex + 1; i < order.length; i += 1) {
    const id = order[i];
    const node = nodes[id];
    const timing = next[id];
    const requiredStart = node.dependsOn.reduce(
      (latest, depId) => Math.max(latest, next[depId].scheduledFinish),
      timing.scheduledStart
    );

    if (requiredStart > timing.scheduledStart) {
      const pushed = requiredStart - timing.scheduledStart;
      next[id] = {
        ...timing,
        scheduledStart: requiredStart,
        scheduledFinish: timing.scheduledFinish + pushed,
      };
      affected.add(id);
    }
  }

  const serve = next[SERVE_NODE_ID];
  const targetOverrunMinutes = Math.max(0, serve.scheduledFinish - serve.latestFinish);

  return { timings: next, affectedStepIds: [...affected], targetOverrunMinutes };
}
