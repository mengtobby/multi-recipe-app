// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { useRecipeStore } from "./recipeStore";

function resetStore() {
  useRecipeStore.setState({
    recipes: [],
    cooks: [{ id: "cook-1", name: "Cook 1" }],
    delays: {},
  });
}

describe("recipeStore", () => {
  beforeEach(resetStore);

  it("strips a removed step from every other recipe's dependsOn, not just its own", () => {
    const { addRecipe } = useRecipeStore.getState();
    const chickenId = addRecipe("Chicken");
    const asparagusId = addRecipe("Asparagus");

    const seasonId = useRecipeStore.getState().addStep(chickenId, {
      description: "season",
      durationMinutes: 5,
      kind: "active",
      dependsOn: [],
      equipment: [],
    });
    useRecipeStore.getState().addStep(asparagusId, {
      description: "roast (after chicken is seasoned, shares the oven timing)",
      durationMinutes: 15,
      kind: "passive",
      dependsOn: [seasonId],
      equipment: [],
    });

    useRecipeStore.getState().removeStep(chickenId, seasonId);

    const asparagusStep = useRecipeStore.getState().recipes.find((r) => r.id === asparagusId)!.steps[0];
    expect(asparagusStep.dependsOn).toEqual([]);
  });

  it("strips dangling dependencies when an entire recipe is removed", () => {
    const { addRecipe } = useRecipeStore.getState();
    const chickenId = addRecipe("Chicken");
    const asparagusId = addRecipe("Asparagus");

    const seasonId = useRecipeStore.getState().addStep(chickenId, {
      description: "season",
      durationMinutes: 5,
      kind: "active",
      dependsOn: [],
      equipment: [],
    });
    useRecipeStore.getState().addStep(asparagusId, {
      description: "roast",
      durationMinutes: 15,
      kind: "passive",
      dependsOn: [seasonId],
      equipment: [],
    });

    useRecipeStore.getState().removeRecipe(chickenId);

    const asparagusStep = useRecipeStore.getState().recipes.find((r) => r.id === asparagusId)!.steps[0];
    expect(asparagusStep.dependsOn).toEqual([]);
  });
});
