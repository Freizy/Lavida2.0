"use client";

import { useState, useEffect, useMemo } from "react";
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
  useDoc,
  isFirebaseAuthConfigured,
  firebaseAuthStatusMessage,
} from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  limit,
} from "firebase/firestore";
import { useCollection } from "@/firebase";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

import { SymptomForm } from "./_components/symptom-form";
import { ConditionCard } from "./_components/condition-card";
import { HealthChat } from "./_components/health-chat";
import { HistoryPanel } from "./_components/history-panel";
import { ToolsPanel } from "./_components/tools-panel";
import { LoadingView } from "./_components/loading-view";
import { ErrorView } from "./_components/error-view";
import { ResultsView } from "./_components/results-view";
import { analyzeSymptoms, type SymptomAnalysisOutput } from "@/ai/flows/symptom-analysis-flow";
import { chatWithLaVida } from "@/ai/flows/health-chat-flow";

type Message = {
  role: "user" | "model";
  content: string;
};

export default function Home() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const authEnabled = isFirebaseAuthConfigured;
  const { t } = useI18n();
  const { toast } = useToast();

  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [age, setAge] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SymptomAnalysisOutput | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [profileRestored, setProfileRestored] = useState(false);

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const [showHistory, setShowHistory] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotificationStore();

  const profileRef = useMemo(() => {
    if (!user?.uid || !db) return null;
    return doc(db, "profiles", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(profileRef);

  const historyQuery = useMemo(() => {
    if (!user?.uid || !db) return null;
    return query(
      collection(db, "history"),
      where("userId", "==", user.uid),
      limit(50),
    );
  }, [user?.uid, db]);

  const { data: rawHistoryItems, loading: historyLoading } =
    useCollection(historyQuery);

  const historyItems = useMemo(() => {
    if (!rawHistoryItems) return null;
    return [...rawHistoryItems].sort((a, b) => {
      const aTime = a.timestamp?.toDate?.()?.getTime?.() || 0;
      const bTime = b.timestamp?.toDate?.()?.getTime?.() || 0;
      return bTime - aTime;
    });
  }, [rawHistoryItems]);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (!profile) {
      setProfileRestored(false);
      return;
    }

    const hasSavedGender =
      profile.gender === "Female" || profile.gender === "Male";
    const hasSavedAge = profile.age !== null && profile.age !== undefined;

    if (hasSavedGender) setGender(profile.gender);
    if (hasSavedAge) setAge(String(profile.age));

    setProfileRestored(hasSavedGender || hasSavedAge);
  }, [profile]);

  const persistProfile = async (updates: Record<string, any>) => {
    if (!user || !db) return;
    await setDoc(
      doc(db, "profiles", user.uid),
      {
        userId: user.uid,
        displayName: user.displayName || null,
        email: user.email || null,
        photoURL: user.photoURL || null,
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const handleGenderChange = (g: "Male" | "Female") => {
    setGender(g);
  };

  const handleAgeChange = (a: string) => {
    setAge(a);
  };

  const handleLogin = async () => {
    if (!authEnabled || !auth || !db) {
      setError(firebaseAuthStatusMessage);
      return;
    }

    const provider = new GoogleAuthProvider();
    try {
      setError(null);
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
    } catch (err: any) {
      console.error("Login failed", err);
      setError(
        err?.message ||
          "Sign in failed. Please check your Firebase Auth configuration.",
      );
    }
  };

  const handleLogout = () => {
    if (!auth) return;
    signOut(auth);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!age || !symptoms.trim()) {
      setError("Please provide both age and a description of your symptoms.");
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 99) {
      setError("Please enter a valid age between 1 and 99.");
      return;
    }

    setLoading(true);
    try {
      const response = await analyzeSymptoms({
        gender,
        age: ageNum,
        symptoms: symptoms.trim(),
      });
      setLoading(false);
      setResult(response);

      if (user && db) {
        const isNewProfile = !profile?.gender && !profile?.age;
        await persistProfile({ gender, age: ageNum });

        if (isNewProfile) {
          toast({
            title: "Profile saved",
            description: "Your gender and age have been saved for future checkups.",
          });
        }

        await addDoc(collection(db, "history"), {
          userId: user.uid,
          gender,
          age: ageNum,
          symptoms: symptoms.trim(),
          conditions: response.conditions,
          timestamp: serverTimestamp(),
        });
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Oops! Something went wrong. Please try again.");
    }
  };

  const handleStartChat = () => {
    setShowChat(true);
    if (chatMessages.length === 0 && result) {
      setChatMessages([
        {
          role: "model",
          content: `Hi! I'm LaVida, your health buddy. I've analyzed your symptoms. Which of these conditions would you like to explore further, or do you have other questions about how you're feeling?`,
        },
      ]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading || !result) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);
    setChatLoading(true);

    try {
      const response = await chatWithLaVida({
        initialContext: {
          gender,
          age: parseInt(age),
          symptoms,
          conditions: result.conditions.map((c) => c.name),
        },
        history: chatMessages,
        message: userMessage,
      });

      setChatMessages((prev) => [
        ...prev,
        { role: "model", content: response.response },
      ]);
    } catch (err: any) {
      setError("Chat Error: " + (err.message || "Could not reach LaVida."));
    } finally {
      setChatLoading(false);
    }
  };

  const handleRestart = () => {
    setGender("Male");
    setAge("");
    setSymptoms("");
    setResult(null);
    setError(null);
    setShowChat(false);
    setShowHistory(false);
    setShowTools(false);
    setChatMessages([]);
  };

  const selectHistoryItem = (item: any) => {
    setGender(item.gender);
    setAge(item.age.toString());
    setSymptoms(item.symptoms);
    setResult({ conditions: item.conditions });
    setShowHistory(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground selection:bg-primary/20">
      <nav className="w-full max-w-2xl flex items-center justify-between p-4 md:p-6 md:px-0">
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={handleRestart}
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
                <div
                  className="cursor-pointer"
                  onClick={() => router.push("/dashboard")}
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
              {authEnabled ? t.nav.signIn : "Sign In Unavailable"}
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
            items={historyItems}
            loading={historyLoading}
            isLoggedIn={!!user}
            onSelect={selectHistoryItem}
            onClose={() => setShowHistory(false)}
            onSignIn={handleLogin}
          />
        )}

        {showTools && (
          <ToolsPanel
            onWellnessAssistant={() => {
              setShowTools(false);
              setShowChat(true);
              if (chatMessages.length === 0) {
                setChatMessages([
                  {
                    role: "model",
                    content:
                      "Hi! I'm LaVida, your health buddy. I can help you with symptom follow-ups, health guidance, and wellness recommendations.",
                  },
                ]);
              }
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

        {!showHistory && !showTools && !result && !loading && !showChat && (
          <SymptomForm
            gender={gender}
            age={age}
            symptoms={symptoms}
            loading={loading}
            profileRestored={profileRestored}
            onGenderChange={handleGenderChange}
            onAgeChange={handleAgeChange}
            onSymptomsChange={setSymptoms}
            onSubmit={handleSubmit}
          />
        )}

        {loading && <LoadingView />}

        {error && <ErrorView message={error} onRetry={handleRestart} />}

        {result && result.conditions && !showChat && !showHistory && !showTools && (
          <ResultsView
            conditions={result.conditions}
            gender={gender}
            age={age}
            symptoms={symptoms}
            onStartChat={handleStartChat}
            onRestart={handleRestart}
          />
        )}

        {showChat && (
          <HealthChat
            messages={chatMessages}
            loading={chatLoading}
            input={chatInput}
            onInputChange={setChatInput}
            onSend={handleSendMessage}
            onClose={() => setShowChat(false)}
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
