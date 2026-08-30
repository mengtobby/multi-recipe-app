import { describe, expect, it } from "vitest";
import type { Recipe } from "@/types/recipe";
import { buildSchedule, timelineFor } from "./index";

function recipe(id: string, steps: Recipe["steps"]): Recipe {
  return { id, name: id, color: "#000", steps };
}

describe("buildSchedule", () => {
  it("builds a valid one-entry schedule for a dish with no steps yet", () => {
    // A dish added before its first step exists should still produce a
    // schedule (just the "plate and serve" entry), not throw — this is
    // what lets the timeline appear as soon as a dish is added, rather
    // than staying blank until the user also adds a step.
    const recipes = [recipe("chicken", [])];

    const schedule = buildSchedule(recipes, 1000);
    const timeline = timelineFor(schedule);

    expect(schedule.conflicts).toEqual([]);
    expect(timeline).toHaveLength(1);
    expect(timeline[0].description).toBe("Plate and serve");
  });
});
