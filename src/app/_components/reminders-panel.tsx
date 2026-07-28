"use client";

import { useState } from "react";
import { Bell, Plus, Trash2, Power, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useI18n } from "@/lib/i18n";
import { useReminders, type Reminder } from "@/hooks/use-reminders";

type RemindersPanelProps = {
  onBack: () => void;
};

export function RemindersPanel({ onBack }: RemindersPanelProps) {
  const { t } = useI18n();
  const { reminders, addReminder, deleteReminder, toggleReminder } =
    useReminders();
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("08:00");

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addReminder({
      title: newTitle.trim(),
      description: "",
      time: newTime,
      repeat: "daily",
      active: true,
    });
    setNewTitle("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1"
        >
          <X className="w-4 h-4" /> {t.tools.back}
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={t.tools.reminderPlaceholder}
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="w-28"
        />
        <Button
          onClick={handleAdd}
          disabled={!newTitle.trim()}
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
            reminders.map((reminder: Reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-3 rounded-xl border hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      reminder.active
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        !reminder.active && "text-muted-foreground"
                      }`}
                    >
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
                    onClick={() =>
                      toggleReminder(reminder.id, reminder.active)
                    }
                    className="h-7 w-7"
                    aria-label={
                      reminder.active
                        ? t.tools.deactivateReminder
                        : t.tools.activateReminder
                    }
                  >
                    <Power
                      className={`w-3 h-3 ${
                        reminder.active
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive/60 hover:text-destructive"
                        aria-label={t.confirm.confirm}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t.confirm.deleteTitle}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t.confirm.deleteDescription}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t.confirm.cancel}
                        </AlertDialogCancel>
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
  );
}
