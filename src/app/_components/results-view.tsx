"use client";

import { MessageCircle, RefreshCcw, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConditionCard } from "./condition-card";
import { generateHealthReport } from "@/lib/generate-report";
import { useUser } from "@/firebase";
import { useI18n } from "@/lib/i18n";

type Condition = {
  name: string;
  cause: string;
  urgency: "low" | "medium" | "high" | "critical";
  nextSteps: string;
};

type ResultsViewProps = {
  conditions: Condition[];
  gender: string;
  age: string;
  symptoms: string;
  onStartChat: () => void;
  onRestart: () => void;
};

export function ResultsView({
  conditions,
  gender,
  age,
  symptoms,
  onStartChat,
  onRestart,
}: ResultsViewProps) {
  const { user } = useUser();
  const { t } = useI18n();

  const handleExportPDF = () => {
    generateHealthReport({
      userName: user?.displayName || "Guest User",
      userEmail: user?.email || "N/A",
      gender,
      age: parseInt(age) || 0,
      symptoms,
      conditions,
      timestamp: new Date(),
    });
  };

  return (
    <section className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <header className="flex items-center justify-between border-b-2 border-primary/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">{t.results.title}</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {t.results.subtitle}
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-10">
        {conditions.map((condition, idx) => (
          <ConditionCard key={idx} condition={condition} index={idx} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 pt-6">
        <Button
          onClick={onStartChat}
          className="lavida-button !bg-blue-600 !shadow-blue-600/20 py-6 text-xl"
        >
          <MessageCircle className="w-6 h-6" /> {t.results.chatWithLaVida}
        </Button>
        <Button
          onClick={handleExportPDF}
          variant="outline"
          className="py-4 text-lg border-primary/30 hover:bg-primary/5"
        >
          <Download className="w-5 h-5 mr-2" /> {t.results.exportPdf}
        </Button>
        <Button
          variant="ghost"
          onClick={onRestart}
          className="text-muted-foreground hover:text-primary transition-colors font-bold"
        >
          <RefreshCcw className="w-4 h-4 mr-2" /> {t.results.startNewCheck}
        </Button>
      </div>
    </section>
  );
}
