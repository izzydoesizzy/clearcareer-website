import { generatePageMetadata } from "@components/SEOHead";
import Hero from "@components/Hero";
import CTASection from "@components/CTASection";
import stats from "@data/stats.json";

export const metadata = generatePageMetadata({
  title: "About Izzy | ClearCareer",
  description: "Meet Izzy Piyale-Sheard: career coach, community builder, and the person behind ClearCareer. 200+ professionals coached, $1.2M+ in collective raises, featured on CBC, Global News, and Newsweek.",
  url: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Hero
        variant="page"
        eyebrow="About ClearCareer"
        headline="Built by a Career Zig-Zagger Who <span class='bg-gradient-to-r from-blue to-blue-light bg-clip-text text-transparent'>Gets It</span>"
        subheadline="I've been stuck, confused, and unmotivated in my job search. That's exactly why I built ClearCareer."
      />

      {/* My Story: Block 1 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="relative aspect-square max-w-[480px] overflow-hidden rounded-2xl shadow-xl" data-animate="slide-left">
              <img
                src="/images/izzy-main.jpeg"
                alt="Izzy Piyale-Sheard"
                className="h-full w-full object-cover object-top"
                loading="eager"
              />
            </div>
            <div data-animate="fade-up">
              <h3 className="text-2xl font-bold text-navy">Hi, I&apos;m Izzy</h3>
              <p className="mt-4 text-[1.0625rem] leading-[1.75] text-text-muted">
                As a career zig-zagger and jack-of-all-trades, I&apos;ve always struggled to create a coherent career story and showcase my value. I&apos;ve been tormented by long periods of unemployment, feeling unclear, confused, and unmotivated, stuck in negative cycles that were hard to break.
              </p>
              <p className="mt-4 text-[1.0625rem] leading-[1.75] text-text-muted">
                When I transitioned into tech, I devoured every resource about the industry. Anytime I attended events, people were mesmerized by my energy, resourcefulness, and genuine desire to connect and add value.
              </p>
              <p className="mt-4 text-[1.0625rem] leading-[1.75] text-text-muted">
                Then it clicked: my unique intersection of skills was my value. Partnerships, community, events, mentorship, rapid execution, and problem-solving. That&apos;s when job opportunities started to bubble up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* My Story: Block 2 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-[1.0625rem] leading-[1.75] text-text-muted">
                Since 2016, I&apos;ve been on a mission to create the support network and community I wished I had when I was struggling in silence.
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  { title: "Empowering Job Seekers:", desc: "Taken clients from over a year of unemployment to job offers within weeks, helped them increase their salaries by $30K" },
                  { title: "Building Community:", desc: "Founded a 900+ member peer-mentorship community for job-seekers" },
                  { title: "Media Features:", desc: "Featured on CBC's For What It's Worth, Global News, Newsweek, Inc. Magazine, Notable Life" },
                  { title: "Workshops:", desc: "Delivered workshops for University of Toronto, TMU, Humber College, CivicAction YouthConnect, Lighthouse Labs, United Nations Association in Canada" },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 flex-shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <span className="font-semibold text-text">{item.title}</span>
                      <span className="text-text-muted"> {item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-square max-w-[480px] overflow-hidden rounded-2xl shadow-xl" data-animate="slide-right">
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

      {/* By the Numbers */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-bg/50 py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-animate="fade-up">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">By the Numbers</p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">Results That Speak for Themselves</h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4" data-animate-stagger>
            {[
              { number: stats.coached, label: "Professionals Coached" },
              { number: stats.collectiveRaises, label: "Collective Raises" },
              { number: stats.communityMembers, label: "Community Members" },
              { number: stats.eventAttendees, label: "Event Attendees" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-blue-bg p-6 text-center">
                <p className="text-3xl font-bold text-blue">{stat.number}</p>
                <p className="mt-2 text-sm text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media & Press */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-animate="fade-up">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">Media & Press</p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">Featured In</h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6" data-animate-stagger>
            {(stats.mediaAppearances as { name: string; show: string }[]).map((media) => (
              <div key={media.name} className="rounded-xl border border-border bg-white p-6 text-center">
                <p className="font-semibold text-text">{media.name}</p>
                {media.show && <p className="mt-1 text-sm text-text-muted">{media.show}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Partners */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">Workshop Partners</p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">Trusted By</h2>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            {(stats.workshopPartners as string[]).map((partner) => (
              <span key={partner} className="text-lg font-semibold text-text-muted/40">{partner}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        heading="Ready to Work Together?"
        body="Book a free 20-minute Job Search Audit. Let's see if ClearCareer is right for you."
        primaryCTA={{ text: "Book a Free Audit", href: "https://calendly.com/clearcareer/discovery-call" }}
        variant="blue"
      />
    </>
  );
}
