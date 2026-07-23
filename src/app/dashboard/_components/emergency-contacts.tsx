"use client";

import { Phone, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export function EmergencyContacts() {
  const { t } = useI18n();

  const emergencyContacts = [
    {
      name: t.emergency.services,
      number: "911",
      description: t.emergency.servicesDesc,
      icon: <AlertTriangle className="w-4 h-4" />,
      color: "bg-red-500/10 text-red-600",
    },
    {
      name: t.emergency.poison,
      number: "1-800-222-1222",
      description: t.emergency.poisonDesc,
      icon: <Phone className="w-4 h-4" />,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      name: t.emergency.crisis,
      number: "988",
      description: t.emergency.crisisDesc,
      icon: <Phone className="w-4 h-4" />,
      color: "bg-blue-500/10 text-blue-600",
    },
  ];

  return (
    <Card className="border-red-200 bg-red-50/30 dark:border-red-900/30 dark:bg-red-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-red-700 dark:text-red-400">
          <Phone className="w-4 h-4" /> {t.emergency.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {emergencyContacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border bg-white dark:bg-card p-3"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${contact.color}`}>
                  {contact.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contact.description}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-sm">
                {contact.number}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30">
          <p className="text-xs text-amber-800 dark:text-amber-400 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            {t.emergency.warning}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
