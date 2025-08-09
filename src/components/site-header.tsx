"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/revision", label: "Revision" },
  { href: "/questions", label: "Questions" },
  { href: "/mock-test", label: "Mock Test" },
  { href: "/resources", label: "Resources" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="liquid-glass sticky top-0 z-40 w-full border-b border-border/50 bg-background/30 supports-[backdrop-filter]:backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-foreground/10 to-transparent" />
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="group inline-flex items-center gap-2">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary/90 to-primary/60 text-primary-foreground shadow-sm">
            <span className="text-sm font-bold">DS</span>
          </div>
          <span className="text-lg font-semibold tracking-tight group-hover:opacity-90">
            DSADeck
          </span>
        </Link>
        <nav className="ml-auto hidden gap-1 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground",
                pathname === item.href && "bg-foreground/10 text-foreground shadow-xs"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10" />
      </div>
    </header>
  );
}

export default SiteHeader;


