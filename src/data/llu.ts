/**
 * Land and Level Up: every fact, number and quote on /land-and-level-up.
 *
 * Rules for editing this file:
 * - Seat counts are set BY HAND. They are the true count. Never compute or fake them.
 * - Quotes are the client's exact words. Do not tidy them.
 * - Every statistic needs its source and sample size.
 */

// ── Destinations ────────────────────────────────────────────────────────────
// TODO(Izzy): paste the live Stripe payment link for the Launch Pack.
// Until then the Launch Pack button opens the discovery call, so it is never a dead end.
export const LAUNCH_PACK_CHECKOUT_URL = "https://calendly.com/clearcareer/discovery-call";
// TODO(Izzy): paste the Concierge application link (form or booking page).
export const CONCIERGE_APPLICATION_URL = "https://calendly.com/clearcareer/discovery-call";

export const CTA_LABEL = "Claim my founding seat";

// ── The offer (confirmed by Izzy, November 21, 2026) ────────────────────────
export const offer = {
  startDateLong: "Monday, December 7, 2026",
  startDateShort: "December 7",
  firstCallLong: "Wednesday, December 9",
  seatsTotal: 20,
  seatsLeft: 20, // hand-set, true count as of November 21, 2026
  currency: "CAD",
  launchPack: {
    name: "Launch Pack",
    price: "$647",
    priceNote: "CAD. One payment. Covers your first 3 months.",
    seatsTotal: 15,
    seatsLeft: 15, // hand-set
    includes: [
      "Your resume and LinkedIn, rebuilt 1:1 with me",
      "3 months in the community",
      "A live group call every Wednesday, 60 minutes",
      "The AI Achievement Interviewer",
    ],
  },
  concierge: {
    name: "Concierge",
    price: "$1,997",
    priceNote: "CAD per quarter. By application.",
    seatsTotal: 5,
    seatsLeft: 5, // hand-set
    includes: [
      "Everything in the Launch Pack",
      "A weekly shortlist of roles, picked for you",
      "A tailored resume for each shortlisted role",
      "A 1:1 with me every month",
    ],
  },
  afterThreeMonths: "After your first 3 months, founding members can stay for $50 CAD a month. Leave any time.",
};

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
      "Here we build the thing together. I rebuild your resume and LinkedIn with you. Then you bring your real search to the group every Wednesday.",
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
      "So do the math with me. At a $100,000 salary, one month without a paycheque is $8,333 before tax. The Launch Pack is $647, once, for 3 months.",
      "And there's a 7-day money-back guarantee, as long as we haven't started your rebuild.",
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
      "The group is 20 people at most. Everyone in it is working on their next role, same as you.",
    ],
    proof:
      "Sparsh K. wrote that “the weekly group sessions kept me motivated.” Past members rated weekly calls 4.17 out of 5 (58 surveyed, December 2024).",
  },
  {
    q: "“What if I land a job in the first month?”",
    a: [
      "Then we celebrate. And you keep your seat for the full 3 months.",
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
