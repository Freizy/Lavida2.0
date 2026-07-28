"use client";

import { useRouter } from "next/navigation";
import {
  Stethoscope,
  LogIn,
  LogOut,
  History,
  HeartPulse,
  User,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useI18n } from "@/lib/i18n";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";

type NavBarProps = {
  unreadCount: number;
  showHistory: boolean;
  showTools: boolean;
  showNotifications: boolean;
  onToggleHistory: () => void;
  onToggleTools: () => void;
  onToggleNotifications: () => void;
  onLogin: () => void;
  onLogout: () => void;
  authEnabled: boolean;
};

export function NavBar({
  unreadCount,
  showHistory,
  showTools,
  showNotifications,
  onToggleHistory,
  onToggleTools,
  onToggleNotifications,
  onLogin,
  onLogout,
  authEnabled,
}: NavBarProps) {
  const router = useRouter();
  const { user } = useUser();
  const { t } = useI18n();

  return (
    <nav className="w-full max-w-2xl flex items-center justify-between p-4 md:p-6 md:px-0">
      <div
        className="flex items-center gap-2 group cursor-pointer"
        onClick={() => router.push("/")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push("/");
          }
        }}
        aria-label="LaVida - Go to home"
      >
        <div className="bg-primary p-2 rounded-xl shadow-glow transition-transform group-hover:scale-110">
          <Stethoscope className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <span className="font-bold text-xl md:text-2xl tracking-tight">LaVida</span>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <LanguageToggle />
        {user ? (
          <>
            <div className="relative hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleNotifications}
                aria-label={t.nav.notifications}
                className={cn(
                  "rounded-xl transition-colors",
                  showNotifications && "bg-primary/10 text-primary",
                )}
              >
                <Bell className="w-5 h-5" />
              </Button>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" aria-label={`${unreadCount} unread notifications`}>
                  {unreadCount}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleHistory}
              aria-label={t.nav.history}
              className={cn(
                "rounded-xl transition-colors hidden md:flex",
                showHistory && "bg-primary/10 text-primary",
              )}
            >
              <History className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTools}
              aria-label={t.nav.tools}
              className={cn(
                "rounded-xl transition-colors",
                showTools && "bg-primary/10 text-primary",
              )}
            >
              <HeartPulse className="w-5 h-5" />
            </Button>
            <div className="h-6 w-[1px] bg-border" aria-hidden="true" />
            <div className="flex items-center gap-3 pl-2">
              <div
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => router.push("/dashboard")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push("/dashboard");
                  }
                }}
                aria-label={t.nav.profile}
              >
                <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-sm">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="bg-primary/5 text-primary">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                aria-label={t.nav.signOut}
                className="rounded-xl text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <Button
            onClick={onLogin}
            disabled={!authEnabled}
            className="lavida-button !w-auto !py-2 rounded-full px-6 shadow-glow disabled:cursor-not-allowed"
          >
            <LogIn className="w-4 h-4" />{" "}
            {authEnabled ? t.nav.signIn : t.nav.signInUnavailable}
          </Button>
        )}
      </div>
    </nav>
  );
}
