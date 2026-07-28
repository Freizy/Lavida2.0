"use client";

import { useState, useMemo } from "react";
import {
  HeartPulse,
  CalendarClock,
  Pill,
  Bell,
  History,
  FileDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useReminders } from "@/hooks/use-reminders";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { useRouter } from "next/navigation";
import { generateHealthReport } from "@/lib/generate-report";
import { doc } from "firebase/firestore";
import { calculateHealthScore, type ScoredCheckup } from "@/lib/health-score";
import { useToast } from "@/hooks/use-toast";
import { useHistory } from "@/hooks/use-history";
import { RemindersPanel } from "./reminders-panel";

type ToolsPanelProps = {
  onWellnessAssistant: () => void;
  onOpenNotifications: () => void;
  onOpenHistory: () => void;
  onClose: () => void;
};

function ToolCard({
  icon,
  iconColor,
  title,
  description,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
    >
      <CardContent className="p-4 flex flex-col items-center text-center gap-3">
        <div className={`p-3 rounded-xl ${iconColor}`}>{icon}</div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        {badge && (
          <Badge className="bg-amber-500 text-white text-[10px]">{badge}</Badge>
        )}
      </CardContent>
    </Card>
  );
}

export function ToolsPanel({
  onWellnessAssistant,
  onOpenNotifications,
  onOpenHistory,
  onClose,
}: ToolsPanelProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { reminders } = useReminders();
  const [showReminders, setShowReminders] = useState(false);

  const profileRef = useMemo(() => {
    if (!user?.uid || !db) return null;
    return doc(db, "profiles", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(profileRef);

  const { items: rawHistory } = useHistory();
  const sortedHistory = rawHistory ?? [];

  const activeCount = reminders.filter((r) => r.active).length;

  const handleHealthSummary = () => {
    if (sortedHistory.length === 0) {
      toast({
        title: t.tools.noDataToExport,
        description: t.tools.noDataToExportDesc,
      });
      return;
    }

    const latest = sortedHistory[0];
    const scoreInput: ScoredCheckup[] = sortedHistory.map((item) => ({
      conditions: item.conditions.map((c) => ({
        urgency: c.urgency as ScoredCheckup["conditions"][number]["urgency"],
      })),
      timestamp: item.timestamp?.toDate() ?? null,
    }));
    const { score } = calculateHealthScore(scoreInput);
    const allConditions = sortedHistory.flatMap((item) => item.conditions);

    generateHealthReport({
      userName: user?.displayName || "Guest User",
      userEmail: user?.email || "N/A",
      gender: (profile as { gender?: string } | null)?.gender || latest.gender || "N/A",
      age: (profile as { age?: number } | null)?.age || latest.age || 0,
      symptoms: latest.symptoms || "N/A",
      conditions: allConditions.map((c) => ({
        name: c.name,
        cause: c.cause || "",
        urgency: c.urgency,
        nextSteps: c.nextSteps || "",
      })),
      timestamp: latest.timestamp?.toDate() ?? new Date(),
      healthScore: score,
      locale,
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-primary" /> {t.tools.title}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          {t.tools.close}
        </Button>
      </div>

      {showReminders ? (
        <RemindersPanel onBack={() => setShowReminders(false)} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <ToolCard
            icon={<CalendarClock className="w-6 h-6" />}
            iconColor="bg-blue-500/10 text-blue-600"
            title={t.tools.assistant}
            description={t.tools.assistantDesc}
            onClick={onWellnessAssistant}
          />
          <ToolCard
            icon={<Bell className="w-6 h-6" />}
            iconColor="bg-amber-500/10 text-amber-600"
            title={t.tools.reminders}
            description={t.tools.remindersDesc}
            badge={
              activeCount > 0
                ? t.tools.activeCount.replace("{count}", String(activeCount))
                : undefined
            }
            onClick={() => setShowReminders(true)}
          />
          <ToolCard
            icon={<Bell className="w-6 h-6" />}
            iconColor="bg-rose-500/10 text-rose-600"
            title={t.tools.notifications}
            description={t.tools.notificationsDesc}
            onClick={onOpenNotifications}
          />
          <ToolCard
            icon={<History className="w-6 h-6" />}
            iconColor="bg-cyan-500/10 text-cyan-600"
            title={t.nav.history}
            description={t.tools.historyDesc}
            onClick={onOpenHistory}
          />
          <ToolCard
            icon={<Pill className="w-6 h-6" />}
            iconColor="bg-purple-500/10 text-purple-600"
            title={t.tools.medications}
            description={t.tools.medicationsDesc}
            onClick={() => router.push("/medications")}
          />
          <ToolCard
            icon={<FileDown className="w-6 h-6" />}
            iconColor="bg-green-500/10 text-green-600"
            title={t.tools.healthReport}
            description={t.tools.healthReportDesc}
            onClick={handleHealthSummary}
          />
        </div>
      )}
    </div>
  );
}
