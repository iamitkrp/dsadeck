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
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/40 supports-[backdrop-filter]:backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] relative overflow-hidden">
      {/* glassy tint + subtle gradient */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-foreground/10 to-transparent" />
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Button size="sm" variant="ghost" onClick={onBack} className="gap-1">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div className="ml-auto" />
        <ThemeToggle />
      </div>
      {/* bottom highlight line for glass effect */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10" />
    </header>
  );
}


