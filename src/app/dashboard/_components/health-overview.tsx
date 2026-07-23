"use client";

import {
  Activity,
  TrendingUp,
  Calendar,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type HealthOverviewProps = {
  latestConditions: { name: string; urgency: string }[];
  lastSymptoms: string;
  historyCount: number;
};

export function HealthOverview({
  latestConditions,
  lastSymptoms,
  historyCount,
}: HealthOverviewProps) {
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return (
          <Badge className="bg-red-600 text-white text-[10px]">
            <Flame className="w-3 h-3 mr-1" /> Critical
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-red-500 text-white text-[10px]">
            <AlertTriangle className="w-3 h-3 mr-1" /> High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-amber-500 text-white text-[10px]">
            <ShieldCheck className="w-3 h-3 mr-1" /> Medium
          </Badge>
        );
      default:
        return (
          <Badge className="bg-primary text-white text-[10px]">
            <ShieldCheck className="w-3 h-3 mr-1" /> Low
          </Badge>
        );
    }
  };

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="w-4 h-4 text-primary" /> Symptom history
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {latestConditions.length > 0 ? (
          <div className="space-y-3">
            <div className="rounded-xl border p-3 bg-primary/5">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
                <TrendingUp className="w-4 h-4" /> Latest Analysis
              </div>
              <p className="text-sm text-muted-foreground">{lastSymptoms}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Detected Conditions
              </p>
              {latestConditions.map((condition, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border p-3 hover:bg-secondary/50 transition-colors"
                >
                  <span className="text-sm font-medium">{condition.name}</span>
                  {getUrgencyBadge(condition.urgency)}
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-3">
              <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                <Calendar className="w-4 h-4 text-primary" /> History
              </div>
              <p className="text-sm text-muted-foreground">
                {historyCount} total checkup{historyCount !== 1 ? "s" : ""}{" "}
                recorded
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <Activity className="w-12 h-12 text-muted-foreground/20 mx-auto" />
            <p className="text-sm text-muted-foreground">
              No check-up history yet. Run your first symptom analysis from
              the main page.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
