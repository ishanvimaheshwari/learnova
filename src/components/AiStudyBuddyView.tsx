import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  Send,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Trash2
} from "lucide-react";
import { Textbook, SubjectType } from "../types";

interface AiStudyBuddyViewProps {
  books: Textbook[];
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  subject?: string;
}

export const AiStudyBuddyView: React.FC<AiStudyBuddyViewProps> = ({ books }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "bot",
      text: "👋 Hi! I'm **ScholarBot**, your 24/7 AI Study Buddy & Socratic Tutor.\n\nI have access to your digital school backpack and textbooks! You can ask me:\n- 💡 **Simple Analogies & Concepts** (ELI12)\n- 📐 **Step-by-step Problem Solving & Proofs**\n- 🎯 **Exam Tricks & Common Pitfalls**\n- 📖 **Questions about any chapter in your textbooks**\n\nHow can I help you study today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | "All">("All");
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [mode, setMode] = useState<"socratic" | "eli12" | "solver" | "summary">("socratic");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const samplePrompts = [
    {
      label: "💡 Explain with Analogy",
      prompt: "Can you explain how Quantum Superposition works using a simple real-world analogy?",
      subj: "Physics" as SubjectType,
      mode: "eli12" as const,
    },
    {
      label: "📐 Step-by-Step Calculus",
      prompt: "Find the derivative of f(x) = (3x² + 2x) * cos(x) using the product rule step-by-step.",
      subj: "Mathematics" as SubjectType,
      mode: "solver" as const,
    },
    {
      label: "🔬 Mitosis vs Meiosis",
      prompt: "What are the 4 fundamental differences between Mitosis and Meiosis that students always mix up?",
      subj: "Biology" as SubjectType,
      mode: "socratic" as const,
    },
    {
      label: "⚠️ Exam Trick Questions",
      prompt: "Give me 2 tricky exam questions about Newton's Third Law with common student misconceptions.",
      subj: "Physics" as SubjectType,
      mode: "socratic" as const,
    },
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      subject: selectedSubject !== "All" ? selectedSubject : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    // Build context if a textbook is selected
    let contextStr = "";
    if (selectedBookId) {
      const book = books.find((b) => b.id === selectedBookId);
      if (book) {
        contextStr = `Active Textbook: ${book.title} (${book.subject}).\nAvailable Chapters: ${book.chapters
          .map((c) => `Ch ${c.number}: ${c.title}`)
          .join(", ")}.\nFirst chapter preview: ${book.chapters[0]?.content.slice(0, 500)}`;
      }
    }

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          subject: selectedSubject !== "All" ? selectedSubject : "General Science & School Curriculum",
          context: contextStr,
          mode,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-msg-${Date.now()}`,
        sender: "bot",
        text: data.text || "I'm sorry, I could not generate a response right now. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-msg-${Date.now()}`,
        sender: "bot",
        text: `Error connecting to AI Tutor: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm("Clear current conversation history?")) {
      setMessages([
        {
          id: "msg-welcome-new",
          sender: "bot",
          text: "Fresh session started! What topic would you like to explore?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-md">
              <Bot className="w-3.5 h-3.5 text-cyan-300" />
              <span>Personal 24/7 Socratic AI Tutor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ScholarBot AI Study Buddy
            </h1>
            <p className="text-sm text-blue-100">
              Get patient explanations, progressive hints for difficult homework, and instant textbook breakdowns.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
            >
              <Trash2 className="w-4 h-4" /> Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Mode & Context Textbook Picker */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setMode("socratic")}
            className={`px-3 py-1.5 rounded-lg transition ${
              mode === "socratic"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            🤔 Socratic Guided
          </button>
          <button
            onClick={() => setMode("eli12")}
            className={`px-3 py-1.5 rounded-lg transition ${
              mode === "eli12"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            💡 Explain Simply (ELI12)
          </button>
          <button
            onClick={() => setMode("solver")}
            className={`px-3 py-1.5 rounded-lg transition ${
              mode === "solver"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            📐 Step-by-Step Solver
          </button>
        </div>

        {/* Linked Textbook Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Context:</span>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
          >
            <option value="">General Knowledge (All Subjects)</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.subject})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {samplePrompts.map((sp, idx) => (
          <button
            key={idx}
            onClick={() => {
              setMode(sp.mode);
              setSelectedSubject(sp.subj);
              handleSendMessage(sp.prompt);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold transition whitespace-nowrap border border-slate-200 dark:border-slate-700/60"
          >
            {sp.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md flex flex-col h-[520px] overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? "justify-start" : "justify-end"}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl sm:max-w-2xl p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                    isBot
                      ? "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200"
                      : "bg-blue-600 text-white shadow-md font-medium"
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  <div
                    className={`flex items-center justify-between text-[10px] pt-2 border-t ${
                      isBot
                        ? "border-slate-200 dark:border-slate-700 text-slate-400"
                        : "border-white/20 text-white/70"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-blue-500 flex items-center gap-1 font-bold"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2 animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>ScholarBot is formulating explanations and formulas...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about school homework, formulas, or chapter concepts..."
              className="flex-1 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-2xl shadow-md transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
