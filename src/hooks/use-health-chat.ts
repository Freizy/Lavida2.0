"use client";

import { useState, useRef } from "react";
import { chatWithLaVida } from "@/ai/flows/health-chat-flow";
import type { TranslationKey } from "@/lib/translations";

export type Message = {
  role: "user" | "model";
  content: string;
};

export function useHealthChat() {
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesRef = useRef<Message[]>([]);

  const startChat = (welcomeMessage: string) => {
    setShowChat(true);
    const freshMessages: Message[] = [{ role: "model", content: welcomeMessage }];
    messagesRef.current = freshMessages;
    setChatMessages(freshMessages);
    setChatInput("");
  };

  const sendMessage = async (
    e: React.FormEvent,
    context: { gender: string; age: string; symptoms: string; conditions: string[] },
    t?: TranslationKey,
  ) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatLoading(true);

    const userMsg: Message = { role: "user", content: userMessage };
    const updatedMessages = [...messagesRef.current, userMsg];
    messagesRef.current = updatedMessages;
    setChatMessages(updatedMessages);

    try {
      const response = await chatWithLaVida({
        initialContext: {
          gender: context.gender,
          age: parseInt(context.age),
          symptoms: context.symptoms,
          conditions: context.conditions,
        },
        history: messagesRef.current,
        message: userMessage,
      });

      if ("error" in response) {
        const errorMsg: Message = {
          role: "model",
          content: response.error,
        };
        const finalMessages = [...messagesRef.current, errorMsg];
        messagesRef.current = finalMessages;
        setChatMessages(finalMessages);
      } else {
        const modelMsg: Message = { role: "model", content: response.response };
        const finalMessages = [...messagesRef.current, modelMsg];
        messagesRef.current = finalMessages;
        setChatMessages(finalMessages);
      }
    } catch (err: unknown) {
      const errorMsg: Message = {
        role: "model",
        content: t?.chat.error || "Sorry, I couldn't process that. Please try again.",
      };
      const finalMessages = [...messagesRef.current, errorMsg];
      messagesRef.current = finalMessages;
      setChatMessages(finalMessages);
    } finally {
      setChatLoading(false);
    }
  };

  const resetChat = () => {
    setShowChat(false);
    messagesRef.current = [];
    setChatMessages([]);
    setChatInput("");
  };

  return {
    showChat, setShowChat,
    chatMessages,
    chatInput, setChatInput,
    chatLoading,
    startChat, sendMessage, resetChat,
  };
}
