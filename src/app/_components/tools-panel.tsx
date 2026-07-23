"use client";

import { HeartPulse, CalendarClock, ScrollText, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ToolsPanelProps = {
  lastSymptoms: string;
  latestConditions: { name: string }[];
  onHealthSummary: () => void;
  onCareContinuity: () => void;
  onWellnessAssistant: () => void;
  onClose: () => void;
};

export function ToolsPanel({
  lastSymptoms,
  latestConditions,
  onHealthSummary,
  onCareContinuity,
  onWellnessAssistant,
  onClose,
}: ToolsPanelProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-primary" /> Health tools
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="space-y-4">
        <Card
          role="button"
          tabIndex={0}
          onClick={onHealthSummary}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onHealthSummary();
            }
          }}
          className="overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Personalized
              health summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Review your saved profile details, latest symptom patterns, and
            follow-up recommendations in one place.
          </CardContent>
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={onCareContinuity}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onCareContinuity();
            }
          }}
          className="overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-primary" /> Care continuity
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Keep a clear log of symptom checkups so your health records stay
            organized and easy to revisit.
          </CardContent>
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={onWellnessAssistant}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onWellnessAssistant();
            }
          }}
          className="overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-primary" /> Future
              wellness tools
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This panel is ready for reminders, habit tracking, medication
            support, and more personalized health insights.
          </CardContent>
        </Card>
      </div>

      {(lastSymptoms !== "No recent symptom check yet" ||
        latestConditions.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Quick Summary
          </h3>
          <Card className="border-primary/10">
            <CardContent className="space-y-3 pt-4">
              {lastSymptoms !== "No recent symptom check yet" && (
                <div className="rounded-xl border bg-primary/5 p-3">
                  <p className="text-xs font-bold text-primary mb-1">
                    Last Symptoms
                  </p>
                  <p className="text-sm text-muted-foreground">{lastSymptoms}</p>
                </div>
              )}
              {latestConditions.length > 0 && (
                <div className="rounded-xl border p-3">
                  <p className="text-xs font-bold mb-2">Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {latestConditions.map((c, i) => (
                      <Badge key={i} variant="secondary">
                        {c.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
