import { QuizTest } from "../types";

export const DEFAULT_QUIZZES: QuizTest[] = [
  {
    id: "quiz-phys-1",
    title: "Kinematics & Dynamics Mastery Check",
    subject: "Physics",
    relatedBookId: "phys-11",
    relatedChapterId: "phys-ch1",
    difficulty: "Medium",
    estimatedMinutes: 10,
    questions: [
      {
        id: "q1",
        question: "A ball is thrown vertically upward with initial speed 20 m/s. What is its velocity at the peak of its flight?",
        options: ["0 m/s", "9.8 m/s downward", "20 m/s", "4.9 m/s upward"],
        correctAnswerIndex: 0,
        explanation: "At the highest peak of vertical trajectory, instantaneous vertical velocity momentarily reaches 0 m/s before descending.",
        keyConcept: "Vertical Projectile Peak"
      },
      {
        id: "q2",
        question: "Which of the following represents Newton's Second Law in terms of momentum?",
        options: ["F_net = dp / dt", "F_net = mv²", "F_net = ∫ p dt", "F_net = m / a"],
        correctAnswerIndex: 0,
        explanation: "Net force is fundamentally defined as the instantaneous time rate of change of linear momentum (dp/dt). When mass is constant, this reduces to m·a.",
        keyConcept: "Newton's Second Law"
      },
      {
        id: "q3",
        question: "If the net force on an object is doubled while its mass is halved, its acceleration will:",
        options: ["Quadruple (4x)", "Double (2x)", "Remain unchanged", "Halve (0.5x)"],
        correctAnswerIndex: 0,
        explanation: "a = F / m. If F becomes 2F and m becomes m/2, the new acceleration is (2F) / (m/2) = 4(F/m) = 4a.",
        keyConcept: "Proportional Dynamics"
      },
      {
        id: "q4",
        question: "A 1000 kg car travelling at 20 m/s brakes to a complete stop. How much work was done by the brakes?",
        options: ["-200,000 J (-200 kJ)", "-100,000 J", "-400,000 J", "-20,000 J"],
        correctAnswerIndex: 0,
        explanation: "Work-Energy theorem: W_net = ΔK = 0 - 0.5(1000)(20²) = -200,000 J.",
        keyConcept: "Work-Energy Theorem"
      },
      {
        id: "q5",
        question: "Which angle gives the maximum range for a projectile launched on level terrain without air resistance?",
        options: ["45°", "30°", "60°", "90°"],
        correctAnswerIndex: 0,
        explanation: "The range formula includes sin(2θ), which reaches its global maximum of 1 at 2θ = 90°, corresponding to θ = 45°.",
        keyConcept: "Projectile Range Optimization"
      }
    ]
  },
  {
    id: "quiz-bio-1",
    title: "Cellular Biology & Respiration Challenge",
    subject: "Biology",
    relatedBookId: "bio-10",
    relatedChapterId: "bio-ch1",
    difficulty: "Medium",
    estimatedMinutes: 8,
    questions: [
      {
        id: "bq1",
        question: "During which stage of cellular respiration is the largest net amount of ATP synthesized?",
        options: ["Oxidative Phosphorylation (Chemiosmosis)", "Glycolysis", "Citric Acid / Krebs Cycle", "Pyruvate Oxidation"],
        correctAnswerIndex: 0,
        explanation: "Oxidative phosphorylation generates approximately 26 to 28 ATP molecules per glucose via the electron transport chain and ATP synthase.",
        keyConcept: "ATP Synthesis"
      },
      {
        id: "bq2",
        question: "Which organelle is responsible for post-translational modification and sorting of secretory proteins?",
        options: ["Golgi Apparatus", "Smooth ER", "Lysosome", "Centrosome"],
        correctAnswerIndex: 0,
        explanation: "The Golgi apparatus receives proteins from the rough ER, glycosylates/modifies them, and packages them into vesicles.",
        keyConcept: "Organelle Specialization"
      },
      {
        id: "bq3",
        question: "What is the primary role of molecular oxygen (O₂) in aerobic cellular respiration?",
        options: ["Final electron acceptor at the end of the electron transport chain", "Direct catalyst for glycolysis", "Carbon carrier in the Krebs cycle", "Donor of protons to ATP synthase"],
        correctAnswerIndex: 0,
        explanation: "Oxygen acts as the terminal electron acceptor in the mitochondrial ETC, combining with protons to form water (H₂O).",
        keyConcept: "Terminal Electron Acceptor"
      },
      {
        id: "bq4",
        question: "The fluid mosaic model describes cell membranes as composed primarily of:",
        options: ["Phospholipid bilayer with embedded proteins", "Rigid cellulose fibers", "Solid nucleic acid mesh", "Continuous carbohydrate polymer"],
        correctAnswerIndex: 0,
        explanation: "Membranes consist of an amphipathic phospholipid bilayer with laterally diffusing proteins, cholesterol, and glycoproteins.",
        keyConcept: "Membrane Fluidity"
      }
    ]
  },
  {
    id: "quiz-math-1",
    title: "Calculus & Limits Diagnostic",
    subject: "Mathematics",
    relatedBookId: "math-12",
    relatedChapterId: "math-ch1",
    difficulty: "Hard",
    estimatedMinutes: 12,
    questions: [
      {
        id: "mq1",
        question: "What is the limit of (sin 3x) / x as x approaches 0?",
        options: ["3", "1", "0", "Does not exist"],
        correctAnswerIndex: 0,
        explanation: "Using the fundamental trigonometric limit lim(u→0) [sin(u)/u] = 1, we rewrite (sin 3x)/x = 3 · [sin(3x)/(3x)] → 3(1) = 3.",
        keyConcept: "Trigonometric Limits"
      },
      {
        id: "mq2",
        question: "If f(x) = ln(x² + 1), what is f'(x)?",
        options: ["2x / (x² + 1)", "1 / (x² + 1)", "2 / x", "2x · ln(x² + 1)"],
        correctAnswerIndex: 0,
        explanation: "By the chain rule: d/dx[ln(u)] = (1/u) · u'. Here u = x² + 1, so u' = 2x, giving 2x / (x² + 1).",
        keyConcept: "Chain Rule Differentiation"
      },
      {
        id: "mq3",
        question: "What is the value of the definite integral ∫[0 to π] sin(x) dx?",
        options: ["2", "0", "1", "π"],
        correctAnswerIndex: 0,
        explanation: "Antiderivative of sin(x) is -cos(x). Evaluating [-cos(π)] - [-cos(0)] = -(-1) - (-1) = 1 + 1 = 2.",
        keyConcept: "Definite Integral Evaluation"
      }
    ]
  },
  {
    id: "quiz-cs-1",
    title: "Algorithms & Data Structures Sprint",
    subject: "Computer Science",
    relatedBookId: "cs-10",
    relatedChapterId: "cs-ch1",
    difficulty: "Medium",
    estimatedMinutes: 10,
    questions: [
      {
        id: "csq1",
        question: "What is the average time complexity of searching a key in a well-balanced Hash Table?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        correctAnswerIndex: 0,
        explanation: "With a uniform hash function and low load factor, hash table lookups take constant time O(1) on average.",
        keyConcept: "Hash Map Complexity"
      },
      {
        id: "csq2",
        question: "Which data structure operates on a Last-In, First-Out (LIFO) order?",
        options: ["Stack", "Queue", "Binary Heap", "Linked List"],
        correctAnswerIndex: 0,
        explanation: "A Stack restricts insertions and deletions to the top element, adhering strictly to LIFO.",
        keyConcept: "Stack Properties"
      },
      {
        id: "csq3",
        question: "How many comparisons does Binary Search require at most for an array of 1,024 sorted elements?",
        options: ["10 or 11 comparisons", "1,024 comparisons", "512 comparisons", "100 comparisons"],
        correctAnswerIndex: 0,
        explanation: "Binary search cuts search space in half each step: log₂(1024) = 10 comparisons maximum.",
        keyConcept: "Binary Search Scaling"
      }
    ]
  }
];

export const defaultQuizzes = DEFAULT_QUIZZES;
