import { SERVE_NODE_ID, type GraphNode, type StepTiming } from "./types";

interface TimingPassResult {
  timings: Record<string, StepTiming>;
  minimumDurationMinutes: number;
}

/**
 * Two-pass CPM timing:
 *  - forward pass anchored at 0 computes the minimum feasible duration (D)
 *    and each step's earliest start/finish relative to session start;
 *  - backward pass anchored at the target computes each step's latest
 *    start/finish before the target slips.
 * Both passes are then expressed in the same absolute-epoch-minutes frame
 * (the forward pass is shifted by `target - D`) so slack = latest - earliest
 * is meaningful.
 */
export function computeTimings(
  nodes: Record<string, GraphNode>,
  order: string[],
  targetEpochMinutes: number
): TimingPassResult {
  const dependents: Record<string, string[]> = {};
  for (const id of order) dependents[id] = [];
  for (const node of Object.values(nodes)) {
    for (const depId of node.dependsOn) dependents[depId].push(node.id);
  }

  const earliestStart0: Record<string, number> = {};
  const earliestFinish0: Record<string, number> = {};
  for (const id of order) {
    const node = nodes[id];
    earliestStart0[id] = node.dependsOn.length
      ? Math.max(...node.dependsOn.map((d) => earliestFinish0[d]))
      : 0;
    earliestFinish0[id] = earliestStart0[id] + node.durationMinutes;
  }

  const minimumDurationMinutes = earliestFinish0[SERVE_NODE_ID];
  const shift = targetEpochMinutes - minimumDurationMinutes;

  const latestFinish: Record<string, number> = {};
  const latestStart: Record<string, number> = {};
  for (let i = order.length - 1; i >= 0; i -= 1) {
    const id = order[i];
    const node = nodes[id];
    latestFinish[id] =
      id === SERVE_NODE_ID
        ? targetEpochMinutes
        : Math.min(...dependents[id].map((d) => latestStart[d]));
    latestStart[id] = latestFinish[id] - node.durationMinutes;
  }

  const timings: Record<string, StepTiming> = {};
  for (const id of order) {
    const earliestStart = earliestStart0[id] + shift;
    const earliestFinish = earliestFinish0[id] + shift;
    timings[id] = {
      stepId: id,
      earliestStart,
      earliestFinish,
      latestStart: latestStart[id],
      latestFinish: latestFinish[id],
      slackMinutes: latestStart[id] - earliestStart,
      scheduledStart: latestStart[id],
      scheduledFinish: latestFinish[id],
    };
  }

  return { timings, minimumDurationMinutes };
}
