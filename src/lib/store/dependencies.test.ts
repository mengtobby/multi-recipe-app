import { describe, expect, it } from "vitest";
import type { Recipe } from "@/types/recipe";
import { getAvailableDependencies } from "./dependencies";

function recipe(id: string, steps: Recipe["steps"]): Recipe {
  return { id, name: id, color: "#000", steps };
}

describe("getAvailableDependencies", () => {
  it("offers every other step, across recipes, for a brand new step", () => {
    const recipes = [
      recipe("chicken", [
        { id: "c1", recipeId: "chicken", description: "season", durationMinutes: 5, kind: "active", dependsOn: [], equipment: [] },
      ]),
      recipe("gravy", [
        { id: "g1", recipeId: "gravy", description: "whisk", durationMinutes: 5, kind: "active", dependsOn: [], equipment: [] },
      ]),
    ];

    const options = getAvailableDependencies(recipes, undefined);

    expect(options.map((o) => o.id).sort()).toEqual(["c1", "g1"]);
  });

  it("excludes the step itself", () => {
    const recipes = [
      recipe("chicken", [
        { id: "c1", recipeId: "chicken", description: "season", durationMinutes: 5, kind: "active", dependsOn: [], equipment: [] },
      ]),
    ];

    expect(getAvailableDependencies(recipes, "c1")).toEqual([]);
  });

  it("excludes any step that would create a cycle, direct or transitive", () => {
    // c1 -> c2 -> c3 (c2 depends on c1, c3 depends on c2)
    const recipes = [
      recipe("chicken", [
        { id: "c1", recipeId: "chicken", description: "season", durationMinutes: 5, kind: "active", dependsOn: [], equipment: [] },
        { id: "c2", recipeId: "chicken", description: "roast", durationMinutes: 20, kind: "passive", dependsOn: ["c1"], equipment: [] },
        { id: "c3", recipeId: "chicken", description: "rest", durationMinutes: 10, kind: "passive", dependsOn: ["c2"], equipment: [] },
      ]),
    ];

    // Editing c1: picking c2 or c3 as a dependency would close a loop back to c1.
    const optionsForC1 = getAvailableDependencies(recipes, "c1");
    expect(optionsForC1).toEqual([]);

    // Editing c2: c3 transitively depends on c2, so picking c3 would cycle; c1 is still fine.
    const optionsForC2 = getAvailableDependencies(recipes, "c2");
    expect(optionsForC2.map((o) => o.id)).toEqual(["c1"]);
  });

  it("still allows unrelated steps in other recipes even when a cycle risk exists locally", () => {
    const recipes = [
      recipe("chicken", [
        { id: "c1", recipeId: "chicken", description: "season", durationMinutes: 5, kind: "active", dependsOn: [], equipment: [] },
        { id: "c2", recipeId: "chicken", description: "roast", durationMinutes: 20, kind: "passive", dependsOn: ["c1"], equipment: [] },
      ]),
      recipe("gravy", [
        { id: "g1", recipeId: "gravy", description: "whisk", durationMinutes: 5, kind: "active", dependsOn: [], equipment: [] },
      ]),
    ];

    const optionsForC1 = getAvailableDependencies(recipes, "c1");
    expect(optionsForC1.map((o) => o.id)).toEqual(["g1"]);
  });
});
