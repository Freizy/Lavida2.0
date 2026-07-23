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

const healthTips = [
  {
    icon: <Heart className="w-4 h-4" />,
    title: "Heart Health",
    tip: "Regular exercise and a balanced diet can reduce heart disease risk by up to 80%.",
    color: "text-red-500",
  },
  {
    icon: <Droplets className="w-4 h-4" />,
    title: "Stay Hydrated",
    tip: "Drink at least 8 glasses of water daily for optimal body function.",
    color: "text-blue-500",
  },
  {
    icon: <Moon className="w-4 h-4" />,
    title: "Sleep Well",
    tip: "Adults need 7-9 hours of quality sleep for immune system support.",
    color: "text-indigo-500",
  },
  {
    icon: <Apple className="w-4 h-4" />,
    title: "Nutrition",
    tip: "Eat 5 servings of fruits and vegetables daily for essential vitamins.",
    color: "text-green-500",
  },
  {
    icon: <Dumbbell className="w-4 h-4" />,
    title: "Stay Active",
    tip: "150 minutes of moderate exercise weekly improves mental and physical health.",
    color: "text-orange-500",
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    title: "Preventive Care",
    tip: "Annual check-ups can catch health issues early when they're most treatable.",
    color: "text-primary",
  },
];

export function HealthTips() {
  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="w-4 h-4 text-primary" /> Health Tips
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
