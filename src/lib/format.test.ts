import { describe, expect, it } from "vitest";
import { formatDuration } from "./format";

describe("formatDuration", () => {
  it("renders sub-hour durations in minutes", () => {
    expect(formatDuration(45)).toBe("45 min");
  });

  it("renders whole hours without a minutes remainder", () => {
    expect(formatDuration(120)).toBe("2 hr");
  });

  it("renders hours plus a minutes remainder", () => {
    expect(formatDuration(125)).toBe("2 hr 5 min");
  });
});
