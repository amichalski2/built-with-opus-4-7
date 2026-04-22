"use client";

import { useState } from "react";

export function CopyLink({ anchor, className = "" }: { anchor: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  function onClick() {
    const url = `${window.location.origin}${window.location.pathname}#${anchor}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      history.replaceState(null, "", `#${anchor}`);
    });
  }

  return (
    <button
      onClick={onClick}
      aria-label={copied ? "Link copied" : "Copy link to this item"}
      className={
        "group/cl relative inline-flex items-center justify-center w-7 h-7 rounded-full text-muted hover:text-accent hover:bg-surface-hover transition " +
        (copied ? "text-accent " : "") +
        className
      }
    >
      {copied ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
          <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
        </svg>
      )}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-md bg-foreground text-background px-2 py-1 text-[10px] font-mono uppercase tracking-wider opacity-0 group-hover/cl:opacity-100 transition-opacity"
      >
        {copied ? "Copied" : "Copy link"}
      </span>
    </button>
  );
}
