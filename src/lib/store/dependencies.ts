import type { Recipe, RecipeStep } from "@/types/recipe";

export interface DependencyOption {
  id: string;
  label: string;
}

/** True if adding `candidateId` as a dependency of `stepId` would create a cycle
 *  — i.e. `stepId` is already a (transitive) dependency of `candidateId`. */
function wouldCreateCycle(allSteps: RecipeStep[], stepId: string, candidateId: string): boolean {
  const byId = new Map(allSteps.map((s) => [s.id, s]));
  const seen = new Set<string>();
  const stack = [candidateId];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === stepId) return true;
    if (seen.has(current)) continue;
    seen.add(current);
    const step = byId.get(current);
    if (step) stack.push(...step.dependsOn);
  }

  return false;
}

/**
 * Every step (across every recipe) that can safely be picked as a dependency
 * of `stepId` — excludes the step itself and anything that would create a
 * circular dependency, so the "depends on" picker can never let a user
 * create a cycle in the first place. Pass `undefined` for a step that
 * doesn't exist yet (a brand new step can never be part of a cycle).
 */
export function getAvailableDependencies(recipes: Recipe[], stepId: string | undefined): DependencyOption[] {
  const recipeById = new Map(recipes.map((r) => [r.id, r]));
  const allSteps = recipes.flatMap((r) => r.steps);

  return allSteps
    .filter((s) => s.id !== stepId && !(stepId && wouldCreateCycle(allSteps, stepId, s.id)))
    .map((s) => ({ id: s.id, label: `${recipeById.get(s.recipeId)?.name}: ${s.description}` }));
}
