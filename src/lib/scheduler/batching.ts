import type { EquipmentUsage, StepKind } from "@/types/recipe";
import type { GraphNode, StepTiming } from "./types";

export interface TimelineEntry {
  /** The step ids folded into this entry (more than one when batched). */
  stepIds: string[];
  recipeIds: (string | null)[];
  description: string;
  start: number;
  finish: number;
  /** "passive" only if every merged step is passive; "active" if any of them needs hands-on attention. */
  kind: StepKind;
  /** Deduped by resourceId across every merged step. */
  equipment: EquipmentUsage[];
}

/**
 * Groups steps that share a `batchKey` and start at the same scheduled
 * minute into a single timeline entry (e.g. "Chop 4 garlic cloves: 2 for
 * the pasta, 2 for the sauce"), then returns entries in chronological order.
 */
export function buildTimeline(
  nodes: Record<string, GraphNode>,
  timings: Record<string, StepTiming>,
  order: string[]
): TimelineEntry[] {
  const batchGroups = new Map<string, string[]>();
  const singles: string[] = [];

  for (const id of order) {
    const node = nodes[id];
    if (node.batchKey) {
      const groupKey = `${node.batchKey}@${timings[id].scheduledStart}`;
      const list = batchGroups.get(groupKey) ?? [];
      list.push(id);
      batchGroups.set(groupKey, list);
    } else {
      singles.push(id);
    }
  }

  const toEntry = (ids: string[]): TimelineEntry => {
    const equipmentByResource = new Map<string, EquipmentUsage>();
    for (const id of ids) {
      for (const usage of nodes[id].equipment) {
        if (!equipmentByResource.has(usage.resourceId)) equipmentByResource.set(usage.resourceId, usage);
      }
    }
    return {
      stepIds: ids,
      recipeIds: ids.map((id) => nodes[id].recipeId),
      description: ids.map((id) => nodes[id].description).join("; "),
      start: timings[ids[0]].scheduledStart,
      finish: Math.max(...ids.map((id) => timings[id].scheduledFinish)),
      kind: ids.every((id) => nodes[id].kind === "passive") ? "passive" : "active",
      equipment: [...equipmentByResource.values()],
    };
  };

  const entries: TimelineEntry[] = singles.map((id) => toEntry([id]));
  for (const groupedIds of batchGroups.values()) {
    entries.push(toEntry(groupedIds));
  }

  return entries.sort((a, b) => a.start - b.start);
}
