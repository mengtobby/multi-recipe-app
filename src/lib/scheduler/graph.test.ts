import { describe, expect, it } from "vitest";
import type { Recipe } from "@/types/recipe";
import { buildGraph, ScheduleCycleError, topologicalSort, UnknownDependencyError } from "./graph";
import { SERVE_NODE_ID } from "./types";

function recipe(id: string, steps: Recipe["steps"]): Recipe {
  return { id, name: id, color: "#000", steps };
}

describe("buildGraph", () => {
  it("wires every step with no dependents into the synthetic serve node", () => {
    const recipes = [
      recipe("chicken", [
        { id: "c1", recipeId: "chicken", description: "season", durationMinutes: 5, kind: "active", dependsOn: [], equipment: [] },
        { id: "c2", recipeId: "chicken", description: "roast", durationMinutes: 50, kind: "passive", dependsOn: ["c1"], equipment: [] },
      ]),
      recipe("asparagus", [
        { id: "a1", recipeId: "asparagus", description: "roast", durationMinutes: 15, kind: "passive", dependsOn: [], equipment: [] },
      ]),
    ];

    const graph = buildGraph(recipes);

    expect(graph[SERVE_NODE_ID].dependsOn.sort()).toEqual(["a1", "c2"]);
    expect(graph.c1.dependsOn).toEqual([]);
  });

  it("produces just the serve node for a dish with no steps yet", () => {
    const recipes = [recipe("chicken", [])];

    const graph = buildGraph(recipes);

    expect(Object.keys(graph)).toEqual([SERVE_NODE_ID]);
    expect(graph[SERVE_NODE_ID].dependsOn).toEqual([]);
  });

  it("throws UnknownDependencyError for a dangling dependency", () => {
    const recipes = [
      recipe("chicken", [
        { id: "c1", recipeId: "chicken", description: "season", durationMinutes: 5, kind: "active", dependsOn: ["ghost"], equipment: [] },
      ]),
    ];

    expect(() => buildGraph(recipes)).toThrow(UnknownDependencyError);
  });
});

describe("topologicalSort", () => {
  it("orders steps before their dependents", () => {
    const recipes = [
      recipe("chicken", [
        { id: "c1", recipeId: "chicken", description: "season", durationMinutes: 5, kind: "active", dependsOn: [], equipment: [] },
        { id: "c2", recipeId: "chicken", description: "roast", durationMinutes: 50, kind: "passive", dependsOn: ["c1"], equipment: [] },
      ]),
    ];
    const graph = buildGraph(recipes);

    const order = topologicalSort(graph);

    expect(order.indexOf("c1")).toBeLessThan(order.indexOf("c2"));
    expect(order[order.length - 1]).toBe(SERVE_NODE_ID);
  });

  it("throws ScheduleCycleError when steps depend on each other circularly", () => {
    const recipes = [
      recipe("chicken", [
        { id: "c1", recipeId: "chicken", description: "a", durationMinutes: 5, kind: "active", dependsOn: ["c2"], equipment: [] },
        { id: "c2", recipeId: "chicken", description: "b", durationMinutes: 5, kind: "active", dependsOn: ["c1"], equipment: [] },
      ]),
    ];
    const graph = buildGraph(recipes);

    expect(() => topologicalSort(graph)).toThrow(ScheduleCycleError);
  });
});
