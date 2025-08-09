"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function EditorPanel({
  code,
  language,
  topicTitle,
}: {
  code: string;
  language: string;
  topicTitle: string;
}) {
  const [output, setOutput] = useState<string>("");
  const [value, setValue] = useState(code);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [resultOk, setResultOk] = useState<boolean | null>(null);
  const initialRef = useRef(code);
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
  const monacoApiRef = useRef<any>(null);

  useEffect(() => {
    setValue(code);
    initialRef.current = code;
    setFeedback(null);
    setResultOk(null);
  }, [code]);

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

  async function onCheck() {
    setLoading(true);
    setFeedback(null);
    setResultOk(null);
    try {
      const resp = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, topic: topicTitle, code: value }),
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error || "Unknown error");
      setResultOk(Boolean(data.result?.correct));
      const fb = data.result?.feedback || "No feedback provided.";
      const sug = Array.isArray(data.result?.suggestions)
        ? data.result.suggestions
        : [];
      const text = [fb, ...sug.map((s: string) => `- ${s}`)].join("\n");
      setFeedback(text);
    } catch (e) {
      setFeedback((e as Error).message);
      setResultOk(false);
    } finally {
      setLoading(false);
    }
  }

  function onReset() {
    setValue(initialRef.current);
    setOutput("");
    setFeedback(null);
    setResultOk(null);
  }

  const monacoLang = language === "cpp" ? "cpp" : language === "c" ? "c" : language;
  const Monaco = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
      <div className="p-3 text-xs text-muted-foreground">Loading editor…</div>
    ),
  });
  const monacoTheme = isDarkMode ? "vs-dark" : "vs";

  function handleEditorMount(_editor: any, monaco: any) {
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

  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto]">
      <div className="flex items-center gap-2 p-2">
        <Button size="sm" variant="default" onClick={onCheck} disabled={loading}>
          {loading ? "Checking..." : "Check"}
        </Button>
        <Button size="sm" variant="secondary" onClick={onReset} disabled={loading}>
          Reset
        </Button>
      </div>
      <Separator />
      <div className="min-h-0">
        <Monaco
          height="100%"
          defaultLanguage={monacoLang}
          language={monacoLang}
          theme={monacoTheme}
          onMount={handleEditorMount}
          value={value}
          onChange={(v) => setValue(v ?? "")}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
      <Separator />
      <div className="max-h-40 overflow-auto p-3 text-xs grid gap-2">
        {output && (
          <div>
            <div className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Output</div>
            <div className="rounded-md bg-background p-2 ring-1 ring-border/60 whitespace-pre-wrap">{output}</div>
          </div>
        )}
        {feedback ? (
          <div className={resultOk ? "text-emerald-600" : "text-red-600"}>{feedback}</div>
        ) : (
          <div className="text-muted-foreground">Write or tweak the snippet, then press Check to get AI feedback.</div>
        )}
      </div>
    </div>
  );
}

export default EditorPanel;


