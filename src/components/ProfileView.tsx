import React, { useState } from "react";
import {
  User,
  CheckCircle2,
  Mail,
  GraduationCap,
  Award,
  BookOpen,
  FileQuestion,
  Layers,
  StickyNote,
  Clock,
  Flame,
  Settings,
  Download,
  LogOut,
  Sparkles,
  ShieldCheck,
  Calendar,
  ChevronRight,
  BookMarked,
  Sliders,
  Target
} from "lucide-react";
import { UserProfile, Textbook, TestResult, StudentNote, Flashcard } from "../types";

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenGoogleAuth: () => void;
  onSignOut: () => void;
  books: Textbook[];
  pastResults: TestResult[];
  notes: StudentNote[];
  flashcards: Flashcard[];
  studyStreakDays: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onOpenGoogleAuth,
  onSignOut,
  books,
  pastResults,
  notes,
  flashcards,
  studyStreakDays,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [gradeLevel, setGradeLevel] = useState(user.gradeLevel);
  const [institution, setInstitution] = useState(user.institution || "Lincoln High School & AP Academy");
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user.dailyGoalMinutes || 45);
  const [defaultTutorMode, setDefaultTutorMode] = useState(user.defaultTutorMode || "socratic");
  const [targetExamsInput, setTargetExamsInput] = useState(user.targetExams.join(", "));
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "settings" | "history">("overview");

  // Metric computations
  const totalChapters = books.reduce((acc, b) => acc + (b.chapters?.length || 0), 0);
  const totalFlashcards = flashcards.length;
  const masteredFlashcards = flashcards.filter((f) => f.status === "mastered" || (f.masteryLevel && f.masteryLevel >= 2)).length;
  const totalQuizzes = pastResults.length;
  const avgQuizScore =
    totalQuizzes > 0
      ? Math.round(
          pastResults.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / totalQuizzes
        )
      : 88;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      gradeLevel,
      institution,
      dailyGoalMinutes: Number(dailyGoalMinutes) || 45,
      defaultTutorMode,
      targetExams: targetExamsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    onUpdateUser(updated);
    setIsEditing(false);
  };

  const handleExportData = () => {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      user,
      booksSummary: books.map((b) => ({ id: b.id, title: b.title, subject: b.subject, chapters: b.chapters.length })),
      notes,
      flashcards,
      pastResults,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scholardesk-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Profile Header Card - Refined Academic Slate */}
      <div className="bg-slate-900 dark:bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Avatar and Info */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative group">
              <img
                src={user.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={user.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
              />
              {user.provider === "google" && (
                <div
                  className="absolute -bottom-1.5 -right-1.5 p-1 bg-white rounded-full shadow-md"
                  title="Verified Google Account"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                  {user.gradeLevel}
                </span>
                {user.provider === "google" && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Google Verified
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {user.institution || "High School Scholar"}
                </span>
              </div>

              {/* Target exams badges */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-[11px] text-slate-400 font-medium mr-1">Target Goals:</span>
                {user.targetExams.map((exam) => (
                  <span
                    key={exam}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-medium"
                  >
                    {exam}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <button
              onClick={onOpenGoogleAuth}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>{user.provider === "google" ? "Google Account" : "Sign In with Google"}</span>
            </button>

            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setActiveSubTab("settings");
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{isEditing ? "Close Editor" : "Edit Profile"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => {
            setActiveSubTab("overview");
            setIsEditing(false);
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeSubTab === "overview" && !isEditing
              ? "bg-slate-900 text-white dark:bg-slate-800"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Academic Overview
        </button>
        <button
          onClick={() => setActiveSubTab("settings")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeSubTab === "settings"
              ? "bg-slate-900 text-white dark:bg-slate-800"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Study Goals & Preferences
        </button>
        <button
          onClick={() => {
            setActiveSubTab("history");
            setIsEditing(false);
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeSubTab === "history"
              ? "bg-slate-900 text-white dark:bg-slate-800"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Recent Activity & Test History ({pastResults.length})
        </button>
      </div>

      {/* Tab 1: Academic Overview */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-xs font-medium">Digital Books</span>
                <BookOpen className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{books.length}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{totalChapters} chapters</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-xs font-medium">Study Streak</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{studyStreakDays} Days</div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">Top 5% consistency</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-xs font-medium">Quizzes Taken</span>
                <FileQuestion className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{totalQuizzes}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Avg Score: {avgQuizScore}%</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-xs font-medium">Flashcards</span>
                <Layers className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{totalFlashcards}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">{masteredFlashcards} mastered</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-xs font-medium">Class Notes</span>
                <StickyNote className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{notes.length}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Annotated & indexed</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-xs font-medium">Daily Goal</span>
                <Target className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{user.dailyGoalMinutes}m</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Daily target</div>
            </div>
          </div>

          {/* Active Curriculum Subjects Cards */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-blue-600" />
              Active Subjects in Digital Backpack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                    style={{ backgroundColor: book.coverColor || "#1e293b" }}
                  >
                    {book.subject.slice(0, 3).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{book.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{book.author} • {book.gradeLevel}</div>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                      {book.chapters.length} Chapters • {book.totalPages} Pages
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Settings & Preferences */}
      {activeSubTab === "settings" && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Academic Profile & Learning Preferences</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize your student grade, target examinations, and AI tutor interaction mode
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Grade / Academic Level
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Middle School (Grades 6-8)">Middle School (Grades 6-8)</option>
                <option value="High School Freshman (Grade 9)">High School Freshman (Grade 9)</option>
                <option value="High School Sophomore (Grade 10)">High School Sophomore (Grade 10)</option>
                <option value="High School Junior (Grade 11)">High School Junior (Grade 11)</option>
                <option value="High School Senior (Grade 12)">High School Senior (Grade 12)</option>
                <option value="AP Scholar / Honors Student">AP Scholar / Honors Student</option>
                <option value="Undergraduate College">Undergraduate College</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                School or Institution Name
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Westlake High School"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Daily Study Target (Minutes)
              </label>
              <input
                type="number"
                min={10}
                max={300}
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Examinations & Milestones (comma separated)
              </label>
              <input
                type="text"
                value={targetExamsInput}
                onChange={(e) => setTargetExamsInput(e.target.value)}
                placeholder="e.g. AP Physics 1, AP Calculus BC, SAT Math, Biology Olympiad"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Default ScholarBot AI Explanation Mode
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "socratic", label: "Socratic Guided", desc: "Asks probing questions to help you derive the answers" },
                  { id: "eli12", label: "Simple Analogies (ELI12)", desc: "Explains complex formulas in plain real-world metaphors" },
                  { id: "solver", label: "Step-by-Step Derivation", desc: "Rigorous mathematical proof and calculations" },
                  { id: "summary", label: "High-Yield Summary", desc: "Fast bullet points and key takeaways for quick review" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setDefaultTutorMode(mode.id as any)}
                    className={`p-3 rounded-xl border text-left transition ${
                      defaultTutorMode === mode.id
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 font-semibold"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="text-xs font-bold">{mode.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportData}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Export Backpack Backup (.json)
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold flex items-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-bold shadow-md transition"
            >
              Save Preferences
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: History & Activity Log */}
      {activeSubTab === "history" && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Practice Exam & Quiz History
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">{pastResults.length} records logged</span>
          </div>

          {pastResults.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <FileQuestion className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">No test results recorded yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Head over to the Tests & Quizzes tab to take a chapter practice quiz.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {pastResults.map((result) => {
                const pct = Math.round((result.score / result.totalQuestions) * 100);
                const isPassed = pct >= 70;
                return (
                  <div key={result.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{result.quizTitle}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {new Date(result.completedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {result.score}/{result.totalQuestions} ({pct}%)
                        </div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isPassed
                              ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                              : "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          {isPassed ? "Mastered" : "Needs Review"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
