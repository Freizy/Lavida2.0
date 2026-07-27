"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  HeartPulse,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  calculateHealthScore,
  type ScoredCheckup,
} from "@/lib/health-score";

type HistoryItem = {
  conditions: { urgency: string }[];
  timestamp: { toDate: () => Date } | null;
};

type HealthScoreProps = {
  historyItems: HistoryItem[];
};

const TREND_ICON = {
  improving: TrendingUp,
  declining: TrendingDown,
  stable: Minus,
} as const;

const TREND_COLOR = {
  improving: "text-green-500",
  declining: "text-red-500",
  stable: "text-muted-foreground",
} as const;

export function HealthScore({ historyItems }: HealthScoreProps) {
  const { t } = useI18n();

  const { score, band, trend, color, sampleSize } = useMemo(() => {
    const checkups: ScoredCheckup[] = historyItems.map((item) => ({
      conditions: item.conditions.map((c) => ({
        urgency: c.urgency as ScoredCheckup["conditions"][number]["urgency"],
      })),
      timestamp: item.timestamp?.toDate() ?? null,
    }));
    return calculateHealthScore(checkups);
  }, [historyItems]);

  const bandLabel: Record<string, string> = {
    critical: t.healthScore.needsAttention,
    poor: t.healthScore.needsAttention,
    fair: t.healthScore.fair,
    good: t.healthScore.good,
    excellent: t.healthScore.excellent,
  };

  const TrendIcon = TREND_ICON[trend];

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="border-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <HeartPulse className="w-4 h-4 text-primary" />{" "}
          {t.healthScore.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-4">
        <div className="relative w-32 h-32">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/30"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`${color} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${color}`}>{score}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              / 100
            </span>
          </div>
        </div>

        <div className="mt-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <TrendIcon
              className={`w-4 h-4 ${TREND_COLOR[trend]}`}
            />
            <span className={`text-sm font-bold ${color}`}>
              {bandLabel[band]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t.healthScore.basedOn} {sampleSize}{" "}
            {t.healthScore.checkups}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
