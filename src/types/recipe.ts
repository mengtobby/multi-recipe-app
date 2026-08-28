export type StepKind = "active" | "passive";

export interface EquipmentUsage {
  /** Resource id, e.g. "oven", "burner", "prep-space". Matches a KitchenResource.id. */
  resourceId: string;
  /** Optional temperature in Fahrenheit, relevant for shared resources like an oven. */
  tempF?: number;
}

export interface RecipeStep {
  id: string;
  recipeId: string;
  description: string;
  /** How long this step occupies its resources/attention, in minutes. */
  durationMinutes: number;
  kind: StepKind;
  /** Step ids (any recipe) that must finish before this step can start. */
  dependsOn: string[];
  equipment: EquipmentUsage[];
  assignedCook?: string;
  /** Groups steps that can be combined into one instruction, e.g. "chop-garlic". */
  batchKey?: string;
}

export interface Recipe {
  id: string;
  name: string;
  color: string;
  servings?: number;
  steps: RecipeStep[];
}

export interface KitchenResource {
  id: string;
  name: string;
  capacity: number;
}

export interface Cook {
  id: string;
  name: string;
}
