"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Medication } from "@/hooks/use-medications";
import { useI18n } from "@/lib/i18n";

type AddMedicationFormProps = {
  onClose: () => void;
  onAdd: (med: Omit<Medication, "id" | "createdAt" | "userId">) => Promise<void>;
};

export function AddMedicationForm({ onClose, onAdd }: AddMedicationFormProps) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState<Medication["frequency"]>("daily");
  const [times, setTimes] = useState("08:00");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  const frequencyOptions = [
    { value: "daily", label: t.medications.list.onceDaily },
    { value: "twice_daily", label: t.medications.list.twiceDaily },
    { value: "three_times_daily", label: t.medications.list.threeTimesDaily },
    { value: "weekly", label: t.medications.list.weekly },
    { value: "as_needed", label: t.medications.list.asNeeded },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    onAdd({
      name: name.trim(),
      dosage: dosage.trim(),
      frequency,
      times: times.split(",").map((t) => t.trim()),
      notes: notes.trim(),
      startDate,
      active: true,
    });

    onClose();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{t.medications.form.addMedication}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">{t.medications.form.name}</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.medications.form.namePlaceholder}
                className="h-9 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">{t.medications.form.dosage}</label>
              <Input
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder={t.medications.form.dosagePlaceholder}
                className="h-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">{t.medications.form.frequency}</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as Medication["frequency"])}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            >
              {frequencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {t.medications.form.timeHint}
            </label>
            <Input
              value={times}
              onChange={(e) => setTimes(e.target.value)}
              placeholder={t.medications.form.timePlaceholder}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">{t.medications.form.notes}</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.medications.form.notesPlaceholder}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">{t.medications.form.startDate}</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <Button type="submit" className="w-full rounded-full" disabled={!name.trim() || !dosage.trim()}>
            <Plus className="w-4 h-4 mr-1" /> {t.medications.form.addMedication}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
