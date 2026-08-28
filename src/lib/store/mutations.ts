import type { Recipe } from "@/types/recipe";

/** Strips references to any of `removedStepIds` from every step's dependsOn, across all recipes. */
export function stripDependencyReferences(recipes: Recipe[], removedStepIds: Set<string>): Recipe[] {
  if (removedStepIds.size === 0) return recipes;
  return recipes.map((r) => ({
    ...r,
    steps: r.steps.map((s) =>
      s.dependsOn.some((d) => removedStepIds.has(d))
        ? { ...s, dependsOn: s.dependsOn.filter((d) => !removedStepIds.has(d)) }
        : s
    ),
  }));
}

/** Clears `assignedCook` on every step currently assigned to `cookId`, across all recipes. */
export function stripCookAssignment(recipes: Recipe[], cookId: string): Recipe[] {
  return recipes.map((r) => ({
    ...r,
    steps: r.steps.map((s) => (s.assignedCook === cookId ? { ...s, assignedCook: undefined } : s)),
  }));
}
