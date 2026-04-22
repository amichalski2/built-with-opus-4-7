import Link from "next/link";
import { Avatar } from "./Avatar";
import { Socials } from "./Socials";
import type { Participant, Role } from "@/lib/types";
import { bestLocation, fullName } from "@/lib/types";

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k";
  return String(n);
}

function scoreTone(score: number): string {
  if (score >= 80) return "bg-accent text-background ring-accent";
  if (score >= 60) return "bg-accent-soft text-accent ring-accent/30";
  if (score >= 35) return "bg-surface-2 text-foreground ring-border-hover";
  return "bg-surface-2 text-muted ring-border";
}

// Role-based card chrome — CSS border via padding-box/border-box gradient trick,
// so there's no height-mismatch between an outer wrapper and an inner panel
// (which was causing the pink strip at the bottom of short mentor cards).
const ROLE_CARD_STYLE: Record<Role, React.CSSProperties | undefined> = {
  participant: undefined,
  mentor: {
    border: "1.5px solid transparent",
    background:
      "linear-gradient(var(--surface), var(--surface)) padding-box, " +
      "linear-gradient(135deg, #ff9eb0 0%, #ff5277 45%, #d6256a 100%) border-box",
  },
  judge: {
    border: "1.5px solid transparent",
    background:
      "linear-gradient(var(--surface), var(--surface)) padding-box, " +
      "linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #c2720a 100%) border-box",
  },
};

const ROLE_LABEL: Record<Role, { text: string; tone: string } | null> = {
  participant: null,
  mentor: { text: "Mentor", tone: "text-[#ff3b61] ring-[#ff3b61]/40" },
  judge: { text: "Judge", tone: "text-[#c2720a] ring-[#f59e0b]/50" },
};

export function ParticipantCard({ p }: { p: Participant }) {
  const loc = bestLocation(p);
  const gh = p.github;
  const badge = ROLE_LABEL[p.role];
  const showScore = p.role === "participant" && !!gh;
  const roleStyle = ROLE_CARD_STYLE[p.role];

  const cardHref = `/p/${encodeURIComponent(p.handle)}`;

  return (
    <article
      style={roleStyle}
      className={
        "group relative block rounded-2xl p-4 h-full transition focus-within:outline-none " +
        (p.role === "participant"
          ? "bg-surface ring-1 ring-border hover:ring-border-hover hover:bg-surface-hover"
          : "hover:opacity-95")
      }
    >
      {/* Stretched-link overlay: covers the whole card so it's clickable,
          but is a sibling to (not a parent of) the Socials anchors below. */}
      <Link
        href={cardHref}
        aria-label={`View ${fullName(p)}`}
        className="absolute inset-0 rounded-2xl z-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />

      <div className="flex items-start gap-3 relative pointer-events-none">
        <Avatar participant={p} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="truncate font-semibold text-[15px]">{fullName(p)}</h3>
            {p.isOrganization && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent ring-1 ring-accent/30 rounded px-1 py-0.5">
                Org
              </span>
            )}
            {badge && (
              <span
                className={
                  "text-[10px] font-mono uppercase tracking-wider ring-1 rounded px-1.5 py-0.5 " +
                  badge.tone
                }
              >
                {badge.text}
              </span>
            )}
          </div>
          <p className="truncate text-[12px] text-muted font-mono">@{p.handle}</p>
          {loc && <p className="truncate text-[12px] text-muted mt-0.5">{loc}</p>}
        </div>
        {showScore && (
          <div
            className={
              "shrink-0 rounded-lg ring-1 px-2 py-1 text-center font-mono tabular-nums " +
              scoreTone(p.score)
            }
            title={`Score ${p.score}/100 · weighted log-sum of followers / stars / repos / contribs / PRs / reviews / tenure`}
          >
            <div className="text-[9px] uppercase tracking-wider opacity-70">Score</div>
            <div className="text-[15px] font-semibold leading-none mt-0.5">
              {Math.round(p.score)}
            </div>
          </div>
        )}
      </div>

      {p.description && (
        <p className="mt-3 text-[13px] leading-relaxed text-text-soft line-clamp-3 relative pointer-events-none">
          {p.description}
        </p>
      )}

      {gh && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] font-mono text-muted tabular-nums relative pointer-events-none">
          <span>{formatCount(gh.followers)} fol</span>
          <span>{formatCount(gh.totalStars)} ★</span>
          <span>{formatCount(gh.contributionsLastYear)} contribs·1y</span>
          <span>{formatCount(gh.totalPRs)} PRs</span>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2 relative z-10">
        <Socials s={p.socials} compact />
        <span className="text-[11px] text-muted group-hover:text-foreground transition pointer-events-none">
          view →
        </span>
      </div>
    </article>
  );
}
