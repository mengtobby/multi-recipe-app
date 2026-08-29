import { SERVE_NODE_ID, type GraphNode, type StepTiming } from "./types";
import { enforceDependencyOrder } from "./ordering";

export interface DelayResult {
  timings: Record<string, StepTiming>;
  /** Steps whose scheduled time actually moved as a result of the delay. */
  affectedStepIds: string[];
  /** How many minutes the final serve time slipped past its target, if any. */
  targetOverrunMinutes: number;
}

/**
 * "I'm running late" mode: a step is taking `extraMinutes` longer than
 * planned. Pushes its finish out, then reuses the same dependency-ordering
 * pass conflict resolution relies on to cascade that delay forward to any
 * dependent step (in any recipe). Returns a new timings map — the input is
 * left untouched.
 */
export function applyDelay(
  nodes: Record<string, GraphNode>,
  timings: Record<string, StepTiming>,
  order: string[],
  stepId: string,
  extraMinutes: number
): DelayResult {
  const delayed = timings[stepId];
  const withDelay: Record<string, StepTiming> = {
    ...timings,
    [stepId]: { ...delayed, scheduledFinish: delayed.scheduledFinish + extraMinutes },
  };

  const next = enforceDependencyOrder(nodes, withDelay, order);
  const affectedStepIds = order.filter((id) => next[id] !== timings[id]);

  const serve = next[SERVE_NODE_ID];
  const targetOverrunMinutes = Math.max(0, serve.scheduledFinish - serve.latestFinish);

  return { timings: next, affectedStepIds, targetOverrunMinutes };
}
