import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Cook, EquipmentUsage, KitchenResource, Recipe, RecipeStep, StepKind } from "@/types/recipe";
import { DEFAULT_COOKS, DEFAULT_KITCHEN_RESOURCES, RECIPE_COLORS } from "./defaults";

export interface NewStepInput {
  description: string;
  durationMinutes: number;
  kind: StepKind;
  dependsOn: string[];
  equipment: EquipmentUsage[];
  assignedCook?: string;
  batchKey?: string;
}

interface RecipeStoreState {
  recipes: Recipe[];
  cooks: Cook[];
  kitchenResources: KitchenResource[];
  /** ISO datetime string from a <input type="datetime-local"> field. */
  targetDateTime: string;
  /** Extra minutes manually added per step via "I'm running late" mode. */
  delays: Record<string, number>;

  addRecipe: (name: string, servings?: number) => string;
  removeRecipe: (recipeId: string) => void;
  renameRecipe: (recipeId: string, name: string) => void;

  addStep: (recipeId: string, input: NewStepInput) => string;
  updateStep: (recipeId: string, stepId: string, patch: Partial<NewStepInput>) => void;
  removeStep: (recipeId: string, stepId: string) => void;

  addCook: (name: string) => string;
  removeCook: (cookId: string) => void;

  setKitchenCapacity: (resourceId: string, capacity: number) => void;
  addKitchenResource: (name: string, capacity: number) => void;

  setTargetDateTime: (iso: string) => void;

  addDelay: (stepId: string, extraMinutes: number) => void;
  clearDelays: () => void;
}

function nextColor(existing: Recipe[]): string {
  return RECIPE_COLORS[existing.length % RECIPE_COLORS.length];
}

export const useRecipeStore = create<RecipeStoreState>()(
  persist(
    (set) => ({
      recipes: [],
      cooks: DEFAULT_COOKS,
      kitchenResources: DEFAULT_KITCHEN_RESOURCES,
      targetDateTime: "",
      delays: {},

      addRecipe: (name, servings) => {
        const id = nanoid();
        set((state) => ({
          recipes: [...state.recipes, { id, name, servings, color: nextColor(state.recipes), steps: [] }],
        }));
        return id;
      },

      removeRecipe: (recipeId) => {
        set((state) => ({ recipes: state.recipes.filter((r) => r.id !== recipeId) }));
      },

      renameRecipe: (recipeId, name) => {
        set((state) => ({
          recipes: state.recipes.map((r) => (r.id === recipeId ? { ...r, name } : r)),
        }));
      },

      addStep: (recipeId, input) => {
        const id = nanoid();
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === recipeId
              ? { ...r, steps: [...r.steps, { id, recipeId, ...input }] }
              : r
          ),
        }));
        return id;
      },

      updateStep: (recipeId, stepId, patch) => {
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === recipeId
              ? {
                  ...r,
                  steps: r.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)),
                }
              : r
          ),
        }));
      },

      removeStep: (recipeId, stepId) => {
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === recipeId
              ? {
                  ...r,
                  steps: r.steps
                    .filter((s) => s.id !== stepId)
                    .map((s) => ({ ...s, dependsOn: s.dependsOn.filter((d) => d !== stepId) })),
                }
              : r
          ),
        }));
      },

      addCook: (name) => {
        const id = nanoid();
        set((state) => ({ cooks: [...state.cooks, { id, name }] }));
        return id;
      },

      removeCook: (cookId) => {
        set((state) => ({ cooks: state.cooks.filter((c) => c.id !== cookId) }));
      },

      setKitchenCapacity: (resourceId, capacity) => {
        set((state) => ({
          kitchenResources: state.kitchenResources.map((r) =>
            r.id === resourceId ? { ...r, capacity } : r
          ),
        }));
      },

      addKitchenResource: (name, capacity) => {
        const id = nanoid();
        set((state) => ({
          kitchenResources: [...state.kitchenResources, { id, name, capacity }],
        }));
      },

      setTargetDateTime: (iso) => set({ targetDateTime: iso }),

      addDelay: (stepId, extraMinutes) => {
        set((state) => ({
          delays: { ...state.delays, [stepId]: (state.delays[stepId] ?? 0) + extraMinutes },
        }));
      },

      clearDelays: () => set({ delays: {} }),
    }),
    { name: "multi-recipe-app-store" }
  )
);

export type { RecipeStep };
