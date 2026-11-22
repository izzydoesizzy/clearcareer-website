/**
 * Social proof for the homepage and the Land and Level Up page.
 *
 * Rules: every number below appears in the person's own words (src/data/testimonials.json,
 * or their LinkedIn review in src/data/llu.ts). `quote` is an exact excerpt. Nothing is invented.
 */
import testimonials from "./testimonials.json";
import stats from "./stats.json";
import { formatName } from "@utils/format-name";

export type FaceKey = "kristin" | "darin" | "blake" | "sparsh" | "laura" | "tamara" | "kira" | "raunika";
export const faceSrc = (k: FaceKey) => `/images/llu/face-${k}-144.webp`;

/** Faces from clients' own public LinkedIn reviews, for the avatar stack. */
export const proofFaces: { key: FaceKey; name: string }[] = [
  { key: "laura", name: "Laura S." },
  { key: "kira", name: "Kira H." },
  { key: "darin", name: "Darin M." },
  { key: "tamara", name: "Tamara G." },
  { key: "sparsh", name: "Sparsh K." },
  { key: "raunika", name: "Raunika L." },
];

export const proofStats = {
  coached: stats.coached, // "200+"
  raises: stats.collectiveRaises, // "$1.2M+"
  rating: String(stats.linkedInRating).split("/")[0], // "5.0"
  reviews: stats.linkedInReviews, // 8
};

export interface Win {
  figure: string;
  label: string;
  quote: string;
  /** The words to highlight, exactly as they appear in `quote`. */
  mark: string;
  name: string;
  context: string;
  face?: FaceKey;
}

/** The headline wins, biggest money first. */
export const wins: Win[] = [
  {
    figure: "+$25,000",
    label: "pay increase, in a new Associate Director role",
    quote: "With his help I landed an internal Associate Director role and secured a $25k pay increase, far exceeding my expectations.",
    mark: "secured a $25k pay increase",
    name: "Chris C.",
    context: "ClearCareer client",
  },
  {
    figure: "+$22,000",
    label: "a year, more than a 30% raise",
    quote: "I landed a fantastic role and bumped my salary by $22,000 a year (more than a 30% increase!).",
    mark: "bumped my salary by $22,000 a year",
    name: "Laura S.",
    context: "Program manager, reproductive health",
    face: "laura",
  },
  {
    figure: "+$20,000",
    label: "salary increase, plus annual bonuses",
    quote: "I ultimately landed a role with a $20,000 salary increase + annual bonuses, giving me the financial stability I needed for my family.",
    mark: "$20,000 salary increase",
    name: "Tamara G.",
    context: "Educator turned customer success leader",
    face: "tamara",
  },
  {
    figure: "+30%",
    label: "salary, with two offers in one week",
    quote: "I received two job offers in a week and negotiated a 30% higher salary.",
    mark: "negotiated a 30% higher salary",
    name: "Henrique P.",
    context: "ClearCareer client",
  },
  {
    figure: "3 offers",
    label: "and a $10,000 raise",
    quote: "With Izzy's guidance, I negotiated a $10k raise and felt empowered and confident in my abilities.",
    mark: "I negotiated a $10k raise",
    name: "Wil G.",
    context: "Software engineer",
  },
  {
    figure: "+$10,000",
    label: "on the first offer, for a dream tech marketing role",
    quote: "With Izzy's guidance, I accepted my dream tech marketing role and even negotiated a 10k bump on the initial offer.",
    mark: "negotiated a 10k bump on the initial offer",
    name: "Marsha D.",
    context: "Senior field marketing manager",
  },
  {
    figure: "+$10,000",
    label: "above the offer",
    quote: "I woke up to interviews after applying with my new resume, and I negotiated $10K above the offer.",
    mark: "I negotiated $10K above the offer",
    name: "Septembre A.",
    context: "Front-end web developer",
  },
  {
    figure: "+$6,000",
    label: "after the employer said they couldn't go higher",
    quote: "I finally landed an offer. With Izzy's motivation, strategies and help, I even negotiated $6K increase on my initial offer",
    mark: "negotiated $6K increase on my initial offer",
    name: "Jorge G.",
    context: "After 12 months of searching",
  },
  {
    figure: "3 weeks",
    label: "to a job, after a year of searching",
    quote: "I was looking for full-time work for an entire year and even though I had a lot of experience, I was still stuck. After working with Izzy, I was employed in just three weeks.",
    mark: "employed in just three weeks",
    name: "Kristin D.",
    context: "Growth marketing manager",
    face: "kristin",
  },
  {
    figure: "30 days",
    label: "to a job, after a year of frustration",
    quote: "After over a year of frustration, I followed his advice exactly - and within 30 days, I had a job.",
    mark: "within 30 days, I had a job",
    name: "Sparsh K.",
    context: "Operations and process improvement",
    face: "sparsh",
  },
  {
    figure: "2 offers",
    label: "within weeks, after a long search",
    quote: "I joined Izzy's course (at a fraction of the cost I should add) and within weeks got 2 offers.",
    mark: "within weeks got 2 offers",
    name: "Annie B.",
    context: "ClearCareer client",
  },
  {
    figure: "World Bank",
    label: "Legal Analyst offer",
    quote: "After working with Izzy, I was over-the-moon that World Bank offered me the job as a Legal Analyst.",
    mark: "World Bank offered me the job",
    name: "Daniela D.",
    context: "ClearCareer client",
  },
];

export interface WallReview {
  name: string;
  context: string;
  quote: string;
  face?: FaceKey;
}

const FACE_BY_FIRST: Record<string, FaceKey> = {
  Kristin: "kristin", Darin: "darin", Blake: "blake", Sparsh: "sparsh", Laura: "laura", Tamara: "tamara", Kira: "kira", Raunika: "raunika",
};
const ORDER = ["career-outcome", "linkedin-review", "coaching-quality", "peer-endorsement", "workshop"];
/** Not about careers (a website design client). */
const SKIP = new Set(["Jessica Leung"]);

function contextFor(role: string, category: string): string {
  if (category === "workshop") return "Workshop attendee";
  const parts = role.split(/\s*\/\s*/).map((p) => p.replace(/\s*\(.*?\)\s*/g, "").trim()).filter(Boolean);
  const title = parts.find((p) => !/^(ClearCareer client|LinkedIn verified review|Case study|Workshop attendee.*)$/i.test(p));
  if (category === "peer-endorsement") return parts[0] || "Colleague";
  return title ? `${title}. ClearCareer client` : "ClearCareer client";
}

/** Every review, best first. `exclude` takes "First L." names already shown elsewhere on the page. */
export function wallReviews(exclude: string[] = []): WallReview[] {
  const skip = new Set(exclude);
  return [...testimonials]
    .filter((t: any) => !SKIP.has(t.name) && !skip.has(formatName(t.name)))
    .sort((a: any, b: any) =>
      (ORDER.indexOf(a.category) - ORDER.indexOf(b.category)) || ((a.sortPriority ?? 99) - (b.sortPriority ?? 99)))
    .map((t: any) => ({
      name: formatName(t.name),
      context: contextFor(t.role, t.category),
      quote: t.quote,
      face: FACE_BY_FIRST[t.name.split(" ")[0]],
    }));
}

export const winNames = wins.map((w) => w.name);

/** Split a quote around its highlighted words. */
export function splitMark(quote: string, mark: string): [string, string, string] {
  const i = quote.indexOf(mark);
  return i < 0 ? [quote, "", ""] : [quote.slice(0, i), mark, quote.slice(i + mark.length)];
}
