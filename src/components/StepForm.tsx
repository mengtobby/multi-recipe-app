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
  durationMinutes: 15,
  kind: "active",
  dependsOn: [],
  equipment: [],
});

/** True when a step already uses one of the fields tucked behind "More options",
 *  so editing it opens with those options visible instead of hiding what's set. */
function hasAdvancedOptionsSet(input: NewStepInput): boolean {
  return Boolean(input.assignedCook || input.batchKey || input.dependsOn.length > 0);
}

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
  const [showMore, setShowMore] = useState(() => hasAdvancedOptionsSet(input));
  const [error, setError] = useState<string | null>(null);

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
    if (!input.description.trim()) {
      setError("Please describe what this step is.");
      return;
    }
    if (!Number.isFinite(input.durationMinutes) || input.durationMinutes <= 0) {
      setError("Duration must be at least 1 minute.");
      return;
    }
    setError(null);
    if (editingStep) {
      updateStep(recipeId, editingStep.id, input);
    } else {
      addStep(recipeId, input);
    }
    onDone();
  };

  return (
    <div className="space-y-3 rounded-sm border border-[var(--ink-faint)]/40 bg-[var(--paper)] p-3 text-sm text-[var(--ink)] shadow-[2px_4px_6px_var(--board-edge)]">
      <label className="block">
        <span className="mb-1 block font-medium">What&apos;s this step?</span>
        <input
          type="text"
          value={input.description}
          onChange={(e) => setInput((p) => ({ ...p, description: e.target.value }))}
          placeholder='e.g. "Season chicken & place in oven"'
          className="w-full rounded-sm border border-[var(--ink-faint)]/40 bg-[var(--board)] px-3 py-2 placeholder:text-[var(--ink-faint)]"
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
            className="w-full rounded-sm border border-[var(--ink-faint)]/40 bg-[var(--board)] px-3 py-2 font-mono tabular-nums"
          />
        </label>
        <label className="flex-1">
          <span className="mb-1 block font-medium">Type</span>
          <select
            value={input.kind}
            onChange={(e) => setInput((p) => ({ ...p, kind: e.target.value as StepKind }))}
            className="w-full rounded-sm border border-[var(--ink-faint)]/40 bg-[var(--board)] px-3 py-2"
          >
            <option value="active">Active (hands-on)</option>
            <option value="passive">Passive (unattended)</option>
          </select>
        </label>
      </div>

      <div>
        <span className="mb-1 block font-medium">Equipment (optional)</span>
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
                    className="accent-[var(--frame)]"
                  />
                  {resource.name}
                </label>
                {usage && resource.supportsTemperature && (
                  <input
                    type="number"
                    placeholder="°F"
                    value={usage.tempF ?? ""}
                    onChange={(e) => setEquipmentTemp(resource.id, e.target.value ? Number(e.target.value) : undefined)}
                    className="w-20 rounded-sm border border-[var(--ink-faint)]/40 bg-[var(--board)] px-2 py-1 text-right font-mono tabular-nums"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!showMore && (
        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="text-xs font-medium text-[var(--ink-muted)] underline decoration-dotted underline-offset-4 hover:text-[var(--ink)]"
        >
          + more options (cook, timing with other steps)
        </button>
      )}

      {showMore && (
        <div className="space-y-3 border-t border-[var(--ink-faint)]/30 pt-3">
          {cooks.length > 1 && (
            <label className="block">
              <span className="mb-1 block font-medium">Who&apos;s doing this?</span>
              <select
                value={input.assignedCook ?? ""}
                onChange={(e) => setInput((p) => ({ ...p, assignedCook: e.target.value || undefined }))}
                className="w-full rounded-sm border border-[var(--ink-faint)]/40 bg-[var(--board)] px-3 py-2"
              >
                <option value="">Anyone</option>
                {cooks.map((cook) => (
                  <option key={cook.id} value={cook.id}>
                    {cook.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          {availableDependencies.length > 0 && (
            <div>
              <span className="mb-1 block font-medium">Wait for another step to finish first (optional)</span>
              <div className="max-h-32 space-y-1 overflow-y-auto">
                {availableDependencies.map((dep) => (
                  <label key={dep.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={input.dependsOn.includes(dep.id)}
                      onChange={(e) => toggleDependency(dep.id, e.target.checked)}
                      className="accent-[var(--frame)]"
                    />
                    {dep.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          <label className="block">
            <span className="mb-1 block font-medium">Combine with matching steps (optional)</span>
            <input
              type="text"
              value={input.batchKey ?? ""}
              onChange={(e) => setInput((p) => ({ ...p, batchKey: e.target.value || undefined }))}
              placeholder='e.g. "garlic" — steps sharing this word merge into one when they happen together'
              className="w-full rounded-sm border border-[var(--ink-faint)]/40 bg-[var(--board)] px-3 py-2 placeholder:text-[var(--ink-faint)]"
            />
          </label>
        </div>
      )}

      {error && <p className="text-xs font-medium text-[var(--red-ink)]">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={submit}
          className="rounded-sm bg-[var(--frame)] px-3 py-1.5 font-medium text-[var(--frame-label)] hover:bg-[var(--frame-dark)]"
        >
          {editingStep ? "Save step" : "Add step"}
        </button>
        <button type="button" onClick={onDone} className="px-3 py-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)]">
          Cancel
        </button>
      </div>
    </div>
  );
}
