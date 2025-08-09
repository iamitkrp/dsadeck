import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QUESTIONS } from "@/lib/questions-data";
import type { Question } from "@/lib/questions-types";
import Editor from "./client-editor";

function findQuestion(slug: string): Question | null {
  const all = [
    ...QUESTIONS.easy,
    ...QUESTIONS.intermediate,
    ...QUESTIONS.hard,
  ];
  return all.find((q) => q.slug === slug) ?? null;
}

export default async function QuestionDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = findQuestion(slug);
  if (!q) return notFound();

  return (
    <main className="mx-auto max-w-7xl container-padding py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{q.title}</h1>
        <div className="text-xs text-muted-foreground capitalize">{q.difficulty}</div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(320px,1fr)_2fr]">
        <Card className="h-[96dvh] overflow-hidden border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Problem</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="grid h-[calc(96dvh-4rem)] grid-rows-[auto_1fr_auto_auto] p-0">
            <div className="p-4 text-sm text-foreground/90 whitespace-pre-wrap">
              {q.statement}
            </div>
            {Array.isArray(q.examples) && q.examples.length > 0 && (
              <div className="px-4 pb-2">
                <div className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Examples</div>
                <ul className="grid gap-2 text-xs">
                  {q.examples.map((ex, i) => (
                    <li key={i} className="rounded-md bg-foreground/[0.03] p-2 ring-1 ring-border/60">
                      <div><span className="font-medium">Input:</span> {ex.input}</div>
                      <div><span className="font-medium">Output:</span> {ex.output}</div>
                      {ex.explanation && (
                        <div className="text-muted-foreground">{ex.explanation}</div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(q.constraints) && q.constraints.length > 0 && (
              <div className="px-4 pb-2">
                <div className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Constraints</div>
                <ul className="list-disc pl-5 text-xs text-foreground/90">
                  {q.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="px-4">
              <div className="flex flex-wrap gap-1.5">
                {q.tags.map((t) => (
                  <span key={t} className="rounded bg-foreground/10 px-2 py-0.5 text-[11px] text-foreground/80">{t}</span>
                ))}
              </div>
            </div>
            <div className="p-3 text-xs text-muted-foreground">Use the editor to implement your solution and press Check to get AI feedback and an estimated time complexity.</div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-0">
            <Editor question={q} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


