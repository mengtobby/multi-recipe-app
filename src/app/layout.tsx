import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Source_Serif_4({
  variable: "--font-display",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multi-Recipe Meal Coordinator",
  description: "Sync multiple recipes into one backward-scheduled cooking timeline.",
};

const DIRECTION_CONTRACT = `
THESIS: the app reads like a food-editorial masthead, not a settings
dashboard — a bold red nameplate, a serif headline voice, and white
story-sheets, refusing the flat generic SaaS card grid this category
defaults to and the two prior kitchen-hardware worlds this project shipped.
OWN-WORLD: a warm newsprint-white page under a saturated masthead red,
bold serif headlines (Source Serif 4) for every section title, tabular
mono clock numerals, a gold "needs attention" alert and a bordered STOP
badge for infeasibility (never color alone).
STORY: cook opens the page to one hero card stating tonight's serve time
and status at a glance, then reads the menu and order rail as a short
stack of clean story-sheets, each headline doing its own work with no
stacked eyebrow above it.
FIRST VIEWPORT: a red masthead nameplate tops the page; directly below,
a white hero card states the serve time, dish count, and feasibility as
one bold serif headline; setup and menu sit left, the order rail right.
FORM: Sunday Table — pinned directly by the user from a reference image,
superseding "Expediter's Rail" as the committed world.
FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying
its provenance.
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div
          style={{ display: "contents" }}
          dangerouslySetInnerHTML={{ __html: `<!--${DIRECTION_CONTRACT}-->` }}
        />
        {children}
      </body>
    </html>
  );
}
