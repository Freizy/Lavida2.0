"use client";

import { useRouter } from "next/navigation";
import {
  Lightbulb,
  Phone,
  Stethoscope,
  Pill,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

export function QuickActions() {
  const router = useRouter();
  const { t } = useI18n();

  const actions = [
    {
      icon: <Stethoscope className="w-5 h-5" />,
      title: t.quickActions.newCheckup,
      description: t.quickActions.newCheckupDesc,
      onClick: () => router.push("/"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: <Pill className="w-5 h-5" />,
      title: t.quickActions.medicationTracker,
      description: t.quickActions.medicationTrackerDesc,
      onClick: () => router.push("/medications"),
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: t.quickActions.emergencyContacts,
      description: t.quickActions.emergencyContactsDesc,
      onClick: () => {},
      color: "bg-red-500/10 text-red-600",
    },
  ];

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="w-4 h-4 text-primary" /> {t.quickActions.title}
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
