export function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function vimeoTimestampUrl(vimeoUrl: string, seconds: number): string {
  const t = Math.floor(seconds);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const frag = [h > 0 ? `${h}h` : "", m > 0 ? `${m}m` : "", `${s}s`].join("");
  const [base] = vimeoUrl.split("#");
  return `${base}#t=${frag}`;
}
