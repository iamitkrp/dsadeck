"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";

export default function BackBar() {
  const router = useRouter();
  const pathname = usePathname();

  const canGoBack = typeof window !== "undefined" && window.history.length > 1;

  function onBack() {
    if (canGoBack) router.back();
    else router.push("/");
  }

  // Hide the bar on the home page for a cleaner landing
  const hide = pathname === "/";

  if (hide) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Button size="sm" variant="ghost" onClick={onBack} className="gap-1">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div className="ml-auto" />
        <ThemeToggle />
      </div>
    </header>
  );
}


