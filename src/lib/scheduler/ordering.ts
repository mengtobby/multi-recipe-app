import type { GraphNode, StepTiming } from "./types";

/**
 * Pushes any step's scheduledStart/scheduledFinish forward if it currently
 * precedes the actual scheduled finish of one of its dependencies, walking
 * in topological order so each step sees its dependencies' final position.
 * This is the one place that enforces "a step never starts before the
 * steps it depends on have finished" — both conflict resolution and delay
 * propagation build on it rather than reimplementing the cascade.
 */
export function enforceDependencyOrder(
  nodes: Record<string, GraphNode>,
  timings: Record<string, StepTiming>,
  order: string[]
): Record<string, StepTiming> {
  const next = { ...timings };
  for (const id of order) {
    const node = nodes[id];
    if (node.dependsOn.length === 0) continue;

    const timing = next[id];
    const requiredStart = node.dependsOn.reduce(
      (latest, depId) => Math.max(latest, next[depId].scheduledFinish),
      timing.scheduledStart
    );

    if (requiredStart > timing.scheduledStart) {
      const duration = timing.scheduledFinish - timing.scheduledStart;
      next[id] = { ...timing, scheduledStart: requiredStart, scheduledFinish: requiredStart + duration };
    }
  }
  return next;
}
