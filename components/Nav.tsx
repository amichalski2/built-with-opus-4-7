"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const LINKS: { href: string; label: string; match: (p: string) => boolean }[] = [
  { href: "/", label: "People", match: (p) => p === "/" || p.startsWith("/p/") },
  { href: "/ama", label: "AMA Notes", match: (p) => p.startsWith("/ama") },
  { href: "/resources", label: "Resources", match: (p) => p.startsWith("/resources") },
  { href: "/details", label: "Details", match: (p) => p.startsWith("/details") },
];

export function Nav() {
  const pathname = usePathname() ?? "/";
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border">
      <div className="mx-auto max-w-[1480px] px-6 h-14 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[13px] font-mono shrink-0 hover:text-accent transition"
        >
          <span className="size-2 rounded-full bg-accent" />
          <span className="font-semibold">built-with-opus-4-7</span>
        </Link>

        <nav className="no-scrollbar flex-1 flex items-center justify-end gap-1 overflow-x-auto">
          {LINKS.map((l) => {
            const active = l.match(pathname);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  "relative whitespace-nowrap text-[13px] px-3 py-1.5 rounded-lg transition " +
                  (active
                    ? "text-foreground"
                    : "text-muted hover:text-foreground")
                }
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[11px] h-[2px] bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
