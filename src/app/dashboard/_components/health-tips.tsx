"use client";

import {
  BookOpen,
  Heart,
  Droplets,
  Moon,
  Apple,
  Dumbbell,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

export function HealthTips() {
  const { t } = useI18n();

  const healthTips = [
    {
      icon: <Heart className="w-4 h-4" />,
      title: t.healthTips.heartHealth,
      tip: t.healthTips.heartHealthTip,
      color: "text-red-500",
    },
    {
      icon: <Droplets className="w-4 h-4" />,
      title: t.healthTips.stayHydrated,
      tip: t.healthTips.stayHydratedTip,
      color: "text-blue-500",
    },
    {
      icon: <Moon className="w-4 h-4" />,
      title: t.healthTips.sleepWell,
      tip: t.healthTips.sleepWellTip,
      color: "text-indigo-500",
    },
    {
      icon: <Apple className="w-4 h-4" />,
      title: t.healthTips.nutrition,
      tip: t.healthTips.nutritionTip,
      color: "text-green-500",
    },
    {
      icon: <Dumbbell className="w-4 h-4" />,
      title: t.healthTips.stayActive,
      tip: t.healthTips.stayActiveTip,
      color: "text-orange-500",
    },
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      title: t.healthTips.preventiveCare,
      tip: t.healthTips.preventiveCareTip,
      color: "text-primary",
    },
  ];

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="w-4 h-4 text-primary" /> {t.healthTips.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {healthTips.map((tip, index) => (
            <div
              key={index}
              className="rounded-xl border p-3 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={tip.color}>{tip.icon}</span>
                <p className="text-sm font-semibold">{tip.title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tip.tip}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
