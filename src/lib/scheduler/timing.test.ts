import { describe, expect, it } from "vitest";
import type { Recipe } from "@/types/recipe";
import { buildGraph, topologicalSort } from "./graph";
import { computeTimings } from "./timing";
import { SERVE_NODE_ID } from "./types";

function recipe(id: string, steps: Recipe["steps"]): Recipe {
  return { id, name: id, color: "#000", steps };
}

describe("computeTimings", () => {
  it("schedules independent chains to finish exactly at the target by default", () => {
    // chicken: 5 min active + 50 min passive = 55 min chain
    // asparagus: 15 min passive chain, starts later since it's shorter
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
    const target = 1000; // arbitrary epoch-minute target

    const { timings, minimumDurationMinutes } = computeTimings(graph, order, target);

    // critical path: c1(5) + c2(50) + serve(2) = 57
    expect(minimumDurationMinutes).toBe(57);
    expect(timings[SERVE_NODE_ID].latestFinish).toBe(target);
    expect(timings.c2.latestFinish).toBe(target - 2);
    expect(timings.c1.latestStart).toBe(target - 57);
    // asparagus has slack: its own chain (15) is shorter than the critical path (57)
    expect(timings.a1.slackMinutes).toBeGreaterThan(0);
    expect(timings.c1.slackMinutes).toBe(0);
  });

  it("schedules a single-chain recipe to start as late as possible with zero slack", () => {
    const recipes = [
      recipe("soup", [
        { id: "s1", recipeId: "soup", description: "simmer", durationMinutes: 10, kind: "passive", dependsOn: [], equipment: [] },
      ]),
    ];
    const graph = buildGraph(recipes, 0);
    const order = topologicalSort(graph);

    const { timings, minimumDurationMinutes } = computeTimings(graph, order, 100);

    expect(minimumDurationMinutes).toBe(10);
    // with nothing else to coordinate around, the only step is on the critical
    // path: it starts as late as possible and has no flexibility of its own.
    expect(timings.s1.latestStart).toBe(90);
    expect(timings.s1.earliestStart).toBe(90);
    expect(timings.s1.slackMinutes).toBe(0);
  });
});
