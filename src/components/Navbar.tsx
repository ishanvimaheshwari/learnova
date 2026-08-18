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
  Scale,
  Sun,
  Moon
} from "lucide-react";
import { ActiveTab, Textbook } from "../types";

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange?: (tab: ActiveTab) => void;
  setActiveTab?: (tab: ActiveTab) => void;
  books?: Textbook[];
  totalWeightSavedKg?: number;
  onOpenWeightModal: () => void;
  searchQuery: string;
  onSearchChange?: (q: string) => void;
  setSearchQuery?: (q: string) => void;
  studyStreakDays?: number;
  streakCount?: number;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  setActiveTab,
  books = [],
  totalWeightSavedKg,
  onOpenWeightModal,
  searchQuery,
  onSearchChange,
  setSearchQuery,
  studyStreakDays = 7,
  streakCount = 5,
  isDark,
  onToggleTheme,
}) => {
  const handleTabSelect = (tab: ActiveTab) => {
    if (onTabChange) onTabChange(tab);
    else if (setActiveTab) setActiveTab(tab);
  };

  const handleSearchUpdate = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    else if (setSearchQuery) setSearchQuery(val);
  };

  const calculatedWeight = (books || []).reduce(
    (acc, b) => acc + (b.physicalWeightKg || 2.5),
    0
  );
  const displayWeight = totalWeightSavedKg !== undefined ? totalWeightSavedKg : calculatedWeight;
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
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                <Backpack className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  ScholarDesk
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    Digital Bag
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Replace heavy textbooks • Study smarter
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
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-blue-500 dark:focus:border-blue-500 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition placeholder:text-slate-400"
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
            {/* Weight Saved Badge (Clickable) */}
            <button
              onClick={onOpenWeightModal}
              title="Click to view spine health & environmental impact"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>-{displayWeight.toFixed(1)} kg saved</span>
            </button>

            {/* Streak Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 text-xs font-bold">
              <span>🔥 {currentStreak}d Streak</span>
            </div>

            {/* Theme Toggle if provided */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            )}

            {/* Quick AI Buddy shortcut */}
            <button
              onClick={() => handleTabSelect("ai_buddy")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden sm:inline">Ask AI Tutor</span>
              <span className="sm:hidden">AI</span>
            </button>
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
