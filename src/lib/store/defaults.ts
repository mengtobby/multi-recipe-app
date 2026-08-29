import type { Cook, KitchenResource } from "@/types/recipe";

export const DEFAULT_KITCHEN_RESOURCES: KitchenResource[] = [
  { id: "oven", name: "Oven", capacity: 1, supportsTemperature: true },
  { id: "burner", name: "Stovetop burner", capacity: 4 },
  { id: "prep-space", name: "Prep / cutting board", capacity: 2 },
];

export const DEFAULT_COOKS: Cook[] = [{ id: "cook-1", name: "Cook 1" }];

export const RECIPE_COLORS = [
  "#e07a5f",
  "#3d5a80",
  "#81b29a",
  "#f2cc8f",
  "#9d8189",
  "#588157",
  "#bc6c25",
  "#457b9d",
];
