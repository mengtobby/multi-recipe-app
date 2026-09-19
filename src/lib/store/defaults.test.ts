import { describe, expect, it } from "vitest";
import { defaultTargetDateTime } from "./defaults";

describe("defaultTargetDateTime", () => {
  it("picks 6pm today when it's still ahead", () => {
    const now = new Date(2026, 0, 15, 10, 0);
    expect(defaultTargetDateTime(now)).toBe("2026-01-15T18:00");
  });

  it("rolls over to 6pm tomorrow once today's 6pm has passed", () => {
    const now = new Date(2026, 0, 15, 19, 30);
    expect(defaultTargetDateTime(now)).toBe("2026-01-16T18:00");
  });

  it("rolls over exactly at 6pm, since the slot is no longer usable", () => {
    const now = new Date(2026, 0, 15, 18, 0);
    expect(defaultTargetDateTime(now)).toBe("2026-01-16T18:00");
  });
});
