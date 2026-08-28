import type { Cook } from "@/types/recipe";

interface CookFilterTabsProps {
  cooks: Cook[];
  selectedCookId: string | null;
  onSelect: (cookId: string | null) => void;
}

export function CookFilterTabs({ cooks, selectedCookId, onSelect }: CookFilterTabsProps) {
  if (cooks.length <= 1) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          selectedCookId === null
            ? "bg-blue-600 text-white"
            : "bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/10 dark:text-white/60"
        }`}
      >
        Everyone
      </button>
      {cooks.map((cook) => (
        <button
          key={cook.id}
          type="button"
          onClick={() => onSelect(cook.id)}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            selectedCookId === cook.id
              ? "bg-blue-600 text-white"
              : "bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/10 dark:text-white/60"
          }`}
        >
          {cook.name}
        </button>
      ))}
    </div>
  );
}
