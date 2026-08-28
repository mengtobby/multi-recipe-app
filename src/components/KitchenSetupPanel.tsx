"use client";

import { useRecipeStore } from "@/lib/store/recipeStore";

export function KitchenSetupPanel() {
  const targetDateTime = useRecipeStore((s) => s.targetDateTime);
  const setTargetDateTime = useRecipeStore((s) => s.setTargetDateTime);
  const kitchenResources = useRecipeStore((s) => s.kitchenResources);
  const setKitchenCapacity = useRecipeStore((s) => s.setKitchenCapacity);
  const cooks = useRecipeStore((s) => s.cooks);
  const addCook = useRecipeStore((s) => s.addCook);
  const removeCook = useRecipeStore((s) => s.removeCook);

  return (
    <section className="rounded-lg border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
        Kitchen setup
      </h2>

      <label className="mb-4 block text-sm">
        <span className="mb-1 block font-medium">Target serving time</span>
        <input
          type="datetime-local"
          value={targetDateTime}
          onChange={(e) => setTargetDateTime(e.target.value)}
          className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-black/30"
        />
      </label>

      <div className="mb-4">
        <span className="mb-1 block text-sm font-medium">Equipment capacity</span>
        <div className="space-y-2">
          {kitchenResources.map((resource) => (
            <div key={resource.id} className="flex items-center justify-between gap-3 text-sm">
              <span>{resource.name}</span>
              <input
                type="number"
                min={1}
                value={resource.capacity}
                onChange={(e) => setKitchenCapacity(resource.id, Math.max(1, Number(e.target.value)))}
                className="w-16 rounded-md border border-black/15 bg-white px-2 py-1 text-right dark:border-white/20 dark:bg-black/30"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Cooks</span>
        <ul className="mb-2 space-y-1 text-sm">
          {cooks.map((cook) => (
            <li key={cook.id} className="flex items-center justify-between gap-2">
              <span>{cook.name}</span>
              {cooks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCook(cook.id)}
                  className="text-xs text-black/50 hover:text-red-600 dark:text-white/50"
                >
                  remove
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => addCook(`Cook ${cooks.length + 1}`)}
          className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          + add cook
        </button>
      </div>
    </section>
  );
}
