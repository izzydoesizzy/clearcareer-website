/**
 * Land and Level Up: every fact, number and quote on /land-and-level-up.
 *
 * Rules for editing this file:
 * - Seat counts are set BY HAND. They are the true count. Never compute or fake them.
 * - Quotes are the client's exact words. Do not tidy them.
 * - Every statistic needs its source and sample size.
 */
import { dealIsLive } from "../lib/email/deal";
import { checkoutLinks } from "../lib/checkout";


// ── Destinations ────────────────────────────────────────────────────────────
// Black Friday is checked when the site builds. A daily job (src/pages/api/cron/deal.ts)
// rebuilds the site just after the deadline, so the page switches to regular prices on its own.
export const dealLive = dealIsLive();

// Stripe payment links, one per tier (Black Friday and regular). See src/lib/checkout.ts.
// Until they're set, both buttons open the book-a-call form, so they are never a dead end.
const links = checkoutLinks(import.meta.env);
export const GROUP_CHECKOUT_URL: string = links.group || "/book-a-call";
export const PRIVATE_CHECKOUT_URL: string = links.private || "/book-a-call";

export const CTA_LABEL = "Claim my founding seat";

// ── The offer (confirmed by Izzy, November 21, 2026) ────────────────────────
export const offer = {
  dealLive,
  startDateLong: "Monday, December 7, 2026",
  startDateShort: "December 7",
  firstCallLong: "Wednesday, December 9",
  /** 6 weeks, with a holiday break. Calls: Dec 9, 16, then Jan 6, 13, 20, 27. */
  programLength: "6 weeks",
  lastCallLong: "Wednesday, January 27, 2027",
  callDates: "December 9 and 16, then January 6, 13, 20 and 27",
  holidayBreak: "No calls on December 23 and 30. We break for the holidays.",
  seatsTotal: 16,
  seatsLeft: 16, // hand-set, true count as of November 21, 2026
  currency: "CAD",
  /** Black Friday pricing. Regular prices apply from December 1, 2026. No extensions. */
  dealEndsLong: "Monday, November 30 at 11:59 pm ET",
  dealEndsShort: "November 30",
  dealLine: "I haven't priced it this low since 2021.",
  /** Text for the sticky bar. Built from the same prices, so one edit changes everything. */
  dealBarLabel: "Black Friday",
  promoCode: "BLACKFRIDAY",
  promoLine: "20% off with code BLACKFRIDAY at checkout.",
  dealBarLong: "20% off with code BLACKFRIDAY. Group cohort $960, regular $1,200. Ends Monday, November 30 at 11:59 pm ET.",
  dealBarShort: "20% off: code BLACKFRIDAY. Ends Nov 30.",
  regularFrom: "On December 1 they go back to $1,200 and $2,297.",
  group: {
    name: "Group cohort",
    price: dealLive ? "$960" : "$1,200",
    regular: "$1,200",
    priceNote: "CAD plus HST. One payment covers the full 6 weeks.",
    seatsTotal: 12,
    seatsLeft: 12, // hand-set
    /** Izzy's labels (Nov 28): the group cohort is DIY, the private tier is done with you plus done for you. */
    mode: "DIY",
    modeLine: "You do the work. I give you the system, every tool I've built, and a room that checks in every Wednesday.",
    forWho: "You want the room, the weekly call, the rebuild workshop and every tool.",
    includes: [
      "6 weeks in the Land and Level Up community",
      "6 live group calls on Wednesdays (with a holiday break)",
      "Resume and LinkedIn rebuild workshop, with hot seats",
      "Every ClearCareer AI tool: 17 Claude skills and the 5-tool Career Suite, sent to you the day you join",
    ],
  },
  private: {
    name: "Group plus private rebuild",
    price: dealLive ? "$1,837.60" : "$2,297",
    regular: "$2,297",
    priceNote: "CAD plus HST. One payment covers the full 6 weeks.",
    seatsTotal: 4,
    seatsLeft: 4, // hand-set
    mode: "Done with you + done for you",
    modeLine: "I do the first drafts and the research for you. Then we finish it together, 1:1, before the holidays.",
    forWho: "You want all of that, plus me doing the heavy lifting with you.",
    includes: [
      "Everything in the group cohort",
      "Done for you: I draft your resume, LinkedIn headline and About section from your intake",
      "Done for you: your list of 50+ target companies and your first named hiring managers",
      "Done for you: your salary research report, with your anchor, target and walk-away numbers",
      "Done with you: 2 to 3 hours 1:1 with me to polish it all, finished before the holidays",
    ],
  },
  paying: "Pay in full by card. In Canada, you can also spread it out monthly with Klarna (up to 12 months). Klarna is for Canadian clients only, so from the US it's one payment by card.",
  afterProgram: "After the 6 weeks, you can stay on for $49 a month. Leave any time.",
  guarantee: "7-day money-back guarantee. It ends once your rebuild work has started.",
};

// ── Onboarding details (welcome emails, intake confirmation, calendar file) ─────────
// TODO(Izzy): fill these in. Until they're set, emails say "I'll send this before we start",
// and the daily digest reminds you.
export const welcome = {
  communityName: "Mighty Networks",
  communityUrl: "", // invite link to the Land and Level Up space on Mighty Networks
  callStart: "", // Wednesday call start time in Toronto time, 24-hour, e.g. "12:00"
  callUrl: "", // Zoom (or Mighty Networks live) link for the Wednesday calls
  privateBookingUrl: "", // where private-rebuild members book their 1:1 sessions (e.g. a Calendly event)
};

/** "12:00 p.m. ET", or "" until callStart is set. */
export function callTimeLabel(): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(welcome.callStart);
  if (!m) return "";
  const d = new Date(Date.UTC(2026, 11, 9, Number(m[1]) + 5, Number(m[2])));
  return `${d.toLocaleTimeString("en-CA", { timeZone: "America/Toronto", hour: "numeric", minute: "2-digit" })} ET`;
}

// ── Sources ────────────────────────────────────────────────────────────────
export const SURVEY_SOURCE =
  "Survey of 58 ClearCareer program participants, December 2024. Self-reported.";
export const NEW_PROGRAM_NOTE =
  "Land and Level Up is new. These results come from my earlier programs and 1:1 coaching.";
export const RESULTS_VARY =
  "Results vary. They depend on your effort, your field and the market. No one can promise you a job, and I won't.";

// ── LinkedIn reviews (public, 5.0 each). Text checked against each screenshot. ──
export type ReviewKey =
  | "kristin" | "darin" | "blake" | "sparsh" | "laura" | "tamara" | "kira" | "raunika";

export interface Review {
  key: ReviewKey;
  name: string; // first name and last initial
  context: string; // from their own LinkedIn headline or review
  date: string;
  startingPoint: string;
  /** Exact words. `before`, `mark`, `after` join into one continuous excerpt. */
  before: string;
  mark: string;
  after: string;
  isExcerpt: boolean;
}

export const reviews: Record<ReviewKey, Review> = {
  kristin: {
    key: "kristin",
    name: "Kristin D.",
    context: "Growth marketing manager",
    date: "January 21, 2025",
    startingPoint: "A year of searching",
    before:
      "I was looking for full-time work for an entire year and even though I had a lot of experience, I was still stuck. After working with Izzy, I was ",
    mark: "employed in just three weeks",
    after: ".",
    isExcerpt: true,
  },
  darin: {
    key: "darin",
    name: "Darin M.",
    context: "Project manager, tech",
    date: "January 28, 2025",
    startingPoint: "600+ applications, 3 interviews",
    before:
      "Before reconnecting with Izzy, I applied for 600+ jobs but only landed three interviews. Izzy helped me slow down, focus on quality over quantity, and be proactive in reaching out to hiring managers. He refined my resume, quantified my achievements, and gave me tools to stand out. Things turned around rapidly, I ",
    mark: "signed an offer maintaining my salary",
    after: " without needing to take a pay cut like countless jobseekers.",
    isExcerpt: true,
  },
  blake: {
    key: "blake",
    name: "Blake M.",
    context: "Moved into digital marketing",
    date: "January 22, 2025",
    startingPoint: "200+ applications, no offers",
    before:
      "After trying to transition into a career in digital marketing and having applied to over 200 jobs, I'd only got 10 interviews, and no offers. When I started using the “Izzy Method,” ",
    mark: "everything changed",
    after: ".",
    isExcerpt: true,
  },
  sparsh: {
    key: "sparsh",
    name: "Sparsh K.",
    context: "Operations and process improvement",
    date: "January 22, 2025",
    startingPoint: "Over a year of searching",
    before:
      "Izzy helped me unlock my full potential and present my best to the world. After over a year of frustration, I followed his advice exactly - and ",
    mark: "within 30 days, I had a job",
    after:
      ". The weekly group sessions kept me motivated, and Izzy's personalized approach made all the difference. Trust his process and put in the effort - you won't regret it.",
    isExcerpt: false,
  },
  laura: {
    key: "laura",
    name: "Laura S.",
    context: "Program manager, reproductive health",
    date: "January 21, 2025",
    startingPoint: "Going for a dream role",
    before:
      "Izzy took the time to learn about my needs and supported me every step of the way, including demonstrating my value, preparing for the interview, and sending an impactful follow up email. I landed the role and ",
    mark: "bumped my salary by $22,000 a year",
    after: " (more than a 30% increase!). Izzy is a warm, caring, and impactful coach that really knows his stuff.",
    isExcerpt: true,
  },
  tamara: {
    key: "tamara",
    name: "Tamara G.",
    context: "Educator turned customer success leader",
    date: "January 21, 2025",
    startingPoint: "Stuck, despite doing the work",
    before:
      "I struggled to articulate my value and was overwhelmed by conflicting advice in the ever-changing job market. With Izzy, I gained clarity, felt more confident, transformed my resume, and within weeks, I landed multiple interviews. I ultimately landed a role with a ",
    mark: "$20,000 salary increase",
    after: " + annual bonuses, giving me the financial stability I needed for my family.",
    isExcerpt: true,
  },
  kira: {
    key: "kira",
    name: "Kira H.",
    context: "Staff software engineer",
    date: "January 22, 2025",
    startingPoint: "Freelance to full-time",
    before:
      "My lightbulb moment came when he helped me see the job search from the employer’s perspective. Together we refined my story, and his invaluable support empowered me to ",
    mark: "negotiate a strong counteroffer",
    after:
      ", securing competitive compensation, good benefits, and the long-term stability I needed for the next chapter of my life.",
    isExcerpt: true,
  },
  raunika: {
    key: "raunika",
    name: "Raunika L.",
    context: "13+ years in financial services",
    date: "March 30, 2025",
    startingPoint: "Aiming for a director role",
    before:
      "I highly recommend Izzy. He helped me navigate my job search, refine my target roles, and build confidence. From resume updates to LinkedIn improvements and interview prep, his guidance was invaluable. A key moment was when he helped me reframe my doubts by identifying my unique value. Thanks to his support, I stayed focused and ",
    mark: "landed a Director-level role",
    after: " at a large Canadian payments company.",
    isExcerpt: true,
  },
};

// ── Client quotes from src/data/testimonials.json (exact words, excerpts are whole sentences) ──
export interface Quote {
  name: string;
  context: string;
  before: string;
  mark: string;
  after: string;
  isExcerpt: boolean;
}

export const quotes = {
  victor: {
    name: "Victor P.",
    context: "Senior project manager. ClearCareer client.",
    before:
      "I'm ecstatic with my LinkedIn profile redesign. And my newly crafted resume quite simply invites attention. Amazed how just 2 weeks after partnering with Izzy I've ",
    mark: "landed 3 interviews directly with the employer",
    after: " not recruiter screenings!",
    isExcerpt: true,
  },
  andrew: {
    name: "Andrew C.",
    context: "ClearCareer client.",
    before:
      "Izzy's system completely transformed my job search from sending out hundreds of applications with no results, to ",
    mark: "receiving responses from employers within the first week",
    after:
      " of joining his program. Now, all the work I do seems to feel more productive and get immediate responses.",
    isExcerpt: true,
  },
  annie: {
    name: "Annie B.",
    context: "ClearCareer client.",
    before:
      "If you're on the fence, go for it. I pondered job search coaching after a LONG job search black hole and was blown away by the $1500+ price tags with zero promises. I joined Izzy's course (at a fraction of the cost I should add) and ",
    mark: "within weeks got 2 offers",
    after: ". To say he knows his stuff would be the understatement of the year.",
    isExcerpt: false,
  },
  chris: {
    name: "Chris C.",
    context: "ClearCareer client.",
    before:
      "Working with Izzy was an absolute game changer. His guidance in narrowing my personal narrative from experience toward tangible quantified metrics and accomplishments gave me a significant edge in my interview... and salary negotiations. With his help I landed an internal Associate Director role and ",
    mark: "secured a $25k pay increase",
    after:
      ", far exceeding my expectations. Izzy is a master at reframing perspective, boosting confidence, and setting you up for success.",
    isExcerpt: false,
  },
  septembre: {
    name: "Septembre A.",
    context: "Front-end web developer. ClearCareer client.",
    before:
      "Izzy helped me craft my resume, refine my interview skills, and believe in my value as a developer. I woke up to interviews after applying with my new resume, and I ",
    mark: "negotiated $10K above the offer",
    after: ". Thanks to Izzy, I feel confident and ready to grow in this exciting role.",
    isExcerpt: false,
  },
  surveyLayoff: {
    name: "ClearCareer member",
    context: "Anonymous survey response, December 2024.",
    before:
      "For me, the level of support I received at this price point was unmatched. After experiencing layoffs, I invested in other career coaches but ",
    mark: "didn't even receive the bare minimum of support",
    after: " that Izzy has provided.",
    isExcerpt: false,
  },
} satisfies Record<string, Quote>;

// ── Section 2: the before, in clients' own numbers ──────────────────────────
export const befores: { key: ReviewKey; figure: string; unit: string; then: string; who: string }[] = [
  { key: "darin", figure: "600+", unit: "jobs applied for", then: "3 interviews", who: "Darin M., project manager" },
  { key: "blake", figure: "200+", unit: "jobs applied to", then: "10 interviews, no offers", who: "Blake M., changing fields" },
  { key: "kristin", figure: "1 year", unit: "looking for full-time work", then: "“still stuck”", who: "Kristin D., growth marketing" },
  { key: "sparsh", figure: "1+ years", unit: "“of frustration”", then: "before we met", who: "Sparsh K., operations" },
];

// ── Section 4: survey figures that reconcile (outcomes.astro) ───────────────
export const survey = {
  n: 58,
  landed: 37,
  stillSearching: 21,
  withinOneMonth: 17,
  withinTwoMonths: 25,
  fiveOrFewerInterviewsBefore: 44,
  searching7PlusMonthsBefore: 25,
  confidenceBefore: 2.45,
  confidenceAfter: 4.5,
  fiveStar: 49,
  weeklyCallsRating: 4.17,
  resumeSupportRating: 4.53,
  aiPromptsRating: 4.22,
  /** Of the 37 who landed, 84% increased their pay. Average increase $21,742 (outcomes report, /outcomes). */
  raisedPay: 31,
  avgRaise: 21742,
  avgRating: 4.84,
  /** More from the outcomes report (/outcomes). */
  raises20kPlus: 17, // outcomes chart: 8 ($20-25K) + 6 ($25-30K) + 2 ($50-75K) + 1 ($100K+)
  raises50kPlus: 2,
  raises100kPlus: 1,
  stuck6PlusMonths: 25,
  stuckLandedPct: 64,
  confidentAfterPct: 93,
  confidentBeforePct: 10,
  savesHourPct: 88, // "88% of members save 1+ hours per week"
  timeToLand: [
    { label: "Under 2 weeks", short: "Under 2 wk", count: 3 },
    { label: "2 to 4 weeks", short: "2 to 4 wk", count: 7 },
    { label: "About 1 month", short: "1 mo", count: 7 },
    { label: "About 2 months", short: "2 mo", count: 8 },
    { label: "3 to 6 months", short: "3 to 6 mo", count: 9 },
    { label: "7 to 12 months", short: "7 to 12 mo", count: 2 },
    { label: "1 to 2 years", short: "1 to 2 yr", count: 1 },
  ],
};

// ── Section 11: objections, in the buyer's words ────────────────────────────
export const objections: { q: string; a: string[]; proof: string }[] = [
  {
    q: "“I already paid for a career coach. It went nowhere.”",
    a: [
      "I hear this every week. Most coaching gives you advice, then leaves you to do it alone.",
      "Here we build the thing together. We rebuild your resume and LinkedIn in a live workshop. Then you bring your real search to the group every Wednesday.",
    ],
    proof:
      "Andrew C. had taken expensive career courses that “didn't lead anywhere.” In my program, employers responded within the first week.",
  },
  {
    q: "“I've sent hundreds of applications. Why would this be different?”",
    a: [
      "Because more applications won't fix it. The people who turn it around slow down and change the approach.",
      "We tighten your story, put numbers on your work, and reach out to real people.",
    ],
    proof:
      "Darin M. applied for 600+ jobs and landed three interviews. After we worked together, Darin signed an offer at the same salary. No pay cut.",
  },
  {
    q: "“Money is tight right now.”",
    a: [
      "I get it. You're watching every dollar, and that's the right instinct.",
      `So do the math with me. At a $100,000 salary, one month without a paycheque is $8,333 before tax. The group cohort is ${dealLive ? "$960 with code BLACKFRIDAY" : "$1,200"} plus HST, for the full 6 weeks.`,
      "In Canada, you can spread it out monthly with Klarna. From the US, it's one payment by card. Either way, there's a 7-day money-back guarantee, as long as your rebuild work hasn't started.",
    ],
    proof:
      "Annie B. was “blown away by the $1500+ price tags with zero promises” elsewhere. Annie joined my course and got 2 offers within weeks.",
  },
  {
    q: "“I've been out of work for over a year. Is it too late?”",
    a: [
      "No. A long gap feels like a verdict. It isn't one.",
      "It usually means you've been doing this alone for too long.",
    ],
    proof:
      "Sparsh K. had over a year of frustration, then a job within 30 days. Kristin D. searched for a year and was employed in three weeks. In my 2024 survey, 25 of 58 members had been searching 7 months or more before they joined.",
  },
  {
    q: "“I'm not in tech. Will this work in my field?”",
    a: [
      "Yes. The work is the same in every field: a clear story, proof with numbers, and conversations with real people.",
    ],
    proof:
      "Laura S. works in reproductive health and landed a $22,000 raise. Raunika L. landed a Director-level role at a large Canadian payments company. Darin M. is a project manager.",
  },
  {
    q: "“I'm not a group person. A weekly call sounds awkward.”",
    a: [
      "Fair. You don't have to perform. Bring one stuck point, or just listen for the first few weeks.",
      "The group is 16 people at most. Everyone in it is working on their next role, same as you.",
    ],
    proof:
      "Sparsh K. wrote that “the weekly group sessions kept me motivated.” Past members rated weekly calls 4.17 out of 5 (58 surveyed, December 2024).",
  },
  {
    q: "“What if I land a job in the first month?”",
    a: [
      "Then we celebrate. And you keep your seat for the full 6 weeks.",
      "Use that time to negotiate the offer and start the new role well.",
    ],
    proof:
      "Septembre A. negotiated $10K above the offer. Chris C. secured a $25k pay increase with an internal move.",
  },
];

/** Plain-text version for FAQ structured data. */
export const objectionsForSchema = objections.map((o) => ({
  question: o.q.replace(/[“”]/g, ""),
  answer: [...o.a, o.proof].join(" ").replace(/[“”]/g, '"'),
}));

// ════════════════════════════════════════════════════════════════════════════
// Redesign (Creator Science structure): extra content blocks
// ════════════════════════════════════════════════════════════════════════════

export const navLinks = [
  { href: "#method", label: "How it works" },
  { href: "#plan", label: "Your 6 weeks" },
  { href: "#toolkit", label: "Your tools" },
  { href: "#results", label: "Results" },
  { href: "#pricing", label: "Pricing" },
];

/** People row under the hero. Each result is taken from that person's LinkedIn review. */
export const people: { key: ReviewKey; result: string }[] = [
  { key: "kristin", result: "Employed in three weeks" },
  { key: "sparsh", result: "A job within 30 days" },
  { key: "laura", result: "$22,000 a year more" },
  { key: "tamara", result: "$20,000 salary increase" },
  { key: "darin", result: "Offer signed, no pay cut" },
  { key: "raunika", result: "Director-level role" },
  { key: "blake", result: "$5,000 salary increase" },
  { key: "kira", result: "A strong counteroffer" },
];

/** Questions members bring. These are examples written by Izzy, not quotes. */
export const questions = [
  "Is this offer low, or am I being greedy?",
  "How do I explain an eight-month gap?",
  "Do I take the contract, or keep looking?",
  "Is it my resume, or is it the market?",
  "Should I follow up again, or let it go?",
  "How much do I say about the layoff?",
  "They said the budget is fixed. Now what?",
  "Am I aiming too high, or too low?",
];

/** Case cards. `start` and `result` restate facts from each person's own LinkedIn review. */
export const cases: { key: ReviewKey; chip: string; start: string; result: string }[] = [
  {
    key: "darin",
    chip: "600+ applications",
    start: "Applied for 600+ jobs and landed three interviews.",
    result: "Slowed down, reached out to hiring managers, and signed an offer at the same salary. No pay cut.",
  },
  {
    key: "laura",
    chip: "+$22,000 a year",
    start: "Saw a dream organization was hiring and wanted to get it right.",
    result: "Landed the role and raised salary by $22,000 a year. That's more than a 30% increase.",
  },
  {
    key: "blake",
    chip: "200+ applications",
    start: "Changing fields. Over 200 applications, 10 interviews and no offers.",
    result: "Sent 27 targeted emails. Landed a full-time role and negotiated a $5,000 salary increase.",
  },
];

/** More client quotes for the wall (src/data/testimonials.json, whole sentences). */
export const moreQuotes = {
  jorge: {
    name: "Jorge G.",
    context: "ClearCareer client.",
    before:
      "Before working with Izzy, I spent 12 months job searching. I applied to over 160 jobs. I had 16 interviews... But I never landed an offer. After joining Izzy's program, he helped me with the whole interview process. Before, during and after the interview. And today, ",
    mark: "I finally landed an offer",
    after: ".",
    isExcerpt: true,
  },
  wil: {
    name: "Wil G.",
    context: "Software engineer. ClearCareer client.",
    before:
      "Izzy helped me rebuild my confidence and approach job searching with renewed energy and focus after being recently unemployed. He helped me hone in on my strengths and communicate them effectively, leading me to ",
    mark: "receive three job offers",
    after:
      ". With Izzy's guidance, I negotiated a $10k raise and felt empowered and confident in my abilities.",
    isExcerpt: true,
  },
  /** A former colleague, on Izzy as a community builder. Not a client. */
  heidi: {
    name: "Heidi P.",
    context: "Former colleague at Hacker Paradise.",
    before: "I'm not sure I've ever met someone who ",
    mark: "works so hard and so efficiently",
    after: " at both the technical and personal aspects of maintaining a community.",
    isExcerpt: true,
  },
} satisfies Record<string, Quote>;

/** LinkedIn headlines, before and after. Exact text from each person's profile screenshot. */
export const profilePairs = [
  {
    key: "nathaniel",
    name: "Nathaniel A.",
    before: "Design Strategy and Design Ops Leader - Looking for Full Time Role",
    after:
      "Head of Design and Studio Operations | Cofounded Design/Venture Studios at ConsenSys & IBM iX | Led High-Impact Innovation for Fortune 500 & Public Sector Clients",
  },
  {
    key: "henrique",
    name: "Henrique P.",
    before: "Finance",
    after:
      "Senior Accounts Receivable Manager | Portfolio of $1Billion+ Including Fortune 500 Companies such as PepsiCo, Walmart, Costco, ExxonMobil, and Coca Cola | Recovered 40% of portfolio past due balance $56M in under 9mo",
  },
  {
    key: "julia",
    name: "Julia S.",
    before: "Sex & Relationship Educator for Teens & Millennials",
    after:
      "Program Director | Expert in 2SLGBTQIA+ Programming | Delivered 150+ Workshops on Consent & Boundaries | Led Teen Camps Empowering 50+ Youth Annually",
  },
  {
    key: "rubina",
    name: "Rubina A.",
    before: "Personal Finance Journalist",
    after:
      "Personal Finance Expert | Featured on CBC, Global, Corus Network, SiriusXM | Nationally-Syndicated Columnist | Journalist | Host",
  },
] as const;

/** Roles of people Izzy has coached, as written in their reviews, testimonials and profiles. */
export const roles = [
  "Project managers",
  "Software engineers",
  "Customer success managers",
  "Growth marketers",
  "Program directors",
  "Operations leads",
  "Legal analysts",
  "Product managers",
  "Accounts receivable managers",
  "Heads of design",
  "Front-end developers",
  "Field marketing managers",
  "Communications writers",
  "Non-profit coordinators",
  "IT specialists",
  "Associate directors",
  "Finance journalists",
  "Digital marketing managers",
  "Startup co-founders",
  "Financial services directors",
];

export const VIDEO_URL = "https://www.youtube.com/watch?v=xyDUx1ji3io";

// ── Your AI career team (src/components/llu/LluToolkit.astro) ────────────────
// Every tool here is real, and every member gets all of them the day they join (product
// "llu-toolkit" in src/data/product-config.ts). `skill` is the tool's real folder name. Tests check
// that the cc- skills are exactly the All-Access Pass skills, the suite tools are exactly the Career
// Suite, and the $201 matches the single prices.
export interface ToolkitTool { skill: string; name: string; what: string; suite?: boolean }
export interface ToolkitStep { n: string; title: string; from: string; to: string; tools: ToolkitTool[] }

export const toolkit = {
  skillCount: 17,
  suiteCount: 5,
  productCount: 9,
  soldSeparately: "$201",
  allAccessPrice: "$99",
  steps: [
    {
      n: "1",
      title: "Get clear on what's next",
      from: "Applying to anything that sounds close.",
      to: "5 titles you fit, what they pay where you live, and a ranked list of companies.",
      tools: [
        { skill: "career-clarity", name: "Career Clarity", suite: true, what: "Your resume and a short intake become 5 target titles, fit scores and local pay. Every number links to its source." },
        { skill: "job-match-rubric", name: "Job Match Scorer", suite: true, what: "Paste a job post. Get a score out of 100 on your real chances, and the proof to lead with." },
        { skill: "cc-research", name: "Market Research", what: "Company snapshots, job post breakdowns, salary ranges and alternative job titles." },
        { skill: "cc-company-scorecards", name: "Company Scorecards", what: "Score 10 to 20 companies on what matters to you, then rank your top 3." },
      ],
    },
    {
      n: "2",
      title: "Tell your story with numbers",
      from: "Bullets that list what you were responsible for.",
      to: "Numbers on every role, and a career profile you never have to rebuild.",
      tools: [
        { skill: "achievement-interviewer", name: "AI Achievement Interviewer", suite: true, what: "A voice interview that digs into every role until it finds the numbers. Then it writes your bullets and 8 summaries." },
        { skill: "cc-resume", name: "Resume Writer", what: "Achievement bullets, summaries, skills and keyword fixes for a specific job post." },
        { skill: "cc-resume-review", name: "Resume Audit", what: "My 6-area rubric, your top 3 fixes, and rewrites that use only your real facts." },
      ],
    },
    {
      n: "3",
      title: "Get found",
      from: "A LinkedIn profile nobody finds.",
      to: "A headline and About section that bring recruiters and hiring managers to you.",
      tools: [
        { skill: "cc-linkedin-launch", name: "LinkedIn Launch", what: "My own formats: 10 headlines to test, the 4-part About, and posts from your stories." },
        { skill: "cc-linkedin-audit", name: "LinkedIn Audit", what: "Photo, banner, headline, About and Experience, checked against my 5-area rubric." },
        { skill: "cc-linkedin", name: "LinkedIn Writer", what: "Experience sections, banner lines, search strings, connection notes and weekly posts." },
      ],
    },
    {
      n: "4",
      title: "Go direct",
      from: "Hundreds of applications into the black hole.",
      to: "New roles scored for you every weekday, and emails out to named hiring managers.",
      tools: [
        { skill: "job-search-autopilot", name: "Job Search Autopilot", suite: true, what: "Scheduled searches that find, check and score new roles for you, every weekday morning." },
        { skill: "job-alerts-setup", name: "Job Alerts Setup", suite: true, what: "LinkedIn, Google and Indeed alerts built from your titles, click by click." },
        { skill: "cc-job-scan", name: "Job Post Scan", what: "Postings from the last 7 days, links checked, each scored out of 12." },
        { skill: "cc-outreach-campaign", name: "Outreach Campaign", what: "One real person at each target company, something of theirs to mention, and a short email." },
        { skill: "cc-email-writer", name: "Email Writer", what: "Fits my 80+ templates to you: cold emails, follow-ups, referrals and LinkedIn messages." },
        { skill: "cc-outreach", name: "Outreach Writer", what: "Informational interviews, coffee chats, cover letters and the \"silver bullet\" thank-you." },
      ],
    },
    {
      n: "5",
      title: "Get paid what you're worth",
      from: "Winging the interview, then taking the first number.",
      to: "Stories ready, a prep pack for every interview, and a counter you've rehearsed.",
      tools: [
        { skill: "cc-interview-dossier", name: "Interview Dossier", what: "A 12-section prep pack for one job: the company, the people you're meeting, your stories." },
        { skill: "cc-interview-coach", name: "Interview Coach", what: "Your STAR story bank, mock interviews with feedback, and a debrief after the real one." },
        { skill: "cc-interview", name: "Interview Prep", what: "Your \"Tell me about yourself\", practice questions, and a strict score of your interview transcripts." },
        { skill: "cc-salary-number", name: "Salary Number", what: "Your anchor, target and walk-away numbers, with word-for-word scripts." },
        { skill: "cc-negotiation-coach", name: "Negotiation Coach", what: "Reviews the offer, drafts your counter, then plays the recruiter so you can rehearse." },
        { skill: "cc-offer", name: "Offer and Next Steps", what: "Offer comparisons, counter-offer calls, resignation letters and your first 90 days." },
      ],
    },
  ] satisfies ToolkitStep[],
};
