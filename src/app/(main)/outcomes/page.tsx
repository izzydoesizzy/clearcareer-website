import { generatePageMetadata } from "@components/SEOHead";
import Hero from "@components/Hero";
import CTASection from "@components/CTASection";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Client Outcomes Report | ClearCareer",
  description:
    "Real outcomes from 58 surveyed ClearCareer members. 84% gave 5 stars, $21.7K average salary increase, NPS of 84, and 84% confidence lift. Self-reported data, no spin.",
});

// ── Section 1: Where They Started ──
const challenges = [
  { label: "Lack of confidence", count: 11 },
  { label: "Unclear goals", count: 11 },
  { label: "Staying motivated", count: 10 },
  { label: "Getting interviews", count: 9 },
  { label: "Improving resume", count: 9 },
  { label: "Interview prep", count: 6 },
  { label: "Networking", count: 1 },
  { label: "LinkedIn", count: 1 },
];
const maxChallenge = 11;

// ── Section 3: Financial Impact ──
const salaryDistribution = [
  { label: "$1-5K", count: 5 },
  { label: "$5-10K", count: 5 },
  { label: "$10-15K", count: 4 },
  { label: "$15-20K", count: 2 },
  { label: "$20-25K", count: 8 },
  { label: "$25-30K", count: 6 },
  { label: "$50-75K", count: 2 },
  { label: "$100K+", count: 1 },
];
const maxSalary = 8;

const timeToLand = [
  { label: "< 2 weeks", count: 3 },
  { label: "2-4 weeks", count: 7 },
  { label: "1 month", count: 7 },
  { label: "2 months", count: 8 },
  { label: "3-6 months", count: 9 },
  { label: "7-12 months", count: 2 },
  { label: "1-2 years", count: 1 },
];
const maxTime = 9;

// ── Section 5: Resource Ratings ──
const resources = [
  { label: "Resume Support", score: 4.53 },
  { label: "Email Templates", score: 4.45 },
  { label: "Motivation", score: 4.45 },
  { label: "Accountability", score: 4.41 },
  { label: "LinkedIn", score: 4.38 },
  { label: "AI Prompts", score: 4.22 },
  { label: "Weekly Calls", score: 4.17 },
  { label: "Courses", score: 4.05 },
  { label: "Skool Community", score: 3.79 },
  { label: "Other Members", score: 3.67 },
];

const skills = [
  { label: "Resume", score: 4.36 },
  { label: "LinkedIn Profile", score: 4.17 },
  { label: "LinkedIn Research", score: 4.17 },
  { label: "ChatGPT", score: 4.03 },
  { label: "Value Proposition", score: 4.02 },
  { label: "Email Outreach", score: 4.02 },
  { label: "Interviewing", score: 3.95 },
  { label: "Market Research", score: 3.86 },
  { label: "Networking", score: 3.83 },
  { label: "Perplexity", score: 3.76 },
  { label: "Other AI Tools", score: 3.69 },
];

// ── Section 6: AI Fluency ──
const aiComparison = [
  { label: "Better", count: 26, max: 26 },
  { label: "Significantly better", count: 19, max: 26 },
  { label: "N/A (first AI prompts)", count: 12, max: 26 },
  { label: "About the same", count: 1, max: 26 },
];

const timeSaved = [
  { label: "1-3 hours", count: 30, max: 30 },
  { label: "4-6 hours", count: 11, max: 30 },
  { label: "Less than 1 hour", count: 7, max: 30 },
  { label: "7-10 hours", count: 6, max: 30 },
  { label: "10+ hours", count: 4, max: 30 },
];

// ── Section 7: The Verdict ──
const recommendation = [
  { label: "10", count: 41, max: 41 },
  { label: "9", count: 8, max: 41 },
  { label: "8", count: 6, max: 41 },
  { label: "7", count: 3, max: 41 },
];

// ── Section 8: Quotes ──
const quotes = [
  "I got a job in 2 weeks after two years of looking and wrote my own job description. It's pretty wild.",
  "Since the program, I've gotten married, purchased a home, and climbed up to a VP role. No other program has come close.",
  "I saw an 83% salary increase. As a disabled person, the program accepted me exactly as I am.",
  "ClearCareer helped me realize my values and not accept lower rates.",
  "The emotional support of a community with a good leader is priceless.",
  "This program really goes above and beyond. It teaches you to work smarter.",
  "I was promoted within 3 months.",
  "Cold outreach emails are so much better, with almost 100% response rate.",
  "I've grown more confident in my personal life as well.",
  "The level of support at this price point was unmatched.",
  "I feel like my career is finally on track and I'm being fairly compensated for the first time.",
  "I feel supported on my journey and my anxiety has gone down significantly. Izzy is the wizard.",
  "ClearCareer helped me understand WHAT I wanted to pursue. I was floating for years.",
  "I switched careers a year later. Drawing on what I learned made it so much easier.",
  "Working with Izzy transformed my career and my life.",
];

export default function OutcomesPage() {
  return (
    <>
      {/* Hero */}
      <Hero
        variant="page"
        eyebrow="Outcomes Report"
        headline="The Numbers Behind the Transformation"
        subheadline="Based on survey responses from 58 program members. Self-reported data. No spin."
      />

      {/* Hero Stats */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            <div className="rounded-xl border border-border bg-white p-6 text-center md:p-8">
              <p className="text-[2rem] font-bold text-blue md:text-[2.5rem]">84%</p>
              <p className="mt-1 text-sm text-text-muted">5-Star Rating</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6 text-center md:p-8">
              <p className="text-[2rem] font-bold text-blue md:text-[2.5rem]">$1.2M+</p>
              <p className="mt-1 text-sm text-text-muted">Collective Raises*</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6 text-center md:p-8">
              <p className="text-[2rem] font-bold text-blue md:text-[2.5rem]">84</p>
              <p className="mt-1 text-sm text-text-muted">NPS Score</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6 text-center md:p-8">
              <p className="text-[2rem] font-bold text-blue md:text-[2.5rem]">+84%</p>
              <p className="mt-1 text-sm text-text-muted">Confidence Lift</p>
            </div>
          </div>
        </div>
      </section>

      {/* 01: Where They Started */}
      <section className="bg-blue-bg/50 py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue">
            01 — Where They Started
          </p>
          <h2 className="mb-3 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
            People came in stuck, depleted, and doubting themselves.
          </h2>
          <p className="mb-10 max-w-xl text-text-muted">
            Most members had been searching for months, sending applications into the void, and questioning whether something was wrong with them.
          </p>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-blue">76%</p>
              <p className="mt-1 text-sm font-semibold text-navy">Had been searching 3+ months</p>
              <p className="mt-1 text-sm text-text-muted">
                43% had been searching 7+ months before joining. Some over 2 years.
              </p>
              <p className="mt-2 text-xs font-medium text-blue">Industry avg: 5.5 months (BLS, 2025)</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-blue">2.45</p>
              <p className="mt-1 text-sm font-semibold text-navy">Average confidence (out of 5)</p>
              <p className="mt-1 text-sm text-text-muted">
                60% rated their confidence a 1 or 2. The search had taken a real toll.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-blue">76%</p>
              <p className="mt-1 text-sm font-semibold text-navy">Had 5 or fewer interviews</p>
              <p className="mt-1 text-sm text-text-muted">
                Despite months of effort, applications weren&apos;t converting. 44 of 58 had secured 5 or fewer.
              </p>
            </div>
          </div>

          {/* Challenges Chart */}
          <div className="rounded-xl border border-border bg-white p-6 md:p-8">
            <h3 className="text-base font-semibold text-navy">Top Challenges When They Arrived</h3>
            <p className="mb-5 text-sm text-text-muted">
              Self-reported biggest challenge before joining (of 58 respondents)
            </p>
            <div className="space-y-3">
              {challenges.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-sm font-medium text-text sm:w-40">
                    {item.label}
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-blue-bg">
                    <div
                      className="h-full rounded-full bg-blue"
                      style={{ width: `${(item.count / maxChallenge) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-sm font-semibold text-blue">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-6 rounded-xl border-l-4 border-blue bg-white p-5">
            <p className="text-sm italic text-text-muted">
              &ldquo;For me, the level of support I received at this price point was unmatched. After experiencing layoffs, I invested in other career coaches but didn&apos;t even receive the bare minimum of support that Izzy has provided.&rdquo;
            </p>
            <p className="mt-2 text-xs font-semibold text-blue">ClearCareer Member</p>
          </div>
        </div>
      </section>

      {/* 02: The Confidence Shift */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue">
            02 — The Confidence Shift
          </p>
          <h2 className="mb-3 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
            The single biggest transformation is invisible on a resume.
          </h2>
          <p className="mb-10 max-w-xl text-text-muted">
            Before strategy. Before assets. Before interviews. The first thing that changes is how people see themselves.
          </p>

          {/* Before/After Visual */}
          <div className="mb-8 rounded-xl border border-blue/20 bg-blue-bg/30 p-8 text-center md:p-12">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-text-muted">
              Self-Reported Job Search Confidence (1-5)
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <div>
                <p className="text-5xl font-bold text-border md:text-6xl">2.45</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-text-muted">
                  Before
                </p>
              </div>
              <p className="text-3xl text-border">&rarr;</p>
              <div>
                <p className="text-5xl font-bold text-blue md:text-6xl">4.50</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-blue">After</p>
              </div>
            </div>
            <p className="mt-6 text-2xl font-bold text-success">+84% increase</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-text-muted">
              93% of members rated their confidence a 4 or 5 after the program, up from just 10% before.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-success">83%</p>
              <p className="mt-1 text-sm font-semibold text-navy">
                Reported significant confidence gains
              </p>
              <p className="mt-1 text-sm text-text-muted">
                48 of 58 rated the confidence outcome a 4 or 5.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-success">79%</p>
              <p className="mt-1 text-sm font-semibold text-navy">Gained significant clarity</p>
              <p className="mt-1 text-sm text-text-muted">
                46 of 58 rated &ldquo;More Clarity&rdquo; a 4 or 5. People stopped spinning and started moving with purpose.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-success">74%</p>
              <p className="mt-1 text-sm font-semibold text-navy">
                Overcame their #1 challenge
              </p>
              <p className="mt-1 text-sm text-text-muted">
                43 of 58 rated challenge resolution a perfect 5/5. Average: 4.67.
              </p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            <div className="rounded-xl border-l-4 border-blue bg-blue-bg/30 p-5">
              <p className="text-sm italic text-text-muted">
                &ldquo;I experienced a dramatic transformation in terms of my self-efficacy and confidence in the value that I bring to organizations.&rdquo;
              </p>
              <p className="mt-2 text-xs font-semibold text-blue">ClearCareer Member</p>
            </div>
            <div className="rounded-xl border-l-4 border-blue bg-blue-bg/30 p-5">
              <p className="text-sm italic text-text-muted">
                &ldquo;Izzy and ClearCareer provided me the toolset and confidence to multiply my earnings, improve my work-life balance and hit my goals. Since the program, I&apos;ve gotten married, purchased a home, and have climbed up to a VP role.&rdquo;
              </p>
              <p className="mt-2 text-xs font-semibold text-blue">ClearCareer Member</p>
            </div>
          </div>
        </div>
      </section>

      {/* 03: Financial Impact */}
      <section className="bg-blue-bg/50 py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue">
            03 — The Financial Impact
          </p>
          <h2 className="mb-3 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
            The program pays for itself. Then it keeps paying.
          </h2>
          <p className="mb-10 max-w-xl text-text-muted">
            Of the 37 members who landed roles, 84% increased their compensation. The average salary increase was $21,742.
          </p>

          {/* Big salary numbers */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-success/20 bg-white p-8 text-center">
              <p className="text-4xl font-bold text-success md:text-5xl">$1.2M+</p>
              <p className="mt-2 text-sm text-text-muted">
                Total collective salary increases across program members*
              </p>
            </div>
            <div className="rounded-xl border border-success/20 bg-white p-8 text-center">
              <p className="text-4xl font-bold text-success md:text-5xl">$21.7K</p>
              <p className="mt-2 text-sm text-text-muted">
                Average salary increase for members who negotiated higher pay
              </p>
              <p className="mt-2 text-xs font-medium text-blue">
                Industry context: 55% of workers don&apos;t negotiate at all (Pew Research, 2023)
              </p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-success">84%</p>
              <p className="mt-1 text-sm font-semibold text-navy">Increased their salary</p>
              <p className="mt-1 text-sm text-text-muted">
                31 of 37 members who secured roles negotiated higher compensation.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-warning">42%</p>
              <p className="mt-1 text-sm font-semibold text-navy">Negotiated $20K+ raises</p>
              <p className="mt-1 text-sm text-text-muted">
                14 members secured increases of $20K+. Two exceeded $50K. One surpassed $100K.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-blue">64%</p>
              <p className="mt-1 text-sm font-semibold text-navy">Landed a role during the program</p>
              <p className="mt-1 text-sm text-text-muted">
                37 of 58 members landed jobs. 21 were still actively searching at survey time.
              </p>
            </div>
          </div>

          {/* Salary Distribution + Time to Land */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-white p-6 md:p-8">
              <h3 className="text-base font-semibold text-navy">Salary Increase Distribution</h3>
              <p className="mb-5 text-sm text-text-muted">
                Among the 33 members who reported salary gains
              </p>
              <div className="space-y-3">
                {salaryDistribution.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-sm font-medium text-text">
                      {item.label}
                    </span>
                    <div className="h-4 flex-1 overflow-hidden rounded-full bg-blue-bg">
                      <div
                        className="h-full rounded-full bg-blue"
                        style={{ width: `${(item.count / maxSalary) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-sm font-semibold text-blue">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 md:p-8">
              <h3 className="text-base font-semibold text-navy">Time to Land a Job</h3>
              <p className="mb-5 text-sm text-text-muted">
                Among the 37 members who secured offers
              </p>
              <div className="space-y-3">
                {timeToLand.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-sm font-medium text-text">
                      {item.label}
                    </span>
                    <div className="h-4 flex-1 overflow-hidden rounded-full bg-blue-bg">
                      <div
                        className="h-full rounded-full bg-blue"
                        style={{ width: `${(item.count / maxTime) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-sm font-semibold text-blue">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-6 rounded-xl border-l-4 border-blue bg-white p-5">
            <p className="text-sm italic text-text-muted">
              &ldquo;I saw an 83% salary increase using ClearCareer&apos;s negotiation and interviewing techniques. As a disabled person, the program accepted me and worked with me, exactly as I am.&rdquo;
            </p>
            <p className="mt-2 text-xs font-semibold text-blue">ClearCareer Member</p>
          </div>
        </div>
      </section>

      {/* 04: Speed to Results */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue">
            04 — Speed to Results
          </p>
          <h2 className="mb-3 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
            Months of spinning. Then weeks to momentum.
          </h2>
          <p className="mb-10 max-w-xl text-text-muted">
            Of the 37 members who landed jobs, 68% did so within 2 months. 46% within a single month.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-blue">46%</p>
              <p className="mt-1 text-sm font-semibold text-navy">Landed within 1 month</p>
              <p className="mt-1 text-sm text-text-muted">
                17 of 37 who got offers did so in 4 weeks or less, after many had been stuck for months.
              </p>
              <p className="mt-2 text-xs font-medium text-blue">
                Industry avg: 1 in 5 unemployed 27+ weeks (BLS, 2025)
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-blue">68%</p>
              <p className="mt-1 text-sm font-semibold text-navy">Landed within 2 months</p>
              <p className="mt-1 text-sm text-text-muted">
                25 of 37 secured a role in under 8 weeks.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-blue">43%</p>
              <p className="mt-1 text-sm font-semibold text-navy">
                Had been searching 7+ months before
              </p>
              <p className="mt-1 text-sm text-text-muted">
                25 members were stuck for over half a year, and 64% of them landed after joining.
              </p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-6 rounded-xl border-l-4 border-blue bg-blue-bg/30 p-5">
            <p className="text-sm italic text-text-muted">
              &ldquo;I got a job in 2 weeks after two years of looking and wrote my own job description. It&apos;s pretty wild.&rdquo;
            </p>
            <p className="mt-2 text-xs font-semibold text-blue">ClearCareer Member</p>
          </div>
        </div>
      </section>

      {/* 05: What People Used */}
      <section className="bg-blue-bg/50 py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue">
            05 — What People Actually Used
          </p>
          <h2 className="mb-3 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
            Every resource rated. Every skill measured.
          </h2>
          <p className="mb-10 max-w-xl text-text-muted">
            The top-rated resources: Resume Support, Email Templates, Motivation, and Accountability.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Resource Ratings */}
            <div className="rounded-xl border border-border bg-white p-6 md:p-8">
              <h3 className="text-base font-semibold text-navy">Resource Ratings</h3>
              <p className="mb-5 text-sm text-text-muted">Average rating out of 5 from 58 members</p>
              <div className="space-y-3">
                {resources.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 text-sm font-medium text-text">
                      {item.label}
                    </span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-blue-bg">
                      <div
                        className="h-full rounded-full bg-blue"
                        style={{ width: `${(item.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-sm font-semibold text-blue">
                      {item.score.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Improvement */}
            <div className="rounded-xl border border-border bg-white p-6 md:p-8">
              <h3 className="text-base font-semibold text-navy">Skills Improvement</h3>
              <p className="mb-5 text-sm text-text-muted">
                Self-reported improvement, average out of 5
              </p>
              <div className="space-y-3">
                {skills.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 text-sm font-medium text-text">
                      {item.label}
                    </span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-blue-bg">
                      <div
                        className="h-full rounded-full bg-blue"
                        style={{ width: `${(item.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-sm font-semibold text-blue">
                      {item.score.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06: AI Fluency */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue">
            06 — AI Fluency
          </p>
          <h2 className="mb-3 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
            From &ldquo;I&apos;ve never used AI&rdquo; to fluent and confident.
          </h2>
          <p className="mb-10 max-w-xl text-text-muted">
            43% had rarely or never used AI before. Of those who compared, 98% say ClearCareer&apos;s prompts outperform anything else they&apos;ve tried.
          </p>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-blue">98%</p>
              <p className="mt-1 text-sm font-semibold text-navy">
                Rate ClearCareer prompts better
              </p>
              <p className="mt-1 text-sm text-text-muted">
                Of those who compared, 45 of 46 say the prompts produce better or significantly better results.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-blue">43%</p>
              <p className="mt-1 text-sm font-semibold text-navy">
                Had rarely or never used AI
              </p>
              <p className="mt-1 text-sm text-text-muted">
                25 members were AI beginners. The program met them where they were.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="text-3xl font-bold text-blue">57%</p>
              <p className="mt-1 text-sm font-semibold text-navy">
                Now confident and fluent with AI
              </p>
              <p className="mt-1 text-sm text-text-muted">
                33 members describe themselves as confident and fluent AI users after the program.
              </p>
            </div>
          </div>

          {/* AI Comparison + Time Saved */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-white p-6 md:p-8">
              <h3 className="text-base font-semibold text-navy">
                AI Prompt Quality vs. Other Sources
              </h3>
              <p className="mb-5 text-sm text-text-muted">
                How members compared ClearCareer prompts to others
              </p>
              <div className="space-y-3">
                {aiComparison.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 text-sm font-medium text-text">
                      {item.label}
                    </span>
                    <div className="h-4 flex-1 overflow-hidden rounded-full bg-blue-bg">
                      <div
                        className="h-full rounded-full bg-blue"
                        style={{ width: `${(item.count / item.max) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-sm font-semibold text-blue">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 md:p-8">
              <h3 className="text-base font-semibold text-navy">
                Time Saved Per Week with AI Tools
              </h3>
              <p className="mb-5 text-sm text-text-muted">
                88% of members save 1+ hours per week
              </p>
              <div className="space-y-3">
                {timeSaved.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 text-sm font-medium text-text">
                      {item.label}
                    </span>
                    <div className="h-4 flex-1 overflow-hidden rounded-full bg-blue-bg">
                      <div
                        className="h-full rounded-full bg-blue"
                        style={{ width: `${(item.count / item.max) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-sm font-semibold text-blue">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07: The Verdict */}
      <section className="bg-blue-bg/50 py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue">
            07 — The Verdict
          </p>
          <h2 className="mb-3 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
            The kind of numbers that don&apos;t need spin.
          </h2>
          <p className="mb-10 max-w-xl text-text-muted">
            NPS of 84. Average rating 4.84 out of 5. 98% rate ClearCareer better than any other program they&apos;ve tried.
          </p>

          {/* NPS */}
          <div className="mb-8 rounded-xl border border-warning/20 bg-white p-8 text-center md:p-12">
            <p className="text-6xl font-bold text-warning md:text-7xl">84</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-text-muted">
              Net Promoter Score
            </p>
            <p className="mx-auto mt-4 max-w-lg text-sm text-text-muted">
              For context: An NPS above 50 is excellent. Above 70 is world-class. Apple is 72. Netflix is 68. ClearCareer is 84.
            </p>
          </div>

          {/* Rating cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-border bg-white p-5 text-center">
              <p className="text-2xl font-bold text-blue">84%</p>
              <p className="mt-1 text-xs text-text-muted">Perfect 5/5 rating</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 text-center">
              <p className="text-2xl font-bold text-blue">71%</p>
              <p className="mt-1 text-xs text-text-muted">Perfect 10/10 recommend</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 text-center">
              <p className="text-2xl font-bold text-blue">98%</p>
              <p className="mt-1 text-xs text-text-muted">Rated better than others</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 text-center">
              <p className="text-2xl font-bold text-blue">4.84</p>
              <p className="mt-1 text-xs text-text-muted">Average rating (out of 5)</p>
            </div>
          </div>

          {/* Rating Breakdown + Recommendation */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Overall Rating Donut */}
            <div className="rounded-xl border border-border bg-white p-6 md:p-8">
              <h3 className="text-base font-semibold text-navy">Overall Program Rating</h3>
              <p className="mb-5 text-sm text-text-muted">
                84% gave a perfect 5 stars (49 of 58)
              </p>
              <div className="flex items-center gap-8">
                <div className="relative h-36 w-36 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-36 w-36 -rotate-90">
                    {/* 4 Stars: 15.5% (9 of 58) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3.5"
                      strokeDasharray="15.5 84.5"
                      strokeDashoffset="0"
                    />
                    {/* 5 Stars: 84.5% (49 of 58) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#0161EF"
                      strokeWidth="3.5"
                      strokeDasharray="84.5 15.5"
                      strokeDashoffset="-15.5"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-blue">4.84</span>
                    <span className="text-xs text-text-muted">out of 5</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-blue" />
                    <span className="text-sm text-text">5 Stars</span>
                    <span className="text-sm font-semibold text-text">49</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-border" />
                    <span className="text-sm text-text">4 Stars</span>
                    <span className="text-sm font-semibold text-text">9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Distribution */}
            <div className="rounded-xl border border-border bg-white p-6 md:p-8">
              <h3 className="text-base font-semibold text-navy">
                Likelihood to Recommend (1-10)
              </h3>
              <p className="mb-5 text-sm text-text-muted">71% gave a perfect 10 (41 of 58)</p>
              <div className="space-y-3">
                {recommendation.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-8 shrink-0 text-sm font-medium text-text">
                      {item.label}
                    </span>
                    <div className="h-4 flex-1 overflow-hidden rounded-full bg-blue-bg">
                      <div
                        className="h-full rounded-full bg-blue"
                        style={{ width: `${(item.count / item.max) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-sm font-semibold text-blue">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 08: In Their Words */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue">
            08 — In Their Words
          </p>
          <h2 className="mb-3 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
            You don&apos;t have to take our word for it.
          </h2>
          <p className="mb-10 max-w-xl text-text-muted">
            Unedited responses from the survey question: &ldquo;Did you experience any other major transformations?&rdquo;
          </p>

          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
            {quotes.map((quote, i) => (
              <div key={i} className="rounded-xl border border-border bg-white p-5">
                <p className="text-sm italic leading-relaxed text-text-muted">
                  &ldquo;{quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Note */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-blue-bg p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Methodology
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Data from 58 ClearCareer program participants surveyed in December 2024. All figures are self-reported. Individual results vary based on effort, market conditions, and role level. *The collective salary figure of $1.2M+ includes additional verified sources beyond this survey.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Industry Benchmarks Referenced
            </p>
            <p className="mt-1 text-sm text-text-muted">
              U.S. Bureau of Labor Statistics (Jan 2025), Statistics Canada (2024), LinkedIn Economic Graph (2024), Indeed Hiring Lab (2024), Pew Research Center (2023), International Coaching Federation (2023).
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        heading="Ready to Write Your Own Success Story?"
        primaryCTA={{
          text: "Book a Free Job Search Audit",
          href: "https://calendly.com/clearcareer/discovery-call",
        }}
        variant="gradient"
      />
    </>
  );
}
