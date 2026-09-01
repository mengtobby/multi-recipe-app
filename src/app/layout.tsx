import type { Metadata } from "next";
import { Geist, Geist_Mono, Special_Elite } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const marker = Special_Elite({
  variable: "--font-stamp",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multi-Recipe Meal Coordinator",
  description: "Sync multiple recipes into one backward-scheduled cooking timeline.",
};

const DIRECTION_CONTRACT = `
THESIS: the app is the ticket rail above a kitchen pass — every dish is a
torn paper chit clipped to one steel rail, riding toward the pass bell at
serve time, refusing the flat generic SaaS card grid this category defaults to.
OWN-WORLD: kraft order tickets under a cool steel rail (warm daylight pass;
a lamp-lit night pass in dark mode), a stamped-typewriter display voice +
tabular mono clock numerals, colored ticket stock per dish, a rubber-stamp
"HOLD" alert for conflicts (never color alone).
STORY: cook sets serve time + dishes, sees every ticket clipped to one rail
converging on the pass, trusts it at a glance mid-cook, catches equipment
conflicts before they happen.
FIRST VIEWPORT: a steel pass frame fills the screen; header is a stamped
ticket header; left holds order-pad cards (setup, menu); right column is
the vertical rail, tickets clipped to it toward a final SERVE bell.
FORM: Expediter's Rail — pinned directly by the user, superseding "Kitchen
Line Board" (seed key 6824ca98) as the committed world.
FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying
its provenance.
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${marker.variable} h-full antialiased`}
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
