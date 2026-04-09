import { useState, useMemo } from "react";

/* ── Scoring Data ── */

const ACTION_VERBS = [
  "accelerated","achieved","administered","advanced","analyzed","architected","automated",
  "boosted","built","captured","championed","closed","coached","collaborated","completed",
  "consolidated","converted","coordinated","created","cut","decreased","delivered","deployed",
  "designed","developed","directed","drove","earned","eliminated","enabled","engineered",
  "established","exceeded","executed","expanded","facilitated","formalized","founded",
  "generated","grew","guided","headed","identified","implemented","improved","increased",
  "influenced","initiated","integrated","introduced","launched","led","leveraged","managed",
  "maximized","mentored","migrated","mobilized","modernized","negotiated","onboarded",
  "optimized","orchestrated","organized","outperformed","overhauled","partnered","piloted",
  "pioneered","planned","produced","programmed","propelled","published","raised","ranked",
  "rebuilt","reduced","redesigned","refactored","reformed","remodeled","reorganized",
  "replaced","rescued","resolved","restructured","revamped","reversed","scaled","secured",
  "simplified","slashed","sold","spearheaded","stabilized","standardized","steered",
  "streamlined","strengthened","surpassed","sustained","trained","transformed","tripled",
  "uncovered","unified","upgraded","utilized","won",
];

const WEAK_PHRASES = [
  "helped","assisted","was responsible for","participated in","involved in",
  "contributed to","worked on","supported","duties included","tasked with",
  "handled","dealt with","was in charge of","was part of","played a role",
];

interface Check {
  name: string;
  pass: boolean;
  suggestion: string;
}

function scoreText(text: string): Check[] {
  const checks: Check[] = [];
  const trimmed = text.trim();
  if (!trimmed) return [];

  // 1. Action verb
  const firstWord = trimmed.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, "");
  checks.push({
    name: "Starts with a strong action verb",
    pass: ACTION_VERBS.includes(firstWord),
    suggestion: "Start with a verb like 'Led', 'Built', 'Increased', or 'Delivered'. Not 'Responsible for' or 'Helped'.",
  });

  // 2. Numbers/metrics
  const hasNumbers = /\d/.test(text) || /\b(percent|percentage|million|billion|thousand|hundred|dozen|triple|double|half)\b/i.test(text);
  checks.push({
    name: "Contains numbers or metrics",
    pass: hasNumbers,
    suggestion: "Add specific numbers: revenue ($), users, percentage improvements, team size, or timeline.",
  });

  // 3. Impact
  const hasImpact = /(result|impact|led to|which|saving|increasing|reducing|improving|generating|achieving|enabling|driving|delivering|producing|contributing|yielding|netting|securing|earning|growing|boosting|cutting|lowering|raising|adding|creating|preventing|eliminating)/i.test(text);
  checks.push({
    name: "Shows impact or result",
    pass: hasImpact,
    suggestion: "Show what happened because of your work. Add 'resulting in...', 'which led to...', or 'saving...'.",
  });

  // 4. Length
  const words = trimmed.split(/\s+/).length;
  const lengthPass = words >= 10 && words <= 30;
  checks.push({
    name: `Appropriate length (${words} words)`,
    pass: lengthPass,
    suggestion: words < 10 ? "Too short. Add more detail about what you did and the result." : "Too long. Aim for 10-30 words. Cut filler and keep the strongest details.",
  });

  // 5. No weak language
  const lower = text.toLowerCase();
  const foundWeak = WEAK_PHRASES.filter((w) => lower.includes(w));
  checks.push({
    name: "No weak language",
    pass: foundWeak.length === 0,
    suggestion: foundWeak.length > 0
      ? `Replace "${foundWeak[0]}" with a specific action verb that shows what YOU did.`
      : "",
  });

  return checks;
}

/* ── Coach Block ── */

function CoachBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border-l-4 border-blue bg-blue-bg p-5 sm:p-6">
      <div className="flex gap-3 sm:gap-4 items-start">
        <img src="/images/izzy-coaching.jpg" alt="Izzy" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5" loading="lazy" />
        <div className="text-[0.9375rem] sm:text-[1rem] leading-[1.7] text-text space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */

export default function BulletScorerCoaching() {
  const [bullet, setBullet] = useState("");

  const checks = useMemo(() => scoreText(bullet), [bullet]);
  const score = checks.filter((c) => c.pass).length;
  const hasInput = bullet.trim().length > 0;

  const scoreColor = !hasInput ? "text-gray-300" : score === 5 ? "text-emerald-600" : score >= 3 ? "text-blue" : "text-amber-600";
  const scoreMessage = !hasInput ? "" : score === 5 ? "This bullet is strong." : score >= 3 ? "Good start. A few tweaks will make it stronger." : "This needs work. Check the suggestions below.";

  return (
    <div className="space-y-8">
      {/* Coach intro */}
      <CoachBlock>
        <p>
          <strong className="text-navy">Recruiters spend 6-7 seconds scanning your resume.</strong> Most bullets fail because they describe duties instead of impact. I check five things: action verb, a number, clear impact, right length, and no weak language. Paste your bullet and rewrite until you hit 5/5.
        </p>
      </CoachBlock>

      {/* Input */}
      <div>
        <label htmlFor="bullet-input" className="block text-base font-semibold text-navy">
          Your resume bullet point
        </label>
        <p className="mt-1 text-sm text-text-muted">Paste one bullet from your resume. I'll score it instantly.</p>
        <textarea
          id="bullet-input"
          rows={3}
          value={bullet}
          onChange={(e) => setBullet(e.target.value)}
          placeholder="Led cross-functional team of 8 to redesign checkout flow, increasing conversion rate by 23% and generating $1.2M in additional annual revenue."
          className="mt-2 w-full rounded-xl border border-border bg-white py-4 px-4 text-text placeholder:text-text-muted/50 focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue/10 transition-all resize-none"
        />
      </div>

      {/* Score display */}
      <div className="rounded-xl border border-border bg-white p-6 sm:p-8 text-center">
        <p className={`font-display text-[clamp(2.5rem,6vw,3.5rem)] leading-[1.1] transition-colors duration-300 ${scoreColor}`}>
          {hasInput ? `${score}/5` : "—/5"}
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                hasInput && i < score ? (score === 5 ? "bg-emerald-500" : score >= 3 ? "bg-blue" : "bg-amber-500") : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        {scoreMessage && (
          <p className={`mt-3 text-sm font-medium transition-colors duration-300 ${scoreColor}`}>
            {scoreMessage}
          </p>
        )}
      </div>

      {/* Checks list */}
      {hasInput && (
        <div className="rounded-xl border border-border bg-white divide-y divide-border animate-fade-up">
          {checks.map((check) => (
            <div key={check.name} className="flex items-start gap-3 p-4">
              <span className={`mt-0.5 text-sm font-bold flex-shrink-0 ${check.pass ? "text-emerald-600" : "text-amber-600"}`}>
                {check.pass ? "✓" : "✗"}
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">{check.name}</p>
                {!check.pass && check.suggestion && (
                  <p className="mt-1 text-sm text-text-muted">{check.suggestion}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coach interpretation */}
      {hasInput && (
        <div className="animate-fade-up">
          <CoachBlock>
            {score === 5 ? (
              <p>
                <strong className="text-navy">Perfect score.</strong> This bullet is in the top 10% of what recruiters see. It tells them exactly what you did, how well you did it, and what it meant for the business. Put this one near the top.
              </p>
            ) : score >= 3 ? (
              <p>
                <strong className="text-navy">{score}/5 is a solid start.</strong> Focus on the items marked with ✗ above. Usually it's one missing number or a weak opening verb. One rewrite and you're there.
              </p>
            ) : (
              <p>
                <strong className="text-navy">This bullet needs a rewrite.</strong> Most people describe what they were "responsible for" instead of what they actually achieved. Flip it: start with the action, add a number, and show the result. "Responsible for managing a team" becomes "Led 8-person team to deliver $2M product launch 3 weeks ahead of schedule."
              </p>
            )}
          </CoachBlock>
        </div>
      )}

      {/* Before/After example */}
      <CoachBlock>
        <p><strong className="text-navy">Example: Before and After</strong></p>
        <div className="mt-2 rounded-lg border border-border bg-white p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Before (1/5)</p>
            <p className="mt-1 text-sm text-text italic">"Responsible for managing the marketing team and overseeing various campaigns for multiple clients."</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">After (5/5)</p>
            <p className="mt-1 text-sm text-text italic">"Led 8-person marketing team to 23% conversion increase across 12 client campaigns, generating $1.2M in annual revenue."</p>
          </div>
        </div>
        <p className="mt-3">
          Action verb, 4 numbers, clear impact, 22 words, zero weak language. A 30-second rewrite that changes everything.
        </p>
      </CoachBlock>

      {/* Tips */}
      <CoachBlock>
        <p><strong className="text-navy">Quick rules for your whole resume:</strong></p>
        <ul className="mt-2 space-y-2 text-[0.9375rem]">
          <li><strong className="text-navy">3-5 bullets for recent roles, 2-3 for older ones.</strong> Total: 12-18 bullets. More than that dilutes your strongest points.</li>
          <li><strong className="text-navy">Put your strongest bullets first.</strong> Recruiters read the first 2 closely and skim the rest.</li>
          <li><strong className="text-navy">Fragments, not sentences.</strong> No "I" at the start. No period at the end. Start with the action verb.</li>
          <li><strong className="text-navy">Run every bullet through this scorer.</strong> If your average is below 3/5, your resume needs a rewrite.</li>
        </ul>
      </CoachBlock>
    </div>
  );
}
