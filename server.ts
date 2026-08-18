import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 1. AI Study Buddy Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, context, mode, subject } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getAI();
    let systemInstruction = `You are "ScholarBot", an encouraging, brilliant, and patient AI Study Buddy for school students.
Your mission is to help students learn deeply, understand textbook concepts, solve homework problems step-by-step, and prepare for exams.
Always use clear formatting, bullet points, and step-by-step numbered instructions when explaining calculations or processes.
Use friendly, engaging school-friendly language.`;

    if (mode === "eli12") {
      systemInstruction += `\nMode: "Explain Like I'm 12". Use vivid real-world analogies, simple terms, and engaging storytelling to make complex topics crystal clear.`;
    } else if (mode === "socratic") {
      systemInstruction += `\nMode: "Socratic Hint Tutor". Guide the student step-by-step with thoughtful guiding questions and hints without immediately revealing the full answer.`;
    } else if (mode === "solver") {
      systemInstruction += `\nMode: "Step-by-Step Problem Solver". Show detailed mathematical formulas, intermediate derivations, and final unit checks.`;
    } else if (mode === "quizzer") {
      systemInstruction += `\nMode: "Interactive Rapid Quizzer". Ask the student testing questions one at a time and grade their replies with helpful corrections.`;
    }

    if (subject) {
      systemInstruction += `\nTarget Subject: ${subject}.`;
    }
    if (context) {
      systemInstruction += `\nTextbook Context / Reference Material:\n"""${context}"""`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "I couldn't generate a response. Please try rephrasing." });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({
      error: error.message || "Failed to communicate with AI tutor. Make sure GEMINI_API_KEY is configured.",
    });
  }
});

// 2. AI Custom Test / Quiz Generator
app.post("/api/gemini/generate-test", async (req, res) => {
  try {
    const { subject, topic, chapterContent, questionCount = 5, difficulty = "Medium" } = req.body;
    const ai = getAI();

    const prompt = `Generate a high-quality ${difficulty} difficulty practice test with ${questionCount} multiple-choice questions for school students.
Subject: ${subject || "General Science"}
Topic: ${topic || "Core Concepts"}
${chapterContent ? `Based on this chapter material: """${chapterContent.slice(0, 4000)}"""` : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            estimatedMinutes: { type: Type.INTEGER },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Exactly 4 options: A, B, C, D",
                  },
                  correctAnswerIndex: {
                    type: Type.INTEGER,
                    description: "0 for first option, 1 for second, etc.",
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Detailed clear explanation of why this answer is correct and others are not",
                  },
                  keyConcept: { type: Type.STRING },
                },
                required: ["id", "question", "options", "correctAnswerIndex", "explanation"],
              },
            },
          },
          required: ["title", "subject", "difficulty", "questions"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini Generate Test Error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate test. Please try again.",
    });
  }
});

// 3. AI Smart Explainer & Flashcard Generator
app.post("/api/gemini/analyze-chapter", async (req, res) => {
  try {
    const { title, content, subject } = req.body;
    const ai = getAI();

    const prompt = `Analyze this textbook chapter for a student.
Subject: ${subject}
Chapter: ${title}
Content snippet: """${content.slice(0, 5000)}"""

Provide:
1. A concise 3-paragraph executive summary.
2. 5 high-yield key takeaway bullet points.
3. 5 essential flashcards (front: question/concept, back: concise definition or answer).
4. Top formulas or key rules to remember.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ["front", "back"],
              },
            },
            keyFormulasOrRules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  formula: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["name", "description"],
              },
            },
          },
          required: ["summary", "keyTakeaways", "flashcards"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini Chapter Analysis Error:", error);
    res.status(500).json({
      error: error.message || "Failed to analyze chapter.",
    });
  }
});

// 4. AI Step-by-Step Homework Solver / Hint Assistant
app.post("/api/gemini/solve-homework", async (req, res) => {
  try {
    const { problemText, subject, assistanceLevel } = req.body;
    const ai = getAI();

    let prompt = `A school student needs help with this ${subject || ""} homework question:\n"""${problemText}"""\n`;
    if (assistanceLevel === "hint") {
      prompt += "Provide 2-3 progressive hints and identify the key underlying formulas/principles to apply, without giving the final direct answer right away.";
    } else {
      prompt += "Provide a complete, crystal-clear step-by-step solution showing every intermediate step, units, and a final verification check.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master academic tutor. Explain math, science, and humanities questions with utmost rigor, pedagogical clarity, and neat formatting.",
      },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Homework Helper Error:", error);
    res.status(500).json({ error: error.message || "Failed to assist with homework." });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ScholarDesk Server running on http://localhost:${PORT}`);
  });
}

startServer();
