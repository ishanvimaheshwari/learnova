import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { DigitalBackpackView } from "./components/DigitalBackpackView";
import { BookReader } from "./components/BookReader";
import { TimetablePlanner } from "./components/TimetablePlanner";
import { HomeworkTracker } from "./components/HomeworkTracker";
import { TestCenter } from "./components/TestCenter";
import { FlashcardsView } from "./components/FlashcardsView";
import { AiStudyBuddyView } from "./components/AiStudyBuddyView";
import { NotebookView } from "./components/NotebookView";
import { ProfileView } from "./components/ProfileView";
import { GoogleAuthModal } from "./components/GoogleAuthModal";

import {
  Textbook,
  TimetablePeriod,
  HomeworkItem,
  QuizTest,
  Flashcard,
  StudentNote,
  TestResult,
  ActiveTab,
  UserProfile,
} from "./types";

import { defaultBooks } from "./data/defaultBooks";
import { defaultTimetablePeriods } from "./data/defaultTimetable";
import { defaultHomework } from "./data/defaultHomework";
import { defaultQuizzes } from "./data/defaultQuizzes";
import { defaultFlashcards } from "./data/defaultFlashcards";

export const App: React.FC = () => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem("scholardesk_theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("scholardesk_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("scholardesk_theme", "light");
    }
  }, [isDark]);

  // Tab & Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>("backpack");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Google Authentication State
  const [isGoogleAuthModalOpen, setIsGoogleAuthModalOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("scholardesk_user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      }
    } catch {}
    return {
      id: "student-1",
      name: "Ishaanvi Maheshwari",
      email: "ishanvimaheshwari@gmail.com",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      gradeLevel: "High School Junior (Grade 11)",
      institution: "Lincoln High School & AP Academy",
      provider: "google",
      dailyGoalMinutes: 45,
      defaultTutorMode: "socratic",
      targetExams: ["AP Physics 1", "AP Calculus BC", "SAT Prep"],
    };
  });

  // Core Data States with localStorage fallback
  const [books, setBooks] = useState<Textbook[]>(() => {
    try {
      const saved = localStorage.getItem("scholardesk_books");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultBooks || [];
  });

  const [activeBook, setActiveBook] = useState<Textbook | null>(books?.[0] || defaultBooks?.[0] || null);
  const [activeChapterId, setActiveChapterId] = useState<string | undefined>(undefined);

  const [periods, setPeriods] = useState<TimetablePeriod[]>(() => {
    try {
      const saved = localStorage.getItem("scholardesk_timetable");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultTimetablePeriods || [];
  });

  const [homework, setHomework] = useState<HomeworkItem[]>(() => {
    try {
      const saved = localStorage.getItem("scholardesk_homework");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return defaultHomework || [];
  });

  const [quizzes, setQuizzes] = useState<QuizTest[]>(() => {
    try {
      const saved = localStorage.getItem("scholardesk_quizzes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return defaultQuizzes || [];
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    try {
      const saved = localStorage.getItem("scholardesk_flashcards");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return defaultFlashcards || [];
  });

  const [notes, setNotes] = useState<StudentNote[]>(() => {
    try {
      const saved = localStorage.getItem("scholardesk_notes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [
      {
        id: "note-1",
        title: "AP Physics: Wave-Particle Duality Key Notes",
        subject: "Physics",
        content:
          "### Fundamental Concept\nLight exhibits both wave and particle characteristics.\n\n- **Photoelectric Effect:** Photons have discrete energy E = hf\n- **De Broglie Wavelength:** λ = h / p\n- **Davisson-Germer Experiment:** Proved electron diffraction confirms wave nature of matter.\n\n### Formula Check\n$$E = hc / \\lambda$$\n$$\\lambda = \\frac{h}{m v}$$",
        tags: ["Physics", "ModernPhysics", "ExamPrep"],
        updatedAt: new Date().toISOString(),
        linkedBookId: "book-phys-1",
      },
      {
        id: "note-2",
        title: "Calculus: Chain Rule & Implicit Differentiation Tricks",
        subject: "Mathematics",
        content:
          "### Chain Rule Rule of Thumb\nAlways differentiate the outer function first, evaluate at the inner function, then multiply by the derivative of the inner function!\n\n$$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$$\n\n### Common Mistake\nForgetting to chain through when multiple compositions are nested e.g., sin(cos(x²)).",
        tags: ["Calculus", "Derivatives", "Math"],
        updatedAt: new Date().toISOString(),
        linkedBookId: "book-math-1",
      },
    ];
  });

  const [pastTestResults, setPastTestResults] = useState<TestResult[]>(() => {
    try {
      const saved = localStorage.getItem("scholardesk_test_results");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [
      {
        id: "res-demo-1",
        quizId: "quiz-phys-1",
        quizTitle: "Newtonian Mechanics & Dynamics",
        score: 5,
        totalQuestions: 5,
        completedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "res-demo-2",
        quizId: "quiz-bio-1",
        quizTitle: "Cellular Respiration & Krebs Cycle",
        score: 4,
        totalQuestions: 5,
        completedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  });

  // Selected book filter for flashcards
  const [flashcardBookFilter, setFlashcardBookFilter] = useState<string | undefined>(undefined);

  // Persistence effects
  useEffect(() => {
    if (user) {
      localStorage.setItem("scholardesk_user_profile", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (Array.isArray(books)) {
      localStorage.setItem("scholardesk_books", JSON.stringify(books));
    }
  }, [books]);

  useEffect(() => {
    if (Array.isArray(periods)) {
      localStorage.setItem("scholardesk_timetable", JSON.stringify(periods));
    }
  }, [periods]);

  useEffect(() => {
    if (Array.isArray(homework)) {
      localStorage.setItem("scholardesk_homework", JSON.stringify(homework));
    }
  }, [homework]);

  useEffect(() => {
    if (Array.isArray(quizzes)) {
      localStorage.setItem("scholardesk_quizzes", JSON.stringify(quizzes));
    }
  }, [quizzes]);

  useEffect(() => {
    if (Array.isArray(flashcards)) {
      localStorage.setItem("scholardesk_flashcards", JSON.stringify(flashcards));
    }
  }, [flashcards]);

  useEffect(() => {
    if (Array.isArray(notes)) {
      localStorage.setItem("scholardesk_notes", JSON.stringify(notes));
    }
  }, [notes]);

  useEffect(() => {
    if (Array.isArray(pastTestResults)) {
      localStorage.setItem("scholardesk_test_results", JSON.stringify(pastTestResults));
    }
  }, [pastTestResults]);

  // Navigation handlers
  const handleSelectBook = (book: Textbook, chapterId?: string) => {
    setActiveBook(book);
    setActiveChapterId(chapterId);
    setActiveTab("reader");
  };

  const handleOpenQuizForBook = (book: Textbook) => {
    setActiveTab("tests");
  };

  const handleOpenFlashcardsForBook = (book: Textbook) => {
    setFlashcardBookFilter(book.id);
    setActiveTab("flashcards");
  };

  const handleAddCustomBook = (newBook: Textbook) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleDeleteCustomBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  const handleSaveResult = (res: TestResult) => {
    setPastTestResults((prev) => [res, ...prev]);
  };

  const handleAddAiQuiz = (quiz: QuizTest) => {
    setQuizzes((prev) => [quiz, ...prev]);
  };

  const handleOpenBookChapterFromHomework = (bookId: string, chapterId?: string) => {
    const targetBook = books.find((b) => b.id === bookId);
    if (targetBook) {
      setActiveBook(targetBook);
      setActiveChapterId(chapterId);
      setActiveTab("reader");
    }
  };

  const handleSaveNoteFromReader = (newNote: StudentNote) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleGoogleSignIn = (userData: { name: string; email: string; photoUrl: string }) => {
    setUser({
      ...user,
      name: userData.name,
      email: userData.email,
      photoUrl: userData.photoUrl,
      provider: "google",
    });
  };

  const handleSignOut = () => {
    setUser({
      id: "guest-user",
      name: "Guest Student",
      email: "guest@scholardesk.app",
      photoUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=guest",
      gradeLevel: "High School Scholar",
      institution: "Independent Learner",
      provider: "email",
      dailyGoalMinutes: 30,
      defaultTutorMode: "socratic",
      targetExams: ["General Study"],
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col">
      {/* Top Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "flashcards") {
            setFlashcardBookFilter(undefined);
          }
        }}
        books={books}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        studyStreakDays={7}
        user={user}
        onOpenGoogleAuth={() => setIsGoogleAuthModalOpen(true)}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeTab === "backpack" && (
          <DigitalBackpackView
            books={books}
            onSelectBook={handleSelectBook}
            onOpenQuizForBook={handleOpenQuizForBook}
            onOpenFlashcardsForBook={handleOpenFlashcardsForBook}
            onAddCustomBook={handleAddCustomBook}
            onDeleteCustomBook={handleDeleteCustomBook}
            searchQuery={searchQuery}
            user={user}
            onOpenGoogleAuth={() => setIsGoogleAuthModalOpen(true)}
          />
        )}

        {activeTab === "reader" && activeBook && (
          <BookReader
            book={activeBook}
            initialChapterId={activeChapterId}
            onBackToBackpack={() => setActiveTab("backpack")}
            onGenerateQuizForChapter={(book, chapter) => {
              setActiveTab("tests");
            }}
            onOpenFlashcards={(book) => {
              setFlashcardBookFilter(book.id);
              setActiveTab("flashcards");
            }}
            onSaveNote={handleSaveNoteFromReader}
          />
        )}

        {activeTab === "timetable" && (
          <TimetablePlanner
            periods={periods}
            books={books}
            homework={homework}
            onOpenBook={(book) => handleSelectBook(book)}
            onUpdatePeriods={setPeriods}
          />
        )}

        {activeTab === "homework" && (
          <HomeworkTracker
            homework={homework}
            books={books}
            onUpdateHomework={setHomework}
            onOpenBookChapter={handleOpenBookChapterFromHomework}
          />
        )}

        {activeTab === "tests" && (
          <TestCenter
            quizzes={quizzes}
            books={books}
            onSaveResult={handleSaveResult}
            pastResults={pastTestResults}
            onAddAiQuiz={handleAddAiQuiz}
          />
        )}

        {activeTab === "flashcards" && (
          <FlashcardsView
            flashcards={flashcards}
            books={books}
            onUpdateFlashcards={setFlashcards}
            selectedBookFilter={flashcardBookFilter}
          />
        )}

        {activeTab === "ai_buddy" && <AiStudyBuddyView books={books} />}

        {activeTab === "notes" && (
          <NotebookView
            notes={notes}
            books={books}
            onUpdateNotes={setNotes}
            onOpenBook={(book) => handleSelectBook(book)}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            user={user}
            onUpdateUser={setUser}
            onOpenGoogleAuth={() => setIsGoogleAuthModalOpen(true)}
            onSignOut={handleSignOut}
            books={books}
            pastResults={pastTestResults}
            notes={notes}
            flashcards={flashcards}
            studyStreakDays={7}
          />
        )}
      </main>

      {/* Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthModalOpen}
        onClose={() => setIsGoogleAuthModalOpen(false)}
        currentUser={user}
        onSignInWithGoogle={handleGoogleSignIn}
        onSignOut={handleSignOut}
      />
    </div>
  );
};

export default App;
