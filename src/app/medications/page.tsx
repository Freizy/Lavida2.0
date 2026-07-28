"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Pill, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMedications } from "@/hooks/use-medications";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useI18n } from "@/lib/i18n";
import { useUser } from "@/firebase";
import { AddMedicationForm } from "./_components/add-medication-form";
import { MedicationList } from "./_components/medication-list";

export default function MedicationsPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { activeMedications, inactiveMedications, addMedication, deleteMedication, toggleActive } = useMedications();
  const [showAddForm, setShowAddForm] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/");
    }
  }, [user, userLoading, router]);

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="rounded-xl"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">{t.medications.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => setShowAddForm(true)}
            className="rounded-full"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" /> {t.medications.add}
          </Button>
        </div>

        {showAddForm && (
          <AddMedicationForm
            onClose={() => setShowAddForm(false)}
            onAdd={addMedication}
          />
        )}

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              {t.medications.active} ({activeMedications.length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              {t.medications.inactive} ({inactiveMedications.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            <MedicationList
              medications={activeMedications}
              emptyMessage={t.medications.noActive}
              onDelete={deleteMedication}
              onToggleActive={toggleActive}
            />
          </TabsContent>
          <TabsContent value="inactive" className="mt-4">
            <MedicationList
              medications={inactiveMedications}
              emptyMessage={t.medications.noInactive}
              onDelete={deleteMedication}
              onToggleActive={toggleActive}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
