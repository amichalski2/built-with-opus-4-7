"use client";

import { useMemo, useState } from "react";
import { formatTimestamp, vimeoTimestampUrl } from "@/lib/ama/format";
import type { Cue } from "@/lib/ama/types";

export function TranscriptBlock({ cues, vimeoUrl }: { cues: Cue[]; vimeoUrl: string }) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return cues;
    const q = query.toLowerCase();
    return cues.filter((c) => c.text.toLowerCase().includes(q));
  }, [cues, query]);

  const display = expanded || query ? filtered : filtered.slice(0, 30);
  const hasMore = !expanded && !query && filtered.length > 30;

  return (
    <div className="rounded-2xl ring-1 ring-border bg-surface overflow-hidden">
      <div className="p-3.5 border-b border-border flex items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the transcript…"
          className="flex-1 bg-background ring-1 ring-border rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:ring-accent transition"
        />
        {query && (
          <span className="text-[11px] font-mono text-muted">{filtered.length} matches</span>
        )}
      </div>
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <div className="space-y-2">
          {display.map((c, i) => (
            <div key={i} className="flex gap-4 text-[13px] leading-relaxed">
              <a
                href={vimeoTimestampUrl(vimeoUrl, c.start)}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] text-muted hover:text-accent shrink-0 w-14 pt-0.5 tabular-nums"
              >
                {formatTimestamp(c.start)}
              </a>
              <span className="text-text-soft">{c.text}</span>
            </div>
          ))}
        </div>
        {hasMore && (
          <button
            onClick={() => setExpanded(true)}
            className="mt-4 text-[11px] font-mono text-accent hover:underline"
          >
            show all {filtered.length} captions ↓
          </button>
        )}
      </div>
    </div>
  );
}
