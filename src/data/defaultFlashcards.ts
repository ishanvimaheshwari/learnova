import { Flashcard } from "../types";

export const DEFAULT_FLASHCARDS: Flashcard[] = [
  // Physics
  {
    id: "fc-p1",
    subject: "Physics",
    bookId: "phys-11",
    front: "What is Newton's First Law of Motion?",
    back: "An object at rest stays at rest, and an object in uniform motion stays in uniform motion unless acted upon by a net external force (Law of Inertia).",
    category: "Mechanics",
    masteryLevel: 2
  },
  {
    id: "fc-p2",
    subject: "Physics",
    bookId: "phys-11",
    front: "State the Work-Energy Theorem.",
    back: "The net work done by all forces on a particle equals the change in its kinetic energy: W_net = ΔK = ½mv_f² - ½mv_i².",
    category: "Energy",
    masteryLevel: 1
  },
  {
    id: "fc-p3",
    subject: "Physics",
    bookId: "phys-11",
    front: "What angle maximizes the range of a projectile on flat ground?",
    back: "45 degrees (since sin(2θ) = sin(90°) = 1).",
    category: "Kinematics",
    masteryLevel: 3
  },

  // Biology
  {
    id: "fc-b1",
    subject: "Biology",
    bookId: "bio-10",
    front: "What is the net ATP yield from 1 molecule of glucose in aerobic cellular respiration?",
    back: "Approximately 30 to 32 ATP (2 from glycolysis, 2 from Krebs cycle, and ~26-28 from oxidative phosphorylation).",
    category: "Cell Respiration",
    masteryLevel: 2
  },
  {
    id: "fc-b2",
    subject: "Biology",
    bookId: "bio-10",
    front: "What is the function of the Golgi apparatus?",
    back: "Modifies, sorts, packages, and tags proteins and lipids from the rough ER for secretion or intracellular delivery.",
    category: "Cell Organelles",
    masteryLevel: 3
  },

  // Chemistry
  {
    id: "fc-c1",
    subject: "Chemistry",
    bookId: "chem-11",
    front: "State Le Chatelier's Principle.",
    back: "When a system at chemical equilibrium is subjected to an external disturbance, the equilibrium position shifts in the direction that opposes and counteracts the change.",
    category: "Equilibrium",
    masteryLevel: 1
  },
  {
    id: "fc-c2",
    subject: "Chemistry",
    bookId: "chem-11",
    front: "What is the Aufbau Principle?",
    back: "Electrons occupy the lowest available atomic energy orbitals before filling higher energy orbitals (1s → 2s → 2p → 3s...).",
    category: "Atomic Structure",
    masteryLevel: 2
  },

  // Mathematics
  {
    id: "fc-m1",
    subject: "Mathematics",
    bookId: "math-12",
    front: "What is the Chain Rule for differentiation?",
    back: "(f ∘ g)'(x) = f'(g(x)) · g'(x). The derivative of the outer function evaluated at inner function multiplied by derivative of inner function.",
    category: "Calculus",
    masteryLevel: 3
  },
  {
    id: "fc-m2",
    subject: "Mathematics",
    bookId: "math-12",
    front: "What is the formula for Integration by Parts?",
    back: "∫ u dv = u·v - ∫ v du (derived from the product rule of derivatives).",
    category: "Calculus",
    masteryLevel: 2
  },

  // Computer Science
  {
    id: "fc-cs1",
    subject: "Computer Science",
    bookId: "cs-10",
    front: "What is the average time complexity of Binary Search?",
    back: "O(log N). The search space is halved at each comparison step.",
    category: "Algorithms",
    masteryLevel: 3
  },
  {
    id: "fc-cs2",
    subject: "Computer Science",
    bookId: "cs-10",
    front: "Difference between Stack and Queue?",
    back: "Stack follows LIFO (Last-In, First-Out, e.g. undo history), whereas Queue follows FIFO (First-In, First-Out, e.g. print queue).",
    category: "Data Structures",
    masteryLevel: 2
  }
];

export const defaultFlashcards = DEFAULT_FLASHCARDS;
