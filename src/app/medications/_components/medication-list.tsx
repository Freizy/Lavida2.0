"use client";

import { Pill, Clock, Trash2, Power, PowerOff, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMedications, type Medication } from "@/hooks/use-medications";
import { cn } from "@/lib/utils";

type MedicationListProps = {
  medications: Medication[];
  emptyMessage: string;
};

function getFrequencyLabel(freq: Medication["frequency"]) {
  switch (freq) {
    case "daily": return "Once daily";
    case "twice_daily": return "Twice daily";
    case "three_times_daily": return "3x daily";
    case "weekly": return "Weekly";
    case "as_needed": return "As needed";
    default: return freq;
  }
}

export function MedicationList({ medications, emptyMessage }: MedicationListProps) {
  const { deleteMedication, toggleActive } = useMedications();

  if (medications.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <Pill className="w-12 h-12 text-muted-foreground/20 mx-auto" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {medications.map((med) => (
        <Card
          key={med.id}
          className={cn(
            "transition-all",
            med.active ? "border-primary/20" : "border-muted opacity-60"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  med.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  <Pill className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{med.name}</p>
                    <Badge variant="secondary" className="text-[10px]">
                      {med.dosage}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getFrequencyLabel(med.frequency)}
                    </span>
                    {med.times.length > 0 && (
                      <span>{med.times.join(", ")}</span>
                    )}
                  </div>
                  {med.notes && (
                    <p className="text-xs text-muted-foreground italic">{med.notes}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Started {new Date(med.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActive(med.id)}
                  className="h-7 w-7"
                >
                  {med.active ? (
                    <Power className="w-3 h-3 text-green-500" />
                  ) : (
                    <PowerOff className="w-3 h-3 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMedication(med.id)}
                  className="h-7 w-7 text-destructive/60 hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
