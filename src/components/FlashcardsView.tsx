import React, { useState } from "react";
import {
  Layers,
  Sparkles,
  RotateCw,
  Check,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Trash2,
  Brain
} from "lucide-react";
import { Flashcard, Textbook, SubjectType } from "../types";

interface FlashcardsViewProps {
  flashcards: Flashcard[];
  books: Textbook[];
  onUpdateFlashcards: (cards: Flashcard[]) => void;
  selectedBookFilter?: string;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  flashcards,
  books,
  onUpdateFlashcards,
  selectedBookFilter,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [formFront, setFormFront] = useState("");
  const [formBack, setFormBack] = useState("");
  const [formSubject, setFormSubject] = useState<SubjectType>("Physics");
  const [formBookId, setFormBookId] = useState("");

  // AI Auto-generator modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiSelectedBookId, setAiSelectedBookId] = useState(books[0]?.id || "");
  const [isGenerating, setIsGenerating] = useState(false);

  const subjects = [
    "All",
    "Physics",
    "Biology",
    "Chemistry",
    "Mathematics",
    "Computer Science",
    "History",
  ];

  const filteredCards = flashcards.filter((card) => {
    const matchesSubject = selectedSubject === "All" || card.subject === selectedSubject;
    const matchesBook = !selectedBookFilter || card.bookId === selectedBookFilter;
    return matchesSubject && matchesBook;
  });

  const currentCard = filteredCards[currentCardIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % (filteredCards.length || 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) =>
      prev === 0 ? (filteredCards.length ? filteredCards.length - 1 : 0) : prev - 1
    );
  };

  const handleReviewStatus = (cardId: string, status: "learning" | "mastered") => {
    const updated = flashcards.map((c) =>
      c.id === cardId
        ? {
            ...c,
            status,
            reviewCount: (c.reviewCount || 0) + 1,
            lastReviewed: new Date().toISOString(),
          }
        : c
    );
    onUpdateFlashcards(updated);
    handleNext();
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFront.trim() || !formBack.trim()) return;

    const newCard: Flashcard = {
      id: `fc-${Date.now()}`,
      subject: formSubject,
      front: formFront,
      back: formBack,
      bookId: formBookId || undefined,
      status: "learning",
      reviewCount: 0,
    };

    onUpdateFlashcards([...flashcards, newCard]);
    setIsAddModalOpen(false);
    setFormFront("");
    setFormBack("");
  };

  const handleAiGenerateFlashcards = async () => {
    const book = books.find((b) => b.id === aiSelectedBookId);
    if (!book) return;

    setIsGenerating(true);
    try {
      const chapter = book.chapters[0];
      const res = await fetch("/api/gemini/analyze-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterTitle: `${book.title} - ${chapter?.title || "Core Concepts"}`,
          content: chapter?.content || book.description,
          subject: book.subject,
        }),
      });

      const data = await res.json();
      if (data.flashcards && data.flashcards.length > 0) {
        const newCards: Flashcard[] = data.flashcards.map((fc: any, i: number) => ({
          id: `ai-fc-${Date.now()}-${i}`,
          subject: book.subject,
          front: fc.front,
          back: fc.back,
          bookId: book.id,
          status: "learning" as const,
          reviewCount: 0,
        }));
        onUpdateFlashcards([...flashcards, ...newCards]);
        setIsAiModalOpen(false);
        alert(`Successfully generated ${newCards.length} smart flashcards with AI!`);
      }
    } catch (err: any) {
      alert(`Could not generate flashcards: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const masteredCount = flashcards.filter((c) => c.status === "mastered").length;
  const learningCount = flashcards.length - masteredCount;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-md">
              <Layers className="w-3.5 h-3.5" />
              <span>Spaced-Repetition Memory Cards</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Active Recall & Chapter Flashcards
            </h1>
            <p className="text-sm text-blue-100">
              Flip through high-yield definitions, mathematical laws, and exam concepts. AI generates custom deck cards right from your textbook chapters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              AI Deck Generator
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              Add Card
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Subject Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Subject Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setSelectedSubject(sub);
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedSubject === sub
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 self-end sm:self-center text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
            {masteredCount} Mastered
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
            {learningCount} Learning
          </span>
        </div>
      </div>

      {/* Flashcard Interactive Carousel */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-bold">
            Card {currentCardIndex + 1} of {filteredCards.length}
          </div>

          {/* Flip Card Stage */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[300px] sm:min-h-[340px] p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-800/95 border-2 border-slate-200 dark:border-slate-700/80 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative group select-none hover:border-blue-400 dark:hover:border-blue-500"
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                {currentCard.subject}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-blue-500 transition">
                <RotateCw className="w-3.5 h-3.5" />
                {isFlipped ? "Viewing Back" : "Click to Flip"}
              </span>
            </div>

            {/* Middle Prompt / Answer */}
            <div className="text-center py-6 space-y-3">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                {isFlipped ? "Definition / Answer" : "Term / Question"}
              </div>
              <p
                className={`font-bold transition-all ${
                  isFlipped
                    ? "text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed"
                    : "text-xl sm:text-2xl text-slate-900 dark:text-white"
                }`}
              >
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            {/* Bottom Status */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700/60">
              <span>Reviews: {currentCard.reviewCount}</span>
              <span
                className={`font-bold ${
                  currentCard.status === "mastered" ? "text-emerald-500" : "text-amber-500"
                }`}
              >
                {currentCard.status === "mastered" ? "★ Mastered" : "Learning"}
              </span>
            </div>
          </div>

          {/* Action Grading Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={handlePrev}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleReviewStatus(currentCard.id, "learning")}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition"
            >
              <X className="w-4 h-4 text-rose-500" />
              Need Practice
            </button>

            <button
              onClick={() => handleReviewStatus(currentCard.id, "mastered")}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
            >
              <Check className="w-4 h-4" />
              Got It! Mastered (+10 XP)
            </button>

            <button
              onClick={handleNext}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
          <Layers className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No flashcards found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Use AI to generate flashcards from your textbook chapters or create manual cards.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Generate AI Deck
            </button>
          </div>
        </div>
      )}

      {/* Manual Add Card Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <h3 className="font-bold text-base">New Study Flashcard</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value as SubjectType)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Physics">Physics</option>
                  <option value="Biology">Biology</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="History">History</option>
                  <option value="Literature">Literature</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Front (Question / Concept / Term) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. What is Kepler's Third Law of Planetary Motion?"
                  value={formFront}
                  onChange={(e) => setFormFront(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Back (Definition / Answer / Law) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. The square of the orbital period of a planet is directly proportional to the cube of the semi-major axis of its orbit: T² ∝ a³."
                  value={formBack}
                  onChange={(e) => setFormBack(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Auto-generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-amber-500 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-200" />
                <h3 className="font-bold text-base">Generate Flashcards from Textbook</h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-white/80 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <p className="text-slate-600 dark:text-slate-300">
                ScholarBot will parse the chapter text and extract key terms, formulas, and definitions directly into your study deck.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Textbook
                </label>
                <select
                  value={aiSelectedBookId}
                  onChange={(e) => setAiSelectedBookId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAiGenerateFlashcards}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" /> Generating Deck...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate 5-8 Cards
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
