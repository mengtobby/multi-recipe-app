"use client";

import { useState } from "react";
import { KitchenSetupPanel } from "@/components/KitchenSetupPanel";
import { RecipeBuilder } from "@/components/RecipeBuilder";
import { TimelineView } from "@/components/TimelineView";
import { useSchedule } from "@/lib/store/useSchedule";
import { useRecipeStore } from "@/lib/store/recipeStore";
import { formatClockTime } from "@/lib/format";
import type { ScheduleResult } from "@/lib/scheduler";

type MobileTab = "timeline" | "setup";

export default function Home() {
  const { schedule, timeline, error } = useSchedule();
  const recipes = useRecipeStore((s) => s.recipes);
  const cooks = useRecipeStore((s) => s.cooks);
  const [mobileTab, setMobileTab] = useState<MobileTab>("timeline");

  const setupPanelClass = mobileTab === "setup" ? "block" : "hidden lg:block";
  const timelinePanelClass = mobileTab === "timeline" ? "block" : "hidden lg:block";
  const activeDishCount = recipes.filter((r) => r.steps.length > 0).length;

  return (
    <div className="min-h-full bg-[var(--wall)]">
      <header className="bg-[var(--frame)] px-4 py-5 text-center sm:py-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--frame-label)] opacity-80">
          Home Kitchen
        </p>
        <h1 className="font-display mt-1 text-4xl font-bold text-[var(--frame-label)] sm:text-5xl">
          Sunday Table
        </h1>
      </header>

      <div className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-8">
        <HeroCard
          schedule={schedule}
          error={error}
          dishCount={activeDishCount}
          cookCount={cooks.length}
        />

        <nav className="mt-5 flex gap-2 border-b border-[var(--board-edge)] pb-3 lg:hidden">
          <TabButton active={mobileTab === "timeline"} onClick={() => setMobileTab("timeline")}>
            Tonight
          </TabButton>
          <TabButton active={mobileTab === "setup"} onClick={() => setMobileTab("setup")}>
            Setup &amp; menu
          </TabButton>
        </nav>

        <main className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[340px_1fr] lg:gap-6">
          <div className={`${setupPanelClass} space-y-5`}>
            <KitchenSetupPanel />
            <RecipeBuilder />
          </div>

          <div className={timelinePanelClass}>
            {error && (
              <div className="flex items-start gap-3 rounded-sm border-2 border-[var(--red)] bg-[var(--red-surface)] p-4 text-sm font-medium text-[var(--red-ink)]">
                <WarningIcon />
                <span>{error}</span>
              </div>
            )}
            {!error && schedule && <TimelineView schedule={schedule} timeline={timeline} />}
            {!error && !schedule && (
              <div className="rounded-sm border border-[var(--paper-edge)] bg-[var(--paper)] p-10 text-center shadow-[2px_5px_10px_var(--board-edge)]">
                <p className="font-display text-2xl font-semibold text-[var(--ink)]">
                  Set tonight&apos;s table
                </p>
                <p className="mx-auto mt-2 max-w-xs text-sm text-[var(--ink-muted)]">
                  Add a target serving time and at least one dish to see the synced timeline.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

interface HeroCardProps {
  schedule: ScheduleResult | null;
  error: string | null;
  dishCount: number;
  cookCount: number;
}

function HeroCard({ schedule, error, dishCount, cookCount }: HeroCardProps) {
  if (error || !schedule) return null;

  const conflictCount = schedule.conflicts.length;
  const dishWord = dishCount === 1 ? "dish" : "dishes";
  const servingLine =
    cookCount > 1 ? `${dishCount} ${dishWord} · ${cookCount} cooks` : `${dishCount} ${dishWord}, one timeline`;

  return (
    <section
      className="rounded-sm bg-[var(--paper)] p-6 shadow-[3px_8px_20px_var(--board-edge)] sm:p-9"
      style={{ borderTop: "5px solid var(--frame)" }}
    >
      <p className="font-display text-4xl font-bold leading-tight text-[var(--ink)] sm:text-5xl">
        {schedule.isFeasible ? <>Dinner&apos;s at {formatClockTime(schedule.targetEpochMinutes)}</> : <>Not enough time before dinner</>}
      </p>
      <p className="mt-2 text-sm text-[var(--ink-muted)]">{servingLine}</p>

      {!schedule.isFeasible && (
        <p className="mt-4 flex items-center gap-2 rounded-sm border-2 border-[var(--red)] bg-[var(--red-surface)] px-3 py-2 text-sm font-semibold text-[var(--red-ink)]">
          <WarningIcon />
          Start earlier or simplify the menu to make the target.
        </p>
      )}
      {schedule.isFeasible && conflictCount > 0 && (
        <p className="mt-4 flex items-center gap-2 rounded-sm border-2 border-[var(--amber)] bg-[var(--amber-surface)] px-3 py-2 text-sm font-semibold text-[var(--amber-ink)]">
          <WarningIcon />
          {conflictCount} equipment {conflictCount === 1 ? "conflict needs" : "conflicts need"} attention.
        </p>
      )}
      {schedule.isFeasible && conflictCount === 0 && (
        <p className="mt-4 text-sm font-medium text-[var(--green)]">Everything&apos;s on track.</p>
      )}
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-t-sm px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-[var(--paper)] text-[var(--ink)] shadow-[0_-2px_0_var(--frame)_inset]"
          : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M10 2.5 18.5 17H1.5L10 2.5Z" strokeLinejoin="round" />
      <path d="M10 8v4" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
