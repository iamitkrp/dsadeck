import type { LanguageKey, TopicKey } from "./revision-types";

// Each snippet is a complete, minimal program/function for quick copy-paste.
export const SNIPPETS: Record<TopicKey, Record<LanguageKey, string>> = {
  basics: {
    javascript: `// Hello World
console.log('Hello, DSADeck!');`,
    python: `# Hello World
print('Hello, DSADeck!')`,
    java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, DSADeck!");
  }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main(){
  cout << "Hello, DSADeck!\n";
  return 0;
}`,
    c: `#include <stdio.h>
int main(){
  printf("Hello, DSADeck!\n");
  return 0;
}`,
  },
  "data-types": {
    javascript: `// Numbers, strings, booleans
let n = 42; const s = 'abc'; const ok = true;`,
    python: `n = 42; s = 'abc'; ok = True`,
    java: `int n = 42; String s = "abc"; boolean ok = true;`,
    cpp: `int n = 42; string s = "abc"; bool ok = true;`,
    c: `int n = 42; char s[] = "abc"; _Bool ok = 1;`,
  },
  operators: {
    javascript: `const a = 5, b = 2; const sum = a + b; const eq = a === b;`,
    python: `a, b = 5, 2; s = a + b; eq = (a == b)`,
    java: `int a = 5, b = 2; int s = a + b; boolean eq = (a == b);`,
    cpp: `int a = 5, b = 2; int s = a + b; bool eq = (a == b);`,
    c: `int a = 5, b = 2; int s = a + b; int eq = (a == b);`,
  },
  conditionals: {
    javascript: `const x = 10; if (x > 5) console.log('big'); else console.log('small');`,
    python: `x = 10
print('big' if x > 5 else 'small')`,
    java: `int x = 10; System.out.println(x > 5 ? "big" : "small");`,
    cpp: `int x = 10; cout << (x > 5 ? "big" : "small");`,
    c: `int x = 10; printf("%s", x > 5 ? "big" : "small");`,
  },
  loops: {
    javascript: `for (let i = 0; i < 3; i++) console.log(i);`,
    python: `for i in range(3):
    print(i)`,
    java: `for (int i = 0; i < 3; i++) System.out.println(i);`,
    cpp: `for (int i = 0; i < 3; i++) cout << i << "\n";`,
    c: `for (int i = 0; i < 3; i++) printf("%d\n", i);`,
  },
  functions: {
    javascript: `function add(a, b) { return a + b; }`,
    python: `def add(a, b):
    return a + b`,
    java: `int add(int a, int b) { return a + b; }`,
    cpp: `int add(int a, int b){ return a + b; }`,
    c: `int add(int a, int b){ return a + b; }`,
  },
  recursion: {
    javascript: `function fact(n){ if(n<=1) return 1; return n*fact(n-1); }`,
    python: `def fact(n):
    return 1 if n <= 1 else n * fact(n-1)`,
    java: `int fact(int n){ return n<=1 ? 1 : n*fact(n-1); }`,
    cpp: `int fact(int n){ return n<=1 ? 1 : n*fact(n-1); }`,
    c: `int fact(int n){ return n<=1 ? 1 : n*fact(n-1); }`,
  },
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
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int,int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
    c: `// Brute force for clarity
int two_sum(int* nums, int n, int target, int* a, int* b) {
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (nums[i] + nums[j] == target) { *a = i; *b = j; return 1; }
    return 0;
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
    cpp: `bool isAnagram(string a, string b) {
    if (a.size() != b.size()) return false;
    array<int,26> cnt{};
    for (char ch : a) cnt[ch-'a']++;
    for (char ch : b) if (--cnt[ch-'a'] < 0) return false;
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
  },
  "pointers-references": {
    javascript: `// Objects are passed by reference to the object (value of reference)
const a = { x: 1 }; const b = a; b.x = 2; console.log(a.x); // 2`,
    python: `# Names bind to objects; lists are mutable and referenced
a = [1,2]; b = a; b[0] = 9; print(a[0])  # 9`,
    java: `class Box{int x;} void demo(){ Box a=new Box(); a.x=1; Box b=a; b.x=2; System.out.println(a.x); }`,
    cpp: `int x=1; int* p=&x; *p=2; // x becomes 2`,
    c: `int x=1; int* p=&x; *p=2; // x becomes 2`,
  },
  "structures-classes": {
    javascript: `class Point { constructor(x,y){ this.x=x; this.y=y; } }`,
    python: `class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y`,
    java: `class Point { int x, y; Point(int x,int y){ this.x=x; this.y=y; } }`,
    cpp: `struct Point{ int x,y; Point(int x,int y):x(x),y(y){} };`,
    c: `typedef struct { int x,y; } Point;`,
  },
  oop: {
    javascript: `class Animal{ speak(){ console.log('...'); } } class Dog extends Animal{ speak(){ console.log('woof'); } }`,
    python: `class Animal:
    def speak(self): print('...')
class Dog(Animal):
    def speak(self): print('woof')`,
    java: `class Animal{ void speak(){ System.out.println("..."); } } class Dog extends Animal{ @Override void speak(){ System.out.println("woof"); } }`,
    cpp: `struct Animal{ virtual void speak(){ cout<<"...\n"; } }; struct Dog:Animal{ void speak() override { cout<<"woof\n"; } };`,
    c: `// C lacks OOP; use function pointers in structs to emulate when needed`,
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
    cpp: `struct ListNode{int val; ListNode* next; ListNode(int v):val(v),next(nullptr){}};
ListNode* reverse(ListNode* head){
    ListNode* prev=nullptr; ListNode* cur=head;
    while(cur){ auto nxt=cur->next; cur->next=prev; prev=cur; cur=nxt; }
    return prev;
}`,
    c: `typedef struct ListNode { int val; struct ListNode* next; } ListNode;
ListNode* reverse(ListNode* head){
    ListNode* prev = NULL; ListNode* cur = head;
    while(cur){ ListNode* nxt = cur->next; cur->next = prev; prev = cur; cur = nxt; }
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
    cpp: `struct Stack{ vector<int> a; void push(int x){a.push_back(x);} int pop(){int x=a.back(); a.pop_back(); return x;} int peek(){return a.back();} };`,
    c: `// Minimal array stack demo`,
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
    cpp: `struct QueueX{ deque<int> a; void enqueue(int x){a.push_back(x);} int dequeue(){int x=a.front(); a.pop_front(); return x;} int peek(){return a.front();} };`,
    c: `// Minimal queue demo`,
  },
  hashing: {
    javascript: `function firstDuplicate(nums){const seen=new Set();for(const x of nums){if(seen.has(x)) return x; seen.add(x);} return -1;}`,
    python: `def first_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen: return x
        seen.add(x)
    return -1`,
    java: `Integer firstDuplicate(int[] a){ Set<Integer> s=new HashSet<>(); for(int x:a){ if(!s.add(x)) return x; } return -1; }`,
    cpp: `int firstDuplicate(const vector<int>& a){ unordered_set<int> s; for(int x:a){ if(s.count(x)) return x; s.insert(x);} return -1; }`,
    c: `// Use a boolean array or hash table depending on constraints`,
  },
  tree: {
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
    cpp: `vector<int> inorder(TreeNode* root){ vector<int> res; vector<TreeNode*> st; TreeNode* cur=root; while(cur||!st.empty()){ while(cur){ st.push_back(cur); cur=cur->left;} cur=st.back(); st.pop_back(); res.push_back(cur->val); cur=cur->right;} return res; }`,
    c: `// Inorder iterative traversal demo`,
  },
  graph: {
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
    cpp: `vector<int> bfs(int n, vector<vector<int>>& adj, int s){ vector<int> dist(n,-1); deque<int> q; q.push_back(s); dist[s]=0; while(!q.empty()){ int u=q.front(); q.pop_front(); for(int v:adj[u]) if(dist[v]==-1){ dist[v]=dist[u]+1; q.push_back(v);} } return dist; }`,
    c: `// BFS demo`,
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
    cpp: `// Merge sort outline`,
    c: `// Merge sort outline`,
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
    cpp: `int binarySearch(vector<int>& a, int x){ int l=0,r=(int)a.size()-1; while(l<=r){ int m=(l+r)/2; if(a[m]==x) return m; if(a[m]<x) l=m+1; else r=m-1; } return -1; }`,
    c: `int binary_search(int* a, int n, int x){ int l=0,r=n-1; while(l<=r){ int m=(l+r)/2; if(a[m]==x) return m; if(a[m]<x) l=m+1; else r=m-1; } return -1; }`,
  },
  "dp-basics": {
    javascript: `// Fibonacci (bottom-up DP)
function fib(n){
  if(n<=1) return n;
  const dp = new Array(n+1).fill(0);
  dp[1] = 1;
  for(let i=2;i<=n;i++) dp[i]=dp[i-1]+dp[i-2];
  return dp[n];
}`,
    python: `def fib(n):
    if n <= 1: return n
    dp = [0]*(n+1)
    dp[1] = 1
    for i in range(2, n+1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`,
    java: `int fib(int n){ if(n<=1) return n; int[] dp=new int[n+1]; dp[1]=1; for(int i=2;i<=n;i++) dp[i]=dp[i-1]+dp[i-2]; return dp[n]; }`,
    cpp: `int fib(int n){ if(n<=1) return n; vector<int> dp(n+1); dp[1]=1; for(int i=2;i<=n;i++) dp[i]=dp[i-1]+dp[i-2]; return dp[n]; }`,
    c: `int fib(int n){ if(n<=1) return n; int* dp = (int*)calloc(n+1,sizeof(int)); dp[1]=1; for(int i=2;i<=n;i++) dp[i]=dp[i-1]+dp[i-2]; int ans=dp[n]; free(dp); return ans; }`,
  },
};


