"use client";

import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationStore } from "@/hooks/use-notification-store";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type NotificationPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, clearAll } =
    useNotificationStore();
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-0 w-80 bg-background border rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <h3 className="font-bold text-sm">{t.notifications.title}</h3>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-white text-[10px] px-1.5 py-0">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-7"
            >
              <CheckCheck className="w-3 h-3 mr-1" /> {t.notifications.readAll}
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[300px]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Bell className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm">{t.notifications.empty}</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "p-3 rounded-xl text-sm transition-colors hover:bg-secondary/50",
                  !n.read && "bg-primary/5"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-medium", !n.read && "text-primary")}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {n.body}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {n.createdAt?.toDate?.().toLocaleTimeString?.([], { hour: "2-digit", minute: "2-digit" }) || t.notifications.justNow}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!n.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAsRead(n.id)}
                        className="h-6 w-6"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => clearNotification(n.id)}
                      className="h-6 w-6 text-destructive/60 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {notifications.length > 0 && (
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="w-full text-xs text-destructive/60 hover:text-destructive"
          >
            {t.notifications.clearAll}
          </Button>
        </div>
      )}
    </div>
  );
}
