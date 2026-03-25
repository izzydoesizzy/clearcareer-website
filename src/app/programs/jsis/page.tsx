import { generatePageMetadata } from "@components/SEOHead";
import Hero from "@components/Hero";
import StatsBar from "@components/StatsBar";
import TrustBar from "@components/TrustBar";
import PricingCard from "@components/PricingCard";
import FAQAccordion from "@components/FAQAccordion";
import CTASection from "@components/CTASection";
import SourceCitations from "@components/SourceCitations";
import JSISTestimonials from "@components/JSISTestimonials";
import deliverables from "@data/deliverables.json";
import faqItems from "@data/faq-jsis.json";
import allTestimonials from "@data/testimonials.json";

export const metadata = generatePageMetadata({
  title: "Job Search Ignition System | 8-Week Career Accelerator",
  description:
    "An 8-week done-with-you job search accelerator for senior professionals targeting $100K+ roles. 20+ career assets built for you. 3 private sessions. Group accountability. Book a free audit.",
  url: "/programs/jsis",
});

export default function JSISPage() {
  // Pick 6 specific career-outcome testimonials for the grid
  const selectedTestimonialNames = [
    "Septembre Anderson",
    "Tamara Gordon",
    "Julian Pedraza",
    "Chris Chipman",
    "Jorge Garboza",
    "Annie Bell",
  ];
  const testimonialGrid = selectedTestimonialNames
    .map((name) => allTestimonials.find((t) => t.name === name))
    .filter(
      (t): t is (typeof allTestimonials)[number] => t !== undefined
    );

  // Section 9: Client achievement cards
  const achievementNames = [
    "Tamara Gordon",
    "Kristin Davis",
    "Blake McDermott",
    "Sparsh Kalia",
    "Laura Salamanca",
    "Kira Howe",
  ];
  const achievementCards = achievementNames
    .map((name) => allTestimonials.find((t) => t.name === name))
    .filter(
      (t): t is (typeof allTestimonials)[number] => t !== undefined
    );

  // Section 14: Fence-sitter / encouragement testimonials
  const fenceSitterNames = [
    "Mazia Syed",
    "Annie Bell",
    "Kay Woods",
    "Victor Perez",
    "Septembre Anderson",
    "Chris Chipman",
  ];
  const fenceSitterCards = fenceSitterNames
    .map((name) => allTestimonials.find((t) => t.name === name))
    .filter(
      (t): t is (typeof allTestimonials)[number] => t !== undefined
    );

  return (
    <>
      {/* 1. Hero */}
      <Hero
        variant="page"
        eyebrow="An 8-Week Done-With-You Job Search Accelerator"
        headline="You've tried going it alone.<br>Let's try building it <span class='bg-gradient-to-r from-blue to-blue-light bg-clip-text text-transparent'>together.</span>"
        subheadline="For the senior professional who's been grinding alone. A place to rebuild your assets, overhaul your strategy, and find your footing again. Together."
        primaryCTA={{
          text: "Book My Free Job Search Audit",
          href: "https://calendly.com/clearcareer/discovery-call",
        }}
        secondaryCTA={{ text: "See What's Inside", href: "#deliverables" }}
        trustText="Free 20-minute call · No commitment · No pressure"
      />

      {/* 2. Stats Bar */}
      <StatsBar
        stats={[
          { number: "84%", label: "5-Star Rating" },
          { number: "$1.2M+", label: "Collective Raises" },
          { number: "46%", label: "Landed Within 1 Month" },
          { number: "98%", label: "Rated Better Than Other Programs" },
        ]}
      />

      {/* 3. Trust Bar */}
      <TrustBar />

      {/* 4. The Problem Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">
              The Problem
            </p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              You&apos;ve tried grinding alone. Let&apos;s try building
              together.
            </h2>
          </div>

          <div className="mt-10 space-y-5 text-[1.0625rem] leading-[1.75] text-text">
            <p>
              You want accountability, not just advice you&apos;ll &quot;get to
              later.&quot;
            </p>
            <p>
              You want to see your achievements written out and think:{" "}
              <em>wait, I&apos;m actually kind of incredible.</em> You want a
              done-for-you resume and LinkedIn that finally reflects the
              professional you actually are. You want a strategy overhauled from
              the ground up. You want to feel recharged, not depleted, by your
              job search.
            </p>
            <p className="font-semibold">You&apos;ve run the math:</p>
            <ul className="space-y-3 pl-1">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0">👉</span>
                <span>
                  At <strong>$100K+</strong>, every month without a job costs
                  you <strong>~$8,000+</strong> in lost income
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0">👉</span>
                <span>
                  The average job search takes <strong>5.5 months</strong> (BLS,
                  2025). For senior roles, <strong>6-9 months</strong> (LinkedIn,
                  2024). That&apos;s up to <strong>$50K-$75K</strong> in
                  foregone salary
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0">👉</span>
                <span>
                  You&apos;ve applied. You&apos;ve tailored. You&apos;ve
                  followed up. You&apos;ve gotten silence.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0">👉</span>
                <span>
                  You don&apos;t need more effort. You need a{" "}
                  <strong>completely different system</strong>, built with you
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0">👉</span>
                <span>
                  And you need people in your corner. Peers who get it,
                  celebrating your wins and keeping you moving
                </span>
              </li>
            </ul>
            <p className="pt-2 text-lg font-semibold text-navy">
              Welcome to the Job Search Ignition System.
            </p>

            <SourceCitations
              variant="section"
              sources={[
                {
                  source: "U.S. Bureau of Labor Statistics",
                  year: 2025,
                  url: "https://www.bls.gov/news.release/empsit.nr0.htm",
                },
                {
                  source: "LinkedIn Economic Graph",
                  year: 2024,
                  url: "https://economicgraph.linkedin.com/",
                },
                {
                  source: "Indeed Hiring Lab",
                  year: 2024,
                  url: "https://www.hiringlab.org/",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 5. The Program Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">
              The Program
            </p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              Introducing the Job Search Ignition System
            </h2>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="inline-flex rounded-full bg-blue-bg px-4 py-2 text-sm font-semibold text-blue">
              20+ assets built for you
            </span>
            <span className="inline-flex rounded-full bg-blue-bg px-4 py-2 text-sm font-semibold text-blue">
              Cohort of up to 10
            </span>
            <span className="inline-flex rounded-full bg-blue-bg px-4 py-2 text-sm font-semibold text-blue">
              3x 1:1 sessions with Izzy
            </span>
            <span className="inline-flex rounded-full bg-blue-bg px-4 py-2 text-sm font-semibold text-blue">
              8 weeks of building
            </span>
          </div>

          <div className="mt-10 space-y-5 text-[1.0625rem] leading-[1.75] text-text">
            <p>
              A tight cohort of up to 10. 8 weeks of building, not just talking.
              Done-for-you resume, LinkedIn, and outreach assets. Three private
              1:1 sessions with Izzy. Group accountability that makes this feel
              less like a grind and more like a team sport.
            </p>
            <p>
              This isn&apos;t a course you&apos;ll watch at 11pm and never
              finish. It&apos;s a hands-on program where we rebuild your job
              search infrastructure from the foundation up, with peers who are in
              it with you and 1:1 time with Izzy to make sure everything reflects
              you.
            </p>
            <p>
              By Week 8, you&apos;ll have 20+ assets you can use forever.
              You&apos;ll walk out with a strategy you actually believe in, and a
              belief in yourself you&apos;d almost forgotten.
            </p>
            <p>
              <strong>
                Sign up early and you&apos;ll get priority access to your first
                1:1 session with Izzy
              </strong>
              , so your assets are in order and you&apos;re applying before the
              cohort even officially kicks off.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Deliverables Section */}
      <section className="py-16 md:py-24" id="deliverables">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">
              What&apos;s Included
            </p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              Here&apos;s What You Get
            </h2>
          </div>

          {/* Done-For-You Asset Bundle */}
          <div className="mt-12 rounded-2xl bg-blue-bg p-6 sm:p-8">
            <h3 className="text-xl font-bold text-navy">
              Done-For-You Asset Bundle
            </h3>
            <p className="mt-1 text-sm font-semibold text-blue">
              Built from your AI Intake Interview
            </p>
            <p className="mt-4 text-[1.0625rem] leading-[1.75] text-text">
              Every asset below is built <em>for you</em>, not assigned as
              homework. This is what sets the Job Search Ignition System apart
              from every other coaching program. Other coaches tell you what to
              do. You still go home and have to do all of it yourself. Not here.
            </p>

            <div className="mt-8 space-y-8">
              {deliverables.pillars.map((pillar) => (
                <div key={pillar.name}>
                  <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue">
                    {pillar.name}{" "}
                    <span className="font-normal text-text-muted">
                      (Weeks {pillar.weeks})
                    </span>
                  </h4>
                  <div className="space-y-3">
                    {pillar.deliverables.map((item) => (
                      <div key={item.name} className="flex items-start gap-3">
                        <svg
                          className="mt-1 h-5 w-5 flex-shrink-0 text-success"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <p className="text-[1.0625rem] leading-[1.75] text-text">
                          <strong>{item.name}</strong> - {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support & Services */}
          <div className="mt-16">
            <h3 className="text-center text-xl font-bold text-navy">
              Support & Services
            </h3>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Featured: LinkedIn Content System (spans 2 cols on lg) */}
              <div className="rounded-xl border border-blue bg-blue-bg/30 p-6 shadow-sm ring-2 ring-blue/20 transition-shadow hover:shadow-md lg:col-span-2">
                <span className="text-2xl">📣</span>
                <p className="mt-3 text-lg font-semibold text-text">
                  LinkedIn Content System
                </p>
                <p className="mt-2 text-[1.0625rem] leading-[1.75] text-text-muted">
                  Most job seekers are invisible. The LinkedIn Content System
                  changes that. Each week, we build 1-2 story-based posts drawn
                  from your experience, written to reflect what you do best and
                  keep you front-of-mind with hiring managers, recruiters, and
                  your network. Passive visibility that works while you sleep.
                </p>
              </div>

              {/* 3x Private 1:1 Sessions */}
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-2xl">🤝</span>
                <p className="mt-3 text-lg font-semibold text-text">
                  3x Private 1:1 Sessions with Izzy
                </p>
                <p className="mt-2 text-[1.0625rem] leading-[1.75] text-text-muted">
                  60-min Kickoff (Week 1) · 45-min Mid-Program Review (Week 4) ·
                  60-min Closing Strategy Call (Week 8). Use them for strategy,
                  asset sign-off, confidence work, or whatever you need most.
                  These are yours.
                </p>
              </div>

              {/* Weekly Monday Check-In */}
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-2xl">📅</span>
                <p className="mt-3 text-lg font-semibold text-text">
                  Weekly Monday Check-In{" "}
                  <span className="ml-2 inline-flex rounded-full bg-blue-bg px-2 py-0.5 text-xs font-semibold text-blue">
                    30 min
                  </span>
                </p>
                <p className="mt-2 text-[1.0625rem] leading-[1.75] text-text-muted">
                  Set your priorities for the week. Never start a Monday adrift
                  again.
                </p>
              </div>

              {/* Weekly Wednesday Group Call */}
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-2xl">📅</span>
                <p className="mt-3 text-lg font-semibold text-text">
                  Weekly Wednesday Group Call
                </p>
                <p className="mt-2 text-[1.0625rem] leading-[1.75] text-text-muted">
                  Mid-week touchpoint to troubleshoot what isn&apos;t working and
                  keep momentum going. This is where breakthroughs happen in
                  front of people who are rooting for you.
                </p>
              </div>

              {/* WhatsApp Async Support */}
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-2xl">💬</span>
                <p className="mt-3 text-lg font-semibold text-text">
                  WhatsApp Async Support{" "}
                  <span className="ml-2 inline-flex rounded-full bg-blue-bg px-2 py-0.5 text-xs font-semibold text-blue">
                    Weekdays
                  </span>
                </p>
                <p className="mt-2 text-[1.0625rem] leading-[1.75] text-text-muted">
                  Izzy is in your corner between sessions. Ask questions, share a
                  draft, get unstuck. Available weekday business hours with
                  lighter support evenings and weekends.
                </p>
              </div>

              {/* Private Skool Community */}
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-2xl">🏘️</span>
                <p className="mt-3 text-lg font-semibold text-text">
                  Private Skool Community
                </p>
                <p className="mt-2 text-[1.0625rem] leading-[1.75] text-text-muted">
                  Share wins, vent frustrations, ask &quot;is this
                  normal?&quot;, and celebrate offers together. The community is
                  where exhaustion turns into momentum.
                </p>
              </div>

              {/* Weekly Voice Notes from Izzy */}
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-2xl">🎙️</span>
                <p className="mt-3 text-lg font-semibold text-text">
                  Weekly Voice Notes from Izzy
                </p>
                <p className="mt-2 text-[1.0625rem] leading-[1.75] text-text-muted">
                  A question, a tip, a nudge every single week, so you never
                  feel like you&apos;re drifting.
                </p>
              </div>

              {/* Full AI Prompt Library */}
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-2xl">🤖</span>
                <p className="mt-3 text-lg font-semibold text-text">
                  Full AI Prompt Library{" "}
                  <span className="ml-2 inline-flex rounded-full bg-blue-bg px-2 py-0.5 text-xs font-semibold text-blue">
                    30+ prompts
                  </span>
                </p>
                <p className="mt-2 text-[1.0625rem] leading-[1.75] text-text-muted">
                  Resume, LinkedIn, company research, outreach, interview prep.
                  Built specifically for senior professionals. Ready to use in
                  seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Mid-Page CTA */}
      <CTASection
        heading="10 Spots. Limited Cohort."
        body="The smaller the group, the more attention you get. Book your free audit to see if this is right for you."
        primaryCTA={{
          text: "Book My Free Job Search Audit",
          href: "https://calendly.com/clearcareer/discovery-call",
        }}
        variant="blue"
      />

      {/* 8, 9, 14: Testimonial sections (client component) */}
      <JSISTestimonials
        testimonialGrid={testimonialGrid}
        achievementCards={achievementCards}
        fenceSitterCards={fenceSitterCards}
      />

      {/* 10. Who It's For / Not For */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">
              Is This Right for You?
            </p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              This program is built for a specific kind of professional
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* Who It's For */}
            <div className="rounded-xl border border-border border-l-4 border-l-success bg-white p-8">
              <h3 className="text-xl font-bold text-navy">
                Who It&apos;s For
              </h3>
              <p className="mt-2 text-sm text-text-muted">
                This is for you if any of these ring true.
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  "You're earning or targeting $100K+ in tech, product, data, engineering, finance, or marketing",
                  "You've been laid off and the severance clock is ticking. You know every month costs you $8K+ and you want to move strategically, not desperately",
                  "You've sent out 50-200+ applications with little or nothing back (you're motivated, your system is broken)",
                  "You've worked with coaches before who gave you advice and left you to figure it out alone. You want someone to build it with you",
                  "You want a group of people who actually get it, who will celebrate your first reply, challenge your excuses, and keep you accountable every single week",
                  "You're quietly employed and searching, and you need something that works around your schedule (no evening calls, no one at work needs to know)",
                  "You're ready to commit 3-5 hours/week for 8 weeks and do the work",
                ].map((item) => (
                  <li
                    key={item.slice(0, 30)}
                    className="flex items-start gap-3 text-[1.0625rem] leading-[1.75] text-text"
                  >
                    <svg
                      className="mt-1 h-5 w-5 flex-shrink-0 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-semibold text-text">
                If you&apos;ve been grinding alone and getting nowhere, this is
                where you refuel.
              </p>
            </div>

            {/* Who It's Not For */}
            <div className="rounded-xl border border-border border-l-4 border-l-red-500 bg-white p-8">
              <h3 className="text-xl font-bold text-navy">
                Who It&apos;s Not For
              </h3>
              <p className="mt-2 text-sm text-text-muted">
                This program is not the right fit if:
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  "You have fewer than 7 years of professional experience. The cohort is designed for senior professionals",
                  "You're not able to commit 3-5 hours a week to your search right now. The system works, but only if you work it",
                  "You want a done-for-you service where someone else handles everything. This is a done-with-you program",
                  "You want solo, self-paced learning. Group accountability is central to how this works",
                  "You're not targeting $100K+ roles. The assets, strategy, and targeting are built for senior-level searches",
                  "You want a guarantee. No one can promise you a job, and I won't pretend otherwise",
                ].map((item) => (
                  <li
                    key={item.slice(0, 30)}
                    className="flex items-start gap-3 text-[1.0625rem] leading-[1.75] text-text"
                  >
                    <svg
                      className="mt-1 h-5 w-5 flex-shrink-0 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-semibold text-text">
                If any of those feel like you right now, this probably isn&apos;t
                your moment, and that&apos;s okay. The right program at the wrong
                time isn&apos;t the right program.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. About Izzy Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">
              Meet Your Coach
            </p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              Meet Izzy
            </h2>
          </div>

          {/* First block */}
          <div className="mt-12 grid items-center gap-8 md:grid-cols-2">
            <div
              className="relative aspect-square max-w-[480px] overflow-hidden rounded-2xl shadow-xl"
              data-animate="slide-left"
            >
              <img
                src="/images/izzy-main.jpeg"
                alt="Izzy Piyale-Sheard"
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <div
              className="space-y-5 text-[1.0625rem] leading-[1.75] text-text"
              data-animate="fade-up"
            >
              <h3 className="text-xl font-bold text-navy">
                Hi there, I&apos;m Izzy
              </h3>
              <p>
                As a career zig-zagger and jack-of-all-trades, I&apos;ve always
                struggled to create a coherent career story and showcase my
                value.
              </p>
              <p>
                I&apos;ve been tormented by long periods of unemployment, feeling
                unclear, confused, and unmotivated, and been stuck in negative
                cycles that were hard to break.
              </p>
              <p>
                When I transitioned into tech, I devoured every resource about
                the industry. It was then I found out that anytime I attended
                events, people were mesmerized by my{" "}
                <strong>
                  energy, resourcefulness, and genuine desire to connect and add
                  value.
                </strong>
              </p>
              <p>
                Then it clicked: my unique intersection of skills <em>was</em>{" "}
                my value, partnerships, community, events, mentorship, rapid
                execution, and problem-solving.
              </p>
              <p>
                <strong>
                  That&apos;s when job opportunities started to bubble up.
                </strong>
              </p>
            </div>
          </div>

          {/* Second block */}
          <div className="mt-16 grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-5 text-[1.0625rem] leading-[1.75] text-text md:order-1">
              <p>
                Since 2016, I&apos;ve been on a mission to create the support
                network and community I wished I had when I was struggling in
                silence.
              </p>
              <p>
                <strong>Here&apos;s a snapshot:</strong>
              </p>
              <ul className="space-y-3">
                <li>
                  <strong>Empowering Job Seekers:</strong> I&apos;ve taken
                  clients from over a year of unemployment to job offers within
                  weeks, helped them increase their salaries by $30K, and given
                  them confidence in their negotiation skills, guiding hundreds
                  to feel valued and worthy again.
                </li>
                <li>
                  <strong>Building Community:</strong> I founded a 900+ member
                  peer-mentorship community for job seekers.
                </li>
                <li>
                  <strong>Media Features:</strong> I&apos;ve been featured on
                  podcasts and radio shows including CBC&apos;s For What
                  It&apos;s Worth, Notable Life, CreateCommunity, and more.
                </li>
                <li>
                  <strong>Workshops:</strong> I&apos;ve been asked to deliver
                  workshops for UofT, TMU, Humber College, CivicAction
                  YouthConnect, Lighthouse Labs, and the United Nations
                  Association in Canada.
                </li>
              </ul>
              <p>
                With that said, welcome to the ClearCareer Community! I&apos;m
                excited to see you inside!
              </p>
            </div>
            <div
              className="relative aspect-square max-w-[480px] overflow-hidden rounded-2xl shadow-xl md:order-2"
              data-animate="slide-right"
            >
              <img
                src="/images/izzy-more.webp"
                alt="Izzy speaking at an event"
                className="h-full w-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 12. Pricing Section */}
      <section className="py-16 md:py-24" id="pricing">
        <div className="mx-auto max-w-[600px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">
              Your Investment
            </p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              Founding Member Pricing
            </h2>
          </div>

          <div className="mt-12">
            <PricingCard
              tier="March 2026 Cohort · Founding Member"
              price="$2,497"
              features={[
                "Professionally written resume with 15-20 quantified, CAR-formatted achievements",
                "LinkedIn rebuild: headline (3 versions), About Me section, custom banner",
                "AI-enhanced or created professional headshot",
                "50+ target companies + alternative job titles + research-backed salary ranges",
                "STAR story bank (10-12 stories) + 15-20 custom interview questions",
                "Full outreach toolkit: cold email, DM, recruiter intro, follow-up + thank-you templates",
                "Salary negotiation strategy + counteroffer scripts",
                "3x private 1:1 sessions with Izzy (Kickoff, Mid-Program Review, Closing Strategy)",
                "8 weeks of Monday check-ins + Wednesday group calls + WhatsApp async support",
                "LinkedIn Content System: 1-2 story-based posts per week, written for you",
                "Job search tracking system + full AI prompt library (30+ prompts)",
              ]}
              ctaText="Enroll as Founding Member"
              ctaHref="https://buy.stripe.com/8x25kD1RH3cp8KO1ZTbfO1i"
              featured={true}
              paymentPlan="Or 3 payments of $833/mo"
            />

            <div className="mt-6 text-center">
              <p className="text-sm text-text-muted">
                Not ready to enroll yet?
              </p>
              <a
                href="https://calendly.com/clearcareer/discovery-call"
                className="mt-1 inline-block text-sm font-semibold text-blue hover:text-blue-dark"
              >
                Book a free 20-minute Job Search Audit &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 12b. Guarantee */}
      <section className="bg-blue-bg py-16 md:py-20">
        <div className="mx-auto max-w-[640px] px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <svg
              className="h-8 w-8 text-blue"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <h2 className="mb-4 font-display text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.15] text-navy">
            The ClearCareer Guarantee
          </h2>
          <p className="leading-relaxed text-text">
            If you complete the full 8-week program and haven&apos;t landed
            interviews, I&apos;ll keep coaching you at no extra cost until you
            do. Weekly calls, async support, the full system. That&apos;s how
            confident I am in this process.
          </p>
        </div>
      </section>

      {/* 13. FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">
              FAQ
            </p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mt-12">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* 15. Final CTA */}
      <CTASection
        heading="Ready to stop grinding alone?"
        body="Book a free 20-minute Job Search Audit with Izzy. We'll diagnose what's broken and walk you through exactly what we'd build together."
        primaryCTA={{
          text: "Book My Free Job Search Audit",
          href: "https://calendly.com/clearcareer/discovery-call",
        }}
        secondaryCTA={{
          text: "Enroll as Founding Member",
          href: "https://buy.stripe.com/8x25kD1RH3cp8KO1ZTbfO1i",
        }}
        variant="blue"
      />
    </>
  );
}
