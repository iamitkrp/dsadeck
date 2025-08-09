"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

function getInitialIsDark(): boolean {
  if (typeof document === "undefined") return false;
  const ls = typeof localStorage !== "undefined" ? localStorage.getItem("theme") : null;
  if (ls === "dark") return true;
  if (ls === "light") return false;
  if (typeof window !== "undefined" && "matchMedia" in window) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(getInitialIsDark());

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      try { localStorage.setItem("theme", "dark"); } catch {}
    } else {
      root.classList.remove("dark");
      try { localStorage.setItem("theme", "light"); } catch {}
    }
  }, [isDark]);

  return (
    <Button
      size="sm"
      variant="ghost"
      className="gap-1"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      onClick={() => setIsDark((v) => !v)}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}


