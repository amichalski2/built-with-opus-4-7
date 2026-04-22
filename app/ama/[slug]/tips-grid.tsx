"use client";

import { useMemo, useState } from "react";
import { formatTimestamp, vimeoTimestampUrl } from "@/lib/ama/format";
import type { FeatureGuide } from "@/lib/ama/types";
import { CopyLink } from "./copy-link";

type Category = FeatureGuide["category"];

const CATEGORY_ORDER: Category[] = [
  "command",
  "feature",
  "pattern",
  "rule",
  "resource",
];

export function TipsGrid({
  guides,
  vimeoUrl,
}: {
  guides: FeatureGuide[];
  vimeoUrl: string;
}) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: guides.length };
    for (const g of guides) c[g.category] = (c[g.category] ?? 0) + 1;
    return c;
  }, [guides]);

  const categories = useMemo(
    () => CATEGORY_ORDER.filter((c) => (counts[c] ?? 0) > 0),
    [counts]
  );

  const visible = useMemo(
    () => (filter === "all" ? guides : guides.filter((g) => g.category === filter)),
    [guides, filter]
  );

  const toggle = (i: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="all"
          count={counts.all}
        />
        {categories.map((c) => (
          <FilterChip
            key={c}
            active={filter === c}
            onClick={() => setFilter(c)}
            label={c}
            count={counts[c]}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visible.map((g) => {
          const idx = guides.indexOf(g);
          const isOpen = openIds.has(idx);
          const hasDetails = g.details.length > 0;
          const canExpand = hasDetails || !!g.one_liner;
          return (
            <article
              key={idx}
              id={`guide-${idx}`}
              className="relative rounded-2xl ring-1 ring-border bg-surface p-5 pr-12 scroll-mt-20 hover:ring-border-hover transition flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-accent ring-1 ring-accent/30 rounded px-1.5 py-0.5">
                    {g.category}
                  </span>
                  <h3 className="font-serif-hero italic text-[18px] leading-tight text-foreground">
                    {g.name}
                  </h3>
                </div>
                {g.timestamp !== null && (
                  <a
                    href={vimeoTimestampUrl(vimeoUrl, g.timestamp)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-accent hover:underline shrink-0 pt-1 tabular-nums"
                  >
                    {formatTimestamp(g.timestamp)}
                  </a>
                )}
              </div>

              {g.quote ? (
                <blockquote className="text-[14px] italic text-text-soft leading-relaxed">
                  &ldquo;{g.quote}&rdquo;
                  {g.speaker && (
                    <span className="block text-[11px] font-mono not-italic text-muted mt-2">
                      — {g.speaker}
                    </span>
                  )}
                </blockquote>
              ) : (
                <p className="text-[14px] text-text-soft leading-relaxed">
                  {g.one_liner}
                </p>
              )}

              {/* Expandable — description (if quote is shown up top) + bullets */}
              {canExpand && (
                <>
                  <div
                    className={
                      "grid transition-[grid-template-rows] duration-300 ease-out " +
                      (isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
                    }
                  >
                    <div className="overflow-hidden">
                      <div className="pt-3 mt-3 border-t border-border space-y-3">
                        {g.quote && g.one_liner && (
                          <p className="text-[13px] text-text-soft leading-relaxed">
                            {g.one_liner}
                          </p>
                        )}
                        {hasDetails && (
                          <ul className="space-y-1.5 text-[13px] text-text-soft leading-relaxed">
                            {g.details.map((d, j) => (
                              <li key={j} className="flex gap-2">
                                <span className="text-accent shrink-0">·</span>
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                    className="mt-3 self-start text-[11px] font-mono text-muted hover:text-accent transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isOpen ? "see less" : "see more"}</span>
                    <svg
                      viewBox="0 0 12 12"
                      className={
                        "size-3 transition-transform duration-300 " +
                        (isOpen ? "rotate-180" : "")
                      }
                      aria-hidden
                    >
                      <path
                        d="M3 4.5l3 3 3-3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}

              <div className="absolute bottom-2 right-2">
                <CopyLink anchor={`guide-${idx}`} />
              </div>
            </article>
          );
        })}
      </div>

      {visible.length === 0 && (
        <div className="rounded-2xl ring-1 ring-border bg-surface-2 p-6 text-[13px] text-text-soft text-center">
          No entries in this category.
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-mono uppercase tracking-wider ring-1 transition cursor-pointer " +
        (active
          ? "bg-accent text-background ring-accent"
          : "bg-surface-2 text-text-soft ring-border hover:ring-border-hover hover:text-foreground")
      }
    >
      <span>{label}</span>
      <span
        className={
          "tabular-nums text-[10px] " +
          (active ? "opacity-80" : "text-muted")
        }
      >
        {count}
      </span>
    </button>
  );
}
