export type LanguageKey = "javascript" | "python" | "java" | "cpp" | "c";

export type TopicKey =
  | "basics"
  | "data-types"
  | "operators"
  | "conditionals"
  | "loops"
  | "functions"
  | "recursion"
  | "arrays"
  | "strings"
  | "pointers-references"
  | "structures-classes"
  | "oop"
  | "linked-list"
  | "stack"
  | "queue"
  | "hashing"
  | "tree"
  | "graph"
  | "sorting"
  | "searching"
  | "dp-basics";

export type TopicInfo = {
  title: string;
  description: string;
};

export const languages: { value: LanguageKey; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
];


