export type Cue = {
  start: number;
  end: number;
  text: string;
};

export type TopicMarker = {
  timestamp: number;
  title: string;
  summary: string;
};

export type QAPair = {
  timestamp: number;
  question: string;
  answer: string;
  asker?: string;
};

export type Quote = {
  timestamp: number;
  speaker: string;
  text: string;
  why_it_matters: string;
};

export type InsightItem = {
  timestamp: number | null;
  insight: string;
  evidence: string;
};

export type BetweenLines = {
  timestamp: number | null;
  reading: string;
  evidence: string;
};

export type FeatureGuide = {
  timestamp: number | null;
  name: string;
  category: "command" | "feature" | "pattern" | "rule" | "resource";
  one_liner: string;
  details: string[];
  speaker?: string;
  quote?: string;
};

export type Summary = {
  tldr: string;
  overview: string;
  speakers: string[];
  topics: TopicMarker[];
  qa: QAPair[];
  quotes: Quote[];
  surprising: InsightItem[];
  between_the_lines: BetweenLines[];
  feature_guides?: FeatureGuide[];
};

export type AmaSession = {
  slug: string;
  vimeo_id: string;
  vimeo_url: string;
  title: string;
  duration_seconds: number;
  thumbnail_url: string | null;
  raw_cues: Cue[];
  summary: Summary;
  created_at: string;
  updated_at: string;
};
