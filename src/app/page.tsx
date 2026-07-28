"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { useI18n } from "@/lib/i18n";
import { NotificationPanel } from "@/components/notification-panel";
import { useNotificationStore } from "@/hooks/use-notification-store";
import {
  useUser,
  useFirestore,
  useAuth,
  isFirebaseAuthConfigured,
  firebaseAuthStatusMessage,
} from "@/firebase";
import { cn } from "@/lib/utils";

import { NavBar } from "./_components/nav-bar";
import { Footer } from "./_components/footer";
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

  const [showHistory, setShowHistory] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotificationStore();

  const checker = useSymptomChecker(t);
  const chat = useHealthChat();

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
        err instanceof Error ? err.message : "Sign in failed.",
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
      <NavBar
        unreadCount={unreadCount}
        showHistory={showHistory}
        showTools={showTools}
        showNotifications={showNotifications}
        onToggleHistory={() => {
          setShowHistory((prev) => !prev);
          setShowTools(false);
        }}
        onToggleTools={() => {
          setShowTools((prev) => !prev);
          setShowHistory(false);
        }}
        onToggleNotifications={() => setShowNotifications((prev) => !prev)}
        onLogin={handleLogin}
        onLogout={handleLogout}
        authEnabled={authEnabled}
      />

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

        <Footer />
      </main>
    </div>
  );
}
