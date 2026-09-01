export type SubjectType =
  | "Physics"
  | "Biology"
  | "Chemistry"
  | "Mathematics"
  | "History"
  | "Computer Science"
  | "Literature"
  | "Geography"
  | "Other";

export interface BookChapter {
  id: string;
  number: number;
  title: string;
  estimatedReadTimeMinutes: number;
  content: string; // Rich text / markdown-like paragraphs
  summary?: string;
  keyFormulas?: { name: string; formula: string; explanation: string }[];
  glossary?: { term: string; definition: string }[];
  checkpoints?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface Textbook {
  id: string;
  title: string;
  subject: SubjectType;
  gradeLevel: string;
  author: string;
  edition: string;
  physicalWeightKg: number; // Weight in physical form saved by using app!
  coverColor: string;
  accentColor: string;
  iconName: string;
  description: string;
  totalPages: number;
  chapters: BookChapter[];
  isCustom?: boolean;
}

export interface Highlight {
  id: string;
  bookId: string;
  chapterId: string;
  text: string;
  color: "yellow" | "green" | "blue" | "pink";
  note?: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapterId: string;
  title: string;
  pageSnippet: string;
  createdAt: string;
}

export interface TimetablePeriod {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  periodNumber: number;
  startTime: string; // e.g. "08:30"
  endTime: string;   // e.g. "09:20"
  subject: SubjectType;
  title: string;
  room: string;
  teacher: string;
  bookId?: string; // Associated digital textbook
  color: string;
}

export type HomeworkPriority = "High" | "Medium" | "Low";
export type HomeworkStatus = "todo" | "in_progress" | "completed";

export interface HomeworkItem {
  id: string;
  title: string;
  subject: SubjectType;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string;
  priority: HomeworkPriority;
  status: HomeworkStatus;
  description: string;
  relatedBookId?: string;
  relatedChapterId?: string;
  estimatedMinutes: number;
  completedAt?: string;
  aiNotes?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  keyConcept?: string;
}

export interface QuizTest {
  id: string;
  title: string;
  subject: SubjectType;
  relatedBookId?: string;
  relatedChapterId?: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Advanced";
  estimatedMinutes: number;
  questions: QuizQuestion[];
  isAiGenerated?: boolean;
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  subject: SubjectType;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  timeSpentSeconds: number;
  userAnswers: { [questionId: string]: number };
}

export interface Flashcard {
  id: string;
  subject: SubjectType;
  bookId?: string;
  front: string;
  back: string;
  category?: string;
  masteryLevel?: number; // 0 (new) to 3 (mastered)
  status?: "learning" | "mastered" | "review";
  reviewCount?: number;
  lastReviewed?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  provider: "google" | "local";
  gradeLevel: string;
  targetExams: string[];
  defaultTutorMode: "socratic" | "eli12" | "solver" | "summary";
  dailyGoalMinutes: number;
  joinedDate: string;
  institution?: string;
}

export interface StudentNote {
  id: string;
  title: string;
  subject: SubjectType;
  content: string;
  tags: string[];
  updatedAt: string;
  linkedBookId?: string;
}

export type ActiveTab =
  | "backpack"
  | "reader"
  | "timetable"
  | "homework"
  | "tests"
  | "flashcards"
  | "notes"
  | "ai_buddy"
  | "profile";
