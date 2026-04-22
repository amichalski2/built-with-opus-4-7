import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { DetailsToc } from "@/components/DetailsToc";
import { getSession, listSlugs } from "@/lib/ama/sessions";
import { formatTimestamp, vimeoTimestampUrl } from "@/lib/ama/format";
import { CopyLink } from "./copy-link";
import { TranscriptBlock } from "./transcript-block";
import { TipsGrid } from "./tips-grid";

export function generateStaticParams() {
  return listSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const session = getSession(slug);
  if (!session) return { title: "Not found" };
  const desc = session.summary.tldr;
  const displayTitle = session.title.replace(/^\[.*?\]\s*/, "");
  return {
    title: `${displayTitle} · AMA Notes · Built with Opus 4.7`,
    description: desc,
    openGraph: { title: displayTitle, description: desc, type: "article" },
    twitter: { card: "summary_large_image", title: displayTitle, description: desc },
  };
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = getSession(slug);
  if (!session) notFound();

  const { summary, raw_cues: cues } = session;

  const guides = summary.feature_guides ?? [];
  const toc = [
    { id: "tldr", label: "TL;DR" },
    { id: "overview", label: "Overview" },
    ...(summary.topics.length ? [{ id: "topics", label: "Topics" }] : []),
    ...(guides.length ? [{ id: "tips", label: "Tips & guides" }] : []),
    ...(summary.surprising.length ? [{ id: "surprising", label: "Surprising" }] : []),
    ...(summary.between_the_lines.length ? [{ id: "between-the-lines", label: "Between the lines" }] : []),
    ...(summary.qa.length ? [{ id: "qa", label: "Q&A" }] : []),
    ...(summary.quotes.length ? [{ id: "quotes", label: "Quotes" }] : []),
    { id: "transcript", label: "Transcript" },
  ];

  const displayTitle = session.title.replace(/^\[.*?\]\s*/, "");
  const dateLabel = new Date(session.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="flex-1 relative z-10">
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted font-mono">
              <span className="size-1.5 rounded-full bg-accent" />
              AMA · {formatTimestamp(session.duration_seconds)} · {dateLabel}
            </div>
            <Link href="/ama" className="text-[12px] font-mono text-muted hover:text-accent transition">
              ← all AMAs
            </Link>
          </div>
          <h1 className="mt-3 text-4xl sm:text-5xl leading-[1.05] tracking-tight font-serif-hero italic">
            {displayTitle}
          </h1>
          {summary.speakers.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {summary.speakers.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface ring-1 ring-border text-[12px] font-mono text-text-soft"
                >
                  <span className="size-1.5 rounded-full bg-accent" />
                  {name}
                </span>
              ))}
            </div>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-[12px] font-mono">
            <a
              href={session.vimeo_url}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              watch on vimeo ↗
            </a>
            <span className="text-muted">password</span>
            <code className="rounded bg-surface-2 ring-1 ring-border px-2 py-0.5 text-foreground select-all">
              builtwithopus4.7
            </code>
          </div>
        </div>
      </section>

      {/* Body with TOC */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10">
          <div className="min-w-0 space-y-12">
            {/* TL;DR */}
            <section id="tldr" className="scroll-mt-20">
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted font-mono mb-3">
                tl;dr
              </div>
              <p className="text-2xl sm:text-3xl leading-snug font-serif-hero italic text-foreground border-l-2 border-accent pl-5">
                {summary.tldr}
              </p>
            </section>

            {/* Overview */}
            <section id="overview" className="scroll-mt-20">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted font-mono">
                  Overview
                </h2>
              </div>
              <p className="text-[15px] leading-relaxed text-text-soft">{summary.overview}</p>
            </section>

            {/* Topics */}
            {summary.topics.length > 0 && (
              <section id="topics" className="scroll-mt-20">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted font-mono">
                    Topics
                  </h2>
                  <span className="text-[10px] font-mono text-muted">jump to any moment</span>
                </div>
                <ol className="divide-y divide-border rounded-2xl ring-1 ring-border bg-surface overflow-hidden">
                  {summary.topics.map((t, i) => (
                    <li key={i} id={`topic-${i}`}>
                      <a
                        href={vimeoTimestampUrl(session.vimeo_url, t.timestamp)}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex gap-5 p-4 hover:bg-surface-hover transition"
                      >
                        <span className="font-mono text-[11px] text-accent pt-1 shrink-0 w-14 tabular-nums">
                          {formatTimestamp(t.timestamp)}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-medium text-[14px] text-foreground group-hover:text-accent transition">
                            {t.title}
                          </span>
                          <span className="block text-[13px] text-text-soft mt-0.5">{t.summary}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Tips & feature guides */}
            {guides.length > 0 && (
              <section id="tips" className="scroll-mt-20">
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted font-mono">
                    Tips, tricks & feature guides
                  </h2>
                  <span className="text-[10px] font-mono text-muted">{guides.length} entries</span>
                </div>
                <p className="text-[12px] text-muted mb-4 leading-relaxed max-w-xl">
                  Specifics shared in the session — commands, features, patterns, and rules
                  worth bookmarking.
                </p>
                <TipsGrid guides={guides} vimeoUrl={session.vimeo_url} />
              </section>
            )}

            {/* Surprising */}
            {summary.surprising.length > 0 && (
              <section id="surprising" className="scroll-mt-20">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted font-mono">
                    Surprising & unexpected
                  </h2>
                  <span className="text-[10px] font-mono text-muted">{summary.surprising.length} items</span>
                </div>
                <div className="space-y-3">
                  {summary.surprising.map((item, i) => (
                    <article
                      key={i}
                      id={`surprising-${i}`}
                      className="relative rounded-2xl ring-1 ring-border bg-surface p-5 pr-12 scroll-mt-20 hover:ring-border-hover transition group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="font-medium text-[15px] leading-snug text-foreground">
                          {item.insight}
                        </div>
                        {item.timestamp !== null && (
                          <a
                            href={vimeoTimestampUrl(session.vimeo_url, item.timestamp)}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-[11px] text-accent hover:underline shrink-0 pt-1 tabular-nums"
                          >
                            {formatTimestamp(item.timestamp)}
                          </a>
                        )}
                      </div>
                      <p className="text-[13px] text-muted italic leading-relaxed">
                        &ldquo;{item.evidence}&rdquo;
                      </p>
                      <div className="absolute bottom-2 right-2">
                        <CopyLink anchor={`surprising-${i}`} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Between the lines */}
            {summary.between_the_lines.length > 0 && (
              <section id="between-the-lines" className="scroll-mt-20">
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted font-mono">
                    Reading between the lines
                  </h2>
                  <span className="text-[10px] font-mono text-muted">{summary.between_the_lines.length} readings</span>
                </div>
                <p className="text-[12px] text-muted mb-4 leading-relaxed max-w-xl">
                  Opus 4.7&rsquo;s speculative reads of the transcript — subtext and signals, not
                  statements from the speakers.
                </p>
                <div className="space-y-3">
                  {summary.between_the_lines.map((item, i) => (
                    <article
                      key={i}
                      id={`btl-${i}`}
                      className="relative rounded-2xl ring-1 ring-border bg-surface p-5 pr-12 scroll-mt-20 hover:ring-border-hover transition"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="font-medium text-[15px] leading-snug text-foreground">
                          {item.reading}
                        </div>
                        {item.timestamp !== null && (
                          <a
                            href={vimeoTimestampUrl(session.vimeo_url, item.timestamp)}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-[11px] text-accent hover:underline shrink-0 pt-1 tabular-nums"
                          >
                            {formatTimestamp(item.timestamp)}
                          </a>
                        )}
                      </div>
                      <p className="text-[13px] text-muted italic leading-relaxed">
                        &ldquo;{item.evidence}&rdquo;
                      </p>
                      <div className="absolute bottom-2 right-2">
                        <CopyLink anchor={`btl-${i}`} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Q&A */}
            {summary.qa.length > 0 && (
              <section id="qa" className="scroll-mt-20">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted font-mono">
                    Questions & answers
                  </h2>
                  <span className="text-[10px] font-mono text-muted">{summary.qa.length} exchanges</span>
                </div>
                <div className="space-y-3">
                  {summary.qa.map((qa, i) => (
                    <article
                      key={i}
                      id={`qa-${i}`}
                      className="relative rounded-2xl ring-1 ring-border bg-surface p-5 pr-12 scroll-mt-20 hover:ring-border-hover transition"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="font-medium text-[15px] leading-snug text-foreground">
                          {qa.question}
                        </div>
                        <a
                          href={vimeoTimestampUrl(session.vimeo_url, qa.timestamp)}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[11px] text-accent hover:underline shrink-0 pt-1 tabular-nums"
                        >
                          {formatTimestamp(qa.timestamp)}
                        </a>
                      </div>
                      <div className="text-[13px] text-text-soft leading-relaxed">{qa.answer}</div>
                      {qa.asker && (
                        <div className="text-[11px] font-mono text-muted mt-3">asked by {qa.asker}</div>
                      )}
                      <div className="absolute bottom-2 right-2">
                        <CopyLink anchor={`qa-${i}`} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Quotes */}
            {summary.quotes.length > 0 && (
              <section id="quotes" className="scroll-mt-20">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted font-mono">
                    Quotes worth saving
                  </h2>
                </div>
                <div className="space-y-3">
                  {summary.quotes.map((q, i) => (
                    <figure
                      key={i}
                      id={`quote-${i}`}
                      className="relative rounded-2xl ring-1 ring-border bg-surface p-5 pr-12 scroll-mt-20 hover:ring-border-hover transition"
                    >
                      <blockquote className="text-[20px] leading-snug font-serif-hero italic text-foreground mb-3">
                        &ldquo;{q.text}&rdquo;
                      </blockquote>
                      <figcaption className="flex items-center justify-between text-[12px]">
                        <span className="text-text-soft font-medium">— {q.speaker}</span>
                        <a
                          href={vimeoTimestampUrl(session.vimeo_url, q.timestamp)}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[11px] text-accent hover:underline tabular-nums"
                        >
                          {formatTimestamp(q.timestamp)}
                        </a>
                      </figcaption>
                      {q.why_it_matters && (
                        <div className="text-[11px] text-muted mt-2 leading-relaxed italic">
                          {q.why_it_matters}
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2">
                        <CopyLink anchor={`quote-${i}`} />
                      </div>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* Transcript */}
            <section id="transcript" className="scroll-mt-20">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted font-mono">
                  Full transcript
                </h2>
                <span className="text-[10px] font-mono text-muted">{cues.length} captions</span>
              </div>
              <TranscriptBlock cues={cues} vimeoUrl={session.vimeo_url} />
            </section>

            {/* Footer credit */}
            <div className="pt-6 border-t border-border text-[11px] text-muted text-center font-mono uppercase tracking-[0.2em]">
              Notes generated with Claude Opus 4.7
            </div>
          </div>

          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <DetailsToc items={toc} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
