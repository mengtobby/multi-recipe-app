import type { EquipmentUsage, StepKind } from "@/types/recipe";

export const SERVE_NODE_ID = "__serve__";

/** Internal scheduling node: a recipe step, or the synthetic "serve" sink. */
export interface GraphNode {
  id: string;
  recipeId: string | null;
  description: string;
  durationMinutes: number;
  kind: StepKind;
  dependsOn: string[];
  equipment: EquipmentUsage[];
  batchKey?: string;
}

export interface StepTiming {
  stepId: string;
  /** Earliest possible start, in absolute epoch minutes. */
  earliestStart: number;
  earliestFinish: number;
  /** Latest allowable start before the target slips, in absolute epoch minutes. */
  latestStart: number;
  latestFinish: number;
  /** How many minutes this step can float without delaying the target. */
  slackMinutes: number;
  /** Actual scheduled start/finish after conflict resolution (defaults to latestStart). */
  scheduledStart: number;
  scheduledFinish: number;
}

export interface EquipmentConflict {
  resourceId: string;
  /** Steps that overlap on this resource beyond its capacity. */
  stepIds: string[];
  reason: string;
  resolved: boolean;
}

export interface ScheduleResult {
  /** All nodes including the synthetic serve node, keyed by id. */
  nodes: Record<string, GraphNode>;
  timings: Record<string, StepTiming>;
  /** Topological order, synthetic serve node last. */
  order: string[];
  conflicts: EquipmentConflict[];
  targetEpochMinutes: number;
  /** Minimum minutes needed on the critical path, regardless of target. */
  minimumDurationMinutes: number;
  /** True if the target leaves enough time for the critical path. */
  isFeasible: boolean;
}

export interface KitchenResourceCapacity {
  resourceId: string;
  capacity: number;
}
