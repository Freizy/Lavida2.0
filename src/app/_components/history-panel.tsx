"use client";

import { History, Calendar as CalendarIcon, Activity, LogIn, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type HistoryItem = {
  id: string;
  gender: string;
  age: number;
  symptoms: string;
  conditions: { name: string }[];
  timestamp: { toDate: () => Date } | null;
};

type HistoryPanelProps = {
  items: HistoryItem[] | undefined;
  loading: boolean;
  isLoggedIn: boolean;
  error?: string | null;
  onSelect: (item: HistoryItem) => void;
  onClose: () => void;
  onSignIn: () => void;
};

export function HistoryPanel({
  items,
  loading,
  isLoggedIn,
  error,
  onSelect,
  onClose,
  onSignIn,
}: HistoryPanelProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="w-6 h-6 text-primary" /> {t.history.title}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      <ScrollArea className="h-[60vh] -mx-2 px-2">
        <div className="space-y-4 pb-4">
          {!isLoggedIn ? (
            <div className="text-center py-20 space-y-4">
              <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">
                <LogIn className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="font-bold text-lg">{t.history.signInPrompt}</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {t.history.signInDesc}
                </p>
              </div>
              <Button onClick={onSignIn} className="lavida-button !w-auto px-6">
                <LogIn className="w-4 h-4 mr-2" /> {t.nav.signIn}
              </Button>
            </div>
          ) : error ? (
            <div className="text-center py-20 space-y-3">
              <AlertTriangle className="w-12 h-12 text-destructive/40 mx-auto" />
              <p className="text-destructive font-medium">Failed to load history</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">{error}</p>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
            </div>
          ) : !items || items.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <Activity className="w-12 h-12 text-muted-foreground/20 mx-auto" />
              <p className="text-muted-foreground">
                {t.history.empty}
              </p>
            </div>
          ) : (
            items?.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group overflow-hidden"
                onClick={() => onSelect(item)}
              >
                <CardHeader className="p-4 pb-2 space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/5 text-primary border-none"
                      >
                        {item.gender}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-primary/5 text-primary border-none"
                      >
                        {item.age}y
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {item.timestamp
                        ?.toDate()
                        .toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                    </span>
                  </div>
                  <CardTitle className="text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors">
                    {item.symptoms}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
