"use client";

import { HeartPulse, CalendarClock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type ToolsPanelProps = {
  onWellnessAssistant: () => void;
  onClose: () => void;
};

export function ToolsPanel({
  onWellnessAssistant,
  onClose,
}: ToolsPanelProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-primary" /> {t.tools.title}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="space-y-4">
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
              <CalendarClock className="w-4 h-4 text-primary" /> {t.tools.assistant}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t.tools.assistantDesc}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
