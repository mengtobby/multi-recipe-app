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

  const bumpCapacity = (resourceId: string, current: number, delta: number) => {
    setKitchenCapacity(resourceId, Math.max(1, current + delta));
  };

  return (
    <section className="relative rounded-sm border border-[var(--paper-edge)] bg-[var(--paper)] p-4 pt-6 shadow-[2px_5px_10px_var(--board-edge)]">
      <RailClip />
      <h2 className="font-marker mb-4 text-lg text-[var(--ink)]">Kitchen setup</h2>

      <label className="mb-5 block">
        <span className="mb-1 flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]">
          <ClockIcon /> Target serving time
        </span>
        <input
          type="datetime-local"
          value={targetDateTime}
          onChange={(e) => setTargetDateTime(e.target.value)}
          className="w-full rounded-sm border border-[var(--frame-light)] bg-[var(--board)] px-3 py-2 font-mono text-sm tabular-nums text-[var(--ink)]"
        />
      </label>

      <div className="mb-5">
        <span className="mb-2 block text-sm font-medium text-[var(--ink)]">Equipment capacity</span>
        <div className="space-y-2">
          {kitchenResources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between gap-3 rounded-sm bg-[var(--board)]/60 px-2 py-1.5"
            >
              <span className="text-sm text-[var(--ink)]">{resource.name}</span>
              <div className="flex items-center gap-1.5">
                <StepperButton
                  label={`Decrease ${resource.name} capacity`}
                  onClick={() => bumpCapacity(resource.id, resource.capacity, -1)}
                >
                  −
                </StepperButton>
                <span className="w-6 text-center font-mono text-sm tabular-nums text-[var(--ink)]">
                  {resource.capacity}
                </span>
                <StepperButton
                  label={`Increase ${resource.name} capacity`}
                  onClick={() => bumpCapacity(resource.id, resource.capacity, 1)}
                >
                  +
                </StepperButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-[var(--ink)]">Cooks on the line</span>
        <ul className="mb-2 flex flex-wrap gap-2">
          {cooks.map((cook) => (
            <li
              key={cook.id}
              className="flex items-center gap-1.5 rounded-sm border border-[var(--frame-light)] bg-[var(--board)] px-2 py-1 text-sm text-[var(--ink)]"
            >
              {cook.name}
              {cooks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCook(cook.id)}
                  aria-label={`Remove ${cook.name}`}
                  className="text-[var(--ink-faint)] hover:text-[var(--red)]"
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => addCook(`Cook ${cooks.length + 1}`)}
          className="text-sm font-medium text-[var(--ink-muted)] underline decoration-dotted underline-offset-4 hover:text-[var(--ink)]"
        >
          + clip a cook
        </button>
      </div>
    </section>
  );
}

function StepperButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-6 w-6 items-center justify-center rounded-sm border border-[var(--frame-light)] bg-[var(--paper)] text-sm leading-none text-[var(--ink)] shadow-[1px_1px_2px_var(--board-edge)] hover:bg-[var(--board)] active:translate-y-px active:shadow-none"
    >
      {children}
    </button>
  );
}

function RailClip() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 18"
      className="absolute -top-3 left-4 h-4 w-7"
      style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.35))" }}
    >
      <path d="M3 13 L9 2 H23 L29 13 Z" fill="var(--frame-light)" stroke="var(--frame-dark)" strokeWidth="1" />
      <rect x="12.5" y="5" width="7" height="10" rx="1.2" fill="var(--frame-dark)" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 6v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
