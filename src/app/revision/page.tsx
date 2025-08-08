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
import { TOPICS, TOPICS_IN_ORDER } from "@/lib/revision-topics";
import { SNIPPETS } from "@/lib/revision-snippets";
import { languages, type LanguageKey, type TopicKey } from "@/lib/revision-types";

export default function RevisionPage() {
  const [activeTopic, setActiveTopic] = useState<TopicKey>(TOPICS_IN_ORDER[0]);
  const [language, setLanguage] = useState<LanguageKey>("python");

  const { title, description } = TOPICS[activeTopic];
  const snippet = useMemo(
    () => SNIPPETS[activeTopic][language],
    [activeTopic, language]
  );

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
                {TOPICS_IN_ORDER.map((key) => (
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


