import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Highlighter,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Award,
  FileText,
  List,
  Type,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
  HelpCircle,
  X,
  Layers,
  Bot,
  Send,
  MessageSquarePlus,
  StickyNote
} from "lucide-react";
import { Textbook, BookChapter, Highlight, StudentNote } from "../types";

interface BookReaderProps {
  book: Textbook;
  initialChapterId?: string;
  onBackToBackpack: () => void;
  onGenerateQuizForChapter: (book: Textbook, chapter: BookChapter) => void;
  onOpenFlashcards: (book: Textbook) => void;
  onSaveNote: (note: StudentNote) => void;
}

type ReaderTheme = "light" | "sepia" | "dark";
type ReaderFont = "sans" | "serif" | "mono";

export const BookReader: React.FC<BookReaderProps> = ({
  book,
  initialChapterId,
  onBackToBackpack,
  onGenerateQuizForChapter,
  onOpenFlashcards,
  onSaveNote,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"toc" | "highlights" | "glossary" | "formulas">("toc");

  // Customization
  const [theme, setTheme] = useState<ReaderTheme>("light");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [fontFamily, setFontFamily] = useState<ReaderFont>("sans");

  // Bookmarks & Highlights
  const [bookmarkedChapters, setBookmarkedChapters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`scholardesk_bm_${book.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [highlights, setHighlights] = useState<Highlight[]>(() => {
    try {
      const saved = localStorage.getItem(`scholardesk_hl_${book.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedHighlightColor, setSelectedHighlightColor] = useState<"yellow" | "green" | "blue" | "pink">("yellow");
  const [activeSelectionText, setActiveSelectionText] = useState("");
  const [selectionPopupPos, setSelectionPopupPos] = useState<{ x: number; y: number } | null>(null);

  // Audio Read-Aloud
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Embedded Checkpoints answers state
  const [checkpointAnswers, setCheckpointAnswers] = useState<{ [qIdx: number]: number }>({});
  const [checkpointRevealed, setCheckpointRevealed] = useState<{ [qIdx: number]: boolean }>({});

  // AI Assistant in Reader
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMode, setAiMode] = useState<"eli12" | "socratic" | "solver" | "summary">("eli12");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Initialize chapter if passed
  useEffect(() => {
    if (initialChapterId) {
      const idx = book.chapters.findIndex((c) => c.id === initialChapterId);
      if (idx !== -1) setCurrentChapterIndex(idx);
    }
  }, [initialChapterId, book.chapters]);

  const currentChapter: BookChapter = book.chapters[currentChapterIndex] || book.chapters[0];

  // Save Bookmarks
  useEffect(() => {
    localStorage.setItem(`scholardesk_bm_${book.id}`, JSON.stringify(bookmarkedChapters));
  }, [bookmarkedChapters, book.id]);

  // Save Highlights
  useEffect(() => {
    localStorage.setItem(`scholardesk_hl_${book.id}`, JSON.stringify(highlights));
  }, [highlights, book.id]);

  // Stop speech when chapter changes or unmounts
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [currentChapterIndex]);

  const toggleBookmark = () => {
    setBookmarkedChapters((prev) =>
      prev.includes(currentChapter.id) ? prev.filter((id) => id !== currentChapter.id) : [...prev, currentChapter.id]
    );
  };

  // Text selection handler for highlighting
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 3) {
      const text = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setActiveSelectionText(text);
      setSelectionPopupPos({
        x: rect.left + rect.width / 2,
        y: Math.max(10, rect.top - 50),
      });
    } else {
      setActiveSelectionText("");
      setSelectionPopupPos(null);
    }
  };

  const addHighlight = (color: "yellow" | "green" | "blue" | "pink") => {
    if (!activeSelectionText) return;
    const newHl: Highlight = {
      id: `hl-${Date.now()}`,
      bookId: book.id,
      chapterId: currentChapter.id,
      text: activeSelectionText,
      color,
      createdAt: new Date().toISOString(),
    };
    setHighlights((prev) => [...prev, newHl]);
    setActiveSelectionText("");
    setSelectionPopupPos(null);
    if (window.getSelection()) {
      window.getSelection()?.removeAllRanges();
    }
  };

  const addSelectionToNotes = () => {
    if (!activeSelectionText) return;
    const newNote: StudentNote = {
      id: `note-${Date.now()}`,
      title: `${book.title} - Ch ${currentChapter.number}`,
      subject: book.subject,
      content: `> "${activeSelectionText}"\n\nNotes & Reflections:\n- `,
      tags: [book.subject, `Ch${currentChapter.number}`],
      updatedAt: new Date().toISOString(),
      linkedBookId: book.id,
    };
    onSaveNote(newNote);
    setActiveSelectionText("");
    setSelectionPopupPos(null);
    alert("Saved snippet to your Student Notebook!");
  };

  // Text-To-Speech
  const handleToggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text for speech
    const cleanText = `${currentChapter.title}. ${currentChapter.content.replace(/[#$*]/g, "")}`;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handleStopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handleChangeSpeechRate = (newRate: number) => {
    setSpeechRate(newRate);
    if (isSpeaking && speechRef.current) {
      window.speechSynthesis.cancel();
      handleToggleSpeech();
    }
  };

  // AI Chapter Analysis / Chat
  const handleAskAi = async (customPrompt?: string, modeOverride?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);
    setIsAiOpen(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptToUse,
          subject: book.subject,
          context: `Book: ${book.title}, Chapter ${currentChapter.number}: ${currentChapter.title}\n${currentChapter.content}`,
          mode: modeOverride || aiMode,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setAiResponse(data.text);
      } else {
        setAiResponse("I could not generate an answer right now. Please try again.");
      }
    } catch (err: any) {
      setAiResponse(`Error: ${err.message || "Failed to reach AI Tutor"}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Theme styles
  const themeClasses = {
    light: "bg-white text-slate-900",
    sepia: "bg-[#fbf0d9] text-[#433422]",
    dark: "bg-slate-950 text-slate-100",
  };

  const fontClasses = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
  };

  const fontSizeClasses = {
    sm: "text-sm leading-relaxed",
    base: "text-base leading-relaxed",
    lg: "text-lg leading-relaxed",
    xl: "text-xl leading-loose",
  };

  return (
    <div className={`relative min-h-[calc(100vh-8rem)] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col ${themeClasses[theme]}`}>
      {/* Top Reader Controls Header */}
      <div className="sticky top-0 z-30 p-3 sm:p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
        {/* Left: Back button & Chapter Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onBackToBackpack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Backpack</span>
          </button>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-xs font-bold hover:bg-blue-100 transition"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Table of Contents</span>
          </button>

          <div className="hidden lg:block text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-xs">
            {book.title}
          </div>
        </div>

        {/* Center: Audio TTS Bar */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={handleToggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition ${
              isSpeaking
                ? "bg-emerald-600 text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {isSpeaking ? (
              isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5" /> Resume
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Audio
                </>
              )
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Read Aloud
              </>
            )}
          </button>

          {isSpeaking && (
            <button
              onClick={handleStopSpeech}
              title="Stop Audio"
              className="p-1 text-slate-500 hover:text-rose-500 rounded"
            >
              <VolumeX className="w-3.5 h-3.5" />
            </button>
          )}

          <select
            value={speechRate}
            onChange={(e) => handleChangeSpeechRate(parseFloat(e.target.value))}
            className="text-[11px] font-bold bg-transparent text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded focus:outline-none cursor-pointer"
          >
            <option value="0.8" className="text-slate-900 bg-white">0.8x</option>
            <option value="1.0" className="text-slate-900 bg-white">1.0x</option>
            <option value="1.2" className="text-slate-900 bg-white">1.2x</option>
            <option value="1.5" className="text-slate-900 bg-white">1.5x</option>
          </select>
        </div>

        {/* Right: Appearance & AI Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme toggles */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setTheme("light")}
              title="Clean Light Theme"
              className={`p-1.5 rounded-lg ${theme === "light" ? "bg-white shadow text-blue-600" : "text-slate-500"}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("sepia")}
              title="Warm Paper Theme"
              className={`p-1.5 rounded-lg ${theme === "sepia" ? "bg-[#fbf0d9] shadow text-[#8b5a2b]" : "text-slate-500"}`}
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              title="Twilight Dark Theme"
              className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-slate-900 shadow text-blue-400" : "text-slate-500"}`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Font Size Selector */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300">
            <button
              onClick={() => setFontSize(fontSize === "xl" ? "lg" : fontSize === "lg" ? "base" : "sm")}
              className="px-2 py-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize(fontSize === "sm" ? "base" : fontSize === "base" ? "lg" : "xl")}
              className="px-2 py-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg"
            >
              A+
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={toggleBookmark}
            title={bookmarkedChapters.includes(currentChapter.id) ? "Bookmarked" : "Bookmark this chapter"}
            className={`p-2 rounded-xl border transition ${
              bookmarkedChapters.includes(currentChapter.id)
                ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white border-transparent"
            }`}
          >
            {bookmarkedChapters.includes(currentChapter.id) ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          {/* Ask AI Sidebar Button */}
          <button
            onClick={() => setIsAiOpen(!isAiOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:from-blue-500 hover:to-indigo-500 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Main Reading Canvas & Sidebar Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table of Contents Drawer */}
        {isSidebarOpen && (
          <div className="w-72 sm:w-80 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20 shadow-lg animate-in slide-in-from-left duration-200">
            {/* Sidebar Tabs */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold w-full">
                <button
                  onClick={() => setSidebarTab("toc")}
                  className={`flex-1 py-1.5 rounded-lg text-center ${
                    sidebarTab === "toc" ? "bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Chapters
                </button>
                <button
                  onClick={() => setSidebarTab("highlights")}
                  className={`flex-1 py-1.5 rounded-lg text-center ${
                    sidebarTab === "highlights" ? "bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Notes ({highlights.length})
                </button>
                {currentChapter.keyFormulas && currentChapter.keyFormulas.length > 0 && (
                  <button
                    onClick={() => setSidebarTab("formulas")}
                    className={`flex-1 py-1.5 rounded-lg text-center ${
                      sidebarTab === "formulas" ? "bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Formulas
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsSidebarOpen(false)}
                className="ml-2 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {sidebarTab === "toc" && (
                <div className="space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {book.title} ({book.chapters.length} Chapters)
                  </div>
                  {book.chapters.map((ch, idx) => {
                    const isSelected = idx === currentChapterIndex;
                    const isBookmarked = bookmarkedChapters.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          setCurrentChapterIndex(idx);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-xl text-xs font-medium transition flex items-start justify-between gap-2 ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-sm font-bold"
                            : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex-1 truncate">
                          <span className="opacity-80">Ch {ch.number}: </span>
                          <span>{ch.title}</span>
                        </div>
                        {isBookmarked && (
                          <BookmarkCheck className={`w-4 h-4 shrink-0 ${isSelected ? "text-amber-300" : "text-amber-500"}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {sidebarTab === "highlights" && (
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Saved Highlights & Annotations
                  </div>
                  {highlights.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      Select any text in the reader to highlight or save notes.
                    </div>
                  ) : (
                    highlights.map((hl) => (
                      <div
                        key={hl.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 ${
                          hl.color === "yellow"
                            ? "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200"
                            : hl.color === "green"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200"
                            : hl.color === "blue"
                            ? "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200"
                            : "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-200"
                        }`}
                      >
                        <p className="italic">"{hl.text}"</p>
                        <div className="flex justify-between items-center text-[10px] opacity-75 pt-1">
                          <span>{new Date(hl.createdAt).toLocaleDateString()}</span>
                          <button
                            onClick={() => setHighlights((prev) => prev.filter((h) => h.id !== hl.id))}
                            className="hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {sidebarTab === "formulas" && currentChapter.keyFormulas && (
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Formulas & Constants
                  </div>
                  {currentChapter.keyFormulas.map((f, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1"
                    >
                      <div className="font-bold text-xs text-blue-600 dark:text-blue-400">{f.name}</div>
                      <div className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                        {f.formula}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">{f.explanation}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reading Content Pane */}
        <div
          onMouseUp={handleMouseUp}
          className="flex-1 overflow-y-auto p-6 sm:p-12 lg:p-16 max-w-4xl mx-auto space-y-8 select-text"
        >
          {/* Chapter Heading Banner */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <span>Chapter {currentChapter.number}</span>
              <span>•</span>
              <span>{book.subject}</span>
              <span>•</span>
              <span>~{currentChapter.estimatedReadTimeMinutes} min read</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {currentChapter.title}
            </h1>
            {currentChapter.summary && (
              <div className="mt-3 p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs sm:text-sm text-blue-900 dark:text-blue-200">
                <strong>Executive Summary: </strong>
                {currentChapter.summary}
              </div>
            )}
          </div>

          {/* Chapter Body Content (Formatted Markdown-like) */}
          <div className={`${fontClasses[fontFamily]} ${fontSizeClasses[fontSize]} space-y-6`}>
            {currentChapter.content.split("\n\n").map((paragraph, pIdx) => {
              if (paragraph.startsWith("### ")) {
                return (
                  <h3
                    key={pIdx}
                    className="text-lg sm:text-xl font-bold pt-4 text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800/60"
                  >
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("$$") && paragraph.endsWith("$$")) {
                const mathText = paragraph.replace(/\$\$/g, "");
                return (
                  <div
                    key={pIdx}
                    className="p-4 my-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 font-mono text-center text-blue-600 dark:text-blue-400 font-bold overflow-x-auto"
                  >
                    {mathText}
                  </div>
                );
              }
              return (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Embedded Interactive Checkpoints (Mini-Quiz) */}
          {currentChapter.checkpoints && currentChapter.checkpoints.length > 0 && (
            <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-slate-900 dark:to-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-600 text-white rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Knowledge Checkpoint: Test Your Understanding
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Quick interactive checks to reinforce your reading retention
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {currentChapter.checkpoints.map((cp, qIdx) => {
                  const userAnswer = checkpointAnswers[qIdx];
                  const isAnswered = userAnswer !== undefined;
                  const isCorrect = isAnswered && userAnswer === cp.correctIndex;

                  return (
                    <div
                      key={qIdx}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-3"
                    >
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {qIdx + 1}. {cp.question}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cp.options.map((opt, optIdx) => {
                          const isOptionSelected = userAnswer === optIdx;
                          const isOptionCorrect = optIdx === cp.correctIndex;

                          let btnStyle = "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40";
                          if (isAnswered) {
                            if (isOptionCorrect) {
                              btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200 font-bold";
                            } else if (isOptionSelected) {
                              btnStyle = "bg-rose-50 border-rose-400 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => {
                                setCheckpointAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                                setCheckpointRevealed((prev) => ({ ...prev, [qIdx]: true }));
                              }}
                              className={`p-3 text-left rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {isAnswered && isOptionCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isAnswered && (
                        <div
                          className={`p-3 rounded-xl text-xs ${
                            isCorrect
                              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                              : "bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300"
                          }`}
                        >
                          <strong>{isCorrect ? "Correct! 🎉 " : "Explanation: "}</strong>
                          {cp.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chapter Footer Actions & Quick Navigation */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                disabled={currentChapterIndex === 0}
                onClick={() => setCurrentChapterIndex((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Chapter
              </button>

              <button
                disabled={currentChapterIndex === book.chapters.length - 1}
                onClick={() => setCurrentChapterIndex((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-xs font-bold text-white transition"
              >
                Next Chapter <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onGenerateQuizForChapter(book, currentChapter)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold transition"
              >
                <Award className="w-4 h-4 text-amber-500" />
                Practice Quiz on Chapter
              </button>

              <button
                onClick={() => onOpenFlashcards(book)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-800 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold transition"
              >
                <Layers className="w-4 h-4 text-purple-500" />
                Flashcards
              </button>
            </div>
          </div>
        </div>

        {/* Floating Selection Highlighter Popup */}
        {selectionPopupPos && activeSelectionText && (
          <div
            className="fixed z-50 p-2 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-1.5 animate-in zoom-in-95"
            style={{
              left: `${Math.min(window.innerWidth - 220, Math.max(20, selectionPopupPos.x - 100))}px`,
              top: `${selectionPopupPos.y}px`,
            }}
          >
            <button
              onClick={() => addHighlight("yellow")}
              title="Highlight Yellow"
              className="w-6 h-6 rounded-full bg-amber-300 hover:scale-110 transition border border-white/20"
            />
            <button
              onClick={() => addHighlight("green")}
              title="Highlight Green"
              className="w-6 h-6 rounded-full bg-emerald-400 hover:scale-110 transition border border-white/20"
            />
            <button
              onClick={() => addHighlight("blue")}
              title="Highlight Blue"
              className="w-6 h-6 rounded-full bg-blue-400 hover:scale-110 transition border border-white/20"
            />
            <button
              onClick={() => addHighlight("pink")}
              title="Highlight Pink"
              className="w-6 h-6 rounded-full bg-pink-400 hover:scale-110 transition border border-white/20"
            />
            <div className="w-px h-4 bg-slate-700 mx-1" />
            <button
              onClick={addSelectionToNotes}
              title="Save to Notebook"
              className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800 text-xs font-semibold flex items-center gap-1"
            >
              <StickyNote className="w-3.5 h-3.5 text-blue-400" /> Note
            </button>
            <button
              onClick={() => {
                handleAskAi(`Please explain this textbook passage simply: "${activeSelectionText}"`, "eli12");
              }}
              title="Explain with AI"
              className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800 text-xs font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Explain
            </button>
          </div>
        )}

        {/* AI Study Buddy Side Panel */}
        {isAiOpen && (
          <div className="w-80 sm:w-96 shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col z-30 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-sm">ScholarBot AI Tutor</h3>
                  <p className="text-[11px] text-blue-200">Context: Ch {currentChapter.number}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                className="text-white/80 hover:text-white text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Mode Presets */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setAiMode("eli12")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                  aiMode === "eli12"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                Explain Simply (ELI12)
              </button>
              <button
                onClick={() => setAiMode("socratic")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                  aiMode === "socratic"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                Socratic Hints
              </button>
              <button
                onClick={() => setAiMode("solver")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                  aiMode === "solver"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                Step-by-Step Solver
              </button>
            </div>

            {/* Chat Response Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
              {isAiLoading && (
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>ScholarBot is thinking with textbook context...</span>
                </div>
              )}

              {aiResponse ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 whitespace-pre-line text-slate-800 dark:text-slate-200">
                  {aiResponse}
                </div>
              ) : (
                !isAiLoading && (
                  <div className="text-center py-8 text-slate-400 space-y-3">
                    <Bot className="w-10 h-10 mx-auto text-blue-400/60" />
                    <p>Ask anything about this chapter, requested formulas, or homework problems!</p>
                    <div className="space-y-1.5 pt-2">
                      <button
                        onClick={() =>
                          handleAskAi(
                            `Can you explain the main concepts of Chapter ${currentChapter.number} with real-world examples?`,
                            "eli12"
                          )
                        }
                        className="w-full text-left p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[11px] font-medium"
                      >
                        💡 "Explain this chapter in simple analogies"
                      </button>
                      <button
                        onClick={() =>
                          handleAskAi(
                            `What are the most common exam traps or trick questions for this chapter?`,
                            "socratic"
                          )
                        }
                        className="w-full text-left p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[11px] font-medium"
                      >
                        ⚠️ "What are common exam traps for this topic?"
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskAi();
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask a question on this chapter..."
                  className="flex-1 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !aiPrompt.trim()}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
