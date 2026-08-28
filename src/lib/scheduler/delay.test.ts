import { describe, expect, it } from "vitest";
import type { Recipe } from "@/types/recipe";
import { buildGraph, topologicalSort } from "./graph";
import { computeTimings } from "./timing";
import { applyDelay } from "./delay";
import { SERVE_NODE_ID } from "./types";

function recipe(id: string, steps: Recipe["steps"]): Recipe {
  return { id, name: id, color: "#000", steps };
}

describe("applyDelay", () => {
  it("pushes dependent steps forward when a prerequisite runs long", () => {
    const recipes = [
      recipe("chicken", [
        { id: "c1", recipeId: "chicken", description: "season", durationMinutes: 5, kind: "active", dependsOn: [], equipment: [] },
        { id: "c2", recipeId: "chicken", description: "roast", durationMinutes: 50, kind: "passive", dependsOn: ["c1"], equipment: [] },
      ]),
    ];
    const graph = buildGraph(recipes, 2);
    const order = topologicalSort(graph);
    const { timings } = computeTimings(graph, order, 1000);

    const result = applyDelay(graph, timings, order, "c1", 5);

    expect(result.affectedStepIds.sort()).toEqual(["c1", "c2", SERVE_NODE_ID].sort());
    expect(result.timings.c1.scheduledFinish).toBe(timings.c1.scheduledFinish + 5);
    expect(result.timings.c2.scheduledStart).toBe(result.timings.c1.scheduledFinish);
    expect(result.timings.c2.scheduledFinish).toBe(timings.c2.scheduledFinish + 5);
    expect(result.targetOverrunMinutes).toBe(5);
    // input untouched
    expect(timings.c2.scheduledStart).not.toBe(result.timings.c2.scheduledStart);
  });

  it("never touches an unrelated recipe's steps, even though it still pushes the shared serve time", () => {
    const recipes = [
      recipe("chicken", [
        { id: "c1", recipeId: "chicken", description: "season", durationMinutes: 5, kind: "active", dependsOn: [], equipment: [] },
        { id: "c2", recipeId: "chicken", description: "roast", durationMinutes: 50, kind: "passive", dependsOn: ["c1"], equipment: [] },
      ]),
      recipe("asparagus", [
        { id: "a1", recipeId: "asparagus", description: "roast", durationMinutes: 15, kind: "passive", dependsOn: [], equipment: [] },
      ]),
    ];
    const graph = buildGraph(recipes, 2);
    const order = topologicalSort(graph);
    const { timings } = computeTimings(graph, order, 1000);

    const result = applyDelay(graph, timings, order, "a1", 3);

    // chicken's chain shares no dependency edge with asparagus, so it's untouched
    expect(result.timings.c1).toBe(timings.c1);
    expect(result.timings.c2).toBe(timings.c2);
    // but the default schedule packs every step tight against its successor,
    // so the delay still surfaces as the shared serve time slipping
    expect(result.affectedStepIds.sort()).toEqual(["a1", SERVE_NODE_ID].sort());
    expect(result.targetOverrunMinutes).toBe(3);
  });
});
