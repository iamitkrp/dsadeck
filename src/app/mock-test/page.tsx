"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Monaco as MonacoEditorApi, OnMount } from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QUESTIONS } from "@/lib/questions-data";
import type { Difficulty, Question } from "@/lib/questions-types";
import { languages, type LanguageKey } from "@/lib/revision-types";

type Mode = "setup" | "running" | "finished";
type Pool = Difficulty | "mixed";

function sample<T>(arr: T[], k: number): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.max(0, Math.min(k, copy.length)));
}

function getPool(pool: Pool): Question[] {
  if (pool === "mixed") return [...QUESTIONS.easy, ...QUESTIONS.intermediate, ...QUESTIONS.hard];
  return QUESTIONS[pool];
}

export default function MockTestPage() {
  const [mode, setMode] = useState<Mode>("setup");
  const [pool, setPool] = useState<Pool>("mixed");
  const [questionCount, setQuestionCount] = useState<number>(6);
  const [language, setLanguage] = useState<LanguageKey>("python");
  const [durationMinutes, setDurationMinutes] = useState<number>(30);

  const available = useMemo(() => getPool(pool), [pool]);
  const maxCount = available.length;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState<number>(0);

  // Per-question state
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [correctMap, setCorrectMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  // Monaco setup
  const Monaco = useMemo(() => dynamic(() => import("@monaco-editor/react"), { ssr: false }), []);
  const monacoApiRef = useRef<MonacoEditorApi | null>(null);
  function getIsDarkFromDom(): boolean {
    const root = document.documentElement;
    const body = document.body;
    const hasDarkClass = root.classList.contains("dark") || (body && body.classList.contains("dark"));
    const hasDarkData = root.getAttribute("data-theme") === "dark" || (body && body.getAttribute("data-theme") === "dark");
    return Boolean(hasDarkClass || hasDarkData);
  }
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return getIsDarkFromDom();
    } catch {
      return false;
    }
  });
  const monacoTheme = isDarkMode ? "vs-dark" : "vs";
  const onEditorMount: OnMount = (_editor, monaco) => {
    monacoApiRef.current = monaco;
    try {
      monaco.editor.setTheme(monacoTheme);
    } catch {}
  };
  useEffect(() => {
    const apply = () => setIsDarkMode(getIsDarkFromDom());
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    if (document.body) observer.observe(document.body, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (monacoApiRef.current) {
      try {
        monacoApiRef.current.editor.setTheme(monacoTheme);
      } catch {}
    }
  }, [monacoTheme]);

  function startTest() {
    const picked = sample(available, questionCount);
    setQuestions(picked);
    setCurrent(0);
    setCodeMap({});
    setFeedbackMap({});
    setCorrectMap({});
    setFlagged({});
    const now = Date.now();
    const end = now + durationMinutes * 60_000;
    setStartedAt(now);
    setEndsAt(end);
    setRemainingMs(end - now);
    setMode("running");
  }

  useEffect(() => {
    if (mode !== "running" || !endsAt) return;
    const id = setInterval(() => {
      const left = Math.max(0, endsAt - Date.now());
      setRemainingMs(left);
      if (left === 0) setMode("finished");
    }, 1000);
    return () => clearInterval(id);
  }, [mode, endsAt]);

  const currentQ = questions[current];
  const currentSlug = currentQ?.slug ?? "";
  const currentCode = codeMap[currentSlug] ?? (currentQ?.starterCode?.[language] || "");

  async function gradeCurrent() {
    if (!currentQ) return;
    setLoading(true);
    try {
      const resp = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, topic: currentQ.title, code: currentCode }),
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error || "Unknown error");
      const r = data.result || {};
      const lines: string[] = [];
      if (typeof r.correct === "boolean") lines.push(r.correct ? "Correct ✅" : "Not quite. ❌");
      if (r.feedback) lines.push(String(r.feedback));
      if (Array.isArray(r.suggestions)) for (const s of r.suggestions) lines.push(`- ${s}`);
      setFeedbackMap((m) => ({ ...m, [currentSlug]: lines.join("\n") }));
      if (typeof r.correct === "boolean") setCorrectMap((m) => ({ ...m, [currentSlug]: Boolean(r.correct) }));
    } catch (e) {
      setFeedbackMap((m) => ({ ...m, [currentSlug]: (e as Error).message }));
    } finally {
      setLoading(false);
    }
  }

  function finishNow() {
    setMode("finished");
  }

  function formatTime(ms: number) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  }

  return (
    <main className="mx-auto max-w-7xl container-padding py-6 sm:px-6">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">Mock Test</h1>

      {mode === "setup" && (
        <Card className="border-border/60">
          <CardHeader className="pb-3"><CardTitle className="text-base">Configure your test</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <span className="text-sm text-muted-foreground">Pool</span>
                <Select value={pool} onValueChange={(v: Pool) => setPool(v)}>
                  <SelectTrigger className="h-9 w-full sm:w-[240px]"><SelectValue placeholder="Pool" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <span className="text-sm text-muted-foreground">Questions</span>
                <Input type="number" value={questionCount} min={1} max={maxCount} onChange={(e) => setQuestionCount(Math.max(1, Math.min(maxCount, Number(e.target.value) || 1)))} className="h-9 w-full sm:w-[140px]" />
                <div className="text-[11px] text-muted-foreground">Max for this pool: {maxCount}</div>
              </div>
              <div className="grid gap-2">
                <span className="text-sm text-muted-foreground">Language</span>
                <Select value={language} onValueChange={(v: LanguageKey) => setLanguage(v)}>
                  <SelectTrigger className="h-9 w-full sm:w-[200px]"><SelectValue placeholder="Language" /></SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <span className="text-sm text-muted-foreground">Duration (min)</span>
                <Input type="number" value={durationMinutes} min={5} max={180} onChange={(e) => setDurationMinutes(Math.max(5, Math.min(180, Number(e.target.value) || 30)))} className="h-9 w-full sm:w-[140px]" />
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={startTest}>Start test</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "running" && (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Time left: {formatTime(remainingMs)}</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <ScrollArea className="h-[70dvh]">
                <ul className="p-3 grid gap-2">
                  {questions.map((q, idx) => {
                    const slug = q.slug;
                    const isActive = idx === current;
                    const status = correctMap[slug];
                    return (
                      <li key={slug}>
                        <button
                          className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${isActive ? "bg-foreground/10" : "hover:bg-foreground/5"}`}
                          onClick={() => setCurrent(idx)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium">Q{idx + 1}. {q.title}</span>
                            {typeof status === "boolean" && (
                              <span className={`text-xs ${status ? "text-emerald-600" : "text-red-600"}`}>{status ? "Correct" : "Try again"}</span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground capitalize">{q.difficulty}</div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
              <div className="p-3 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setFlagged((m) => ({ ...m, [currentSlug]: !m[currentSlug] }))}>
                  {flagged[currentSlug] ? "Unflag" : "Flag"}
                </Button>
                <Button size="sm" variant="destructive" onClick={finishNow}>Finish test</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{currentQ?.title}</CardTitle>
                <div className="text-xs text-muted-foreground">{current + 1} / {questions.length}</div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <div className="grid h-[75dvh] grid-rows-[auto_1fr_auto]">
                <div className="p-3 text-sm text-muted-foreground">
                  Write your solution below and press Check to get feedback.
                </div>
                <div className="min-h-0">
                  <Monaco
                    height="100%"
                    defaultLanguage={language === "cpp" ? "cpp" : language === "c" ? "c" : language}
                    language={language === "cpp" ? "cpp" : language === "c" ? "c" : language}
                    theme={monacoTheme}
                    onMount={onEditorMount}
                    value={currentCode}
                    onChange={(v) => setCodeMap((m) => ({ ...m, [currentSlug]: v ?? "" }))}
                    options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true, scrollBeyondLastLine: false, lineNumbers: "on" }}
                  />
                </div>
                <div className="grid gap-2 p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={gradeCurrent} disabled={loading || !currentQ}>{loading ? "Checking…" : "Check"}</Button>
                    <Button size="sm" variant="secondary" onClick={() => setCodeMap((m) => ({ ...m, [currentSlug]: currentQ?.starterCode?.[language] || "" }))}>Reset</Button>
                  </div>
                  {feedbackMap[currentSlug] && (
                    <div className="rounded-md bg-background ring-1 ring-border/60 p-2 whitespace-pre-wrap max-h-40 overflow-auto">
                      {feedbackMap[currentSlug]}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {mode === "finished" && (
        <Card className="border-border/60">
          <CardHeader className="pb-3"><CardTitle className="text-base">Results</CardTitle></CardHeader>
          <CardContent>
            <div className="text-sm">Score: {Object.values(correctMap).filter(Boolean).length} / {questions.length}</div>
            <div className="mt-3 grid gap-2">
              {questions.map((q, i) => (
                <div key={q.slug} className="rounded-md border border-border/60 p-3">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="font-medium">Q{i + 1}. {q.title}</div>
                    <div className={`text-xs ${correctMap[q.slug] ? "text-emerald-600" : "text-red-600"}`}>{correctMap[q.slug] ? "Correct" : "Not correct"}</div>
                  </div>
                  {feedbackMap[q.slug] && (
                    <div className="mt-2 text-xs whitespace-pre-wrap text-muted-foreground">{feedbackMap[q.slug]}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => setMode("setup")}>Create new test</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}


