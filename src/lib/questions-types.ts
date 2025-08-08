export type Difficulty = "easy" | "intermediate" | "hard";

export type Question = {
  id: string; // e.g., easy-001
  slug: string; // for URLs, mirrors id
  title: string;
  difficulty: Difficulty;
  tags: string[]; // concepts involved
  statement: string; // problem statement (markdown-friendly text)
  examples?: { input: string; output: string; explanation?: string }[];
  constraints?: string[];
  starterCode: Partial<Record<"javascript" | "python" | "java" | "cpp" | "c", string>>;
  hints: string[]; // ordered hints
  solution: Partial<Record<"javascript" | "python" | "java" | "cpp" | "c", string>>; // optional per language
};

export type QuestionsIndex = Record<Difficulty, Question[]>;


