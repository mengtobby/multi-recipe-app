import type { Recipe, RecipeStep } from "@/types/recipe";

function mapAllSteps(recipes: Recipe[], fn: (step: RecipeStep) => RecipeStep): Recipe[] {
  return recipes.map((r) => ({ ...r, steps: r.steps.map(fn) }));
}

/** Strips references to any of `removedStepIds` from every step's dependsOn, across all recipes. */
export function stripDependencyReferences(recipes: Recipe[], removedStepIds: Set<string>): Recipe[] {
  if (removedStepIds.size === 0) return recipes;
  return mapAllSteps(recipes, (s) =>
    s.dependsOn.some((d) => removedStepIds.has(d))
      ? { ...s, dependsOn: s.dependsOn.filter((d) => !removedStepIds.has(d)) }
      : s
  );
}

/** Clears `assignedCook` on every step currently assigned to `cookId`, across all recipes. */
export function stripCookAssignment(recipes: Recipe[], cookId: string): Recipe[] {
  return mapAllSteps(recipes, (s) => (s.assignedCook === cookId ? { ...s, assignedCook: undefined } : s));
}
