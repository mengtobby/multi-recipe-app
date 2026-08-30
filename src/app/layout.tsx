import type { Metadata } from "next";
import { Geist, Geist_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const marker = Permanent_Marker({
  variable: "--font-marker",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multi-Recipe Meal Coordinator",
  description: "Sync multiple recipes into one backward-scheduled cooking timeline.",
};

const DIRECTION_CONTRACT = `
THESIS: one synced kitchen whiteboard, not a settings dashboard — every dish
is a pinned chit hanging off one hand-ruled timeline spine, refusing the
flat generic SaaS card grid this category defaults to.
OWN-WORLD: dry-erase board (warm white/steel frame; chalkboard at night),
grease-pencil marker display type + tabular mono clock numerals, magnet-
colored dish chits, amber hazard-stripe for conflicts (never color alone).
STORY: cook sets serve time + dishes, sees one converging timeline, trusts
it at a glance mid-cook, catches equipment conflicts before they happen.
FIRST VIEWPORT: a steel-framed board fills the screen; header is a clipped
label card; left holds pinned index cards (setup, menu); right column is
the ruled timeline spine, chits hanging off it toward a final SERVE pin.
FORM: Kitchen Line Board — grounded candidate 3 of 7, seed key 6824ca98.
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
