"use client";

import { History, Calendar as CalendarIcon, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

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
  onSelect: (item: HistoryItem) => void;
  onClose: () => void;
};

export function HistoryPanel({
  items,
  loading,
  onSelect,
  onClose,
}: HistoryPanelProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="w-6 h-6 text-primary" /> History
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      <ScrollArea className="h-[60vh] -mx-2 px-2">
        <div className="space-y-4 pb-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
            </div>
          ) : items?.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <Activity className="w-12 h-12 text-muted-foreground/20 mx-auto" />
              <p className="text-muted-foreground">
                Your check-up history will appear here.
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
