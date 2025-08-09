"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QUESTIONS } from "@/lib/questions-data";
import type { Difficulty, Question } from "@/lib/questions-types";

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "intermediate", label: "Intermediate" },
  { value: "hard", label: "Hard" },
];

export default function QuestionsPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [count, setCount] = useState<number>(QUESTIONS["easy"].length);
  const [query, setQuery] = useState<string>("");

  const all = QUESTIONS[difficulty];
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? all.filter((x) =>
          x.title.toLowerCase().includes(q) ||
          x.tags.some((t) => t.toLowerCase().includes(q))
        )
      : all;
    return filtered.slice(0, Math.max(1, Math.min(all.length, count)));
  }, [all, query, count]);

  const defaultCountForDifficulty = all.length;

  return (
    <main className="mx-auto max-w-5xl container-padding py-6 sm:px-6">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">Questions</h1>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Difficulty</span>
              <Select value={difficulty} onValueChange={(v: Difficulty) => setDifficulty(v)}>
                <SelectTrigger className="h-8 w-[160px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyOptions.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Count</span>
              <Input
                value={count}
                onChange={(e) => setCount(Number(e.target.value) || 0)}
                className="h-8 w-24"
                type="number"
                min={1}
                max={all.length}
              />
              <Button size="sm" variant="secondary" onClick={() => setCount(defaultCountForDifficulty)}>Reset</Button>
            </div>
            <div className="flex-1" />
            <Input
              placeholder="Search title or tag..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-2">
        {list.map((q: Question) => (
          <Link
            key={q.slug}
            href={`/questions/${q.slug}`}
            className="rounded-lg border border-border/60 bg-background/60 p-3 transition hover:bg-foreground/5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-medium">{q.title}</div>
              <div className="text-xs text-muted-foreground">{q.difficulty}</div>
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {q.tags.map((t) => (
                <span key={t} className="rounded bg-foreground/10 px-2 py-0.5 text-[11px] text-foreground/80">{t}</span>
              ))}
            </div>
          </Link>
        ))}
        {list.length === 0 && (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No questions match your filters.
          </div>
        )}
      </div>
    </main>
  );
}


