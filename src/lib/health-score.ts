/**
 * LaVida Health Score Algorithm
 *
 * A weighted scoring system that evaluates a user's health trajectory
 * based on symptom checkup history. The score ranges from 0 (critical)
 * to 100 (excellent) and incorporates:
 *
 *   1. Urgency severity   — each AI-generated condition carries an urgency level
 *   2. Temporal decay     — recent checkups weigh more than older ones
 *   3. Frequency penalty  — repeated high-urgency findings compound the score
 *   4. Trend detection    — moving average comparison over a configurable window
 *
 * Urgency-to-base-score mapping (higher = healthier):
 *   low      → 85   (self-manageable, OTC care)
 *   medium   → 55   (should see a doctor soon)
 *   high     → 25   (needs prompt attention)
 *   critical → 5    (life-threatening, call 911)
 *
 * These base scores are derived from clinical triage severity
 * categories (ESI levels 1-4) inversely mapped to a 0-100 scale.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export interface ScoredCondition {
  urgency: UrgencyLevel;
}

export interface ScoredCheckup {
  conditions: ScoredCondition[];
  timestamp: Date | null;
}

export type TrendDirection = "improving" | "declining" | "stable";

export type ScoreBand = "critical" | "poor" | "fair" | "good" | "excellent";

export interface HealthScoreResult {
  /** 0-100 integer score. Higher is better. */
  score: number;
  /** Normalized label for the score band. */
  band: ScoreBand;
  /** Whether health is trending up, down, or flat. */
  trend: TrendDirection;
  /** Human-readable color class (Tailwind). */
  color: string;
  /** Number of checkups the score is based on. */
  sampleSize: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Base scores for each urgency level (0-100, higher = healthier). */
const URGENCY_BASE_SCORE: Record<UrgencyLevel, number> = {
  low: 85,
  medium: 55,
  high: 25,
  critical: 5,
};

/** Half-life in days for temporal decay. A checkup from `HALF_LIFE_DAYS` ago
 *  counts at 50 % of its base score. */
const HALF_LIFE_DAYS = 30;

/** Number of recent checkups used for trend comparison. */
const TREND_WINDOW = 3;

/** Score thresholds for band classification. */
const BAND_THRESHOLDS: [number, ScoreBand][] = [
  [85, "excellent"],
  [70, "good"],
  [50, "fair"],
  [30, "poor"],
  [0, "critical"],
];

/** Minimum absolute change in the moving-average score to register a trend. */
const TREND_THRESHOLD = 3;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Exponential decay factor: 0.5^(elapsed / halfLife). */
function decayFactor(elapsedDays: number): number {
  return Math.pow(0.5, elapsedDays / HALF_LIFE_DAYS);
}

/** Compute the average base score for a single checkup's conditions. */
function checkupBaseScore(conditions: ScoredCondition[]): number {
  if (conditions.length === 0) return 50; // neutral fallback
  const sum = conditions.reduce(
    (acc, c) => acc + (URGENCY_BASE_SCORE[c.urgency] ?? 50),
    0,
  );
  return sum / conditions.length;
}

/** Count how many conditions in a checkup fall in `high` or `critical`. */
function severeCount(conditions: ScoredCondition[]): number {
  return conditions.filter(
    (c) => c.urgency === "high" || c.urgency === "critical",
  ).length;
}

/** Classify a numeric score into a band. */
function scoreToBand(score: number): ScoreBand {
  for (const [threshold, band] of BAND_THRESHOLDS) {
    if (score >= threshold) return band;
  }
  return "critical";
}

/** Tailwind color for each band. */
const BAND_COLORS: Record<ScoreBand, string> = {
  excellent: "text-emerald-500",
  good: "text-green-500",
  fair: "text-amber-500",
  poor: "text-orange-500",
  critical: "text-red-500",
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Calculate the LaVida Health Score from a list of checkups.
 *
 * @param checkups - Most-recent-first array of past checkups.
 * @param now      - Reference date (defaults to `new Date()`).
 * @returns        - Score, band, trend, and metadata.
 */
export function calculateHealthScore(
  checkups: ScoredCheckup[],
  now: Date = new Date(),
): HealthScoreResult {
  if (checkups.length === 0) {
    return {
      score: 0,
      band: "critical",
      trend: "stable",
      color: BAND_COLORS.critical,
      sampleSize: 0,
    };
  }

  // ---- Step 1: Weighted score per checkup ----
  let weightedSum = 0;
  let weightTotal = 0;

  for (let i = 0; i < checkups.length; i++) {
    const item = checkups[i];
    const base = checkupBaseScore(item.conditions);

    // Temporal decay
    const elapsedDays = item.timestamp
      ? (now.getTime() - item.timestamp.getTime()) / (1000 * 60 * 60 * 24)
      : i * 7; // fallback: assume 7-day spacing by index

    const temporalWeight = decayFactor(Math.max(0, elapsedDays));

    // Severity penalty: if a checkup has many severe conditions, reduce its
    // effective weight so the overall score reflects repeated bad news.
    const severe = severeCount(item.conditions);
    const severityMultiplier = Math.max(0.4, 1 - severe * 0.15);

    const effectiveWeight = temporalWeight * severityMultiplier;

    weightedSum += base * effectiveWeight;
    weightTotal += effectiveWeight;
  }

  const rawScore = weightTotal > 0 ? weightedSum / weightTotal : 50;
  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  // ---- Step 2: Trend via moving averages ----
  const windowItems = checkups.slice(0, TREND_WINDOW);
  const recentMA = movingAverage(windowItems, now);
  const olderMA = movingAverage(
    checkups.slice(TREND_WINDOW, TREND_WINDOW * 2),
    now,
  );

  let trend: TrendDirection = "stable";
  if (recentMA !== null && olderMA !== null) {
    const diff = recentMA - olderMA;
    if (diff > TREND_THRESHOLD) trend = "improving";
    else if (diff < -TREND_THRESHOLD) trend = "declining";
  }

  const band = scoreToBand(score);

  return {
    score,
    band,
    trend,
    color: BAND_COLORS[band],
    sampleSize: checkups.length,
  };
}

/** Compute a simple weighted moving average of base scores for a window. */
function movingAverage(items: ScoredCheckup[], now: Date): number | null {
  if (items.length === 0) return null;
  let sum = 0;
  let count = 0;
  for (const item of items) {
    const base = checkupBaseScore(item.conditions);
    const elapsedDays = item.timestamp
      ? (now.getTime() - item.timestamp.getTime()) / (1000 * 60 * 60 * 24)
      : 0;
    const w = decayFactor(Math.max(0, elapsedDays));
    sum += base * w;
    count += w;
  }
  return count > 0 ? sum / count : null;
}
