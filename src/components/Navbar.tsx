import React from "react";
import {
  Backpack,
  BookOpen,
  Calendar,
  CheckSquare,
  FileQuestion,
  Layers,
  StickyNote,
  Bot,
  Sparkles,
  Search,
  Sun,
  Moon,
  User,
  CheckCircle2
} from "lucide-react";
import { ActiveTab, Textbook, UserProfile } from "../types";

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange?: (tab: ActiveTab) => void;
  setActiveTab?: (tab: ActiveTab) => void;
  books?: Textbook[];
  searchQuery: string;
  onSearchChange?: (q: string) => void;
  setSearchQuery?: (q: string) => void;
  studyStreakDays?: number;
  streakCount?: number;
  isDark?: boolean;
  onToggleTheme?: () => void;
  user?: UserProfile;
  onOpenGoogleAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  setActiveTab,
  books = [],
  searchQuery,
  onSearchChange,
  setSearchQuery,
  studyStreakDays = 7,
  streakCount = 5,
  isDark,
  onToggleTheme,
  user,
  onOpenGoogleAuth,
}) => {
  const handleTabSelect = (tab: ActiveTab) => {
    if (onTabChange) onTabChange(tab);
    else if (setActiveTab) setActiveTab(tab);
  };

  const handleSearchUpdate = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    else if (setSearchQuery) setSearchQuery(val);
  };

  const currentStreak = studyStreakDays || streakCount || 7;

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "backpack", label: "My Backpack", icon: Backpack },
    { id: "reader", label: "Book Reader", icon: BookOpen },
    { id: "timetable", label: "Timetable", icon: Calendar },
    { id: "homework", label: "Homework", icon: CheckSquare },
    { id: "tests", label: "Tests & Quizzes", icon: FileQuestion },
    { id: "flashcards", label: "Flashcards", icon: Layers },
    { id: "notes", label: "Notebook", icon: StickyNote },
    { id: "ai_buddy", label: "AI Study Buddy", icon: Bot },
    { id: "profile", label: "Student Profile", icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top brand & utility row */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleTabSelect("backpack")}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-sm group-hover:scale-105 transition">
                <Backpack className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  ScholarDesk
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    Digital Desk
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Digital Textbooks • Smart Study Hub
                </div>
              </div>
            </button>
          </div>

          {/* Quick Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchUpdate(e.target.value)}
                placeholder="Search books, chapters, topics, formulas..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchUpdate("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Action Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 text-xs font-bold">
              <span>🔥 {currentStreak}d Streak</span>
            </div>

            {/* Theme Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
                aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition cursor-pointer shadow-2xs"
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden lg:inline text-[11px]">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-700" />
                    <span className="hidden lg:inline text-[11px]">Dark</span>
                  </>
                )}
              </button>
            )}

            {/* Quick AI Buddy shortcut */}
            <button
              onClick={() => handleTabSelect("ai_buddy")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span className="hidden sm:inline">Ask AI Tutor</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Google User Profile Avatar / Sign In */}
            {user ? (
              <button
                onClick={() => handleTabSelect("profile")}
                title={`Logged in as ${user.name}`}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-300 dark:border-slate-600"
                  />
                  {user.provider === "google" && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden md:inline truncate max-w-[100px]">
                  {user.name.split(" ")[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenGoogleAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Google Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-100 dark:border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400 dark:text-indigo-600" : "text-slate-500 dark:text-slate-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
