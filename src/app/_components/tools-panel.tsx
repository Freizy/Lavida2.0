"use client";

import { useState, useMemo } from "react";
import {
  HeartPulse,
  CalendarClock,
  Pill,
  ClipboardList,
  Bell,
  History,
  Plus,
  Trash2,
  Power,
  X,
  FileDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { useI18n } from "@/lib/i18n";
import { useReminders } from "@/hooks/use-reminders";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { useRouter } from "next/navigation";
import { generateHealthReport } from "@/lib/generate-report";
import { collection, doc, query, where, limit as firestoreLimit } from "firebase/firestore";
import { calculateHealthScore, type ScoredCheckup } from "@/lib/health-score";
import { useToast } from "@/hooks/use-toast";

type ToolsPanelProps = {
  onWellnessAssistant: () => void;
  onOpenNotifications: () => void;
  onOpenHistory: () => void;
  onClose: () => void;
};

export function ToolsPanel({
  onWellnessAssistant,
  onOpenNotifications,
  onOpenHistory,
  onClose,
}: ToolsPanelProps) {
  const { t } = useI18n();
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { reminders, addReminder, deleteReminder, toggleReminder } = useReminders();
  const [showReminders, setShowReminders] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("08:00");

  const profileRef = useMemo(() => {
    if (!user?.uid || !db) return null;
    return doc(db, "profiles", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(profileRef);

  const historyQuery = useMemo(() => {
    if (!user?.uid || !db) return null;
    return query(
      collection(db, "history"),
      where("userId", "==", user.uid),
      firestoreLimit(50),
    );
  }, [user?.uid, db]);

  const { data: rawHistoryItems } = useCollection(historyQuery);

  type HistoryDoc = { gender: string; age: number; symptoms: string; conditions: { name: string; cause?: string; urgency: string; nextSteps?: string }[]; timestamp: { toDate: () => Date } | null };

  const sortedHistory = useMemo(() => {
    if (!rawHistoryItems) return [];
    return [...(rawHistoryItems as HistoryDoc[])].sort((a, b) => {
      const aTime = a.timestamp?.toDate?.()?.getTime?.() || 0;
      const bTime = b.timestamp?.toDate?.()?.getTime?.() || 0;
      return bTime - aTime;
    });
  }, [rawHistoryItems]);

  const handleAddReminder = () => {
    if (!newReminderTitle.trim()) return;
    addReminder({
      title: newReminderTitle.trim(),
      description: "",
      time: newReminderTime,
      repeat: "daily",
      active: true,
    });
    setNewReminderTitle("");
  };

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

      {!showReminders ? (
        <div className="grid grid-cols-2 gap-3">
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
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                <CalendarClock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t.tools.assistant}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.tools.assistantDesc}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            role="button"
            tabIndex={0}
            onClick={() => setShowReminders(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowReminders(true);
              }
            }}
            className="overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
          >
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t.tools.reminders}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.tools.remindersDesc}
                </p>
              </div>
              {reminders.filter((r: any) => r.active).length > 0 && (
                <Badge className="bg-amber-500 text-white text-[10px]">
                  {t.tools.activeCount.replace("{count}", String(reminders.filter((r: any) => r.active).length))}
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card
            role="button"
            tabIndex={0}
            onClick={onOpenNotifications}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenNotifications();
              }
            }}
            className="overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md md:hidden"
          >
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t.tools.notifications}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.tools.notificationsDesc}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            role="button"
            tabIndex={0}
            onClick={onOpenHistory}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenHistory();
              }
            }}
            className="overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md md:hidden"
          >
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600">
                <History className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t.nav.history}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.tools.historyDesc}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            role="button"
            tabIndex={0}
            onClick={() => router.push("/medications")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push("/medications");
              }
            }}
            className="overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
          >
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t.tools.medications}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.tools.medicationsDesc}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            role="button"
            tabIndex={0}
            onClick={handleHealthSummary}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleHealthSummary();
              }
            }}
            className="overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
          >
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-green-500/10 text-green-600">
                <FileDown className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t.tools.healthReport}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.tools.healthReportDesc}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReminders(false)}
              className="gap-1"
            >
              <X className="w-4 h-4" /> {t.tools.back}
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              value={newReminderTitle}
              onChange={(e) => setNewReminderTitle(e.target.value)}
              placeholder={t.tools.reminderPlaceholder}
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAddReminder()}
            />
            <Input
              type="time"
              value={newReminderTime}
              onChange={(e) => setNewReminderTime(e.target.value)}
              className="w-28"
            />
            <Button
              onClick={handleAddReminder}
              disabled={!newReminderTitle.trim()}
              size="icon"
              className="shrink-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="h-[40vh]">
            <div className="space-y-2">
              {reminders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Bell className="w-10 h-10 text-muted-foreground/20 mx-auto" />
                    <p className="text-sm text-muted-foreground">
                    {t.tools.noReminders}
                  </p>
                </div>
              ) : (
                reminders.map((reminder: any) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-3 rounded-xl border hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${reminder.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${!reminder.active && "text-muted-foreground"}`}>
                          {reminder.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {reminder.time} • {reminder.repeat}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleReminder(reminder.id, reminder.active)}
                        className="h-7 w-7"
                      >
                        <Power className={`w-3 h-3 ${reminder.active ? "text-green-500" : "text-muted-foreground"}`} />
                      </Button>
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive/60 hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t.confirm.deleteTitle}</AlertDialogTitle>
                            <AlertDialogDescription>{t.confirm.deleteDescription}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t.confirm.cancel}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteReminder(reminder.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {t.confirm.confirm}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
