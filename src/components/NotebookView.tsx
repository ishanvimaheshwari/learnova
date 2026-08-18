import React, { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  Calendar,
  Tag,
  Download,
  Share2,
  Sparkles,
  Check
} from "lucide-react";
import { StudentNote, SubjectType, Textbook } from "../types";

interface NotebookViewProps {
  notes: StudentNote[];
  books: Textbook[];
  onUpdateNotes: (notes: StudentNote[]) => void;
  onOpenBook: (book: Textbook) => void;
}

export const NotebookView: React.FC<NotebookViewProps> = ({
  notes,
  books,
  onUpdateNotes,
  onOpenBook,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [activeNote, setActiveNote] = useState<StudentNote | null>(notes[0] || null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSubject, setEditSubject] = useState<SubjectType>("Physics");
  const [editTags, setEditTags] = useState("");

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

  const filteredNotes = notes.filter(
    (n) => selectedSubject === "All" || n.subject === selectedSubject
  );

  const handleStartCreate = () => {
    const newNote: StudentNote = {
      id: `note-${Date.now()}`,
      title: "Untitled Study Note",
      subject: "Physics",
      content: "### Key Concepts\n- Write your takeaways here...\n\n### Formulas & Notes\n- ",
      tags: ["Notes", "Class"],
      updatedAt: new Date().toISOString(),
    };
    onUpdateNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditSubject(newNote.subject);
    setEditTags(newNote.tags.join(", "));
    setIsEditing(true);
  };

  const handleSelectNote = (note: StudentNote) => {
    setActiveNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditSubject(note.subject);
    setEditTags(note.tags.join(", "));
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!activeNote) return;
    const updatedNote: StudentNote = {
      ...activeNote,
      title: editTitle.trim() || "Untitled Note",
      content: editContent,
      subject: editSubject,
      tags: editTags.split(",").map((t) => t.trim()).filter(Boolean),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = notes.map((n) => (n.id === activeNote.id ? updatedNote : n));
    onUpdateNotes(updatedList);
    setActiveNote(updatedNote);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    onUpdateNotes(updated);
    if (activeNote?.id === id) {
      setActiveNote(updated[0] || null);
      setIsEditing(false);
    }
  };

  const handleExport = (note: StudentNote) => {
    const element = document.createElement("a");
    const file = new Blob([`# ${note.title}\nSubject: ${note.subject}\nDate: ${note.updatedAt}\n\n${note.content}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-md">
              <FileText className="w-3.5 h-3.5" />
              <span>Digital Class Notebook & Summary Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Organized Notes Across All Subjects
            </h1>
            <p className="text-sm text-blue-100">
              Save highlights directly from your digital textbooks, jot lecture notes, and export markdown summaries anytime.
            </p>
          </div>

          <button
            onClick={handleStartCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
        </div>
      </div>

      {/* Main Two-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Notes List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {subjects.slice(0, 5).map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedSubject === sub
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition space-y-2 ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-sm text-slate-900 dark:text-white"
                      : "bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                      {note.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {note.title}
                  </h4>

                  <p className="text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed text-[11px]">
                    {note.content.replace(/[#*`>]/g, "")}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {note.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {filteredNotes.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                No notes found in this subject. Click "New Note" to create one!
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Note Editor / Preview */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-8 space-y-6">
          {activeNote ? (
            isEditing ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    Editing Note
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Subject
                    </label>
                    <select
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value as SubjectType)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="e.g. Physics, ExamPrep, LabNotes"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Content (Markdown supported)
                  </label>
                  <textarea
                    rows={12}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                        {activeNote.subject}
                      </span>
                      <span className="text-xs text-slate-400">
                        Updated {new Date(activeNote.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                      {activeNote.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditTitle(activeNote.title);
                        setEditContent(activeNote.content);
                        setEditSubject(activeNote.subject);
                        setEditTags(activeNote.tags.join(", "));
                        setIsEditing(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button
                      onClick={() => handleExport(activeNote)}
                      title="Download Markdown"
                      className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(activeNote.id)}
                      title="Delete Note"
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content formatted */}
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-4">
                  {activeNote.content}
                </div>

                {/* Tags footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {activeNote.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-24 text-slate-400 space-y-2">
              <FileText className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-bold">Select a note or create a new one to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
