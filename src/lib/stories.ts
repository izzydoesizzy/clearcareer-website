/**
 * Real stories only. Every line here comes from a client's own public review or
 * testimonial (src/data/llu.ts) or from Izzy's own story (About page, voice guide).
 * Never add a detail that isn't in those sources.
 */
import type { BookCallAnswers, DiagnosisKey } from './book-call.js';
import { PROGRAMS } from './book-call.js';

export interface Story {
  /** Who, in the client's own framing. */
  who: string;
  /** Short story in plain words, with only the facts from the source. */
  story: string;
  /** Their exact words. */
  quote: string;
}

export const STORIES = {
  darin: {
    who: 'Darin M., project manager in tech',
    story: "Darin had applied for more than 600 jobs. Six hundred. And landed three interviews. So we slowed everything down. Fewer applications, better ones. We put numbers on Darin's achievements, refined the resume, and Darin started reaching out to hiring managers directly.",
    quote: 'Things turned around rapidly, I signed an offer maintaining my salary without needing to take a pay cut like countless jobseekers.',
  },
  blake: {
    who: 'Blake M., moving into digital marketing',
    story: 'Blake was changing fields. Over 200 applications, 10 interviews, zero offers.',
    quote: 'When I started using the "Izzy Method," everything changed.',
  },
  kristin: {
    who: 'Kristin D., growth marketing manager',
    story: 'Kristin had a lot of experience. That was never the problem. Kristin had been looking for full-time work for an entire year and was still stuck.',
    quote: 'After working with Izzy, I was employed in just three weeks.',
  },
  sparsh: {
    who: 'Sparsh K., operations and process improvement',
    story: 'Sparsh came to me after more than a year of frustration. Sparsh followed the plan exactly and kept showing up to the weekly group sessions.',
    quote: "Within 30 days, I had a job. The weekly group sessions kept me motivated, and Izzy's personalized approach made all the difference.",
  },
  laura: {
    who: 'Laura S., program manager in reproductive health',
    story: 'Laura and I worked on three things: showing value with proof, preparing for the interview, and sending an impactful follow-up email after it.',
    quote: 'I landed the role and bumped my salary by $22,000 a year (more than a 30% increase!).',
  },
  tamara: {
    who: 'Tamara G., educator turned customer success leader',
    story: 'Tamara was doing the work and still stuck. Putting that value into words was hard, and the conflicting advice out there made it worse.',
    quote: 'Within weeks, I landed multiple interviews. I ultimately landed a role with a $20,000 salary increase + annual bonuses, giving me the financial stability I needed for my family.',
  },
  raunika: {
    who: 'Raunika L., 13+ years in financial services',
    story: "Raunika was aiming for a director role, with doubts. We refined the target roles, updated the resume and LinkedIn, and prepped for interviews. The key moment was reframing those doubts by naming exactly what made Raunika's experience valuable.",
    quote: 'I stayed focused and landed a Director-level role at a large Canadian payments company.',
  },
  septembre: {
    who: 'Septembre A., front-end web developer',
    story: 'Septembre and I rebuilt the resume, sharpened the interview answers, and worked on the part nobody talks about: believing the value is real.',
    quote: 'I woke up to interviews after applying with my new resume, and I negotiated $10K above the offer.',
  },
  chris: {
    who: 'Chris C.',
    story: 'Chris went after an internal move. We narrowed the story down to quantified metrics and accomplishments Chris could point to in the interview, and in the salary conversation.',
    quote: 'I landed an internal Associate Director role and secured a $25k pay increase, far exceeding my expectations.',
  },
  kira: {
    who: 'Kira H., staff software engineer',
    story: 'Kira was moving from freelance to full-time. The lightbulb moment came when we looked at the search from the employer\'s side of the table.',
    quote: 'Together we refined my story, and his invaluable support empowered me to negotiate a strong counteroffer.',
  },
  andrew: {
    who: 'Andrew C.',
    story: 'Andrew had already paid for expensive career courses. They didn\'t lead anywhere. Hundreds of applications, no results.',
    quote: "Izzy's system completely transformed my job search from sending out hundreds of applications with no results, to receiving responses from employers within the first week of joining his program.",
  },
  annie: {
    who: 'Annie B.',
    story: 'Annie had been in a LONG job search black hole. Annie looked at coaching and was blown away by the $1,500+ price tags with zero promises.',
    quote: 'If you\'re on the fence, go for it. I joined Izzy\'s course (at a fraction of the cost I should add) and within weeks got 2 offers.',
  },
  victor: {
    who: 'Victor P., senior project manager',
    story: 'Victor and I redesigned the LinkedIn profile and rebuilt the resume.',
    quote: "Amazed how just 2 weeks after partnering with Izzy I've landed 3 interviews directly with the employer, not recruiter screenings!",
  },
} satisfies Record<string, Story>;

/** Izzy's own story. From the About page and the voice guide. */
export const IZZY = {
  zigzag:
    "I'm a career zig-zagger. For years I couldn't tell a clear story about my own work. I went through long stretches of unemployment, feeling unclear, confused and unmotivated, stuck in cycles I couldn't break. I was between jobs. I didn't have money to burn.",
  click:
    'What changed things for me was asking. I volunteered at events I could never have afforded, and I asked for help, and I ended up in about $2,000 worth of conferences for free. And somewhere in those rooms it clicked: my weird mix of skills WAS my value. Partnerships, community, events, getting things done fast. Once I could say that clearly, opportunities started to show up.',
  mission: "In 2016 I started building the support network I wished I'd had when I was struggling in silence. That started as a Facebook group that grew to 900 people.",
  selling: 'Confession: when I started coaching, I was terrified of selling. I was afraid of being spammy. Then I realised I wasn\'t selling. I was coaching. Selling is serving, when the thing actually helps.',
};

/** The story that matches each diagnosis, used in pre-call emails, follow-ups and Izzy's brief. */
export const STORY_FOR: Record<DiagnosisKey, Story> = {
  positioning: STORIES.darin,
  interviewing: STORIES.laura,
  clarity: STORIES.tamara,
  tuning: STORIES.septembre,
};

/** A long search gets the long-search story instead, because that's what they'll relate to. */
export function storyFor(key: DiagnosisKey, a?: Partial<BookCallAnswers>): Story {
  if (a?.searchLength && ['11-12 months', '1+ years'].includes(a.searchLength) && key !== 'interviewing') return STORIES.kristin;
  if (a?.yearsExperience && a.yearsExperience >= 13 && key === 'clarity') return STORIES.raunika;
  return STORY_FOR[key];
}

/** Which program to recommend, and why, from their answers. */
export function recommend(a: BookCallAnswers): { program: string; why: string } {
  const g = PROGRAMS.group.name;
  const p = PROGRAMS.private.name;
  const resume = a.struggles.some((s) => s.startsWith('Resume Writing'));
  if (a.program === p) return { program: p, why: 'They picked it on the form. Confirm it, do not talk them down unless money comes up.' };
  if (a.program === g) {
    if (resume && a.yearsExperience >= 10 && a.payment === 'Credit card in full')
      return { program: g, why: `They picked the group. Offer the private rebuild once, as an option: ${a.yearsExperience} years of experience, resume is a named struggle, and they'd pay by card.` };
    return { program: g, why: 'They picked it on the form. Confirm it and close.' };
  }
  if (resume || a.yearsExperience >= 10)
    return { program: p, why: `Not sure yet on the form. ${resume ? 'Resume is a named struggle' : `${a.yearsExperience} years of experience`}, so the 1:1 rebuild is the strongest fit. Have the group as the fallback.` };
  return { program: g, why: 'Not sure yet on the form. The group fits their answers. Mention the private rebuild only if they ask for more 1:1 time.' };
}
