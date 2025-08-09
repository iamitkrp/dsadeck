import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Code2, Brain, Timer } from "lucide-react";

const sections = [
  {
    key: "revision",
    title: "Revision",
    description: "Quickly revise core DSA topics with ready snippets.",
    href: "/revision",
    comingSoon: false,
  },
  {
    key: "questions",
    title: "Questions",
    description: "Practice curated questions by topic and difficulty.",
    href: "/questions",
    comingSoon: false,
  },
  {
    key: "mock-test",
    title: "Mock Test",
    description: "Timed assessments to simulate interview rounds.",
    href: "/mock-test",
    comingSoon: false,
  },
  {
    key: "resources",
    title: "Resources",
    description: "Cheatsheets, notes, and recommended readings.",
    href: "/resources",
    comingSoon: true,
  },
];

export default function Home() {
  return (
    <main className="relative mx-auto min-h-[calc(100dvh-3rem)] max-w-7xl px-4 py-10 sm:px-6">
      {/* Page content only; background provided globally in layout */}

      <section className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="text-balance bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          Level up your DSA with DSADeck
        </h1>
        <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
          A clean, focused platform to revise essentials, practice questions, and get interview‑ready with AI‑powered feedback.
        </p>
      </section>

      {/* Primary sections */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <Card
            key={section.key}
            className="group relative overflow-hidden border-border/60 bg-background/60 shadow-sm ring-1 ring-inset ring-border/60 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            {/* subtle corner accent */}
            <div className="absolute right-[-30px] top-[-30px] h-24 w-24 rotate-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 blur-xl transition-opacity group-hover:opacity-80" />
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="font-semibold">{section.title}</span>
                {section.comingSoon && (
                  <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground/80">
                    Coming Soon
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="min-h-12 text-sm text-muted-foreground">
                {section.description}
              </p>
              <div className="mt-4">
                {section.comingSoon ? (
                  <span className="cursor-not-allowed text-sm text-muted-foreground">
                    Stay tuned
                  </span>
                ) : (
                  <Link
                    href={section.href}
                    className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/15"
                  >
                    Open
                    <span aria-hidden>→</span>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* What is DSADeck? */}
      <section className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3">
        <Card className="border-border/60 bg-background/70 ring-1 ring-inset ring-border/60">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><BookOpen className="size-4"/>Revision first</CardTitle></CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">Short, language‑switchable snippets for core topics so you can refresh syntax and patterns before diving into problems.</CardContent>
        </Card>
        <Card className="border-border/60 bg-background/70 ring-1 ring-inset ring-border/60">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Code2 className="size-4"/>Practice with code</CardTitle></CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">Built‑in Monaco editor to write and iterate quickly. Hints and reference solutions are available when you get stuck.</CardContent>
        </Card>
        <Card className="border-border/60 bg-background/70 ring-1 ring-inset ring-border/60">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Brain className="size-4"/>AI feedback</CardTitle></CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">Instant guidance on correctness plus time & space complexity estimates powered by Gemini. Learn the reasoning behind each suggestion.</CardContent>
        </Card>
      </section>

      {/* Roadmap / CTA */}
      <section className="mx-auto mt-10 max-w-5xl rounded-2xl border border-border/60 bg-foreground/[.03] p-6 text-center">
        <div className="grid gap-2 sm:grid-cols-3 sm:text-left">
          <div className="text-sm text-muted-foreground">
            <div className="mb-1 flex items-center gap-2 font-medium text-foreground"><Timer className="size-4"/>Mock tests (coming)</div>
            Timed rounds to simulate interviews with curated question pools.
          </div>
          <div className="text-sm text-muted-foreground">
            <div className="mb-1 font-medium text-foreground">Multi‑language</div>
            Code in Python, JavaScript, Java, C++ or C with one‑click switching.
          </div>
          <div className="text-sm text-muted-foreground">
            <div className="mb-1 font-medium text-foreground">Zero setup</div>
            Everything runs in the browser. No local toolchain required.
          </div>
        </div>
        <div className="mt-5">
          <Link href="/questions" className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">
            Start practicing <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
