"use client";

import { useState } from "react";
import type { StepKind, RecipeStep } from "@/types/recipe";
import type { NewStepInput } from "@/lib/store/recipeStore";
import { useRecipeStore } from "@/lib/store/recipeStore";

interface StepFormProps {
  recipeId: string;
  /** Steps eligible as dependencies: every step across every recipe except this recipe's own. */
  availableDependencies: { id: string; label: string }[];
  editingStep?: RecipeStep;
  onDone: () => void;
}

const emptyInput = (): NewStepInput => ({
  description: "",
  durationMinutes: 5,
  kind: "active",
  dependsOn: [],
  equipment: [],
});

export function StepForm({ recipeId, availableDependencies, editingStep, onDone }: StepFormProps) {
  const addStep = useRecipeStore((s) => s.addStep);
  const updateStep = useRecipeStore((s) => s.updateStep);
  const cooks = useRecipeStore((s) => s.cooks);
  const kitchenResources = useRecipeStore((s) => s.kitchenResources);

  const [input, setInput] = useState<NewStepInput>(() =>
    editingStep
      ? {
          description: editingStep.description,
          durationMinutes: editingStep.durationMinutes,
          kind: editingStep.kind,
          dependsOn: editingStep.dependsOn,
          equipment: editingStep.equipment,
          assignedCook: editingStep.assignedCook,
          batchKey: editingStep.batchKey,
        }
      : emptyInput()
  );

  const toggleEquipment = (resourceId: string, checked: boolean) => {
    setInput((prev) => ({
      ...prev,
      equipment: checked
        ? [...prev.equipment, { resourceId }]
        : prev.equipment.filter((e) => e.resourceId !== resourceId),
    }));
  };

  const setEquipmentTemp = (resourceId: string, tempF: number | undefined) => {
    setInput((prev) => ({
      ...prev,
      equipment: prev.equipment.map((e) => (e.resourceId === resourceId ? { ...e, tempF } : e)),
    }));
  };

  const toggleDependency = (stepId: string, checked: boolean) => {
    setInput((prev) => ({
      ...prev,
      dependsOn: checked ? [...prev.dependsOn, stepId] : prev.dependsOn.filter((d) => d !== stepId),
    }));
  };

  const submit = () => {
    if (!input.description.trim() || !Number.isFinite(input.durationMinutes) || input.durationMinutes <= 0) return;
    if (editingStep) {
      updateStep(recipeId, editingStep.id, input);
    } else {
      addStep(recipeId, input);
    }
    onDone();
  };

  return (
    <div className="space-y-3 rounded-md border border-black/10 bg-black/[0.02] p-3 text-sm dark:border-white/10 dark:bg-white/5">
      <label className="block">
        <span className="mb-1 block font-medium">Step description</span>
        <input
          type="text"
          value={input.description}
          onChange={(e) => setInput((p) => ({ ...p, description: e.target.value }))}
          placeholder='e.g. "Season chicken & place in oven"'
          className="w-full rounded-md border border-black/15 bg-white px-3 py-2 dark:border-white/20 dark:bg-black/30"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex-1">
          <span className="mb-1 block font-medium">Duration (min)</span>
          <input
            type="number"
            min={1}
            value={input.durationMinutes}
            onChange={(e) => setInput((p) => ({ ...p, durationMinutes: Number(e.target.value) }))}
            className="w-full rounded-md border border-black/15 bg-white px-3 py-2 dark:border-white/20 dark:bg-black/30"
          />
        </label>
        <label className="flex-1">
          <span className="mb-1 block font-medium">Type</span>
          <select
            value={input.kind}
            onChange={(e) => setInput((p) => ({ ...p, kind: e.target.value as StepKind }))}
            className="w-full rounded-md border border-black/15 bg-white px-3 py-2 dark:border-white/20 dark:bg-black/30"
          >
            <option value="active">Active (hands-on)</option>
            <option value="passive">Passive (unattended)</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-medium">Assigned cook</span>
        <select
          value={input.assignedCook ?? ""}
          onChange={(e) => setInput((p) => ({ ...p, assignedCook: e.target.value || undefined }))}
          className="w-full rounded-md border border-black/15 bg-white px-3 py-2 dark:border-white/20 dark:bg-black/30"
        >
          <option value="">Unassigned</option>
          {cooks.map((cook) => (
            <option key={cook.id} value={cook.id}>
              {cook.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">Batch key (optional)</span>
        <input
          type="text"
          value={input.batchKey ?? ""}
          onChange={(e) => setInput((p) => ({ ...p, batchKey: e.target.value || undefined }))}
          placeholder='e.g. "chop-garlic" — combines with same-key steps at the same time'
          className="w-full rounded-md border border-black/15 bg-white px-3 py-2 dark:border-white/20 dark:bg-black/30"
        />
      </label>

      <div>
        <span className="mb-1 block font-medium">Equipment</span>
        <div className="space-y-1">
          {kitchenResources.map((resource) => {
            const usage = input.equipment.find((e) => e.resourceId === resource.id);
            return (
              <div key={resource.id} className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!usage}
                    onChange={(e) => toggleEquipment(resource.id, e.target.checked)}
                  />
                  {resource.name}
                </label>
                {usage && resource.id === "oven" && (
                  <input
                    type="number"
                    placeholder="°F"
                    value={usage.tempF ?? ""}
                    onChange={(e) => setEquipmentTemp(resource.id, e.target.value ? Number(e.target.value) : undefined)}
                    className="w-20 rounded-md border border-black/15 bg-white px-2 py-1 text-right dark:border-white/20 dark:bg-black/30"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {availableDependencies.length > 0 && (
        <div>
          <span className="mb-1 block font-medium">Depends on</span>
          <div className="max-h-32 space-y-1 overflow-y-auto">
            {availableDependencies.map((dep) => (
              <label key={dep.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={input.dependsOn.includes(dep.id)}
                  onChange={(e) => toggleDependency(dep.id, e.target.checked)}
                />
                {dep.label}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={submit}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
        >
          {editingStep ? "Save step" : "Add step"}
        </button>
        <button type="button" onClick={onDone} className="px-3 py-1.5 text-black/60 dark:text-white/60">
          Cancel
        </button>
      </div>
    </div>
  );
}
