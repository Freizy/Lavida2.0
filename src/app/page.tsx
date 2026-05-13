'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { analyzeSymptoms, type SymptomAnalysisOutput } from '@/ai/flows/symptom-analysis-flow';
import { chatWithLaVida } from '@/ai/flows/health-chat-flow';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AlertCircle, CheckCircle2, Loader2, Stethoscope, ArrowRight, RefreshCcw, MessageCircle, Send, User, Bot, LogIn, LogOut, History, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit } from 'firebase/firestore';
import { useCollection } from '@/firebase';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function Home() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [age, setAge] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SymptomAnalysisOutput | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // History state
  const [showHistory, setShowHistory] = useState(false);

  const historyQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(
      collection(db, 'history'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
  }, [user, db]);

  const { data: historyItems } = useCollection(historyQuery);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!age || !symptoms.trim()) {
      setError('Please provide both age and a description of your symptoms.');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 99) {
      setError('Please enter a valid age between 1 and 99.');
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

      // Save to history if logged in
      if (user && db) {
        addDoc(collection(db, 'history'), {
          userId: user.uid,
          gender,
          age: ageNum,
          symptoms: symptoms.trim(),
          conditions: response.conditions,
          timestamp: serverTimestamp(),
        });
      }
    } catch (err: any) {
      setError(err.message || 'Oops! Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = () => {
    setShowChat(true);
    if (chatMessages.length === 0 && result) {
      setChatMessages([
        { 
          role: 'model', 
          content: `Hi! I'm LaVida. I've looked at your symptoms. Based on the analysis, which of these conditions would you like to discuss further, or do you have other questions about how you're feeling?` 
        }
      ]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading || !result) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const response = await chatWithLaVida({
        initialContext: {
          gender,
          age: parseInt(age),
          symptoms,
          conditions: result.conditions.map(c => c.name),
        },
        history: chatMessages,
        message: userMessage,
      });

      setChatMessages(prev => [...prev, { role: 'model', content: response.response }]);
    } catch (err: any) {
      setError('Chat Error: ' + (err.message || 'Could not reach LaVida.'));
    } finally {
      setChatLoading(false);
    }
  };

  const handleRestart = () => {
    setGender('Male');
    setAge('');
    setSymptoms('');
    setResult(null);
    setError(null);
    setShowChat(false);
    setShowHistory(false);
    setChatMessages([]);
  };

  const selectHistoryItem = (item: any) => {
    setGender(item.gender);
    setAge(item.age.toString());
    setSymptoms(item.symptoms);
    setResult({ conditions: item.conditions });
    setShowHistory(false);
  };

  const loadingPlaceholder = PlaceHolderImages.find(img => img.id === 'loading-medical');

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="w-full max-w-[400px] flex items-center justify-between mb-8 py-2">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">LaVida</span>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowHistory(true)} className="rounded-full">
                <History className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8 border">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={handleLogin} className="flex items-center gap-2 rounded-full border-primary text-primary">
              <LogIn className="w-4 h-4" /> Sign In
            </Button>
          )}
        </div>
      </nav>

      <main className="w-full max-w-[400px] flex flex-col gap-8 flex-1">
        {showHistory && (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
            <header className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-2xl font-bold">Health History</h1>
            </header>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {historyItems?.length === 0 && <p className="text-center text-muted-foreground py-10">No history yet.</p>}
                {historyItems?.map((item: any) => (
                  <Card key={item.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => selectHistoryItem(item)}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-primary">{item.gender}, {item.age}y</span>
                        <span className="text-[10px] text-muted-foreground">
                          {item.timestamp?.toDate().toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-sm line-clamp-1">{item.symptoms}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-wrap gap-1">
                        {item.conditions.slice(0, 2).map((c: any, i: number) => (
                          <span key={i} className="text-[9px] bg-secondary px-1.5 py-0.5 rounded-full">{c.name}</span>
                        ))}
                        {item.conditions.length > 2 && <span className="text-[9px] text-muted-foreground">+{item.conditions.length - 2} more</span>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {!showHistory && !showChat && (
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              LaVida Buddy 😎
            </h1>
            <p className="text-sm text-muted-foreground">
              {user ? `Welcome back, ${user.displayName?.split(' ')[0]}` : 'Sign in to save your history!'}
            </p>
          </header>
        )}

        {!result && !loading && !showChat && !showHistory && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-500">
            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                className="lavida-input cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="age" className="text-sm font-medium">Age (1-99)</label>
              <input
                id="age"
                type="number"
                min="1"
                max="99"
                placeholder="e.g. 25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="lavida-input"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="symptoms" className="text-sm font-medium">Symptoms</label>
              <textarea
                id="symptoms"
                rows={4}
                placeholder="Describe how you feel..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="lavida-input resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="lavida-button mt-4"
            >
              Check Symptoms
            </button>
          </form>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center space-y-4 pt-4 animate-in fade-in duration-500">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
              {loadingPlaceholder && (
                <Image
                  src={loadingPlaceholder.imageUrl}
                  alt="Loading animation"
                  fill
                  className="object-cover animate-pulse"
                  data-ai-hint={loadingPlaceholder.imageHint}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
            </div>
            <p className="font-semibold text-primary animate-bounce">Analyzing Symptoms...</p>
          </div>
        )}

        {error && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="lavida-error-panel flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRestart} 
              className="w-full flex items-center gap-2 border-primary text-primary hover:bg-primary/5"
            >
              <RefreshCcw className="w-4 h-4" /> Start Over
            </Button>
          </div>
        )}

        {result && result.conditions && !showChat && !showHistory && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between border-b-2 border-primary pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold uppercase tracking-wide">Analysis Result</h2>
              </div>
            </div>
            
            <div className="flex flex-col gap-10">
              {result.conditions.map((condition, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-3 top-0 bottom-0 w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(39,235,4,0.3)]" />
                  <Card className="border-none shadow-md bg-white/60 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-extrabold text-foreground flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">
                          {idx + 1}
                        </span>
                        {condition.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest block mb-1">Likely Cause</span>
                        <p className="text-sm font-medium leading-relaxed text-foreground/80">{condition.cause}</p>
                      </div>
                      <div className="pt-3 border-t border-primary/10">
                        <span className="text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-1 mb-1">
                          <ArrowRight className="w-3 h-3" /> Next Steps
                        </span>
                        <p className="text-sm font-bold text-foreground leading-relaxed italic">{condition.nextSteps}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <div className="grid gap-3 pt-4">
              <Button 
                onClick={handleStartChat} 
                className="w-full py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> Dive Deeper (Chat)
              </Button>
              <Button 
                variant="outline"
                onClick={handleRestart} 
                className="w-full py-6 text-lg font-bold border-primary text-primary hover:bg-primary/5 transition-all active:scale-95 flex items-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" /> Start New Check
              </Button>
            </div>
          </section>
        )}

        {showChat && (
          <section className="flex flex-col h-[600px] bg-white rounded-2xl shadow-2xl border border-primary/20 overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-4 bg-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 border-2 border-white/20">
                  <AvatarFallback className="bg-white/10"><Bot className="w-5 h-5" /></AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sm">Chat with LaVida</h3>
                  <p className="text-[10px] opacity-80">Online Health Buddy</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowChat(false)} className="text-white hover:bg-white/10 h-8 px-2 text-xs">
                Back to Results
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4 bg-[#f9fff9]">
              <div className="space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white border border-primary/10 text-foreground rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-primary/10 p-3 rounded-2xl rounded-tl-none shadow-sm">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
              <input
                type="text"
                placeholder="Ask follow-up questions..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-secondary rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={chatLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="rounded-full bg-primary hover:bg-primary/90 shrink-0"
                disabled={chatLoading || !chatInput.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </section>
        )}

        <footer className="mt-12 text-center text-xs text-muted-foreground pb-8">
          <p>© {currentYear ?? '...'} LaVidaWeb Health Buddy</p>
          <p className="mt-1 italic px-4">Disclaimer: This is an AI assistant, not a substitute for professional medical advice. Always consult with a qualified healthcare provider.</p>
        </footer>
      </main>
    </div>
  );
}
