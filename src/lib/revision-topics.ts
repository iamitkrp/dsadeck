import type { TopicInfo, TopicKey } from "./revision-types";

export const TOPICS_IN_ORDER: TopicKey[] = [
  "basics",
  "data-types",
  "operators",
  "conditionals",
  "loops",
  "functions",
  "recursion",
  "arrays",
  "strings",
  "pointers-references",
  "structures-classes",
  "oop",
  "linked-list",
  "stack",
  "queue",
  "hashing",
  "tree",
  "graph",
  "sorting",
  "searching",
  "dp-basics",
];

export const TOPICS: Record<TopicKey, TopicInfo> = {
  basics: {
    title: "Basics & Syntax",
    description:
      "Hello world, input/output, basic program structure, and compiling/running. These are the building blocks to get any program off the ground.",
  },
  "data-types": {
    title: "Data Types & Variables",
    description:
      "Primitive types, declarations, initialization, and mutability. Understand memory and ranges for numeric types.",
  },
  operators: {
    title: "Operators",
    description:
      "Arithmetic, comparison, logical, bitwise, and assignment operators. Pay attention to precedence and short-circuiting.",
  },
  conditionals: {
    title: "Conditional Statements",
    description:
      "Branching with if/else and switch. Use guard clauses to reduce nesting and improve readability.",
  },
  loops: {
    title: "Loops",
    description:
      "for, while, and do-while. Know iteration patterns, loop invariants, and when to break/continue.",
  },
  functions: {
    title: "Functions",
    description:
      "Defining reusable logic with parameters and return values. Embrace pure functions for testability.",
  },
  recursion: {
    title: "Recursion",
    description:
      "Solve problems by defining them in terms of smaller subproblems. Always ensure a base case and progress toward it.",
  },
  arrays: {
    title: "Arrays",
    description:
      "Contiguous memory with O(1) access. Patterns include traversal, two pointers, prefix sums, and sliding window.",
  },
  strings: {
    title: "Strings",
    description:
      "Text sequences. Techniques include frequency tables, hashing, sliding window, and two pointers.",
  },
  "pointers-references": {
    title: "Pointers / References",
    description:
      "Indirect access to values (C/C++ pointers, references; JS/Java object references). Understand aliasing and mutability.",
  },
  "structures-classes": {
    title: "Structures / Classes",
    description:
      "Custom types bundling related data (and behavior). Useful for modeling problem entities cleanly.",
  },
  oop: {
    title: "OOP Concepts",
    description:
      "Encapsulation, inheritance, and polymorphism. Helpful for organizing complex systems and APIs.",
  },
  "linked-list": {
    title: "Linked List",
    description:
      "Nodes connected by pointers. Practice slow/fast pointers, reversal, merging, and cycle detection.",
  },
  stack: {
    title: "Stack",
    description:
      "LIFO data structure. Use for parenthesis matching, monotonic stack patterns, backtracking, and DFS.",
  },
  queue: {
    title: "Queue",
    description:
      "FIFO data structure. Variants include deque and priority queue. Use for BFS and scheduling.",
  },
  hashing: {
    title: "Hashing / Hash Map",
    description:
      "Average O(1) insert/lookup via hashing. Be aware of collisions, load factor, and custom hash functions.",
  },
  tree: {
    title: "Tree",
    description:
      "Hierarchical data. Master traversals, BST operations, LCA, and tree DP.",
  },
  graph: {
    title: "Graph",
    description:
      "Vertices and edges. Core algorithms: BFS, DFS, Dijkstra, Union-Find, Topological sort, and MST.",
  },
  sorting: {
    title: "Sorting Algorithms",
    description:
      "From quadratic (Bubble/Insertion/Selection) to efficient (Merge/Quick/Heap). Know stability and complexity.",
  },
  searching: {
    title: "Searching Algorithms",
    description:
      "Binary search on arrays or on answer space, BFS/DFS on graphs, and pruning strategies.",
  },
  "dp-basics": {
    title: "Dynamic Programming Basics",
    description:
      "Break problems into overlapping subproblems. Identify states, transitions, base cases, and iteration order.",
  },
};


