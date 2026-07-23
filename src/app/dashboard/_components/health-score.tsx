"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, HeartPulse } from "lucide-react";

type HistoryItem = {
  conditions: { urgency: string }[];
  timestamp: { toDate: () => Date } | null;
};

type HealthScoreProps = {
  historyItems: HistoryItem[];
};

function calculateScore(items: HistoryItem[]): {
  score: number;
  trend: "up" | "down" | "stable";
  label: string;
  color: string;
} {
  if (items.length === 0) {
    return { score: 0, trend: "stable", label: "No data yet", color: "text-muted-foreground" };
  }

  let totalPoints = 0;
  let count = 0;

  items.forEach((item, index) => {
    const recencyWeight = Math.max(0.3, 1 - index * 0.1);
    const urgencyScore = item.conditions.reduce((sum, c) => {
      switch (c.urgency) {
        case "critical": return sum + 10;
        case "high": return sum + 25;
        case "medium": return sum + 50;
        case "low": return sum + 80;
        default: return sum + 50;
      }
    }, 0) / Math.max(item.conditions.length, 1);

    totalPoints += urgencyScore * recencyWeight;
    count++;
  });

  const avgScore = count > 0 ? totalPoints / count : 50;
  const score = Math.round(Math.min(100, Math.max(0, avgScore)));

  let trend: "up" | "down" | "stable" = "stable";
  if (items.length >= 2) {
    const recent = items[0].conditions.reduce((s, c) => {
      switch (c.urgency) { case "critical": return s + 10; case "high": return s + 25; case "medium": return s + 50; default: return s + 80; }
    }, 0) / Math.max(items[0].conditions.length, 1);
    const older = items[1].conditions.reduce((s, c) => {
      switch (c.urgency) { case "critical": return s + 10; case "high": return s + 25; case "medium": return s + 50; default: return s + 80; }
    }, 0) / Math.max(items[1].conditions.length, 1);
    if (recent > older + 5) trend = "up";
    else if (recent < older - 5) trend = "down";
  }

  let label = "Good";
  let color = "text-green-500";
  if (score < 30) { label = "Needs Attention"; color = "text-red-500"; }
  else if (score < 60) { label = "Fair"; color = "text-amber-500"; }
  else if (score < 80) { label = "Good"; color = "text-green-500"; }
  else { label = "Excellent"; color = "text-emerald-500"; }

  return { score, trend, label, color };
}

export function HealthScore({ historyItems }: HealthScoreProps) {
  const { score, trend, label, color } = useMemo(
    () => calculateScore(historyItems),
    [historyItems]
  );

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="border-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <HeartPulse className="w-4 h-4 text-primary" /> Health Score
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
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
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">/ 100</span>
          </div>
        </div>

        <div className="mt-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            {trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
            {trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
            {trend === "stable" && <Minus className="w-4 h-4 text-muted-foreground" />}
            <span className={`text-sm font-bold ${color}`}>{label}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on your last {historyItems.length} checkup{historyItems.length !== 1 ? "s" : ""}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
