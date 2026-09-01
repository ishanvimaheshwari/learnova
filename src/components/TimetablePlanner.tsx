import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Backpack,
  Sparkles,
  ChevronRight,
  Bell
} from "lucide-react";
import { TimetablePeriod, Textbook, HomeworkItem, SubjectType } from "../types";

interface TimetablePlannerProps {
  periods: TimetablePeriod[];
  books: Textbook[];
  homework: HomeworkItem[];
  onOpenBook: (book: Textbook) => void;
  onUpdatePeriods: (newPeriods: TimetablePeriod[]) => void;
}

export const TimetablePlanner: React.FC<TimetablePlannerProps> = ({
  periods,
  books,
  homework,
  onOpenBook,
  onUpdatePeriods,
}) => {
  const days: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday")[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Current day helper
  const getInitialDay = (): ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday") => {
    const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    if (dayIndex >= 1 && dayIndex <= 6) {
      return days[dayIndex - 1];
    }
    return "Monday";
  };

  const [selectedDay, setSelectedDay] = useState<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday">(getInitialDay);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Current time tracker
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Form state
  const [formPeriodNumber, setFormPeriodNumber] = useState(1);
  const [formStartTime, setFormStartTime] = useState("08:30");
  const [formEndTime, setFormEndTime] = useState("09:20");
  const [formSubject, setFormSubject] = useState<SubjectType>("Physics");
  const [formTitle, setFormTitle] = useState("");
  const [formRoom, setFormRoom] = useState("");
  const [formTeacher, setFormTeacher] = useState("");
  const [formBookId, setFormBookId] = useState("");

  const currentDayPeriods = periods
    .filter((p) => p.day === selectedDay)
    .sort((a, b) => a.periodNumber - b.periodNumber);

  // Digital bag for the selected day: all unique textbooks needed on this day
  const todayBookIds = Array.from(
    new Set(currentDayPeriods.map((p) => p.bookId).filter(Boolean))
  );
  const todayBooks = books.filter((b) => todayBookIds.includes(b.id));

  // Homework due today or relevant to today's subjects
  const todaySubjects = currentDayPeriods.map((p) => p.subject);
  const relevantHomework = homework.filter(
    (h) => h.status !== "completed" && todaySubjects.includes(h.subject)
  );

  const handleAddPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    const newPeriod: TimetablePeriod = {
      id: `tt-${Date.now()}`,
      day: selectedDay,
      periodNumber: Number(formPeriodNumber),
      startTime: formStartTime,
      endTime: formEndTime,
      subject: formSubject,
      title: formTitle || `${formSubject} Lecture`,
      room: formRoom || "Main Hall",
      teacher: formTeacher || "Teacher",
      bookId: formBookId || undefined,
      color: "blue",
    };

    onUpdatePeriods([...periods, newPeriod]);
    setIsAddModalOpen(false);
    setFormTitle("");
    setFormRoom("");
    setFormTeacher("");
  };

  const handleDeletePeriod = (id: string) => {
    onUpdatePeriods(periods.filter((p) => p.id !== id));
  };

  const getSubjectColorStyle = (subject: SubjectType) => {
    switch (subject) {
      case "Physics":
        return "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300";
      case "Biology":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300";
      case "Chemistry":
        return "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300";
      case "Mathematics":
        return "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300";
      case "Computer Science":
        return "bg-cyan-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-300";
      case "History":
        return "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300";
      case "Literature":
        return "bg-violet-500/10 border-violet-500/30 text-violet-700 dark:text-violet-300";
      default:
        return "bg-slate-500/10 border-slate-500/30 text-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-md">
              <Clock className="w-3.5 h-3.5" />
              <span>Current Time: {currentTimeStr || "08:30"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive Class Timetable & Schedule
            </h1>
            <p className="text-sm text-blue-100">
              Never forget which period is next or which textbook you need. Seamlessly linked to your digital backpack.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              Add Class Period
            </button>
          </div>
        </div>
      </div>

      {/* "What's in Today's Digital Bag" Smart Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl">
              <Backpack className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Pack Your Digital Bag for {selectedDay}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You need {todayBooks.length} digital books and have {relevantHomework.length} pending homework items for today.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800/50 self-start sm:self-center">
            <CheckCircle2 className="w-4 h-4" /> All Textbooks Synced
          </div>
        </div>

        {/* Quick Launch Today's Books */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {todayBooks.map((b) => (
            <button
              key={b.id}
              onClick={() => onOpenBook(b)}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700/60 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3 truncate">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${b.coverColor} text-white shrink-0 shadow-xs`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {b.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {b.subject} • {b.chapters.length} Chapters
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition shrink-0" />
            </button>
          ))}

          {todayBooks.length === 0 && (
            <div className="col-span-full py-4 text-center text-xs text-slate-400">
              No specific textbooks assigned for {selectedDay}. Enjoy your study schedule!
            </div>
          )}
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          const count = periods.filter((p) => p.day === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span>{day}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule Periods Timeline */}
      <div className="space-y-3">
        {currentDayPeriods.map((p, idx) => {
          const associatedBook = books.find((b) => b.id === p.bookId);

          return (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Info */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center font-black shrink-0 border border-blue-200 dark:border-blue-800/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">P</span>
                  <span className="text-base leading-none">{p.periodNumber}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border uppercase tracking-wider ${getSubjectColorStyle(
                        p.subject
                      )}`}
                    >
                      {p.subject}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {p.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      {p.startTime} - {p.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {p.room}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-purple-500" />
                      {p.teacher}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action */}
              <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700/60 justify-end">
                {associatedBook && (
                  <button
                    onClick={() => onOpenBook(associatedBook)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition border border-blue-200 dark:border-blue-800/60"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Textbook</span>
                  </button>
                )}

                <button
                  onClick={() => handleDeletePeriod(p.id)}
                  title="Remove class period"
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {currentDayPeriods.length === 0 && (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            <CalendarIcon className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No classes scheduled for {selectedDay}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Add your class periods with subject, room number, and textbook links to organize your day.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Add First Period
            </button>
          </div>
        )}
      </div>

      {/* Add Class Period Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                <h3 className="font-bold text-base">Add Class to {selectedDay}</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPeriod} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Period #
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={formPeriodNumber}
                    onChange={(e) => setFormPeriodNumber(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

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
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Class / Topic Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. AP Physics: Electromagnetism"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Room / Lab
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lab 304"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teacher
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Vance"
                    value={formTeacher}
                    onChange={(e) => setFormTeacher(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Linked Digital Textbook
                </label>
                <select
                  value={formBookId}
                  onChange={(e) => setFormBookId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="">None / Custom Notes</option>
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
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  Save Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
