"use client";

import { useMemo, useState } from "react";
import { useRecipeStore } from "@/lib/store/recipeStore";
import { formatDuration } from "@/lib/format";
import { toMapById } from "@/lib/collections";
import { getAvailableDependencies } from "@/lib/store/dependencies";
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

  const cookById = useMemo(() => toMapById(cooks), [cooks]);

  return (
    <section className="rounded-sm border border-[var(--paper-edge)] bg-[var(--paper)] p-5 shadow-[2px_5px_10px_var(--board-edge)]">
      <h2 className="font-display mb-4 border-b-2 border-[var(--ink)] pb-2 text-xl font-semibold text-[var(--ink)]">
        Menu
      </h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newRecipeName}
          onChange={(e) => setNewRecipeName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createRecipe()}
          placeholder="Add a dish, e.g. Roast Chicken"
          className="flex-1 rounded-sm border border-[var(--ink-faint)]/40 bg-[var(--board)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)]"
        />
        <button
          type="button"
          onClick={createRecipe}
          disabled={!newRecipeName.trim()}
          className="rounded-sm bg-[var(--frame)] px-3 py-2 text-sm font-medium text-[var(--frame-label)] hover:bg-[var(--frame-dark)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--frame)]"
        >
          Add
        </button>
      </div>

      <div className="space-y-3">
        {recipes.map((recipe) => {
          return (
            <div key={recipe.id} className="rounded-sm border border-[var(--board-edge)] bg-[var(--board)]/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10 shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                    style={{ backgroundColor: recipe.color }}
                    aria-hidden
                  />
                  <h3 className="font-medium text-[var(--ink)]">{recipe.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => removeRecipe(recipe.id)}
                  className="text-xs text-[var(--ink-faint)] hover:text-[var(--red)]"
                >
                  remove dish
                </button>
              </div>

              <ul className="mb-2 space-y-1 text-sm">
                {recipe.steps.map((step) => (
                  <li
                    key={step.id}
                    className="flex items-center justify-between gap-2 rounded-sm px-2 py-1 hover:bg-[var(--paper)]"
                  >
                    {editingStep?.stepId === step.id ? (
                      <div className="w-full">
                        <StepForm
                          recipeId={recipe.id}
                          editingStep={step}
                          availableDependencies={getAvailableDependencies(recipes, step.id)}
                          onDone={() => setEditingStep(null)}
                        />
                      </div>
                    ) : (
                      <>
                        <span className="text-[var(--ink)]">
                          {step.description}{" "}
                          <span className="font-mono text-xs tabular-nums text-[var(--ink-faint)]">
                            ({formatDuration(step.durationMinutes)}, {step.kind}
                            {step.assignedCook ? `, ${cookById.get(step.assignedCook)?.name}` : ""})
                          </span>
                        </span>
                        <span className="flex shrink-0 gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setEditingStep({ recipeId: recipe.id, stepId: step.id })}
                            className="text-[var(--ink-muted)] underline decoration-dotted underline-offset-4 hover:text-[var(--ink)]"
                          >
                            edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeStep(recipe.id, step.id)}
                            className="text-[var(--ink-faint)] hover:text-[var(--red)]"
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
                  availableDependencies={getAvailableDependencies(recipes, undefined)}
                  onDone={() => setAddingStepFor(null)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingStepFor(recipe.id)}
                  className="text-xs font-medium text-[var(--ink-muted)] underline decoration-dotted underline-offset-4 hover:text-[var(--ink)]"
                >
                  + add step
                </button>
              )}
            </div>
          );
        })}

        {recipes.length === 0 && (
          <p className="rounded-sm border border-dashed border-[var(--ink-faint)] p-4 text-center text-sm text-[var(--ink-muted)]">
            Add a dish above to start building your menu.
          </p>
        )}
      </div>
    </section>
  );
}
