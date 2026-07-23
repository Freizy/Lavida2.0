"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMedications, type Medication } from "@/hooks/use-medications";

type AddMedicationFormProps = {
  onClose: () => void;
};

const frequencyOptions = [
  { value: "daily", label: "Once daily" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "three_times_daily", label: "Three times daily" },
  { value: "weekly", label: "Weekly" },
  { value: "as_needed", label: "As needed" },
];

export function AddMedicationForm({ onClose }: AddMedicationFormProps) {
  const { addMedication } = useMedications();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState<Medication["frequency"]>("daily");
  const [times, setTimes] = useState("08:00");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    addMedication({
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
          <CardTitle className="text-sm">Add Medication</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ibuprofen"
                className="h-9 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Dosage *</label>
              <Input
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="200mg"
                className="h-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Frequency</label>
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
              Time(s) (comma separated)
            </label>
            <Input
              value={times}
              onChange={(e) => setTimes(e.target.value)}
              placeholder="08:00, 20:00"
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Notes</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take with food"
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <Button type="submit" className="w-full rounded-full" disabled={!name.trim() || !dosage.trim()}>
            <Plus className="w-4 h-4 mr-1" /> Add Medication
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
