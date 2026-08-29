import type { Cook } from "@/types/recipe";

interface CookFilterTabsProps {
  cooks: Cook[];
  selectedCookId: string | null;
  onSelect: (cookId: string | null) => void;
}

function tabClassName(active: boolean): string {
  const state = active
    ? "bg-blue-600 text-white"
    : "bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/10 dark:text-white/60";
  return `rounded-full px-3 py-1 text-xs font-medium ${state}`;
}

export function CookFilterTabs({ cooks, selectedCookId, onSelect }: CookFilterTabsProps) {
  if (cooks.length <= 1) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => onSelect(null)} className={tabClassName(selectedCookId === null)}>
        Everyone
      </button>
      {cooks.map((cook) => (
        <button
          key={cook.id}
          type="button"
          onClick={() => onSelect(cook.id)}
          className={tabClassName(selectedCookId === cook.id)}
        >
          {cook.name}
        </button>
      ))}
    </div>
  );
}
