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
import { subscribeToAuthState, logOutGoogle } from "./services/authService";

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

  // Subscribe to real Firebase Google Auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(
      (googleUser) => {
        setUser((prev) => ({
          ...prev,
          id: googleUser.id,
          name: googleUser.name,
          email: googleUser.email,
          photoUrl: googleUser.photoUrl,
          provider: "google",
        }));
      },
      () => {
        // Optional: keep current local profile if not logged into Firebase session
      }
    );
    return () => unsubscribe();
  }, []);

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
        id: "note-init-1",
        bookId: "book-chem-1",
        bookTitle: "AP Chemistry: Structure & Properties",
        chapterId: "ch-chem-2",
        chapterTitle: "Chemical Bonding & Molecular Structure",
        content:
          "Remember VSEPR Theory: Lone pairs repel more strongly than bonding pairs. For water (H2O), tetrahedral electronic geometry yields bent molecular geometry with ~104.5 degree bond angle.",
        pageNumber: 42,
        color: "yellow",
        createdAt: new Date().toISOString(),
      },
      {
        id: "note-init-2",
        bookId: "book-phys-1",
        bookTitle: "Fundamentals of Physics: Mechanics",
        chapterId: "ch-phys-1",
        chapterTitle: "Kinematics in One & Two Dimensions",
        content:
          "Important kinematic equation for projectile maximum height: H = (v0^2 * sin^2(theta)) / (2g). Time of flight is 2 * v0 * sin(theta) / g.",
        pageNumber: 15,
        color: "blue",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
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

  const handleOpenQuizForBook = (_book: Textbook) => {
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

  const handleSignOut = async () => {
    try {
      await logOutGoogle();
    } catch {}
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
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        user={user}
        onOpenGoogleAuth={() => setIsGoogleAuthModalOpen(true)}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "backpack" && (
          <DigitalBackpackView
            books={books}
            onSelectBook={handleSelectBook}
            onOpenQuiz={handleOpenQuizForBook}
            onOpenFlashcards={handleOpenFlashcardsForBook}
            onAddCustomBook={handleAddCustomBook}
            onDeleteCustomBook={handleDeleteCustomBook}
            searchQuery={searchQuery}
            user={user}
            onOpenGoogleAuth={() => setIsGoogleAuthModalOpen(true)}
          />
        )}

        {activeTab === "reader" && (
          <BookReader
            books={books}
            initialBook={activeBook}
            initialChapterId={activeChapterId}
            onBackToBackpack={() => setActiveTab("backpack")}
            onOpenAiTutor={() => setActiveTab("tutor")}
            onOpenTestCenter={() => setActiveTab("tests")}
            onSaveNote={handleSaveNoteFromReader}
            notes={notes}
          />
        )}

        {activeTab === "timetable" && (
          <TimetablePlanner
            periods={periods}
            setPeriods={setPeriods}
            books={books}
            onSelectBook={handleSelectBook}
          />
        )}

        {activeTab === "homework" && (
          <HomeworkTracker
            homework={homework}
            setHomework={setHomework}
            books={books}
            onOpenChapter={handleOpenBookChapterFromHomework}
          />
        )}

        {activeTab === "tests" && (
          <TestCenter
            quizzes={quizzes}
            books={books}
            onSaveResult={handleSaveResult}
            onAddQuiz={handleAddAiQuiz}
            pastResults={pastTestResults}
          />
        )}

        {activeTab === "flashcards" && (
          <FlashcardsView
            flashcards={flashcards}
            setFlashcards={setFlashcards}
            books={books}
            initialBookId={flashcardBookFilter}
          />
        )}

        {activeTab === "tutor" && (
          <AiStudyBuddyView
            books={books}
            activeBook={activeBook}
            notes={notes}
            onSelectBook={(book) => setActiveBook(book)}
          />
        )}

        {activeTab === "notebook" && (
          <NotebookView
            notes={notes}
            setNotes={setNotes}
            books={books}
            onNavigateToChapter={handleOpenBookChapterFromHomework}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            user={user}
            setUser={setUser}
            books={books}
            pastTestResults={pastTestResults}
            notes={notes}
            flashcards={flashcards}
            studyStreakDays={7}
            isDark={isDark}
            onToggleTheme={() => setIsDark(!isDark)}
          />
        )}
      </main>

      {/* Google Authentication Dialog Modal */}
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
