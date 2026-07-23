"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Pill } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMedications } from "@/hooks/use-medications";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { AddMedicationForm } from "./_components/add-medication-form";
import { MedicationList } from "./_components/medication-list";

export default function MedicationsPage() {
  const router = useRouter();
  const { activeMedications, inactiveMedications } = useMedications();
  const [showAddForm, setShowAddForm] = useState(false);

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
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Medications</h1>
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
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>

        {showAddForm && (
          <AddMedicationForm onClose={() => setShowAddForm(false)} />
        )}

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active ({activeMedications.length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive ({inactiveMedications.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            <MedicationList
              medications={activeMedications}
              emptyMessage="No active medications. Add one to start tracking."
            />
          </TabsContent>
          <TabsContent value="inactive" className="mt-4">
            <MedicationList
              medications={inactiveMedications}
              emptyMessage="No inactive medications."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
