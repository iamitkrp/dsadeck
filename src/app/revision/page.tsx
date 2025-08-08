"use client";

import { useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type LanguageKey = "java" | "c" | "cpp" | "python" | "javascript";

type TopicKey =
  | "arrays"
  | "strings"
  | "linked-list"
  | "stack"
  | "queue"
  | "trees"
  | "graphs"
  | "sorting"
  | "searching";

type TopicInfo = {
  title: string;
  description: string;
};

const TOPICS: Record<TopicKey, TopicInfo> = {
  arrays: {
    title: "Arrays",
    description:
      "A contiguous memory structure with O(1) random access. Common ops: traversal, searching, two-pointers, sliding window.",
  },
  strings: {
    title: "Strings",
    description:
      "Sequences of characters. Patterns include frequency counting, sliding window, and hashing (e.g., Rabin–Karp).",
  },
  "linked-list": {
    title: "Linked List",
    description:
      "Nodes linked via pointers. Practice slow/fast pointers, reversal, cycle detection, merge and split operations.",
  },
  stack: {
    title: "Stack",
    description:
      "LIFO structure. Use for parentheses matching, monotonic stacks, DFS, and expression evaluation.",
  },
  queue: {
    title: "Queue",
    description:
      "FIFO structure. Variants include deque and priority queue. Use for BFS and scheduling problems.",
  },
  trees: {
    title: "Trees",
    description:
      "Hierarchical data. Practice traversals (DFS/BFS), BST properties, LCA, and tree DP.",
  },
  graphs: {
    title: "Graphs",
    description:
      "Vertices and edges. Key algorithms: BFS, DFS, Dijkstra, Toposort, Union-Find, MST.",
  },
  sorting: {
    title: "Sorting",
    description:
      "Ordering elements. Classic algorithms: Quick, Merge, Heap, Counting. Know complexities and stability.",
  },
  searching: {
    title: "Searching",
    description:
      "Find target within data. Binary search patterns, lower/upper bound, search on answer space.",
  },
};

// Code snippet mapping by topic and language
const SNIPPETS: Record<TopicKey, Record<LanguageKey, string>> = {
  arrays: {
    javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    python: `def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
    return []`,
    java: `int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (seen.containsKey(need)) return new int[]{ seen.get(need), i };
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
    c: `#include <stdio.h>
#include <stdlib.h>
// For demo: returns indices via output params, returns 1 if found
int two_sum(int* nums, int n, int target, int* a, int* b) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) { *a = i; *b = j; return 1; }
        }
    }
    return 0;
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int,int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
  },
  strings: {
    javascript: `function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const cnt = new Array(26).fill(0);
  for (const ch of a) cnt[ch.charCodeAt(0) - 97]++;
  for (const ch of b) if (--cnt[ch.charCodeAt(0) - 97] < 0) return false;
  return true;
}`,
    python: `from collections import Counter
def is_anagram(a: str, b: str) -> bool:
    return Counter(a) == Counter(b)`,
    java: `boolean isAnagram(String a, String b) {
    if (a.length() != b.length()) return false;
    int[] cnt = new int[26];
    for (char ch : a.toCharArray()) cnt[ch - 'a']++;
    for (char ch : b.toCharArray()) if (--cnt[ch - 'a'] < 0) return false;
    return true;
}`,
    c: `#include <stdbool.h>
#include <string.h>
bool is_anagram(const char* a, const char* b) {
    if (strlen(a) != strlen(b)) return false;
    int cnt[26] = {0};
    for (int i = 0; a[i]; i++) cnt[a[i]-'a']++;
    for (int i = 0; b[i]; i++) if (--cnt[b[i]-'a'] < 0) return false;
    return true;
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
bool isAnagram(string a, string b) {
    if (a.size() != b.size()) return false;
    array<int,26> cnt{};
    for (char ch : a) cnt[ch-'a']++;
    for (char ch : b) if (--cnt[ch-'a'] < 0) return false;
    return true;
}`,
  },
  "linked-list": {
    javascript: `class ListNode{constructor(v,next=null){this.val=v;this.next=next}}
function reverse(head){let prev=null,cur=head;while(cur){const nxt=cur.next;cur.next=prev;prev=cur;cur=nxt}return prev}`,
    python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev, cur = cur, nxt
    return prev`,
    java: `class ListNode { int val; ListNode next; ListNode(int v){val=v;} }
ListNode reverse(ListNode head){
    ListNode prev=null, cur=head;
    while(cur!=null){ ListNode nxt=cur.next; cur.next=prev; prev=cur; cur=nxt; }
    return prev;
}`,
    c: `typedef struct ListNode { int val; struct ListNode* next; } ListNode;
ListNode* reverse(ListNode* head){
    ListNode* prev = NULL; ListNode* cur = head;
    while(cur){ ListNode* nxt = cur->next; cur->next = prev; prev = cur; cur = nxt; }
    return prev;
}`,
    cpp: `struct ListNode{int val; ListNode* next; ListNode(int v):val(v),next(nullptr){}};
ListNode* reverse(ListNode* head){
    ListNode* prev=nullptr; ListNode* cur=head;
    while(cur){ auto nxt=cur->next; cur->next=prev; prev=cur; cur=nxt; }
    return prev;
}`,
  },
  stack: {
    javascript: `class Stack{constructor(){this.a=[]} push(x){this.a.push(x)} pop(){return this.a.pop()} peek(){return this.a[this.a.length-1]}}`,
    python: `class Stack:
    def __init__(self):
        self.a = []
    def push(self, x):
        self.a.append(x)
    def pop(self):
        return self.a.pop()
    def peek(self):
        return self.a[-1] if self.a else None`,
    java: `class StackX { private Deque<Integer> a = new ArrayDeque<>();
  void push(int x){ a.push(x);} int pop(){ return a.pop(); } Integer peek(){ return a.peek(); } }`,
    c: `// Minimal array stack demo`,
    cpp: `struct Stack{ vector<int> a; void push(int x){a.push_back(x);} int pop(){int x=a.back(); a.pop_back(); return x;} int peek(){return a.back();} };`,
  },
  queue: {
    javascript: `class Queue{constructor(){this.a=[]} enqueue(x){this.a.push(x)} dequeue(){return this.a.shift()} peek(){return this.a[0]}}`,
    python: `from collections import deque
class Queue:
    def __init__(self):
        self.a = deque()
    def enqueue(self, x):
        self.a.append(x)
    def dequeue(self):
        return self.a.popleft()
    def peek(self):
        return self.a[0] if self.a else None`,
    java: `class QueueX{ private Deque<Integer> a=new ArrayDeque<>(); void enqueue(int x){a.addLast(x);} Integer dequeue(){return a.pollFirst();} Integer peek(){return a.peekFirst();} }`,
    c: `// Minimal queue demo`,
    cpp: `struct QueueX{ deque<int> a; void enqueue(int x){a.push_back(x);} int dequeue(){int x=a.front(); a.pop_front(); return x;} int peek(){return a.front();} };`,
  },
  trees: {
    javascript: `function inorder(root){const res=[];const st=[];let cur=root;while(cur||st.length){while(cur){st.push(cur);cur=cur.left}cur=st.pop();res.push(cur.val);cur=cur.right}return res}`,
    python: `def inorder(root):
    res, st, cur = [], [], root
    while cur or st:
        while cur:
            st.append(cur)
            cur = cur.left
        cur = st.pop()
        res.append(cur.val)
        cur = cur.right
    return res`,
    java: `List<Integer> inorder(TreeNode root){ List<Integer> res = new ArrayList<>(); Deque<TreeNode> st = new ArrayDeque<>(); TreeNode cur = root; while(cur!=null || !st.isEmpty()){ while(cur!=null){ st.push(cur); cur=cur.left; } cur=st.pop(); res.add(cur.val); cur=cur.right; } return res; }`,
    c: `// Inorder iterative traversal demo`,
    cpp: `vector<int> inorder(TreeNode* root){ vector<int> res; vector<TreeNode*> st; TreeNode* cur=root; while(cur||!st.empty()){ while(cur){ st.push_back(cur); cur=cur->left;} cur=st.back(); st.pop_back(); res.push_back(cur->val); cur=cur->right;} return res; }`,
  },
  graphs: {
    javascript: `function bfs(n, adj, s){const dist=Array(n).fill(-1);const q=[s];dist[s]=0;for(let i=0;i<q.length;i++){const u=q[i];for(const v of adj[u]) if(dist[v]===-1){dist[v]=dist[u]+1;q.push(v)}}return dist}`,
    python: `from collections import deque
def bfs(n, adj, s):
    dist = [-1]*n
    q = deque([s])
    dist[s] = 0
    while q:
        u = q.popleft()
        for v in adj[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist`,
    java: `int[] bfs(int n, List<List<Integer>> adj, int s){ int[] dist=new int[n]; Arrays.fill(dist,-1); Deque<Integer> q=new ArrayDeque<>(); q.add(s); dist[s]=0; while(!q.isEmpty()){ int u=q.poll(); for(int v:adj.get(u)) if(dist[v]==-1){ dist[v]=dist[u]+1; q.add(v);} } return dist; }`,
    c: `// BFS demo`,
    cpp: `vector<int> bfs(int n, vector<vector<int>>& adj, int s){ vector<int> dist(n,-1); deque<int> q; q.push_back(s); dist[s]=0; while(!q.empty()){ int u=q.front(); q.pop_front(); for(int v:adj[u]) if(dist[v]==-1){ dist[v]=dist[u]+1; q.push_back(v);} } return dist; }`,
  },
  sorting: {
    javascript: `function mergeSort(a){if(a.length<=1) return a;const m=a.length>>1;const L=mergeSort(a.slice(0,m));const R=mergeSort(a.slice(m));let i=0,j=0,res=[];while(i<L.length&&j<R.length){res.push(L[i]<=R[j]?L[i++]:R[j++])}return res.concat(L.slice(i)).concat(R.slice(j))}`,
    python: `def merge_sort(a):
    if len(a) <= 1: return a
    m = len(a)//2
    L, R = merge_sort(a[:m]), merge_sort(a[m:])
    i = j = 0
    res = []
    while i < len(L) and j < len(R):
        if L[i] <= R[j]:
            res.append(L[i]); i += 1
        else:
            res.append(R[j]); j += 1
    return res + L[i:] + R[j:]`,
    java: `// Merge sort outline`,
    c: `// Merge sort outline`,
    cpp: `// Merge sort outline`,
  },
  searching: {
    javascript: `function binarySearch(a,x){let l=0,r=a.length-1;while(l<=r){const m=(l+r)>>1; if(a[m]===x) return m; if(a[m]<x) l=m+1; else r=m-1;} return -1;}`,
    python: `def binary_search(a, x):
    l, r = 0, len(a)-1
    while l <= r:
        m = (l+r)//2
        if a[m] == x: return m
        if a[m] < x: l = m+1
        else: r = m-1
    return -1`,
    java: `int binarySearch(int[] a, int x){ int l=0,r=a.length-1; while(l<=r){ int m=(l+r)>>>1; if(a[m]==x) return m; if(a[m]<x) l=m+1; else r=m-1; } return -1; }`,
    c: `int binary_search(int* a, int n, int x){ int l=0,r=n-1; while(l<=r){ int m=(l+r)/2; if(a[m]==x) return m; if(a[m]<x) l=m+1; else r=m-1; } return -1; }`,
    cpp: `int binarySearch(vector<int>& a, int x){ int l=0,r=(int)a.size()-1; while(l<=r){ int m=(l+r)/2; if(a[m]==x) return m; if(a[m]<x) l=m+1; else r=m-1; } return -1; }`,
  },
};

const languages: { value: LanguageKey; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
];

export default function RevisionPage() {
  const [activeTopic, setActiveTopic] = useState<TopicKey>("arrays");
  const [language, setLanguage] = useState<LanguageKey>("javascript");

  const { title, description } = TOPICS[activeTopic];
  const snippet = useMemo(() => SNIPPETS[activeTopic][language], [activeTopic, language]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">Revision</h1>
      <div className="grid gap-4 md:grid-cols-[320px_1fr]">
        <Card className="h-[70dvh] overflow-hidden border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Topics</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(70dvh-5rem)]">
              <ul className="p-2">
                {(Object.keys(TOPICS) as TopicKey[]).map((key) => (
                  <li key={key}>
                    <button
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-foreground/5 ${
                        key === activeTopic ? "bg-foreground/10" : ""
                      }`}
                      onClick={() => setActiveTopic(key)}
                    >
                      <div className="font-medium">{TOPICS[key].title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {TOPICS[key].description}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="h-[70dvh] overflow-hidden border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">{title}</CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="lang" className="text-xs text-muted-foreground">
                  Language
                </Label>
                <Select
                  value={language}
                  onValueChange={(v: LanguageKey) => setLanguage(v)}
                >
                  <SelectTrigger id="lang" className="h-8 w-[140px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {languages.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <div className="grid h-[calc(70dvh-5rem)] grid-rows-[auto_1fr]">
              <div className="p-3 text-sm text-muted-foreground">{description}</div>
              <ScrollArea className="border-t border-border/60 bg-foreground/[0.03]">
                <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                  <code>{snippet}</code>
                </pre>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


