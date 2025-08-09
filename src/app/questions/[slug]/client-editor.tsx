"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Monaco as MonacoEditorApi, OnMount } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Question } from "@/lib/questions-types";
import { languages, type LanguageKey } from "@/lib/revision-types";

const Monaco = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="p-3 text-xs text-muted-foreground">Loading editor…</div>,
});

export default function ClientEditor({ question }: { question: Question }) {
  const [language, setLanguage] = useState<LanguageKey>("python");
  const [value, setValue] = useState<string>(question.starterCode[language] || "");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [complexity, setComplexity] = useState<string | null>(null);
  const [complexityWhy, setComplexityWhy] = useState<string | null>(null);
  const [spaceComplexity, setSpaceComplexity] = useState<string | null>(null);
  const [spaceWhy, setSpaceWhy] = useState<string | null>(null);
  const [hintStep, setHintStep] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  function getIsDarkFromDom(): boolean {
    const root = document.documentElement;
    const body = document.body;
    const hasDarkClass = root.classList.contains("dark") || (body && body.classList.contains("dark"));
    const hasDarkData = root.getAttribute("data-theme") === "dark" || (body && body.getAttribute("data-theme") === "dark");
    return Boolean(hasDarkClass || hasDarkData);
  }
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try { return getIsDarkFromDom(); } catch { return false; }
  });
  const monacoApiRef = useRef<MonacoEditorApi | null>(null);

  const monacoLang = useMemo(() => (language === "cpp" ? "cpp" : language === "c" ? "c" : language), [language]);
  const monacoTheme = isDarkMode ? "vs-dark" : "vs";

  // Keep Monaco theme in sync with app/theme
  useEffect(() => {
    const apply = () => setIsDarkMode(getIsDarkFromDom());
    apply();

    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    if (document.body) {
      observer.observe(document.body, { attributes: true, attributeFilter: ["class", "data-theme"] });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleEditorMount: OnMount = (_editor, monaco) => {
    monacoApiRef.current = monaco;
    try {
      monaco.editor.setTheme(monacoTheme);
    } catch {}
  }

  useEffect(() => {
    if (monacoApiRef.current) {
      try {
        monacoApiRef.current.editor.setTheme(monacoTheme);
      } catch {}
    }
  }, [monacoTheme]);

  function onLanguageChange(v: LanguageKey) {
    setLanguage(v);
    setValue(question.starterCode[v] || "");
    setFeedback(null);
    setComplexity(null);
    setComplexityWhy(null);
    setSpaceComplexity(null);
    setSpaceWhy(null);
  }

  async function onCheck() {
    setLoading(true);
    setFeedback(null);
    setComplexity(null);
    setComplexityWhy(null);
    try {
      const resp = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, topic: question.title, code: value }),
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error || "Unknown error");
      const r = data.result || {};
      const lines: string[] = [];
      if (typeof r.correct === "boolean") {
        lines.push(r.correct ? "Correct ✅" : "Not quite. ❌");
      }
      if (r.feedback) lines.push(String(r.feedback));
      if (Array.isArray(r.suggestions)) {
        for (const s of r.suggestions) lines.push(`- ${s}`);
      }
      setFeedback(lines.join("\n"));
      if (r.timeComplexity) setComplexity(String(r.timeComplexity));
      if (r.complexityReason) setComplexityWhy(String(r.complexityReason));
      if (r.spaceComplexity) setSpaceComplexity(String(r.spaceComplexity));
      if (r.spaceReason) setSpaceWhy(String(r.spaceReason));
    } catch (e) {
      setFeedback((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function onReset() {
    setValue(question.starterCode[language] || "");
    setFeedback(null);
    setComplexity(null);
    setComplexityWhy(null);
    setSpaceComplexity(null);
    setSpaceWhy(null);
    setHintStep(0);
    setShowSolution(false);
  }

  const currentSolution = question.solution[language] || "Solution not provided for this language.";
  const shownHints = question.hints.slice(0, Math.max(0, Math.min(question.hints.length, hintStep)));

  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto]">
      <div className="flex flex-wrap items-center gap-2 px-2 py-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Language</span>
          <Select value={language} onValueChange={(v: LanguageKey) => onLanguageChange(v)}>
            <SelectTrigger className="h-8 w-[140px]"><SelectValue placeholder="Language" /></SelectTrigger>
            <SelectContent align="start">
              {languages.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={onCheck} disabled={loading}>{loading ? "Checking…" : "Check"}</Button>
        <Button size="sm" variant="secondary" onClick={onReset} disabled={loading}>Reset</Button>
        <div className="ml-auto" />
      </div>
      <div className="grid grid-rows-[auto_auto_auto] min-h-0">
        <div className="px-3 pb-3 text-xs text-muted-foreground">
          Write code and press Check to receive AI feedback and time complexity estimate.
        </div>
        <div className="h-[85dvh]">
          <Monaco
            height="100%"
            defaultLanguage={monacoLang}
            language={monacoLang}
            theme={monacoTheme}
            onMount={handleEditorMount}
            value={value}
            onChange={(v) => setValue(v ?? "")}
            options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true, scrollBeyondLastLine: false, lineNumbers: "on" }}
          />
        </div>
        {feedback ? (
          <>
            <div className="h-2" />
            <Separator />
            <div className="p-3">
              <div className="rounded-md bg-background ring-1 ring-border/60 p-2 text-xs whitespace-pre-wrap break-words overflow-auto max-h-[34dvh]">
                {feedback}
              </div>
              <div className="mt-2 grid gap-1 text-[11px] text-muted-foreground">
                {complexity && (
                  <span className="rounded bg-foreground/10 px-2 py-0.5 text-foreground">Time: {complexity}{complexityWhy ? ` – ${complexityWhy}` : ""}</span>
                )}
                {spaceComplexity && (
                  <span className="rounded bg-foreground/10 px-2 py-0.5 text-foreground">Space: {spaceComplexity}{spaceWhy ? ` – ${spaceWhy}` : ""}</span>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="h-2" />
        )}
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-3 p-2 md:grid-cols-2">
        <div>
          <div className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Hints</div>
          {shownHints.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-xs">
              {shownHints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          ) : (
            <div className="text-xs text-muted-foreground">No hint revealed yet.</div>
          )}
          {hintStep < question.hints.length && (
            <Button size="sm" variant="ghost" className="mt-2" onClick={() => setHintStep(hintStep + 1)}>Reveal next hint</Button>
          )}
        </div>
        <div>
          <div className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Solution</div>
          {showSolution ? (
            <pre className="overflow-x-auto rounded-md bg-background p-3 ring-1 ring-border/60 text-xs"><code>{currentSolution}</code></pre>
          ) : (
            <div className="text-xs text-muted-foreground">Click show to reveal the reference solution for the selected language.</div>
          )}
          <Button size="sm" variant="ghost" className="mt-2" onClick={() => setShowSolution((v) => !v)}>
            {showSolution ? "Hide solution" : "Show solution"}
          </Button>
        </div>
      </div>
    </div>
  );
}


