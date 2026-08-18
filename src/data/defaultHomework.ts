import { HomeworkItem } from "../types";

export const DEFAULT_HOMEWORK: HomeworkItem[] = [
  {
    id: "hw-1",
    title: "Physics Problem Set: Projectile Motion at 45° Angle",
    subject: "Physics",
    dueDate: "2026-08-20",
    dueTime: "23:59",
    priority: "High",
    status: "todo",
    description: "Complete problems 4.2 through 4.8 on page 42. Calculate maximum height and range for an initial launch velocity of 35 m/s with g = 9.8 m/s².",
    relatedBookId: "phys-11",
    relatedChapterId: "phys-ch1",
    estimatedMinutes: 45,
    aiNotes: "Hint: Remember to decompose initial velocity into horizontal (v0 cos θ) and vertical (v0 sin θ) components."
  },
  {
    id: "hw-2",
    title: "Calculus Worksheet: Derivatives via Chain & Product Rules",
    subject: "Mathematics",
    dueDate: "2026-08-21",
    dueTime: "17:00",
    priority: "High",
    status: "in_progress",
    description: "Differentiate 10 composite functions including y = (3x² + 5)⁴ · sin(2x) and find equation of tangent line at x = 0.",
    relatedBookId: "math-12",
    relatedChapterId: "math-ch1",
    estimatedMinutes: 50
  },
  {
    id: "hw-3",
    title: "Biology Lab Report: Cellular Respiration in Yeast",
    subject: "Biology",
    dueDate: "2026-08-22",
    dueTime: "08:30",
    priority: "Medium",
    status: "todo",
    description: "Analyze gas production rates under anaerobic vs aerobic conditions. Graph CO₂ output and answer concluding questions.",
    relatedBookId: "bio-10",
    relatedChapterId: "bio-ch2",
    estimatedMinutes: 60
  },
  {
    id: "hw-4",
    title: "Chemistry Equilibrium Constant Calculation",
    subject: "Chemistry",
    dueDate: "2026-08-23",
    dueTime: "23:59",
    priority: "Medium",
    status: "todo",
    description: "Use ICE tables (Initial, Change, Equilibrium) to determine Kc for Haber Process N₂ + 3H₂ ⇌ 2NH₃ at 500 K.",
    relatedBookId: "chem-11",
    relatedChapterId: "chem-ch2",
    estimatedMinutes: 35
  },
  {
    id: "hw-5",
    title: "Computer Science: Implement Binary Search & Big-O Proof",
    subject: "Computer Science",
    dueDate: "2026-08-19",
    dueTime: "23:59",
    priority: "High",
    status: "completed",
    description: "Write an iterative and recursive binary search algorithm and document why the recurrence relation yields O(log N).",
    relatedBookId: "cs-10",
    relatedChapterId: "cs-ch1",
    estimatedMinutes: 40,
    completedAt: "2026-08-18T10:30:00Z"
  },
  {
    id: "hw-6",
    title: "History Essay: Comparative Impact of Enlightenment Thinkers",
    subject: "History",
    dueDate: "2026-08-25",
    dueTime: "16:00",
    priority: "Low",
    status: "todo",
    description: "Draft a 750-word synthesis comparing John Locke's Social Contract with Montesquieu's Separation of Powers.",
    relatedBookId: "hist-10",
    relatedChapterId: "hist-ch1",
    estimatedMinutes: 90
  }
];

export const defaultHomework = DEFAULT_HOMEWORK;
