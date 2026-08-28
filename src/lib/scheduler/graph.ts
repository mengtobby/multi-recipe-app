import type { Recipe } from "@/types/recipe";
import { SERVE_NODE_ID, type GraphNode } from "./types";

export class ScheduleCycleError extends Error {
  constructor(public readonly cycleStepIds: string[]) {
    super(`Circular dependency detected among steps: ${cycleStepIds.join(" -> ")}`);
    this.name = "ScheduleCycleError";
  }
}

export class UnknownDependencyError extends Error {
  constructor(public readonly stepId: string, public readonly missingDependencyId: string) {
    super(`Step "${stepId}" depends on unknown step "${missingDependencyId}"`);
    this.name = "UnknownDependencyError";
  }
}

/**
 * Builds the unified step graph across all recipes and appends a synthetic
 * "serve" sink node depended on by every step nothing else depends on
 * (i.e. every dish's final step), so the whole menu converges on one target.
 */
export function buildGraph(recipes: Recipe[], serveBufferMinutes = 2): Record<string, GraphNode> {
  const nodes: Record<string, GraphNode> = {};

  for (const recipe of recipes) {
    for (const step of recipe.steps) {
      nodes[step.id] = {
        id: step.id,
        recipeId: recipe.id,
        description: step.description,
        durationMinutes: step.durationMinutes,
        kind: step.kind,
        dependsOn: [...step.dependsOn],
        equipment: step.equipment,
        batchKey: step.batchKey,
      };
    }
  }

  for (const node of Object.values(nodes)) {
    for (const depId of node.dependsOn) {
      if (!nodes[depId]) {
        throw new UnknownDependencyError(node.id, depId);
      }
    }
  }

  const dependedOn = new Set<string>();
  for (const node of Object.values(nodes)) {
    for (const depId of node.dependsOn) dependedOn.add(depId);
  }
  const finalStepIds = Object.keys(nodes).filter((id) => !dependedOn.has(id));

  nodes[SERVE_NODE_ID] = {
    id: SERVE_NODE_ID,
    recipeId: null,
    description: "Plate and serve",
    durationMinutes: serveBufferMinutes,
    kind: "active",
    dependsOn: finalStepIds,
    equipment: [],
  };

  return nodes;
}

/** Kahn's algorithm; throws ScheduleCycleError if the graph isn't a DAG. */
export function topologicalSort(nodes: Record<string, GraphNode>): string[] {
  const inDegree: Record<string, number> = {};
  const dependents: Record<string, string[]> = {};

  for (const id of Object.keys(nodes)) {
    inDegree[id] = 0;
    dependents[id] = [];
  }
  for (const node of Object.values(nodes)) {
    inDegree[node.id] = node.dependsOn.length;
    for (const depId of node.dependsOn) {
      dependents[depId].push(node.id);
    }
  }

  const queue = Object.keys(nodes)
    .filter((id) => inDegree[id] === 0)
    .sort();
  const order: string[] = [];

  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    for (const dependentId of dependents[id]) {
      inDegree[dependentId] -= 1;
      if (inDegree[dependentId] === 0) queue.push(dependentId);
    }
  }

  if (order.length !== Object.keys(nodes).length) {
    const remaining = Object.keys(nodes).filter((id) => !order.includes(id));
    throw new ScheduleCycleError(remaining);
  }

  return order;
}
