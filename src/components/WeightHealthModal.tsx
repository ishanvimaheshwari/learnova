import React, { useState } from "react";
import { X, Backpack, Heart, TreePine, Award, CheckCircle2, ShieldCheck, Sparkles, Scale } from "lucide-react";
import { Textbook } from "../types";

interface WeightHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  books?: Textbook[];
  totalWeightSavedKg?: number;
  bookCount?: number;
}

export const WeightHealthModal: React.FC<WeightHealthModalProps> = ({
  isOpen,
  onClose,
  books = [],
  totalWeightSavedKg,
  bookCount,
}) => {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");

  if (!isOpen) return null;

  const safeBooks = books || [];
  const calculatedKg = safeBooks.reduce((acc, b) => acc + (b.physicalWeightKg || 2.5), 0);
  const totalKg = totalWeightSavedKg !== undefined ? totalWeightSavedKg : calculatedKg;
  const totalLbs = totalKg * 2.20462;
  const totalPages = safeBooks.reduce((acc, b) => acc + (b.totalPages || 500), 0) || (bookCount ? bookCount * 450 : 2500);

  const displayedWeight = unit === "kg" ? totalKg.toFixed(1) : totalLbs.toFixed(1);
  const unitLabel = unit === "kg" ? "kg" : "lbs";

  // Environmental and health metrics
  const treesSaved = (totalPages * 0.0001).toFixed(2);
  const co2SavedKg = (totalPages * 0.005).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/15 backdrop-blur-md rounded-xl">
                <Backpack className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Physical Weight & Spine Health Impact</h2>
                <p className="text-sm text-blue-100">See how replacing physical textbooks transforms your health</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main big metric card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-800/80 dark:to-indigo-950/30 p-6 rounded-2xl border border-blue-100 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  <Scale className="w-4 h-4" />
                  Total Weight Relieved from Your Spine
                </div>
                <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                  {displayedWeight} <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{unitLabel}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Across {books.length} full digitized textbooks ({totalPages.toLocaleString()} total physical pages)
                </p>
              </div>

              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-center shadow-sm">
                <button
                  onClick={() => setUnit("kg")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    unit === "kg"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Kilograms (kg)
                </button>
                <button
                  onClick={() => setUnit("lbs")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    unit === "lbs"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Pounds (lbs)
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-100 dark:border-slate-700/60 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong>Real-world comparison:</strong> That's equivalent to carrying ~3 heavy bowling balls or 16 large water bottles to school every single morning!
              </span>
            </div>
          </div>

          {/* Secondary stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500 text-white rounded-lg">
                  <TreePine className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Environmental Impact</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {treesSaved} Trees & {co2SavedKg} kg CO₂ Saved
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                Digital learning eliminates paper pulp waste and school printing overhead.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-500 text-white rounded-lg">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-rose-800 dark:text-rose-300 font-medium">Spine Health Score</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">100% Zero-Load Safety</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                Medical guidelines advise backpacks not exceed 10% of body weight. You carry 0 kg!
              </p>
            </div>
          </div>

          {/* Ergonomic tips for students */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Healthy Digital Study Habits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 20-20-20 Rule
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Every 20 mins, look at an object 20 feet away for 20 seconds to prevent eye fatigue.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Eye-Level Screen
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Keep device at eye level with relaxed shoulders to prevent forward head posture.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Active Audio Mode
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Use our built-in Read-Aloud audio while stretching or walking between classes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition"
          >
            Got it, Let's Study!
          </button>
        </div>
      </div>
    </div>
  );
};
