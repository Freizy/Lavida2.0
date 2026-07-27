"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type ErrorViewProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
      <div className="lavida-error-panel shadow-lg shadow-destructive/5">
        <AlertCircle className="w-6 h-6 shrink-0" />
        <div className="space-y-1">
          <p className="font-bold">{t.error.title}</p>
          <p className="opacity-80">{message}</p>
        </div>
      </div>
      <Button
        onClick={onRetry}
        className="lavida-button bg-background !text-foreground border-2 border-border shadow-none hover:bg-secondary"
      >
        <RefreshCcw className="w-5 h-5" /> {t.error.tryAgain}
      </Button>
    </div>
  );
}
