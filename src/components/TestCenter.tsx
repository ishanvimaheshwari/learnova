import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  FileQuestion,
  Award,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Plus,
  BarChart3,
  Sliders,
  Check,
  X
} from "lucide-react";
import { QuizTest, QuizQuestion, TestResult, SubjectType, Textbook } from "../types";

interface TestCenterProps {
  quizzes: QuizTest[];
  books: Textbook[];
  onSaveResult: (res: TestResult) => void;
  pastResults: TestResult[];
  onAddAiQuiz: (quiz: QuizTest) => void;
}

export const TestCenter: React.FC<TestCenterProps> = ({
  quizzes,
  books,
  onSaveResult,
  pastResults,
  onAddAiQuiz,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [activeTest, setActiveTest] = useState<QuizTest | null>(null);

  // Active Test Runner state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600);
  const [testFinishedResult, setTestFinishedResult] = useState<TestResult | null>(null);

  // AI Test Generator state
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [aiGenSubject, setAiGenSubject] = useState<SubjectType>("Physics");
  const [aiGenTopic, setAiGenTopic] = useState("");
  const [aiGenDifficulty, setAiGenDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Advanced">("Medium");
  const [aiGenCount, setAiGenCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const subjects = [
    "All",
    "Physics",
    "Biology",
    "Chemistry",
    "Mathematics",
    "Computer Science",
    "History",
  ];

  // Timer countdown
  useEffect(() => {
    if (!activeTest || testFinishedResult) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest, testFinishedResult]);

  const startTest = (quiz: QuizTest) => {
    setActiveTest(quiz);
    setCurrentQIndex(0);
    setUserAnswers({});
    setFlaggedQuestions([]);
    setSecondsRemaining((quiz.estimatedMinutes || 10) * 60);
    setTestFinishedResult(null);
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;

    let score = 0;
    activeTest.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        score += 1;
      }
    });

    const totalQuestions = activeTest.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const timeSpent = (activeTest.estimatedMinutes * 60) - secondsRemaining;

    const result: TestResult = {
      id: `result-${Date.now()}`,
      testId: activeTest.id,
      testTitle: activeTest.title,
      subject: activeTest.subject,
      score,
      totalQuestions,
      percentage,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: Math.max(10, timeSpent),
      userAnswers,
    };

    setTestFinishedResult(result);
    onSaveResult(result);

    // Confetti for good performance!
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const handleGenerateAiTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenError(null);

    try {
      const res = await fetch("/api/gemini/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: aiGenSubject,
          topic: aiGenTopic.trim() || `${aiGenSubject} Core Fundamentals`,
          difficulty: aiGenDifficulty,
          questionCount: aiGenCount,
        }),
      });

      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error("AI returned empty test questions. Please try again.");
      }

      const newQuiz: QuizTest = {
        id: `ai-quiz-${Date.now()}`,
        title: data.title || `${aiGenSubject}: ${aiGenTopic || "Custom Test"}`,
        subject: aiGenSubject,
        difficulty: aiGenDifficulty,
        estimatedMinutes: data.estimatedMinutes || aiGenCount * 2,
        questions: data.questions,
        isAiGenerated: true,
      };

      onAddAiQuiz(newQuiz);
      setIsAiGeneratorOpen(false);
      startTest(newQuiz);
    } catch (err: any) {
      setGenError(err.message || "Failed to generate test.");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const filteredQuizzes = quizzes.filter(
    (q) => selectedSubject === "All" || q.subject === selectedSubject
  );

  return (
    <div className="space-y-8 pb-16">
      {/* 1. If currently taking a test or reviewing test results */}
      {activeTest ? (
        testFinishedResult ? (
          /* Result & Scorecard View */
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white text-center space-y-4 shadow-2xl border border-indigo-800/40">
              <div className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-md mx-auto">
                <Award className="w-12 h-12 text-amber-400" />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight">
                {testFinishedResult.percentage >= 80
                  ? "Outstanding Mastery! 🏆"
                  : testFinishedResult.percentage >= 60
                  ? "Good Job! Keep Practicing 🎯"
                  : "Needs Review & Practice 📚"}
              </h2>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                You completed <strong>{activeTest.title}</strong> in{" "}
                {Math.round(testFinishedResult.timeSpentSeconds / 60)} minutes.
              </p>

              {/* Big Score Badges */}
              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="p-4 bg-white/10 rounded-2xl border border-white/15 min-w-[120px]">
                  <div className="text-xs text-blue-200 uppercase font-bold">Your Score</div>
                  <div className="text-3xl font-black text-white">
                    {testFinishedResult.score} / {testFinishedResult.totalQuestions}
                  </div>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl border border-white/15 min-w-[120px]">
                  <div className="text-xs text-blue-200 uppercase font-bold">Accuracy</div>
                  <div className="text-3xl font-black text-emerald-400">
                    {testFinishedResult.percentage}%
                  </div>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl border border-white/15 min-w-[120px]">
                  <div className="text-xs text-blue-200 uppercase font-bold">XP Earned</div>
                  <div className="text-3xl font-black text-amber-400">
                    +{testFinishedResult.score * 20} XP
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => startTest(activeTest)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs sm:text-sm text-white shadow transition"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Test
                </button>
                <button
                  onClick={() => {
                    setActiveTest(null);
                    setTestFinishedResult(null);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs sm:text-sm text-white transition"
                >
                  Back to Test Center
                </button>
              </div>
            </div>

            {/* Detailed Question Review */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-blue-600" /> Question-by-Question Breakdown
              </h3>

              {activeTest.questions.map((q, idx) => {
                const userChoice = testFinishedResult.userAnswers[q.id];
                const isCorrect = userChoice === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-6 rounded-2xl border ${
                      isCorrect
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                        : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40"
                    } space-y-4 shadow-xs`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                        <span>
                          {idx + 1}. {q.question}
                        </span>
                      </div>
                      {q.keyConcept && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 shrink-0">
                          {q.keyConcept}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userChoice === optIdx;
                        const isRight = optIdx === q.correctAnswerIndex;

                        let optClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300";
                        if (isRight) {
                          optClass = "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold";
                        } else if (isChosen && !isRight) {
                          optClass = "bg-rose-100 dark:bg-rose-900/50 border-rose-500 text-rose-900 dark:text-rose-100";
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border flex items-center justify-between ${optClass}`}
                          >
                            <span>{opt}</span>
                            {isRight && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                            {isChosen && !isRight && (
                              <X className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 leading-relaxed">
                      <strong>Explanation: </strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Test Taking View */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Test Header with Timer & Progress */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">
                  <span>{activeTest.subject}</span>
                  <span>•</span>
                  <span>{activeTest.difficulty} Difficulty</span>
                </div>
                <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  {activeTest.title}
                </h2>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black border ${
                    secondsRemaining < 120
                      ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800 animate-pulse"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(secondsRemaining)}</span>
                </div>

                <button
                  onClick={handleSubmitTest}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  Submit Test
                </button>
              </div>
            </div>

            {/* Question Navigation Palette */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-slate-500 shrink-0 mr-2">Questions:</span>
              {activeTest.questions.map((q, idx) => {
                const isCurrent = idx === currentQIndex;
                const isAnswered = userAnswers[q.id] !== undefined;
                const isFlagged = flaggedQuestions.includes(q.id);

                let badgeColor = "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
                if (isCurrent) {
                  badgeColor = "bg-blue-600 text-white border-blue-600 shadow-sm";
                } else if (isFlagged) {
                  badgeColor = "bg-amber-100 dark:bg-amber-950/50 text-amber-800 border-amber-300";
                } else if (isAnswered) {
                  badgeColor = "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 border-emerald-300";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold border shrink-0 transition ${badgeColor}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Current Question Card */}
            {activeTest.questions[currentQIndex] && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Question {currentQIndex + 1} of {activeTest.questions.length}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                      {activeTest.questions[currentQIndex].question}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleFlag(activeTest.questions[currentQIndex].id)}
                    title="Flag question for review"
                    className={`p-2.5 rounded-xl border transition ${
                      flaggedQuestions.includes(activeTest.questions[currentQIndex].id)
                        ? "bg-amber-100 text-amber-700 border-amber-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent hover:text-slate-700"
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {activeTest.questions[currentQIndex].options.map((opt, optIdx) => {
                    const isSelected =
                      userAnswers[activeTest.questions[currentQIndex].id] === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() =>
                          handleSelectAnswer(activeTest.questions[currentQIndex].id, optIdx)
                        }
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-100 font-bold shadow-xs"
                            : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Footer buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <button
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex((prev) => prev - 1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 text-xs font-bold transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  {currentQIndex < activeTest.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQIndex((prev) => prev + 1)}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                    >
                      Next Question <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitTest}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow"
                    >
                      Finish & Submit Test
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        /* 2. Main Test Center Dashboard */
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-md">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Interactive Exam Simulator & Quizzes</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Master Every Chapter with Instant Practice Tests
                </h1>
                <p className="text-sm text-blue-100">
                  Timed mock exams, chapter knowledge checkpoints, and on-demand AI test generation across all school subjects.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAiGeneratorOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  Generate AI Custom Test
                </button>
              </div>
            </div>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  selectedSubject === sub
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Quizzes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                      {quiz.subject}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                      {quiz.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {quiz.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2">
                    <span className="flex items-center gap-1">
                      <FileQuestion className="w-3.5 h-3.5" />
                      {quiz.questions.length} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {quiz.estimatedMinutes} Mins
                    </span>
                    {quiz.isAiGenerated && (
                      <span className="flex items-center gap-0.5 text-purple-600 dark:text-purple-400 font-bold">
                        <Sparkles className="w-3 h-3" /> AI
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => startTest(quiz)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs group-hover:bg-blue-700"
                >
                  <span>Start Practice Test</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </button>
              </div>
            ))}
          </div>

          {/* Past Performance Record */}
          {pastResults.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" /> Recent Test History & Scores
              </h3>
              <div className="space-y-2">
                {pastResults.slice(0, 5).map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{r.testTitle}</div>
                      <div className="text-slate-500 text-[11px]">
                        {new Date(r.completedAt).toLocaleDateString()} • {r.subject}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-black text-sm ${
                          r.percentage >= 70 ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {r.score} / {r.totalQuestions} ({r.percentage}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Test Generator Modal */}
          {isAiGeneratorOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-amber-500 to-indigo-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-200" />
                    <h3 className="font-bold text-base">AI Custom Test Generator</h3>
                  </div>
                  <button
                    onClick={() => setIsAiGeneratorOpen(false)}
                    className="text-white/80 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleGenerateAiTest} className="p-6 space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Subject
                    </label>
                    <select
                      value={aiGenSubject}
                      onChange={(e) => setAiGenSubject(e.target.value as SubjectType)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Topic or Specific Chapter Focus
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Projectile Motion, Photosynthesis, Limit Derivative Rules"
                      value={aiGenTopic}
                      onChange={(e) => setAiGenTopic(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Difficulty
                      </label>
                      <select
                        value={aiGenDifficulty}
                        onChange={(e) =>
                          setAiGenDifficulty(e.target.value as "Easy" | "Medium" | "Hard" | "Advanced")
                        }
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard (Exam Prep)</option>
                        <option value="Advanced">Advanced (Olympiad)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Question Count
                      </label>
                      <select
                        value={aiGenCount}
                        onChange={(e) => setAiGenCount(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      >
                        <option value={3}>3 Questions (Quick Sprint)</option>
                        <option value={5}>5 Questions (Standard)</option>
                        <option value={8}>8 Questions (In-depth)</option>
                      </select>
                    </div>
                  </div>

                  {genError && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                      {genError}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAiGeneratorOpen(false)}
                      className="px-4 py-2 text-slate-600 dark:text-slate-400 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow transition"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin" /> Generating Test...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" /> Create & Start Test
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
