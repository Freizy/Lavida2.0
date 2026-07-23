"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Flame,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Condition = {
  name: string;
  cause: string;
  urgency: "low" | "medium" | "high" | "critical";
  nextSteps: string;
};

const urgencyStyles: Record<
  string,
  {
    card: string;
    header: string;
    badge: string;
    icon: React.ReactNode;
    label: string;
  }
> = {
  critical: {
    card: "border-red-600/50 bg-red-50/50 urgency-critical",
    header: "bg-red-600/10",
    badge: "bg-red-600 text-white",
    icon: <Flame className="w-5 h-5 text-red-600" />,
    label: "Critical / Emergency",
  },
  high: {
    card: "border-red-500/30 bg-red-50/30 urgency-high",
    header: "bg-red-500/10",
    badge: "bg-red-500 text-white",
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    label: "High Urgency",
  },
  medium: {
    card: "border-amber-500/30 bg-amber-50/30 urgency-medium",
    header: "bg-amber-500/10",
    badge: "bg-amber-500 text-white",
    icon: <Stethoscope className="w-5 h-5 text-amber-500" />,
    label: "Moderate Urgency",
  },
  low: {
    card: "border-primary/30 bg-primary/5 urgency-low",
    header: "bg-primary/10",
    badge: "bg-primary text-white",
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    label: "Low Urgency",
  },
};

export function ConditionCard({
  condition,
  index,
}: {
  condition: Condition;
  index: number;
}) {
  const style = urgencyStyles[condition.urgency] || urgencyStyles.low;

  return (
    <div className="group relative">
      <Card
        className={cn(
          "border-2 shadow-soft hover:shadow-xl transition-all overflow-hidden",
          style.card,
        )}
      >
        <CardHeader
          className={cn(
            "pb-3 flex-row items-center justify-between",
            style.header,
          )}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-foreground text-xs font-black shadow-sm">
              0{index + 1}
            </span>
            <CardTitle className="text-xl font-bold tracking-tight">
              {condition.name}
            </CardTitle>
          </div>
          <Badge
            className={cn(
              "text-[10px] font-black uppercase tracking-widest px-3 py-1",
              style.badge,
            )}
          >
            {condition.urgency}
          </Badge>
        </CardHeader>
        <CardContent className="pt-5 space-y-5">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.15em] flex items-center gap-1.5">
              {style.icon} Potential Cause
            </span>
            <p className="text-base text-foreground/80 leading-relaxed font-medium">
              {condition.cause}
            </p>
          </div>

          <div className="p-4 bg-white/50 rounded-2xl border border-black/5">
            <span className="text-[10px] uppercase font-black text-foreground/60 tracking-[0.15em] flex items-center gap-1.5 mb-2">
              <ArrowRight className="w-3 h-3" /> Recommended Next Steps
            </span>
            <p className="text-sm font-bold text-foreground leading-relaxed italic">
              {condition.nextSteps}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
