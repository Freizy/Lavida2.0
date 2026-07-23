"use client";

import { MessageCircle, RefreshCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConditionCard } from "./condition-card";

type Condition = {
  name: string;
  cause: string;
  urgency: "low" | "medium" | "high" | "critical";
  nextSteps: string;
};

type ResultsViewProps = {
  conditions: Condition[];
  onStartChat: () => void;
  onRestart: () => void;
};

export function ResultsView({
  conditions,
  onStartChat,
  onRestart,
}: ResultsViewProps) {
  return (
    <section className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <header className="flex items-center justify-between border-b-2 border-primary/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">AI Analysis</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Urgency Assessment
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
          <MessageCircle className="w-6 h-6" /> Chat with LaVida
        </Button>
        <Button
          variant="ghost"
          onClick={onRestart}
          className="text-muted-foreground hover:text-primary transition-colors font-bold"
        >
          <RefreshCcw className="w-4 h-4 mr-2" /> Start New Check
        </Button>
      </div>
    </section>
  );
}
