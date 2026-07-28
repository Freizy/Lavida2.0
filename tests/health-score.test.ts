import { describe, it, expect } from "vitest";
import {
  calculateHealthScore,
  type ScoredCheckup,
} from "@/lib/health-score";

function makeCheckup(
  urgency: ScoredCheckup["conditions"][number]["urgency"],
  daysAgo: number,
): ScoredCheckup {
  return {
    conditions: [{ urgency }],
    timestamp: new Date(Date.now() - daysAgo * 86_400_000),
  };
}

describe("calculateHealthScore", () => {
  it("returns 0 for empty history", () => {
    const result = calculateHealthScore([]);
    expect(result.score).toBe(0);
    expect(result.band).toBe("critical");
    expect(result.trend).toBe("stable");
    expect(result.sampleSize).toBe(0);
  });

  it("returns high score for all-low urgency checkups", () => {
    const checkups = [makeCheckup("low", 1), makeCheckup("low", 5)];
    const result = calculateHealthScore(checkups);
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.band).toMatch(/good|excellent/);
  });

  it("returns low score for critical urgency", () => {
    const checkups = [makeCheckup("critical", 1)];
    const result = calculateHealthScore(checkups);
    expect(result.score).toBeLessThan(30);
    expect(result.band).toBe("critical");
  });

  it("weights recent checkups more heavily", () => {
    const recentCritical = [
      makeCheckup("critical", 1),
      makeCheckup("low", 5),
    ];
    const oldCritical = [
      makeCheckup("low", 1),
      makeCheckup("critical", 60),
    ];

    const recent = calculateHealthScore(recentCritical);
    const old = calculateHealthScore(oldCritical);

    expect(recent.score).toBeLessThan(old.score);
  });

  it("detects improving trend", () => {
    const checkups = [
      makeCheckup("low", 1),
      makeCheckup("low", 8),
      makeCheckup("low", 15),
      makeCheckup("critical", 22),
      makeCheckup("critical", 29),
      makeCheckup("critical", 36),
    ];
    const result = calculateHealthScore(checkups);
    expect(result.trend).toBe("improving");
  });

  it("detects declining trend", () => {
    const checkups = [
      makeCheckup("critical", 1),
      makeCheckup("critical", 8),
      makeCheckup("critical", 15),
      makeCheckup("low", 22),
      makeCheckup("low", 29),
      makeCheckup("low", 36),
    ];
    const result = calculateHealthScore(checkups);
    expect(result.trend).toBe("declining");
  });

  it("returns stable trend for same-severity checkups", () => {
    const checkups = [
      makeCheckup("medium", 1),
      makeCheckup("medium", 8),
      makeCheckup("medium", 15),
      makeCheckup("medium", 22),
      makeCheckup("medium", 29),
      makeCheckup("medium", 36),
    ];
    const result = calculateHealthScore(checkups);
    expect(result.trend).toBe("stable");
  });

  it("clamps score between 0 and 100", () => {
    const manyLow = Array.from({ length: 20 }, () => makeCheckup("low", 1));
    const result = calculateHealthScore(manyLow);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("penalizes checkups with many severe conditions", () => {
    const mixed: ScoredCheckup[] = [
      {
        conditions: [
          { urgency: "critical" },
          { urgency: "critical" },
          { urgency: "critical" },
        ],
        timestamp: new Date(Date.now() - 86_400_000),
      },
    ];
    const single: ScoredCheckup[] = [makeCheckup("critical", 1)];

    const mixedResult = calculateHealthScore(mixed);
    const singleResult = calculateHealthScore(single);

    expect(mixedResult.score).toBeLessThanOrEqual(singleResult.score);
  });

  it("handles checkups with no timestamp gracefully", () => {
    const checkups: ScoredCheckup[] = [
      { conditions: [{ urgency: "medium" }], timestamp: null },
      { conditions: [{ urgency: "low" }], timestamp: null },
    ];
    const result = calculateHealthScore(checkups);
    expect(result.score).toBeGreaterThan(0);
    expect(result.sampleSize).toBe(2);
  });

  it("returns correct color for each band", () => {
    const excellent = calculateHealthScore([makeCheckup("low", 1)]);
    expect(excellent.color).toContain("emerald");

    const critical = calculateHealthScore([makeCheckup("critical", 1)]);
    expect(critical.color).toContain("red");
  });
});
