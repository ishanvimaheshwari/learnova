import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  AlertCircle,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Circle,
  MoreVertical,
  Trash2,
  ArrowRight,
  Bot,
  Lightbulb,
  X
} from "lucide-react";
import { HomeworkItem, HomeworkPriority, HomeworkStatus, SubjectType, Textbook } from "../types";

interface HomeworkTrackerProps {
  homework: HomeworkItem[];
  books: Textbook[];
  onUpdateHomework: (items: HomeworkItem[]) => void;
  onOpenBookChapter: (bookId: string, chapterId?: string) => void;
}

export const HomeworkTracker: React.FC<HomeworkTrackerProps> = ({
  homework,
  books,
  onUpdateHomework,
  onOpenBookChapter,
}) => {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // AI Homework Helper modal state
  const [activeAiItem, setActiveAiItem] = useState<HomeworkItem | null>(null);
  const [aiAssistanceLevel, setAiAssistanceLevel] = useState<"hint" | "full">("hint");
  const [aiHelperResponse, setAiHelperResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<SubjectType>("Physics");
  const [dueDate, setDueDate] = useState("2026-08-22");
  const [dueTime, setDueTime] = useState("23:59");
  const [priority, setPriority] = useState<HomeworkPriority>("High");
  const [description, setDescription] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [relatedBookId, setRelatedBookId] = useState("");

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

  const filteredHomework = homework.filter((item) => {
    const matchesSubject = selectedSubject === "All" || item.subject === selectedSubject;
    const matchesPriority = selectedPriority === "All" || item.priority === selectedPriority;
    return matchesSubject && matchesPriority;
  });

  const todoItems = filteredHomework.filter((h) => h.status === "todo");
  const inProgressItems = filteredHomework.filter((h) => h.status === "in_progress");
  const completedItems = filteredHomework.filter((h) => h.status === "completed");

  const totalCount = homework.length;
  const completedCount = homework.filter((h) => h.status === "completed").length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleStatusChange = (id: string, newStatus: HomeworkStatus) => {
    const updated = homework.map((h) =>
      h.id === id
        ? {
            ...h,
            status: newStatus,
            completedAt: newStatus === "completed" ? new Date().toISOString() : undefined,
          }
        : h
    );
    onUpdateHomework(updated);
  };

  const handleDelete = (id: string) => {
    onUpdateHomework(homework.filter((h) => h.id !== id));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: HomeworkItem = {
      id: `hw-${Date.now()}`,
      title,
      subject,
      dueDate,
      dueTime,
      priority,
      status: "todo",
      description,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      relatedBookId: relatedBookId || undefined,
    };

    onUpdateHomework([...homework, newItem]);
    setIsAddModalOpen(false);
    setTitle("");
    setDescription("");
  };

  // Trigger AI Step-by-Step Helper
  const handleOpenAiHelper = async (item: HomeworkItem, level: "hint" | "full" = "hint") => {
    setActiveAiItem(item);
    setAiAssistanceLevel(level);
    setIsAiLoading(true);
    setAiHelperResponse(null);

    try {
      const res = await fetch("/api/gemini/solve-homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemText: `${item.title}\n\nTask details: ${item.description}`,
          subject: item.subject,
          assistanceLevel: level,
        }),
      });
      const data = await res.json();
      setAiHelperResponse(data.result || "Could not generate assistance right now.");
    } catch (err: any) {
      setAiHelperResponse(`Error: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const getPriorityBadge = (p: HomeworkPriority) => {
    switch (p) {
      case "High":
        return "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "Medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Low":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-md">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Homework & Assignments Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Track Tasks with Direct Textbook Links
            </h1>
            <p className="text-sm text-blue-100">
              Never get stuck on problem sets. One tap opens the exact chapter in your digital book or asks the Socratic AI tutor for progressive hints.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div>
              <div className="text-xs text-blue-200 font-medium">Completion Progress</div>
              <div className="text-2xl font-black text-white">
                {completedCount} / {totalCount} Tasks ({completionPercentage}%)
              </div>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-bold text-xs sm:text-sm shadow-md transition shrink-0"
            >
              <Plus className="w-4 h-4 inline mr-1" /> New Assignment
            </button>
          </div>
        </div>
      </div>

      {/* Filter and View Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Subject Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedSubject === sub
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === "kanban" ? "bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400" : "text-slate-500"
              }`}
            >
              Board View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === "list" ? "bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400" : "text-slate-500"
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TO DO Column */}
          <div className="bg-slate-100/70 dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">To Do</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {todoItems.length}
              </span>
            </div>

            <div className="space-y-3">
              {todoItems.map((item) => (
                <HomeworkCard
                  key={item.id}
                  item={item}
                  books={books}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  onOpenBookChapter={onOpenBookChapter}
                  onOpenAiHelper={handleOpenAiHelper}
                  getPriorityBadge={getPriorityBadge}
                />
              ))}
              {todoItems.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">All caught up! No tasks here.</div>
              )}
            </div>
          </div>

          {/* IN PROGRESS Column */}
          <div className="bg-slate-100/70 dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">In Progress</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {inProgressItems.length}
              </span>
            </div>

            <div className="space-y-3">
              {inProgressItems.map((item) => (
                <HomeworkCard
                  key={item.id}
                  item={item}
                  books={books}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  onOpenBookChapter={onOpenBookChapter}
                  onOpenAiHelper={handleOpenAiHelper}
                  getPriorityBadge={getPriorityBadge}
                />
              ))}
              {inProgressItems.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">No active tasks in progress.</div>
              )}
            </div>
          </div>

          {/* COMPLETED Column */}
          <div className="bg-slate-100/70 dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Completed</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {completedItems.length}
              </span>
            </div>

            <div className="space-y-3">
              {completedItems.map((item) => (
                <HomeworkCard
                  key={item.id}
                  item={item}
                  books={books}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  onOpenBookChapter={onOpenBookChapter}
                  onOpenAiHelper={handleOpenAiHelper}
                  getPriorityBadge={getPriorityBadge}
                />
              ))}
              {completedItems.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">Completed assignments show up here.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {filteredHomework.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() =>
                    handleStatusChange(
                      item.id,
                      item.status === "completed" ? "todo" : "completed"
                    )
                  }
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 transition"
                >
                  {item.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                      {item.subject}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${getPriorityBadge(
                        item.priority
                      )}`}
                    >
                      {item.priority} Priority
                    </span>
                    <h3
                      className={`font-bold text-sm ${
                        item.status === "completed"
                          ? "line-through text-slate-400"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Due: {item.dueDate}
                </span>

                {item.relatedBookId && (
                  <button
                    onClick={() => onOpenBookChapter(item.relatedBookId!, item.relatedChapterId)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition text-xs font-bold flex items-center gap-1"
                    title="Open Textbook Chapter"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleOpenAiHelper(item, "hint")}
                  className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl transition text-xs font-bold flex items-center gap-1"
                  title="Ask AI Helper"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Assignment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                <h3 className="font-bold text-base">New Homework Assignment</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics: Projectile Problem Set 3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as SubjectType)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
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
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as HomeworkPriority)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Est. Minutes
                  </label>
                  <input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Attach Digital Textbook
                </label>
                <select
                  value={relatedBookId}
                  onChange={(e) => setRelatedBookId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="">No Book Link</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Task Instructions / Problem Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste problem statements or assignment details here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none"
                />
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
                  Add Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Homework Helper Modal */}
      {activeAiItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">ScholarBot Homework Assistant</h3>
                  <p className="text-xs text-purple-200 truncate max-w-md">{activeAiItem.title}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveAiItem(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Assistance Mode Switcher */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Choose Help Mode:
              </div>
              <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-700 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => handleOpenAiHelper(activeAiItem, "hint")}
                  className={`px-3 py-1 rounded-lg transition ${
                    aiAssistanceLevel === "hint"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  💡 Socratic Hints Mode
                </button>
                <button
                  onClick={() => handleOpenAiHelper(activeAiItem, "full")}
                  className={`px-3 py-1 rounded-lg transition ${
                    aiAssistanceLevel === "full"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  📝 Step-by-Step Breakdown
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                <strong>Problem Statement:</strong> {activeAiItem.description || activeAiItem.title}
              </div>

              {isAiLoading ? (
                <div className="p-8 text-center space-y-3 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-8 h-8 animate-spin mx-auto" />
                  <p className="font-bold">Analyzing question & preparing guided guidance...</p>
                </div>
              ) : aiHelperResponse ? (
                <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-3">
                  {aiHelperResponse}
                </div>
              ) : null}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setActiveAiItem(null)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow transition"
              >
                Done / Back to Homework
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface HomeworkCardProps {
  item: HomeworkItem;
  books: Textbook[];
  onStatusChange: (id: string, newStatus: HomeworkStatus) => void;
  onDelete: (id: string) => void;
  onOpenBookChapter: (bookId: string, chapterId?: string) => void;
  onOpenAiHelper: (item: HomeworkItem, level: "hint" | "full") => void;
  getPriorityBadge: (p: HomeworkPriority) => string;
}

const HomeworkCard: React.FC<HomeworkCardProps> = ({
  item,
  books,
  onStatusChange,
  onDelete,
  onOpenBookChapter,
  onOpenAiHelper,
  getPriorityBadge,
}) => {
  const associatedBook = books.find((b) => b.id === item.relatedBookId);

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition space-y-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
          {item.subject}
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${getPriorityBadge(
            item.priority
          )}`}
        >
          {item.priority}
        </span>
      </div>

      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
        {item.title}
      </h4>

      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
        {item.description}
      </p>

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/60">
        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          <Calendar className="w-3 h-3 text-slate-400" />
          {item.dueDate}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          ~{item.estimatedMinutes}m
        </span>
      </div>

      {/* Action links */}
      <div className="pt-2 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1">
          {associatedBook && (
            <button
              onClick={() => onOpenBookChapter(associatedBook.id, item.relatedChapterId)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg text-xs font-bold flex items-center gap-1 transition"
              title="Open Connected Textbook"
            >
              <BookOpen className="w-3.5 h-3.5" /> Book
            </button>
          )}

          <button
            onClick={() => onOpenAiHelper(item, "hint")}
            className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg text-xs font-bold flex items-center gap-1 transition"
            title="Ask AI for Hints"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Hints
          </button>
        </div>

        {/* Status transitions */}
        <div className="flex items-center gap-1">
          {item.status === "todo" && (
            <button
              onClick={() => onStatusChange(item.id, "in_progress")}
              className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
            >
              Start
            </button>
          )}
          {item.status === "in_progress" && (
            <button
              onClick={() => onStatusChange(item.id, "completed")}
              className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition"
            >
              Done ✓
            </button>
          )}
          {item.status === "completed" && (
            <button
              onClick={() => onStatusChange(item.id, "todo")}
              className="px-2 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-600"
            >
              Reopen
            </button>
          )}
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 text-slate-300 hover:text-rose-500 rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
