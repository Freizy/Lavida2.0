"use client";

import { useRouter } from "next/navigation";
import {
  Lightbulb,
  BookOpen,
  Phone,
  HeartPulse,
  Stethoscope,
  Brain,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      icon: <Stethoscope className="w-5 h-5" />,
      title: "New Symptom Check",
      description: "Analyze new symptoms with AI",
      onClick: () => router.push("/"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Health Education",
      description: "Learn about common conditions",
      onClick: () => {},
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: <HeartPulse className="w-5 h-5" />,
      title: "Wellness Tips",
      description: "Daily health recommendations",
      onClick: () => {},
      color: "bg-green-500/10 text-green-600",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Emergency Contacts",
      description: "Quick access to help",
      onClick: () => {},
      color: "bg-red-500/10 text-red-600",
    },
  ];

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="w-4 h-4 text-primary" /> Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-start gap-3 p-3 rounded-xl border hover:bg-secondary/50 hover:border-primary/30 transition-all text-left"
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-semibold">{action.title}</p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
