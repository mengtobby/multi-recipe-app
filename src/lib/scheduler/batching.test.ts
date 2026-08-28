import { describe, expect, it } from "vitest";
import type { Recipe } from "@/types/recipe";
import { buildGraph, topologicalSort } from "./graph";
import { computeTimings } from "./timing";
import { buildTimeline } from "./batching";

function recipe(id: string, steps: Recipe["steps"]): Recipe {
  return { id, name: id, color: "#000", steps };
}

describe("buildTimeline", () => {
  it("combines same-batchKey steps scheduled at the same time into one entry", () => {
    const recipes = [
      recipe("pasta", [
        { id: "p-garlic", recipeId: "pasta", description: "Chop 2 garlic cloves for the pasta", durationMinutes: 3, kind: "active", dependsOn: [], equipment: [], batchKey: "chop-garlic" },
      ]),
      recipe("sauce", [
        { id: "s-garlic", recipeId: "sauce", description: "Chop 2 garlic cloves for the sauce", durationMinutes: 3, kind: "active", dependsOn: [], equipment: [], batchKey: "chop-garlic" },
      ]),
    ];
    const graph = buildGraph(recipes, 0);
    const order = topologicalSort(graph);
    const { timings } = computeTimings(graph, order, 3);

    const timeline = buildTimeline(graph, timings, order);

    const garlicEntry = timeline.find((e) => e.stepIds.includes("p-garlic"));
    expect(garlicEntry?.stepIds.sort()).toEqual(["p-garlic", "s-garlic"]);
    expect(garlicEntry?.description).toContain("pasta");
    expect(garlicEntry?.description).toContain("sauce");
  });

  it("returns entries sorted chronologically by scheduled start", () => {
    const recipes = [
      recipe("chicken", [
        { id: "c1", recipeId: "chicken", description: "season", durationMinutes: 5, kind: "active", dependsOn: [], equipment: [] },
        { id: "c2", recipeId: "chicken", description: "roast", durationMinutes: 50, kind: "passive", dependsOn: ["c1"], equipment: [] },
      ]),
    ];
    const graph = buildGraph(recipes, 2);
    const order = topologicalSort(graph);
    const { timings } = computeTimings(graph, order, 1000);

    const timeline = buildTimeline(graph, timings, order);

    const starts = timeline.map((e) => e.start);
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
    expect(timeline[0].stepIds).toEqual(["c1"]);
  });
});
