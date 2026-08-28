"use client";

import { useState } from "react";
import { useRecipeStore } from "@/lib/store/recipeStore";
import { formatDuration } from "@/lib/format";
import { StepForm } from "./StepForm";

export function RecipeBuilder() {
  const recipes = useRecipeStore((s) => s.recipes);
  const addRecipe = useRecipeStore((s) => s.addRecipe);
  const removeRecipe = useRecipeStore((s) => s.removeRecipe);
  const removeStep = useRecipeStore((s) => s.removeStep);
  const cooks = useRecipeStore((s) => s.cooks);

  const [newRecipeName, setNewRecipeName] = useState("");
  const [addingStepFor, setAddingStepFor] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<{ recipeId: string; stepId: string } | null>(null);

  const createRecipe = () => {
    if (!newRecipeName.trim()) return;
    addRecipe(newRecipeName.trim());
    setNewRecipeName("");
  };

  return (
    <section className="rounded-lg border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
        Menu
      </h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newRecipeName}
          onChange={(e) => setNewRecipeName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createRecipe()}
          placeholder="Add a dish, e.g. Roast Chicken"
          className="flex-1 rounded-md border border-black/15 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-black/30"
        />
        <button
          type="button"
          onClick={createRecipe}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
        >
          Add dish
        </button>
      </div>

      <div className="space-y-4">
        {recipes.map((recipe) => {
          const otherDependencies = recipes
            .flatMap((r) => r.steps)
            .map((s) => ({
              id: s.id,
              label: `${recipes.find((r) => r.id === s.recipeId)?.name}: ${s.description}`,
            }));

          return (
            <div key={recipe.id} className="rounded-md border border-black/10 p-3 dark:border-white/10">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: recipe.color }} />
                  <h3 className="font-medium">{recipe.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => removeRecipe(recipe.id)}
                  className="text-xs text-black/50 hover:text-red-600 dark:text-white/50"
                >
                  remove dish
                </button>
              </div>

              <ul className="mb-2 space-y-1 text-sm">
                {recipe.steps.map((step) => (
                  <li key={step.id} className="flex items-center justify-between gap-2 rounded px-2 py-1 hover:bg-black/[0.03] dark:hover:bg-white/5">
                    {editingStep?.stepId === step.id ? (
                      <div className="w-full">
                        <StepForm
                          recipeId={recipe.id}
                          editingStep={step}
                          availableDependencies={otherDependencies.filter((d) => d.id !== step.id)}
                          onDone={() => setEditingStep(null)}
                        />
                      </div>
                    ) : (
                      <>
                        <span>
                          {step.description}{" "}
                          <span className="text-black/40 dark:text-white/40">
                            ({formatDuration(step.durationMinutes)}, {step.kind}
                            {step.assignedCook ? `, ${cooks.find((c) => c.id === step.assignedCook)?.name}` : ""})
                          </span>
                        </span>
                        <span className="flex shrink-0 gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setEditingStep({ recipeId: recipe.id, stepId: step.id })}
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeStep(recipe.id, step.id)}
                            className="text-black/50 hover:text-red-600 dark:text-white/50"
                          >
                            remove
                          </button>
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {addingStepFor === recipe.id ? (
                <StepForm
                  recipeId={recipe.id}
                  availableDependencies={otherDependencies}
                  onDone={() => setAddingStepFor(null)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingStepFor(recipe.id)}
                  className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  + add step
                </button>
              )}
            </div>
          );
        })}

        {recipes.length === 0 && (
          <p className="text-sm text-black/50 dark:text-white/50">
            Add a dish above to start building your menu.
          </p>
        )}
      </div>
    </section>
  );
}
