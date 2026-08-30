"use client";

import { KitchenSetupPanel } from "@/components/KitchenSetupPanel";
import { RecipeBuilder } from "@/components/RecipeBuilder";
import { TimelineView } from "@/components/TimelineView";
import { useSchedule } from "@/lib/store/useSchedule";

export default function Home() {
  const { schedule, timeline, error } = useSchedule();

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <header className="border-b border-black/10 bg-white/70 px-6 py-4 dark:border-white/10 dark:bg-black/40">
        <h1 className="text-lg font-semibold">Multi-Recipe Meal Coordinator</h1>
        <p className="text-sm text-black/50 dark:text-white/50">
          Add every dish for the meal and a target serving time — get one synced timeline for the whole kitchen.
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <KitchenSetupPanel />
          <RecipeBuilder />
        </div>

        <div>
          {error && (
            <p className="rounded-lg border border-red-400/60 bg-red-50 p-3 text-sm text-red-800 dark:border-red-400/30 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </p>
          )}
          {!error && schedule && <TimelineView schedule={schedule} timeline={timeline} />}
          {!error && !schedule && (
            <div className="rounded-lg border border-dashed border-black/15 p-8 text-center text-sm text-black/50 dark:border-white/15 dark:text-white/50">
              Set a target serving time and add at least one dish to see the synced timeline.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
