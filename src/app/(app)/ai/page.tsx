"use client";

import { Send, User, Bot, Loader2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";

export default function AIPage() {
  const { dict } = useI18n();
  const [messages, setMessages] = useState<{ id: string, role: string, content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!res.body) throw new Error("No response body");

      const data = await res.json();
      const assistId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, { id: assistId, role: "assistant", content: data.text }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggest = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b bg-emerald-50/50 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900">{dict.nav.aiAssistant}</h1>
          <p className="text-xs text-slate-500 font-medium">Business Intelligence AI</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Halo, saya Asisten AI Anda.</h2>
              <p className="mt-2 text-slate-500">
                Saya dapat membantu menganalisis performa bisnis, membaca metrik, dan memberikan rekomendasi strategis berdasarkan data real-time perusahaan Anda.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {["Kenapa penjualan turun?", "Produk paling menguntungkan?", "Ringkas performa bulan ini"].map((q) => (
                <button
                  key={q}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  onClick={() => handleSuggest(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Bot className="h-4 w-4" />
              </div>
            )}
            
            <div className={`rounded-2xl px-5 py-3.5 max-w-[80%] text-sm ${
              m.role === "user" 
                ? "bg-slate-900 text-white rounded-tr-sm" 
                : "bg-slate-100 text-slate-800 rounded-tl-sm leading-relaxed whitespace-pre-wrap"
            }`}>
              {m.content}
            </div>

            {m.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 justify-start">
             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-5 py-3.5 text-sm text-slate-500 rounded-tl-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Menganalisis data...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu tentang performa bisnis..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
