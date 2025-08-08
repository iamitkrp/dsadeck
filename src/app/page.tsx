import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    comingSoon: true,
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
    <main className="mx-auto min-h-[calc(100dvh-4rem)] max-w-7xl px-4 py-10 sm:px-6">
      <section className="mx-auto mb-8 max-w-3xl text-center">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Level up your DSA with DSADeck
        </h1>
        <p className="mt-3 text-pretty text-sm text-muted-foreground sm:text-base">
          A clean, focused platform to revise essentials and get interview‑ready.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <Card
            key={section.key}
            className="relative overflow-hidden border-border/60 bg-background/60 shadow-sm ring-1 ring-inset ring-border/60 transition hover:translate-y-[-2px] hover:shadow-md"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>{section.title}</span>
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
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Open
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
