"use client";

import { useRouter } from "next/navigation";
import {
  Lightbulb,
  Phone,
  Stethoscope,
  Pill,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      icon: <Pill className="w-5 h-5" />,
      title: "Medication Tracker",
      description: "Track your medications",
      onClick: () => router.push("/medications"),
      color: "bg-purple-500/10 text-purple-600",
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
        <div className="grid grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:bg-secondary/50 hover:border-primary/30 transition-all text-center"
            >
              <div className={`p-3 rounded-xl ${action.color}`}>
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-semibold">{action.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
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
