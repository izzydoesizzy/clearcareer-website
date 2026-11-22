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
  { key: "kristin", name: "Kristin D." },
  { key: "blake", name: "Blake M." },
];

export const proofStats = {
  coached: stats.coached, // "200+"
  raises: stats.collectiveRaises, // "$1.2M+"
  rating: String(stats.linkedInRating).split("/")[0], // "5.0"
  reviews: stats.linkedInReviews, // 8
  avgRating: "4.84", // outcomes report: average rating out of 5
  surveyed: 58,
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
  /** The best line, exactly as written in `quote`. Shown bold on top and highlighted inside. */
  mark: string;
  face?: FaceKey;
}

/** The best line from each review, word for word (checked by tests/content/proof.test.ts). */
const HIGHLIGHTS: Record<string, string> = {
  "Adam Kastor": "Izzy gave me exactly what I needed; a kickstart!",
  "Alex": "the style he presents is engaging and he's a funny guy",
  "Alison Gibbins": "I negotiated top pay, extra vacation",
  "Andrew Cameron": "receiving responses from employers within the first week of joining his program",
  "Angie Graves": "Made an intimidating concept not so scary!",
  "Annie Bell": "within weeks got 2 offers",
  "Athena Hernandez": "transformed my job search strategy",
  "Barbara Dye": "gave me a boost in hope and confidence in my job search efforts",
  "Beckie Thain-Blonk": "make your job search waaay easier",
  "Blake McDermott": "I sent out 27 emails in total. 13 replied.",
  "Chris Chipman": "secured a $25k pay increase",
  "Courtenay Badran": "the most caring, supportive, and dedicated career coach I've ever worked with",
  "Daniela Dyer Melhado": "World Bank offered me the job as a Legal Analyst",
  "Danica Stark": "understand the true impact of my work",
  "Darin Mellor": "I signed an offer maintaining my salary without needing to take a pay cut",
  "Dave Basham": "tools you probably didn't know existed!",
  "Denise Merzon": "It could be scary at first, however, it can be fun as well.",
  "Ellie Hoekman": "Izzy is a wizard!",
  "Erin Marini": "He taught me really good tricks for getting your resume noticed",
  "Gamze Aluc": "he showed me some points I had never realized before about the interviewing process",
  "Glenna Eastwood": "The library of prompts he shared",
  "Haddie Lengyuen": "the majority of my jobs were from reaching out!",
  "Hamsharan Mahalingam": "Here's to me landing a job.",
  "Heidi Priebe": "Izzy was the first one to check in with them",
  "Henrique Perez": "I received two job offers in a week and negotiated a 30% higher salary.",
  "Jeska Edens": "I already feel so much better about my prospects it's crazy.",
  "Jesse Norton": "as awesome as a stegosaurus with laser beams attached to its head",
  "Jorge Garboza": "I even negotiated $6K increase on my initial offer",
  "Julie Boettger": "I am jazzed to get started",
  "Julian Pedraza": "you can actually achieve more than you think you can",
  "Kay Woods": "He is worth every penny.",
  "Kedar Nadkarny": "My Resume came across more mature to recruiters",
  "Ken Alperin": "I got plenty of valuable information, websites and tools to use for my current job search.",
  "Kenenna": "surely going to invite my friends",
  "Kevin Truong": "craft a stronger intro story",
  "Kira Howe": "put together a real resume for the first time in my life",
  "Kris Adams": "Very beneficial!!!",
  "Kristin Davis": "I was employed in just three weeks",
  "Laura Salamanca": "bumped my salary by $22,000 a year",
  "Leanne Saldanha": "opened it 4 times and then forwarded it to a colleague",
  "Linda Tu": "He was engaging, interactive, humble, and authentic.",
  "Linet Okerio": "This is the best event I have attended.",
  "Lucretia": "a different perspective to be set up for success!",
  "Maggie": "The prompts went beyond the 'Create a thank you email ...' I usually write.",
  "Maria Chami": "reading between the lines in ways I never thought of",
  "Marina": "Highly recommend.",
  "Marsha Druker": "negotiated a 10k bump on the initial offer",
  "Marsha Malcolm": "successfully transition into a field that I had been interested in for a long time",
  "Mary Smith": "tangible notes, things to do, and next steps",
  "Mayowa Awosiyan": "I personally had not heard of most of these tools",
  "Mazia Syed": "He will absolutely bring out the best in you.",
  "Nabeel K Adeni": "transforming my storytelling from vague narratives to impactful, Quentin Tarantino-esque hooks",
  "Naomi Khumalo": "Izzy is on the money",
  "Natallia Miniuk": "Information was organized and delivered in a clear and structured manner.",
  "Nicole": "very informative, relevant, and actionable",
  "Olivia Essen": "He radiates positivity.",
  "Patrice Sadd": "something different to inject into my job search which has been frustrating",
  "Rae Birkett": "Izzy kept me fully engaged",
  "Raunika Lamge": "landed a Director-level role at a large Canadian payments company",
  "Rebecca Meyer": "using AI to help me tailor my resumes to various job postings without spending too much time",
  "Robert Heavill": "Not AI hype but very actionable info focusing on finding a job.",
  "Rose Wan": "Izzy is always the person in the room with the biggest smile!",
  "Sandra D Gray": "my perception of AI has turned 180 degrees",
  "Sarvesh Syal": "She was admiring the professionalism of my email.",
  "Septembre Anderson": "I negotiated $10K above the offer",
  "Shaun Alphonso": "one of the best people I know",
  "Sparsh Kalia": "smart ways of increasing my network to land a job rather than just simply applying for jobs",
  "Stephanie Heintzman-Scheidecker": "he is able to bring out the best in anyone",
  "Suellen Nelles": "I truly appreciate the hands-on tools.",
  "Susan L Nelson": "his presentation style is engaging and fun!",
  "Susanne": "the tools, confidence, and community I needed",
  "Suzana Djurdjevic": "faster, better selected",
  "Tamara Gordon": "since January I've landed multiple interviews!",
  "Traci Chier": "so clearly useful",
  "Veronica Amarante": "I would 100% recommend Izzy",
  "Victor Perez": "just 2 weeks after partnering with Izzy I've landed 3 interviews directly with the employer",
  "Victor Rivas": "I feel great about my interview.",
  "Wil Gerard": "leading me to receive three job offers",
  "Win Shi Wong": "he sent a detailed summary with action items to keep me accountable",
};

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
      mark: HIGHLIGHTS[t.name] && t.quote.includes(HIGHLIGHTS[t.name]) ? HIGHLIGHTS[t.name] : "",
      face: FACE_BY_FIRST[t.name.split(" ")[0]],
    }));
}

export const winNames = wins.map((w) => w.name);

/** Split a quote around its highlighted words. */
export function splitMark(quote: string, mark: string): [string, string, string] {
  const i = quote.indexOf(mark);
  return i < 0 ? [quote, "", ""] : [quote.slice(0, i), mark, quote.slice(i + mark.length)];
}
