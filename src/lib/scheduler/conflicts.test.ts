import { describe, expect, it } from "vitest";
import type { Recipe } from "@/types/recipe";
import { buildGraph, topologicalSort } from "./graph";
import { computeTimings } from "./timing";
import { resolveEquipmentConflicts } from "./conflicts";

function recipe(id: string, steps: Recipe["steps"]): Recipe {
  return { id, name: id, color: "#000", steps };
}

describe("resolveEquipmentConflicts", () => {
  it("shifts the more flexible step earlier to free up a single oven", () => {
    // A long non-oven salad-prep chain (40 min, zero slack) sets the overall
    // session length, which gives both oven users room to maneuver: the
    // chicken roast has 15 min of slack, the bread has 30. Both default to
    // their latest-possible start, which collide in the oven — the bread
    // (more flexible) should give way and move earlier.
    const recipes = [
      recipe("chicken", [
        { id: "c1", recipeId: "chicken", description: "season", durationMinutes: 5, kind: "active", dependsOn: [], equipment: [] },
        { id: "c2", recipeId: "chicken", description: "roast", durationMinutes: 20, kind: "passive", dependsOn: ["c1"], equipment: [{ resourceId: "oven", tempF: 400 }] },
      ]),
      recipe("bread", [
        { id: "br1", recipeId: "bread", description: "bake bread", durationMinutes: 10, kind: "passive", dependsOn: [], equipment: [{ resourceId: "oven", tempF: 400 }] },
      ]),
      recipe("salad", [
        { id: "sd1", recipeId: "salad", description: "prep big salad", durationMinutes: 40, kind: "active", dependsOn: [], equipment: [] },
      ]),
    ];
    const graph = buildGraph(recipes, 0);
    const order = topologicalSort(graph);
    const target = 100;
    const { timings } = computeTimings(graph, order, target);

    // before resolution both default to their own latestStart (as-late-as-possible)
    expect(timings.c2.scheduledStart).toBe(80);
    expect(timings.br1.scheduledStart).toBe(90);

    const resolved = resolveEquipmentConflicts(graph, timings, [{ resourceId: "oven", capacity: 1 }]);

    expect(resolved.conflicts).toHaveLength(0);
    // chicken (less oven slack) keeps its default late placement
    expect(resolved.timings.c2.scheduledStart).toBe(80);
    expect(resolved.timings.c2.scheduledFinish).toBe(100);
    // bread (more slack) got pushed earlier so it finishes before the roast starts
    expect(resolved.timings.br1.scheduledFinish).toBeLessThanOrEqual(80);
    // the input map passed in is untouched — the resolver returns a new one
    expect(timings.br1.scheduledStart).toBe(90);
  });

  it("reports an unresolved conflict when there isn't enough slack to separate two steps", () => {
    const recipes = [
      recipe("a", [
        { id: "a1", recipeId: "a", description: "bake a", durationMinutes: 50, kind: "passive", dependsOn: [], equipment: [{ resourceId: "oven", tempF: 400 }] },
      ]),
      recipe("b", [
        { id: "b1", recipeId: "b", description: "bake b", durationMinutes: 50, kind: "passive", dependsOn: [], equipment: [{ resourceId: "oven", tempF: 350 }] },
      ]),
    ];
    const graph = buildGraph(recipes, 0);
    const order = topologicalSort(graph);
    const { timings } = computeTimings(graph, order, 50);

    const resolved = resolveEquipmentConflicts(graph, timings, [{ resourceId: "oven", capacity: 1 }]);

    expect(resolved.conflicts).toHaveLength(1);
    expect(resolved.conflicts[0].resolved).toBe(false);
    expect(resolved.conflicts[0].reason).toMatch(/temperature/i);
    expect(resolved.conflicts[0].stepIds.sort()).toEqual(["a1", "b1"]);
  });

  it("allows concurrent use up to the resource's capacity", () => {
    const recipes = [
      recipe("veg", [
        { id: "v1", recipeId: "veg", description: "saute peppers", durationMinutes: 10, kind: "active", dependsOn: [], equipment: [{ resourceId: "burner" }] },
        { id: "v2", recipeId: "veg", description: "saute onions", durationMinutes: 10, kind: "active", dependsOn: [], equipment: [{ resourceId: "burner" }] },
      ]),
    ];
    const graph = buildGraph(recipes, 0);
    const order = topologicalSort(graph);
    const { timings } = computeTimings(graph, order, 10);

    const resolved = resolveEquipmentConflicts(graph, timings, [{ resourceId: "burner", capacity: 4 }]);

    expect(resolved.conflicts).toHaveLength(0);
    expect(resolved.timings.v1.scheduledStart).toBe(0);
    expect(resolved.timings.v2.scheduledStart).toBe(0);
  });
});
