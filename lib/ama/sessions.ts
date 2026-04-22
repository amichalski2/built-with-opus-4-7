import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { AmaSession } from "./types";

const DIR = path.join(process.cwd(), "lib", "ama", "sessions");

export function listSessions(): AmaSession[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf-8")) as AmaSession)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export function getSession(slug: string): AmaSession | null {
  const file = path.join(DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as AmaSession;
}

export function listSlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}
