"use client";

import { useRef, useEffect } from "react";
import { Send, Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type Message = {
  role: "user" | "model";
  content: string;
};

type HealthChatProps = {
  messages: Message[];
  loading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  onClose: () => void;
};

export function HealthChat({
  messages,
  loading,
  input,
  onInputChange,
  onSend,
  onClose,
}: HealthChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
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
            <h3 className="font-black text-lg leading-none">{t.chat.title}</h3>
            <p className="text-[10px] opacity-90 uppercase tracking-widest font-bold mt-1">
              {t.chat.subtitle} • {t.chat.online}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/10 h-10 px-4 rounded-full font-bold"
        >
          <X className="w-4 h-4 mr-1" /> Close
        </Button>
      </header>

      <ScrollArea className="flex-1 px-6 py-6 bg-[#FAFAFA]">
        <div className="space-y-6">
          {messages.map((msg, idx) => (
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
          {loading && (
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
        <form onSubmit={onSend} className="flex gap-3">
          <input
            type="text"
            placeholder={t.chat.placeholder}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            className="flex-1 bg-secondary/80 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all border-none"
            disabled={loading}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-2xl h-14 w-14 bg-primary hover:bg-primary/90 shadow-glow transition-all"
            disabled={loading || !input.trim()}
          >
            <Send className="w-6 h-6" />
          </Button>
        </form>
      </div>
    </section>
  );
}
