"use client";

import { useState } from "react";
import { KitchenSetupPanel } from "@/components/KitchenSetupPanel";
import { RecipeBuilder } from "@/components/RecipeBuilder";
import { TimelineView } from "@/components/TimelineView";
import { useSchedule } from "@/lib/store/useSchedule";

type MobileTab = "timeline" | "setup";

export default function Home() {
  const { schedule, timeline, error } = useSchedule();
  const [mobileTab, setMobileTab] = useState<MobileTab>("timeline");

  const setupPanelClass = mobileTab === "setup" ? "block" : "hidden lg:block";
  const timelinePanelClass = mobileTab === "timeline" ? "block" : "hidden lg:block";

  return (
    <div className="min-h-full bg-[var(--wall)] px-3 py-4 sm:px-6 sm:py-8">
      <div
        className="mx-auto max-w-6xl rounded-md border-[3px] border-[var(--frame)] bg-[var(--board)] shadow-[0_18px_45px_var(--wall-shadow)]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--board-edge) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      >
        {/* mounting rail */}
        <div className="flex items-center gap-4 rounded-t-[3px] bg-[var(--frame)] px-4 py-2 sm:px-6">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--frame-light)]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--frame-light)]" aria-hidden />
          <span className="ml-auto text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--frame-light)]">
            Kitchen line board
          </span>
        </div>

        <header className="px-4 pb-2 pt-6 sm:px-8">
          <div className="inline-block -rotate-1 rounded-sm border border-[var(--paper-edge)] bg-[var(--paper)] px-4 py-2 shadow-[2px_4px_6px_var(--board-edge)]">
            <h1 className="font-marker text-2xl leading-none text-[var(--ink)] sm:text-3xl">
              Tonight&apos;s line-up
            </h1>
          </div>
          <p className="mt-3 max-w-xl text-sm text-[var(--ink-muted)]">
            Pin every dish to the board, set a serve time, and the whole kitchen shares one
            synced timeline.
          </p>
        </header>

        <nav className="mt-4 flex gap-2 border-b border-[var(--board-edge)] px-4 pb-3 sm:px-8 lg:hidden">
          <TabButton active={mobileTab === "timeline"} onClick={() => setMobileTab("timeline")}>
            Timeline
          </TabButton>
          <TabButton active={mobileTab === "setup"} onClick={() => setMobileTab("setup")}>
            Setup &amp; menu
          </TabButton>
        </nav>

        <main className="grid grid-cols-1 gap-5 p-4 sm:p-8 lg:grid-cols-[340px_1fr] lg:gap-6">
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
              <div className="rounded-sm border-2 border-dashed border-[var(--ink-faint)] p-10 text-center">
                <p className="font-marker text-lg text-[var(--ink-muted)]">Board&apos;s empty</p>
                <p className="mx-auto mt-2 max-w-xs text-sm text-[var(--ink-muted)]">
                  Set a target serving time and pin at least one dish to see the synced timeline.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
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
      className="mt-0.5 h-4 w-4 shrink-0"
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
