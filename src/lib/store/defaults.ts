import type { Cook, KitchenResource } from "@/types/recipe";

/**
 * A sensible first value for the target serving time: 6pm today, or 6pm
 * tomorrow if it's already past 6pm — so a brand new visitor sees a real,
 * editable time instead of a blank "yyyy-mm-dd --:-- --" field with no clue
 * what to type. Only used for the very first load; once set, the user's own
 * choice persists.
 */
export function defaultTargetDateTime(now: Date = new Date()): string {
  const target = new Date(now);
  target.setHours(18, 0, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}`;
}

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
