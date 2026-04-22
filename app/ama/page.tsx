import type { Metadata } from "next";
import Link from "next/link";
import { listSessions } from "@/lib/ama/sessions";
import { formatTimestamp } from "@/lib/ama/format";

export const metadata: Metadata = {
  title: "AMA Notes · Built with Opus 4.7",
  description:
    "Notes, highlights, quotes, and full transcripts from every AMA session during the Built with Opus 4.7 hackathon.",
};

export default function AmaIndexPage() {
  const sessions = listSessions();

  return (
    <main className="flex-1 relative z-10">
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted font-mono">
            <span className="size-1.5 rounded-full bg-accent" />
            AMAs · highlights · transcripts
          </div>
          <h1 className="mt-3 text-4xl sm:text-5xl leading-[1.05] tracking-tight font-serif-hero italic">
            <span className="text-accent not-italic">AMA</span> Notes
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] text-text-soft leading-relaxed">
            A searchable archive of every AMA session — TL;DR, topics, quotes,
            Q&amp;A, a between-the-lines read, and the full transcript with
            timestamps that jump straight to the Vimeo recording.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        {sessions.length === 0 ? (
          <div className="rounded-2xl ring-1 ring-border bg-surface-2 p-6 text-[13px] text-text-soft">
            No AMA sessions yet. Check back after the first live session.
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((s) => {
              const display = s.title.replace(/^\[.*?\]\s*/, "");
              const date = new Date(s.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              return (
                <li key={s.slug}>
                  <Link
                    href={`/ama/${s.slug}`}
                    className="group block h-full rounded-2xl bg-surface ring-1 ring-border hover:ring-border-hover hover:bg-surface-hover transition p-5"
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-muted font-mono">
                      <span className="flex items-center gap-1.5">
                        <span className="size-1 rounded-full bg-accent" />
                        {date}
                      </span>
                      <span className="tabular-nums">
                        {formatTimestamp(s.duration_seconds)}
                      </span>
                    </div>
                    <h2 className="mt-2 text-[20px] leading-snug font-serif-hero italic text-foreground group-hover:text-accent transition">
                      {display}
                    </h2>
                    {s.summary.speakers.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {s.summary.speakers.map((name) => (
                          <span
                            key={name}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-2 ring-1 ring-border text-[11px] font-mono text-text-soft"
                          >
                            <span className="size-1 rounded-full bg-accent" />
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="mt-3 text-[13px] text-text-soft leading-relaxed line-clamp-3">
                      {s.summary.tldr}
                    </p>
                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted">
                      <span className="flex items-center gap-3">
                        <span>{s.summary.topics.length} topics</span>
                        <span>·</span>
                        <span>{s.summary.quotes.length} quotes</span>
                        <span>·</span>
                        <span>{s.raw_cues.length} captions</span>
                      </span>
                      <span className="group-hover:text-foreground transition">read →</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-10 rounded-2xl ring-1 ring-border bg-surface-2 p-5 text-[13px] text-text-soft leading-relaxed">
          Live sessions for this hackathon happen daily. See the full schedule
          on{" "}
          <Link href="/details#schedule" className="text-accent hover:underline">
            Details
          </Link>
          . Recordings and notes land here shortly after each session ends.
        </div>
      </section>
    </main>
  );
}
