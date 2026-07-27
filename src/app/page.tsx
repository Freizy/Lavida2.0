"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { NotificationPanel } from "@/components/notification-panel";
import { useNotificationStore } from "@/hooks/use-notification-store";
import {
  useUser,
  useFirestore,
  useAuth,
  isFirebaseAuthConfigured,
  firebaseAuthStatusMessage,
} from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

import { SymptomForm } from "./_components/symptom-form";
import { HealthChat } from "./_components/health-chat";
import { HistoryPanel } from "./_components/history-panel";
import { ToolsPanel } from "./_components/tools-panel";
import { LoadingView } from "./_components/loading-view";
import { ErrorView } from "./_components/error-view";
import { ResultsView } from "./_components/results-view";
import { useSymptomChecker } from "@/hooks/use-symptom-checker";
import { useHealthChat } from "@/hooks/use-health-chat";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const authEnabled = isFirebaseAuthConfigured;
  const { t } = useI18n();

  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotificationStore();

  const checker = useSymptomChecker(t);
  const chat = useHealthChat();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleLogin = async () => {
    if (!authEnabled || !auth || !db) {
      checker.setError(firebaseAuthStatusMessage);
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      checker.setError(null);
      const result = await signInWithPopup(auth, provider);
      await setDoc(
        doc(db, "profiles", result.user.uid),
        {
          userId: result.user.uid,
          displayName: result.user.displayName || null,
          email: result.user.email || null,
          photoURL: result.user.photoURL || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Login failed", err);
      checker.setError(
        err instanceof Error ? err.message : "Sign in failed. Please check your Firebase Auth configuration.",
      );
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "history", id));
    } catch (err) {
      console.error("[LaVida] Failed to delete history item:", err);
    }
  };

  const handleFullRestart = () => {
    checker.handleRestart();
    chat.resetChat();
    setShowHistory(false);
    setShowTools(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground selection:bg-primary/20">
      <nav className="w-full max-w-2xl flex items-center justify-between p-4 md:p-6 md:px-0">
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={handleFullRestart}
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
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className={cn(
                    "rounded-xl transition-colors",
                    showNotifications && "bg-primary/10 text-primary",
                  )}
                >
                  <Bell className="w-5 h-5" />
                </Button>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowHistory((prev) => !prev);
                  setShowTools(false);
                }}
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
                onClick={() => {
                  setShowTools((prev) => !prev);
                  setShowHistory(false);
                }}
                className={cn(
                  "rounded-xl transition-colors",
                  showTools && "bg-primary/10 text-primary",
                )}
              >
                <HeartPulse className="w-5 h-5" />
              </Button>
              <div className="h-6 w-[1px] bg-border" />
              <div className="flex items-center gap-3 pl-2">
                <div className="cursor-pointer" onClick={() => router.push("/dashboard")}>
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
                  onClick={handleLogout}
                  className="rounded-xl text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={handleLogin}
              disabled={!authEnabled}
              className="lavida-button !w-auto !py-2 rounded-full px-6 shadow-glow disabled:cursor-not-allowed"
            >
              <LogIn className="w-4 h-4" />{" "}
              {authEnabled ? t.nav.signIn : t.nav.signInUnavailable}
            </Button>
          )}
        </div>
      </nav>

      <div className="relative w-full max-w-2xl px-6 md:px-0">
        <NotificationPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>

      <main
        className={cn(
          "w-full px-6 flex flex-col gap-8 pb-12 flex-1 transition-all duration-300",
          showHistory || showTools ? "max-w-5xl" : "max-w-md",
        )}
      >
        {showHistory && (
          <HistoryPanel
            items={checker.historyItems}
            loading={checker.historyLoading}
            isLoggedIn={!!user}
            error={checker.historyError?.message}
            onSelect={(item) => {
              checker.selectHistoryItem(item);
              setShowHistory(false);
            }}
            onDelete={handleDeleteHistory}
            onClose={() => setShowHistory(false)}
            onSignIn={handleLogin}
          />
        )}

        {showTools && (
          <ToolsPanel
            onWellnessAssistant={() => {
              setShowTools(false);
              chat.startChat(t.home.chatWelcomeTools);
            }}
            onOpenNotifications={() => {
              setShowTools(false);
              setShowNotifications(true);
            }}
            onOpenHistory={() => {
              setShowTools(false);
              setShowHistory(true);
            }}
            onClose={() => setShowTools(false)}
          />
        )}

        {!showHistory && !showTools && !checker.result && !checker.loading && !chat.showChat && (
          <SymptomForm
            gender={checker.gender}
            age={checker.age}
            symptoms={checker.symptoms}
            loading={checker.loading}
            profileRestored={checker.profileRestored}
            onGenderChange={checker.setGender}
            onAgeChange={checker.setAge}
            onSymptomsChange={checker.setSymptoms}
            onSubmit={checker.handleSubmit}
          />
        )}

        {checker.loading && <LoadingView />}

        {checker.error && <ErrorView message={checker.error} onRetry={handleFullRestart} />}

        {checker.result && checker.result.conditions && !chat.showChat && !showHistory && !showTools && (
          <ResultsView
            conditions={checker.result.conditions}
            gender={checker.gender}
            age={checker.age}
            symptoms={checker.symptoms}
            onStartChat={() => chat.startChat(t.home.chatWelcome)}
            onRestart={handleFullRestart}
          />
        )}

        {chat.showChat && (
          <HealthChat
            messages={chat.chatMessages}
            loading={chat.chatLoading}
            input={chat.chatInput}
            onInputChange={chat.setChatInput}
            onSend={(e) =>
              chat.sendMessage(e, {
                gender: checker.gender,
                age: checker.age,
                symptoms: checker.symptoms,
                conditions: checker.result?.conditions?.map((c) => c.name) || [],
              }, t)
            }
            onClose={() => chat.setShowChat(false)}
          />
        )}

        <footer className="mt-auto pt-12 space-y-4 text-center">
          <Separator className="w-12 mx-auto bg-primary/20 h-1 rounded-full" />
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              © {currentYear ?? "2024"} LaVida Health Labs
            </p>
            <p className="text-[11px] font-bold text-muted-foreground/40 leading-relaxed px-8 italic">
              {t.footer.disclaimer}
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
