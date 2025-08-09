"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { TOPICS, TOPICS_IN_ORDER } from "@/lib/revision-topics";
import { SNIPPETS } from "@/lib/revision-snippets";
import { languages, type LanguageKey, type TopicKey } from "@/lib/revision-types";
import { QUESTIONS } from "@/lib/questions-data";
import TopicSearch from "./_components/topic-search";
import Link from "next/link";
import { Copy, Link2, Star } from "lucide-react";

export default function RevisionPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // Initial state from URL or localStorage
  const initialTopic = (params.get("topic") as TopicKey) || (typeof window !== "undefined" ? (localStorage.getItem("revision:topic") as TopicKey) : undefined) || TOPICS_IN_ORDER[0];
  const initialLang = (params.get("lang") as LanguageKey) || (typeof window !== "undefined" ? (localStorage.getItem("revision:lang") as LanguageKey) : undefined) || "python";
  const [activeTopic, setActiveTopic] = useState<TopicKey>(initialTopic);
  const [language, setLanguage] = useState<LanguageKey>(initialLang);
  const [copied, setCopied] = useState(false);
  const [pinned, setPinned] = useState<Set<TopicKey>>(() => {
    try {
      const raw = localStorage.getItem("revision:pinned");
      return new Set<TopicKey>(raw ? (JSON.parse(raw) as TopicKey[]) : []);
    } catch {
      return new Set();
    }
  });

  const { title, description } = TOPICS[activeTopic];
  const snippet = useMemo(
    () => SNIPPETS[activeTopic][language],
    [activeTopic, language]
  );

  // Persist and reflect state in URL
  useEffect(() => {
    try {
      localStorage.setItem("revision:topic", activeTopic);
      localStorage.setItem("revision:lang", language);
    } catch {}
    const usp = new URLSearchParams(params?.toString());
    usp.set("topic", activeTopic);
    usp.set("lang", language);
    router.replace(`${pathname}?${usp.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTopic, language]);

  // Keyboard shortcuts: prev/next topics and copy
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement)?.closest("input, textarea, [contenteditable=true]")) return;
      if (e.key === "[" || (e.key === "ArrowUp" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setActiveTopic((t) => TOPICS_IN_ORDER[Math.max(0, TOPICS_IN_ORDER.indexOf(t) - 1)]);
      }
      if (e.key === "]" || (e.key === "ArrowDown" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setActiveTopic((t) => TOPICS_IN_ORDER[Math.min(TOPICS_IN_ORDER.length - 1, TOPICS_IN_ORDER.indexOf(t) + 1)]);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
        e.preventDefault();
        onCopySnippet();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onCopySnippet() {
    try {
      navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  function onCopyLink() {
    const url = `${location.origin}${pathname}?topic=${activeTopic}&lang=${language}`;
    try {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  function togglePin() {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(activeTopic)) next.delete(activeTopic);
      else next.add(activeTopic);
      try { localStorage.setItem("revision:pinned", JSON.stringify(Array.from(next))); } catch {}
      return next;
    });
  }

  // Related questions by topic tags
  const TOPIC_TO_TAGS: Partial<Record<TopicKey, string[]>> = {
    arrays: ["arrays", "two-pointers", "sliding-window"],
    strings: ["strings", "hashing", "two-pointers"],
    "linked-list": ["linked-list"],
    stack: ["stack", "monotonic"],
    queue: ["queue", "bfs"],
    hashing: ["hashing", "map"],
    tree: ["tree", "bst", "trees"],
    graph: ["graph", "bfs", "dfs", "topological-sort"],
    sorting: ["sorting", "intervals"],
    searching: ["binary-search", "search"],
    recursion: ["recursion"],
    "dp-basics": ["dp"],
  };
  const allQuestions = useMemo(() => ([
    ...QUESTIONS.easy,
    ...QUESTIONS.intermediate,
    ...QUESTIONS.hard,
  ]), []);
  const related = useMemo(() => {
    const tags = TOPIC_TO_TAGS[activeTopic];
    if (!tags) return [] as typeof allQuestions;
    return allQuestions.filter((q) => q.tags.some((t) => tags.includes(t))).slice(0, 6);
  }, [activeTopic, allQuestions]);

  return (
    <main className="mx-auto max-w-7xl container-padding py-6 sm:px-6">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">Revision</h1>
      <div className="grid gap-4 md:grid-cols-[minmax(260px,1fr)_2fr]">
        <Card className="h-[70dvh] overflow-hidden border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Topics</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(70dvh-5rem)]">
              <TopicSearch
                items={[
                  ...TOPICS_IN_ORDER.filter((k) => pinned.has(k)).map((k) => ({ key: k, title: `★ ${TOPICS[k].title}`, description: TOPICS[k].description })),
                  ...TOPICS_IN_ORDER.filter((k) => !pinned.has(k)).map((k) => ({ key: k, title: TOPICS[k].title, description: TOPICS[k].description })),
                ]}
                activeKey={activeTopic}
                onSelect={(key) => setActiveTopic(key as TopicKey)}
              />
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
                <button
                  type="button"
                  className="inline-flex items-center rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  title={copied ? "Copied!" : "Copy snippet"}
                  aria-label="Copy snippet"
                  onClick={onCopySnippet}
                >
                  <Copy className="size-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  title={copied ? "Copied!" : "Copy link"}
                  aria-label="Copy link"
                  onClick={onCopyLink}
                >
                  <Link2 className="size-4" />
                </button>
                <button
                  type="button"
                  className={"inline-flex items-center rounded-md px-2 py-1 text-xs " + (pinned.has(activeTopic) ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
                  title={pinned.has(activeTopic) ? "Unpin topic" : "Pin topic"}
                  aria-label="Pin topic"
                  onClick={togglePin}
                >
                  <Star className="size-4" />
                </button>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <div className="grid h-[calc(70dvh-5rem)] grid-rows-[auto_1fr_auto]">
              <div className="p-3 text-sm text-muted-foreground">{description}</div>
              <ScrollArea className="border-t border-border/60 bg-foreground/[0.03]">
                <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                  <code>{snippet}</code>
                </pre>
              </ScrollArea>
              {related.length > 0 && (
                <div className="border-t border-border/60 bg-background/50 p-3">
                  <div className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">Related questions</div>
                  <div className="grid gap-1.5">
                    {related.map((q) => (
                      <Link key={q.slug} href={`/questions/${q.slug}`} className="text-sm text-foreground/90 hover:underline">
                        {q.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


