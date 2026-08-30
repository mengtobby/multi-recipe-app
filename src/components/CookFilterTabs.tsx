import type { Cook } from "@/types/recipe";

interface CookFilterTabsProps {
  cooks: Cook[];
  selectedCookId: string | null;
  onSelect: (cookId: string | null) => void;
}

function tagClassName(active: boolean): string {
  const state = active
    ? "border-[var(--frame)] bg-[var(--frame)] text-[var(--board)]"
    : "border-[var(--frame-light)] bg-[var(--paper)] text-[var(--ink-muted)] hover:text-[var(--ink)]";
  return `rounded-sm border px-3 py-1 text-xs font-medium ${state}`;
}

export function CookFilterTabs({ cooks, selectedCookId, onSelect }: CookFilterTabsProps) {
  if (cooks.length <= 1) return null;

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter timeline by cook">
      <button
        type="button"
        role="tab"
        aria-selected={selectedCookId === null}
        onClick={() => onSelect(null)}
        className={tagClassName(selectedCookId === null)}
      >
        Everyone
      </button>
      {cooks.map((cook) => (
        <button
          key={cook.id}
          type="button"
          role="tab"
          aria-selected={selectedCookId === cook.id}
          onClick={() => onSelect(cook.id)}
          className={tagClassName(selectedCookId === cook.id)}
        >
          {cook.name}
        </button>
      ))}
    </div>
  );
}
