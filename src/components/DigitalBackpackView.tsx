import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Zap,
  Dna,
  FlaskConical,
  Calculator,
  Code,
  Landmark,
  FileText,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Award,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { Textbook, SubjectType, BookChapter } from "../types";

interface DigitalBackpackViewProps {
  books: Textbook[];
  onSelectBook: (book: Textbook, chapterId?: string) => void;
  onOpenQuizForBook: (book: Textbook) => void;
  onOpenFlashcardsForBook: (book: Textbook) => void;
  onAddCustomBook: (newBook: Textbook) => void;
  onDeleteCustomBook?: (bookId: string) => void;
  searchQuery: string;
}

export const DigitalBackpackView: React.FC<DigitalBackpackViewProps> = ({
  books,
  onSelectBook,
  onOpenQuizForBook,
  onOpenFlashcardsForBook,
  onAddCustomBook,
  onDeleteCustomBook,
  searchQuery,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New book form state
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState<SubjectType>("Physics");
  const [newGrade, setNewGrade] = useState("Grade 11-12");
  const [newAuthor, setNewAuthor] = useState("");
  const [newWeight, setNewWeight] = useState("2.5");
  const [newDescription, setNewDescription] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");

  const subjects = [
    "All",
    "Physics",
    "Biology",
    "Chemistry",
    "Mathematics",
    "Computer Science",
    "History",
    "Literature",
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSubject = selectedSubject === "All" || book.subject === selectedSubject;
    const matchesSearch =
      !searchQuery ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.chapters.some(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSubject && matchesSearch;
  });

  const getSubjectIcon = (iconName: string, subject: string) => {
    switch (subject) {
      case "Physics":
        return <Zap className="w-5 h-5" />;
      case "Biology":
        return <Dna className="w-5 h-5" />;
      case "Chemistry":
        return <FlaskConical className="w-5 h-5" />;
      case "Mathematics":
        return <Calculator className="w-5 h-5" />;
      case "Computer Science":
        return <Code className="w-5 h-5" />;
      case "History":
        return <Landmark className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const initialChapters: BookChapter[] = [
      {
        id: `custom-ch-${Date.now()}`,
        number: 1,
        title: chapterTitle.trim() || "Chapter 1: Foundations & Overview",
        estimatedReadTimeMinutes: 10,
        content:
          chapterContent.trim() ||
          `### 1.1 Overview & Key Concepts\nThis is a customized digital textbook chapter created directly in your ScholarDesk backpack.\n\n### 1.2 Core Notes\nYou can highlight text, ask AI questions, generate practice quizzes, and study with instant flashcards.`,
        summary: "Overview of custom student curriculum notes and reading material.",
        keyFormulas: [],
        glossary: [],
      },
    ];

    const newBook: Textbook = {
      id: `custom-book-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      gradeLevel: newGrade,
      author: newAuthor || "Student / Educator Custom Edition",
      edition: "Personalized Digital Edition",
      physicalWeightKg: parseFloat(newWeight) || 2.4,
      coverColor: "from-indigo-600 to-purple-800",
      accentColor: "indigo",
      iconName: "BookOpen",
      description: newDescription || "Custom syllabus and class notes digitized in your ScholarDesk backpack.",
      totalPages: 120,
      chapters: initialChapters,
      isCustom: true,
    };

    onAddCustomBook(newBook);
    setIsAddModalOpen(false);
    // Reset
    setNewTitle("");
    setNewAuthor("");
    setNewDescription("");
    setChapterTitle("");
    setChapterContent("");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Backpack Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digital School Backpack & Curriculum Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              All Your School Textbooks, Interactive & Always in Sync
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Access full interactive chapters, AI explanations, built-in audio read-aloud, instant formula lookup,
              and chapter practice tests in one seamless digital hub.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Custom Book / Notes
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Interactive Chapters & Audio</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>AI Socratic Explainer</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Smart Timetable Sync</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Integrated Homework Links</span>
          </div>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                selectedSubject === sub
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Showing {filteredBooks.length} digital books
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => {
          return (
            <div
              key={book.id}
              className="group flex flex-col bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Card Header with book cover styling */}
              <div className={`relative p-5 bg-gradient-to-br ${book.coverColor} text-white`}>
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/25 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
                    {getSubjectIcon(book.iconName, book.subject)}
                    {book.subject}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white text-xs font-bold shadow-xs">
                    {book.chapters.length} Chapters
                  </span>
                </div>

                <h3 className="text-lg font-bold mt-4 line-clamp-2 leading-snug">{book.title}</h3>
                <p className="text-xs text-white/80 mt-1">
                  {book.gradeLevel} • {book.edition}
                </p>

                {book.isCustom && onDeleteCustomBook && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCustomBook(book.id);
                    }}
                    title="Delete custom book"
                    className="absolute top-4 right-4 p-1.5 bg-black/30 hover:bg-rose-600 rounded-lg text-white transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {(book.chapters || []).length} Chapters ({book.totalPages} pages)
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      ~
                      {(book.chapters || []).reduce((acc, c) => acc + (c.estimatedReadTimeMinutes || 10), 0)} min total read
                    </span>
                  </div>

                  {/* Chapters List Preview */}
                  <div className="mt-3 space-y-1.5">
                    {(book.chapters || []).slice(0, 3).map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => onSelectBook(book, ch.id)}
                        className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-medium flex items-center justify-between transition group/ch"
                      >
                        <span className="truncate pr-2">
                          {ch.number}. {ch.title}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/ch:translate-x-0.5 transition shrink-0" />
                      </button>
                    ))}
                    {book.chapters.length > 3 && (
                      <div className="text-[11px] text-slate-400 text-center pt-0.5">
                        +{book.chapters.length - 3} more chapters
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                  <button
                    onClick={() => onSelectBook(book)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Open Textbook
                  </button>

                  <button
                    onClick={() => onOpenQuizForBook(book)}
                    title="Take chapter quiz"
                    className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-300 rounded-xl text-xs font-bold transition"
                  >
                    <Award className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenFlashcardsForBook(book)}
                    title="Study Flashcards"
                    className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-purple-950/50 text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300 rounded-xl text-xs font-bold transition"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No textbooks found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or subject filter, or create a custom book with your own study notes.
          </p>
          <button
            onClick={() => {
              setSelectedSubject("All");
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl shadow-xs"
          >
            Show All Books
          </button>
        </div>
      )}

      {/* Add Custom Book Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold text-base">Add Custom Digital Book or Class Syllabus</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Book / Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AP Environmental Science & Ecosystems"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as SubjectType)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Biology">Biology</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="History">History</option>
                    <option value="Literature">Literature</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Grade Level
                  </label>
                  <input
                    type="text"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    placeholder="e.g. Grade 10"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Edition / Curriculum
                  </label>
                  <input
                    type="text"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="e.g. 2026 AP Edition"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Author / Teacher / Source
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Mr. Harrison / Cambridge Syllabus"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Synopsis
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief summary of what this book or course covers..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-xs text-blue-600 dark:text-blue-400 mb-2">First Chapter Material</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Chapter 1 Title (e.g. Introduction to Ecology)"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  <textarea
                    rows={4}
                    placeholder="Paste chapter text, study notes, or syllabus content here..."
                    value={chapterContent}
                    onChange={(e) => setChapterContent(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  Create & Pack in Bag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
