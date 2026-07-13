"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  analyzeSymptoms,
  type SymptomAnalysisOutput,
} from "@/ai/flows/symptom-analysis-flow";
import { chatWithLaVida } from "@/ai/flows/health-chat-flow";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Stethoscope,
  ArrowRight,
  RefreshCcw,
  MessageCircle,
  Send,
  User,
  Bot,
  LogIn,
  LogOut,
  History,
  Calendar as CalendarIcon,
  Activity,
  UserCircle,
  AlertTriangle,
  Flame,
  HeartPulse,
  ShieldCheck,
  Stethoscope as StethoscopeIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useUser,
  useFirestore,
  useAuth,
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
  orderBy,
  limit,
} from "firebase/firestore";
import { useCollection } from "@/firebase";
import { cn } from "@/lib/utils";

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

  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [age, setAge] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SymptomAnalysisOutput | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // History and tools state
  const [showHistory, setShowHistory] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const historyQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "history"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(15),
    );
  }, [user, db]);

  const { data: historyItems, loading: historyLoading } =
    useCollection(historyQuery);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

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
          gender: null,
          age: null,
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
      setResult(response);

      if (user && db) {
        await setDoc(
          doc(db, "profiles", user.uid),
          {
            userId: user.uid,
            gender,
            age: ageNum,
            displayName: user.displayName || null,
            email: user.email || null,
            photoURL: user.photoURL || null,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );

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
      setError(err.message || "Oops! Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

  const openHealthSummary = () => {
    setShowTools(false);

    if (!user) {
      setError("Please sign in to access your personalized health summary.");
      return;
    }

    router.push("/dashboard");
  };

  const openCareContinuity = () => {
    setShowTools(false);
    setShowHistory(true);
  };

  const openWellnessAssistant = () => {
    setShowTools(false);
    setShowChat(true);

    if (chatMessages.length === 0) {
      setChatMessages([
        {
          role: "model",
          content:
            "Hi! I'm LaVida, your health buddy. I can help you review your health summary, follow up on saved checkups, or answer questions about your next wellness steps.",
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

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return {
          card: "border-red-600/50 bg-red-50/50 urgency-critical",
          header: "bg-red-600/10",
          badge: "bg-red-600 text-white",
          icon: <Flame className="w-5 h-5 text-red-600" />,
          label: "Critical / Emergency",
        };
      case "high":
        return {
          card: "border-red-500/30 bg-red-50/30 urgency-high",
          header: "bg-red-500/10",
          badge: "bg-red-500 text-white",
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          label: "High Urgency",
        };
      case "medium":
        return {
          card: "border-amber-500/30 bg-amber-50/30 urgency-medium",
          header: "bg-amber-500/10",
          badge: "bg-amber-500 text-white",
          icon: <StethoscopeIcon className="w-5 h-5 text-amber-500" />,
          label: "Moderate Urgency",
        };
      default:
        return {
          card: "border-primary/30 bg-primary/5 urgency-low",
          header: "bg-primary/10",
          badge: "bg-primary text-white",
          icon: <ShieldCheck className="w-5 h-5 text-primary" />,
          label: "Low Urgency",
        };
    }
  };

  const loadingPlaceholder = PlaceHolderImages.find(
    (img) => img.id === "loading-medical",
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navigation Header */}
      <nav className="w-full max-w-2xl flex items-center justify-between p-6 md:px-0">
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={handleRestart}
        >
          <div className="bg-primary p-2 rounded-xl shadow-glow transition-transform group-hover:scale-110">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight">LaVida</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowHistory((prev) => !prev);
                  setShowTools(false);
                }}
                className={cn(
                  "rounded-xl transition-colors",
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
              {authEnabled ? "Sign In" : "Sign In Unavailable"}
            </Button>
          )}
        </div>
      </nav>

      <main className="w-full max-w-md px-6 flex flex-col gap-8 pb-12 flex-1">
        {showHistory && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <History className="w-6 h-6 text-primary" /> History
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(false)}
              >
                Close
              </Button>
            </div>
            <ScrollArea className="h-[60vh] -mx-2 px-2">
              <div className="space-y-4 pb-4">
                {historyLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                  </div>
                ) : historyItems?.length === 0 ? (
                  <div className="text-center py-20 space-y-3">
                    <Activity className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                    <p className="text-muted-foreground">
                      Your check-up history will appear here.
                    </p>
                  </div>
                ) : (
                  historyItems?.map((item: any) => (
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group overflow-hidden"
                      onClick={() => selectHistoryItem(item)}
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
        )}

        {showTools && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <HeartPulse className="w-6 h-6 text-primary" /> Health tools
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTools(false)}
              >
                Close
              </Button>
            </div>
            <div className="space-y-4">
              <Card
                role="button"
                tabIndex={0}
                onClick={openHealthSummary}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openHealthSummary();
                  }
                }}
                className="overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Personalized health summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Review your saved profile details, latest symptom patterns,
                  and follow-up recommendations in one place.
                </CardContent>
              </Card>

              <Card
                role="button"
                tabIndex={0}
                onClick={openCareContinuity}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openCareContinuity();
                  }
                }}
                className="overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Care continuity</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Keep a clear log of symptom checkups so your health records
                  stay organized and easy to revisit.
                </CardContent>
              </Card>

              <Card
                role="button"
                tabIndex={0}
                onClick={openWellnessAssistant}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openWellnessAssistant();
                  }
                }}
                className="overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Future wellness tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  This panel is ready for reminders, habit tracking, medication
                  support, and more personalized health insights.
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!showHistory && !showTools && !result && !loading && !showChat && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <header className="space-y-3">
              <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                How are you <span className="text-primary">feeling</span> today?
              </h1>
              <p className="text-muted-foreground text-lg">
                Describe your symptoms and get an AI-powered health analysis in
                seconds.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="gender"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value as "Male" | "Female")
                    }
                    className="lavida-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="age"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                  >
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    min="1"
                    max="99"
                    placeholder="e.g. 28"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="lavida-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="symptoms"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Symptoms
                </label>
                <textarea
                  id="symptoms"
                  rows={4}
                  placeholder="Describe your symptoms in detail (e.g., headache for 3 days, mild fever...)"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="lavida-input resize-none min-h-[120px]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="lavida-button text-lg py-4"
              >
                Analyze My Health <Activity className="w-5 h-5" />
              </button>
            </form>

            <div className="bg-secondary/50 p-4 rounded-2xl flex items-start gap-4">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <UserCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Privacy First</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your data is stored securely. Log in to access your history
                  from any device.
                </p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center space-y-8 pt-20 animate-in fade-in duration-500 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                {loadingPlaceholder && (
                  <Image
                    src={loadingPlaceholder.imageUrl}
                    alt="Loading"
                    fill
                    className="object-cover transition-opacity duration-1000"
                    data-ai-hint={loadingPlaceholder.imageHint}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-[2px]">
                  <Loader2 className="w-16 h-16 text-primary animate-spin" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-primary animate-bounce">
                Consulting AI Buddy...
              </p>
              <p className="text-muted-foreground font-medium">
                This usually takes about 5 seconds.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
            <div className="lavida-error-panel shadow-lg shadow-destructive/5">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div className="space-y-1">
                <p className="font-bold">Something went wrong</p>
                <p className="opacity-80">{error}</p>
              </div>
            </div>
            <Button
              onClick={handleRestart}
              className="lavida-button bg-white !text-foreground border-2 border-border shadow-none hover:bg-secondary"
            >
              <RefreshCcw className="w-5 h-5" /> Try Again
            </Button>
          </div>
        )}

        {result && result.conditions && !showChat && !showHistory && (
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <header className="flex items-center justify-between border-b-2 border-primary/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    AI Analysis
                  </h2>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Urgency Assessment
                  </p>
                </div>
              </div>
            </header>

            <div className="flex flex-col gap-10">
              {result.conditions.map((condition, idx) => {
                const style = getUrgencyStyles(condition.urgency);
                return (
                  <div key={idx} className="group relative">
                    <Card
                      className={cn(
                        "border-2 shadow-soft hover:shadow-xl transition-all overflow-hidden",
                        style.card,
                      )}
                    >
                      <CardHeader
                        className={cn(
                          "pb-3 flex-row items-center justify-between",
                          style.header,
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-foreground text-xs font-black shadow-sm">
                            0{idx + 1}
                          </span>
                          <CardTitle className="text-xl font-bold tracking-tight">
                            {condition.name}
                          </CardTitle>
                        </div>
                        <Badge
                          className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-3 py-1",
                            style.badge,
                          )}
                        >
                          {condition.urgency}
                        </Badge>
                      </CardHeader>
                      <CardContent className="pt-5 space-y-5">
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.15em] flex items-center gap-1.5">
                            {style.icon} Potential Cause
                          </span>
                          <p className="text-base text-foreground/80 leading-relaxed font-medium">
                            {condition.cause}
                          </p>
                        </div>

                        <div className="p-4 bg-white/50 rounded-2xl border border-black/5">
                          <span className="text-[10px] uppercase font-black text-foreground/60 tracking-[0.15em] flex items-center gap-1.5 mb-2">
                            <ArrowRight className="w-3 h-3" /> Recommended Next
                            Steps
                          </span>
                          <p className="text-sm font-bold text-foreground leading-relaxed italic">
                            {condition.nextSteps}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-4 pt-6">
              <Button
                onClick={handleStartChat}
                className="lavida-button !bg-blue-600 !shadow-blue-600/20 py-6 text-xl"
              >
                <MessageCircle className="w-6 h-6" /> Chat with LaVida
              </Button>
              <Button
                variant="ghost"
                onClick={handleRestart}
                className="text-muted-foreground hover:text-primary transition-colors font-bold"
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Start New Check
              </Button>
            </div>
          </section>
        )}

        {showChat && (
          <section className="flex flex-col h-[650px] bg-white rounded-[2rem] shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-500">
            <header className="px-6 py-5 bg-primary text-white flex items-center justify-between shadow-lg relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-white/40 shadow-sm">
                    <AvatarFallback className="bg-white/10 text-white font-bold">
                      <Bot className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-primary rounded-full" />
                </div>
                <div>
                  <h3 className="font-black text-lg leading-none">
                    LaVida Buddy
                  </h3>
                  <p className="text-[10px] opacity-90 uppercase tracking-widest font-bold mt-1">
                    Health Assistant • Online
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
                className="text-white hover:bg-white/10 h-10 px-4 rounded-full font-bold"
              >
                Close
              </Button>
            </header>

            <ScrollArea className="flex-1 px-6 py-6 bg-[#FAFAFA]">
              <div className="space-y-6">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex w-full animate-in fade-in slide-in-from-bottom-2",
                      msg.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed",
                        msg.role === "user"
                          ? "bg-primary text-white rounded-tr-none shadow-primary/10"
                          : "bg-white border border-border text-foreground rounded-tl-none shadow-soft",
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start animate-in fade-in">
                    <div className="bg-white border border-border p-4 rounded-2xl rounded-tl-none shadow-soft">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            <div className="p-6 bg-white border-t-2 border-secondary">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ask a follow-up question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-secondary/80 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all border-none"
                  disabled={chatLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-2xl h-14 w-14 bg-primary hover:bg-primary/90 shadow-glow transition-all"
                  disabled={chatLoading || !chatInput.trim()}
                >
                  <Send className="w-6 h-6" />
                </Button>
              </form>
            </div>
          </section>
        )}

        <footer className="mt-auto pt-12 space-y-4 text-center">
          <Separator className="w-12 mx-auto bg-primary/20 h-1 rounded-full" />
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              © {currentYear ?? "2024"} LaVida Health Labs
            </p>
            <p className="text-[11px] font-bold text-muted-foreground/40 leading-relaxed px-8 italic">
              Medical Disclaimer: This AI is for information only and not a
              substitute for professional medical advice. If you have an
              emergency, please call local emergency services immediately.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
