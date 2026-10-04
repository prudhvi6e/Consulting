import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "psrao.chat.v1";
const GREETING: Msg = {
  role: "assistant",
  content: "Hello! I'm the PS Rao virtual assistant. Ask me about our services, compliance deadlines, or how to book a free consultation.",
};
const SUGGESTIONS = ["What services do you offer?", "How do I book a consultation?", "Do you handle SEBI/LODR compliance?"];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as Msg[];
    } catch { /* ignore */ }
    return [GREETING];
  });
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30))); } catch { /* ignore */ }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING).slice(-12) }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      setMessages((m) => [...m, { role: "assistant", content: data.reply || data.error || "Sorry, something went wrong. Please try again." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "I couldn't reach the server. Please try again in a moment." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onClick={() => setOpen(true)}
            aria-label="Open chat assistant"
            data-cursor
            className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[60] h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary))] flex items-center justify-center hover:scale-105 transition-transform"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-sky-300 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-sky-300" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="PS Rao chat assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[70] bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-[400px] h-[85dvh] md:h-[600px] md:max-h-[calc(100dvh-4rem)] bg-card text-card-foreground md:rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-secondary text-secondary-foreground px-5 py-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-white leading-tight">PS Rao Assistant</div>
                <div className="text-xs text-secondary-foreground/60 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online · replies in seconds
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" data-cursor className="h-9 w-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border text-foreground rounded-bl-md",
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              {messages.length <= 1 && !busy && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} data-cursor className="text-xs rounded-full border border-border bg-card px-3 py-1.5 hover:border-primary hover:text-primary transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="border-t border-border bg-card px-3 py-3 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                maxLength={1000}
                className="flex-1 h-11 rounded-full bg-background border border-border px-4 text-sm outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                aria-label="Send"
                data-cursor
                className="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="bg-card px-4 pb-3 -mt-1 text-[11px] text-muted-foreground text-center">
              General information only — <Link href="/contact#schedule" onClick={() => setOpen(false)} className="text-primary hover:underline">book a free consultation</Link> for advice on your matter.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
