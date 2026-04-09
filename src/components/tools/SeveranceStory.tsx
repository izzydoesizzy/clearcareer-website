import { useState, useRef } from "react";
import {
  PROVINCES,
  calculateEsa,
  estimateCommonLaw,
  findComparableCases,
  type JobLevel,
  type EsaResult,
  type CommonLawEstimate,
  type ComparableCase,
} from "../layoff-kit/calculator-data";

const JOB_LEVELS: { value: JobLevel; label: string }[] = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid-Level" },
  { value: "senior", label: "Senior / Specialist" },
  { value: "director", label: "Director / VP" },
  { value: "executive", label: "C-Suite / Executive" },
];

function formatDollars(n: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
}

/* ── Story Arc Severance Calculator ── */

export default function SeveranceStory() {
  const [province, setProvince] = useState("ON");
  const [years, setYears] = useState<number | "">("");
  const [age, setAge] = useState<number | "">("");
  const [salary, setSalary] = useState<number | "">("");
  const [jobLevel, setJobLevel] = useState<JobLevel>("mid");
  const [inducement, setInducement] = useState(false);
  const [hasTermClause, setHasTermClause] = useState<"no" | "yes" | "unknown">("unknown");
  const [result, setResult] = useState<{
    esa: EsaResult;
    commonLaw: CommonLawEstimate;
    comparableCases: ComparableCase[];
    weeklyPay: number;
  } | null>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  const isReady = years !== "" && age !== "" && salary !== "";

  function handleReveal() {
    if (!isReady || !salary) return;
    const esa = calculateEsa(province, years as number, salary as number);
    const commonLaw = estimateCommonLaw(years as number, age as number, jobLevel, inducement);
    const comparableCases = findComparableCases(age as number, years as number, jobLevel, inducement);
    setResult({ esa, commonLaw, comparableCases, weeklyPay: (salary as number) / 52 });
    setTimeout(() => {
      revealRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const midDollars = result
    ? Math.round((result.commonLaw.midMonths / 12) * (salary as number))
    : 0;
  const lowDollars = result
    ? Math.round((result.commonLaw.lowMonths / 12) * (salary as number))
    : 0;
  const highDollars = result
    ? Math.round((result.commonLaw.highMonths / 12) * (salary as number))
    : 0;
  const gapAboveEsa = result ? midDollars - result.esa.totalDollars : 0;

  return (
    <div>
      {/* ── Section 1: The Context (dark) ── */}
      <section className="bg-navy py-16 sm:py-24 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue/5 blur-[100px]" />
        </div>
        <div className="relative max-w-[560px] mx-auto">
          <p className="text-blue-light text-sm font-semibold uppercase tracking-widest mb-6">
            Canadian Severance Estimator
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] leading-[1.1] text-white">
            Most people accept the first number their employer offers.
            <span className="text-blue-light"> It's almost never enough.</span>
          </h2>
          <p className="mt-6 text-white/50 text-lg">
            Find out what courts have actually awarded in cases like yours.
          </p>
          <div className="mt-8 animate-bounce">
            <svg className="w-6 h-6 mx-auto text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Section 2: Your Details (light) ── */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-[520px] mx-auto">
          <div className="text-center mb-10">
            <p className="font-display text-sm italic text-text-muted">Chapter One</p>
            <h3 className="font-display text-[clamp(1.25rem,3vw,1.75rem)] text-navy mt-1">Your Situation</h3>
          </div>

          {/* Disclaimer */}
          <div className="mb-8 rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>This is not legal advice.</strong> Educational estimates based on general Canadian employment law. Consult an employment lawyer before making decisions.
            </p>
          </div>

          <div className="space-y-6">
            {/* Province */}
            <div>
              <p className="font-display italic text-text-muted text-sm mb-2">Where do you work?</p>
              <select
                value={province}
                onChange={(e) => { setProvince(e.target.value); setResult(null); }}
                className="w-full border-0 border-b-2 border-border bg-transparent py-3 text-lg text-navy focus:border-blue focus:outline-none focus:ring-0 transition-colors cursor-pointer"
              >
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Years + Age side by side */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-display italic text-text-muted text-sm mb-2">Years at this job...</p>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={50}
                  step={0.5}
                  placeholder="7"
                  value={years}
                  onChange={(e) => { setYears(e.target.value ? Number(e.target.value) : ""); setResult(null); }}
                  className="w-full border-0 border-b-2 border-border bg-transparent py-3 text-xl text-navy placeholder:text-text-muted/40 focus:border-blue focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
              <div>
                <p className="font-display italic text-text-muted text-sm mb-2">Your age...</p>
                <input
                  type="number"
                  inputMode="numeric"
                  min={18}
                  max={80}
                  placeholder="45"
                  value={age}
                  onChange={(e) => { setAge(e.target.value ? Number(e.target.value) : ""); setResult(null); }}
                  className="w-full border-0 border-b-2 border-border bg-transparent py-3 text-xl text-navy placeholder:text-text-muted/40 focus:border-blue focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
            </div>

            {/* Salary */}
            <div>
              <p className="font-display italic text-text-muted text-sm mb-2">Your annual salary (CAD)...</p>
              <div className="relative">
                <span className="absolute left-0 bottom-3 text-text-muted text-lg">$</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1000}
                  placeholder="120,000"
                  value={salary}
                  onChange={(e) => { setSalary(e.target.value ? Number(e.target.value) : ""); setResult(null); }}
                  className="w-full border-0 border-b-2 border-border bg-transparent py-3 pl-6 text-xl text-navy placeholder:text-text-muted/40 focus:border-blue focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
            </div>

            {/* Job Level */}
            <div>
              <p className="font-display italic text-text-muted text-sm mb-2">Your role level...</p>
              <select
                value={jobLevel}
                onChange={(e) => { setJobLevel(e.target.value as JobLevel); setResult(null); }}
                className="w-full border-0 border-b-2 border-border bg-transparent py-3 text-lg text-navy focus:border-blue focus:outline-none focus:ring-0 transition-colors cursor-pointer"
              >
                {JOB_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Inducement */}
            <div>
              <p className="font-display italic text-text-muted text-sm mb-3">Were you recruited away from a stable job?</p>
              <div className="flex gap-4">
                {[false, true].map((v) => (
                  <button
                    key={String(v)}
                    onClick={() => { setInducement(v); setResult(null); }}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      inducement === v
                        ? "bg-navy text-white"
                        : "bg-gray-100 text-text-muted hover:bg-gray-200"
                    }`}
                  >
                    {v ? "Yes" : "No"}
                  </button>
                ))}
              </div>
              {inducement && (
                <p className="mt-2 text-xs text-blue leading-relaxed">
                  Courts increase severance when you were recruited away from secure employment. In <em>Rodgers v CEVA</em>, 3 years of service resulted in 14 months.
                </p>
              )}
            </div>

            {/* Termination Clause */}
            <div>
              <p className="font-display italic text-text-muted text-sm mb-3">Does your contract have a termination clause?</p>
              <div className="flex gap-3">
                {(["unknown", "no", "yes"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => { setHasTermClause(v); setResult(null); }}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      hasTermClause === v
                        ? "bg-navy text-white"
                        : "bg-gray-100 text-text-muted hover:bg-gray-200"
                    }`}
                  >
                    {v === "unknown" ? "Not sure" : v === "no" ? "No" : "Yes"}
                  </button>
                ))}
              </div>
              {hasTermClause === "yes" && (
                <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>A termination clause may limit your entitlement</strong> to the ESA minimum. However, many are poorly drafted and unenforceable. Have a lawyer review yours. The estimates below assume no enforceable clause.
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleReveal}
            disabled={!isReady}
            className={`mt-10 w-full rounded-full py-4 text-lg font-semibold transition-all ${
              isReady
                ? "bg-navy text-white hover:bg-navy/90 hover:shadow-lg hover:shadow-navy/20 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Show Me My Estimate
          </button>
        </div>
      </section>

      {/* ── Section 3: The Reveal (dark) ── */}
      <section
        ref={revealRef}
        className={`relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 transition-all duration-700 ${
          result ? "bg-navy" : "bg-gray-100"
        }`}
      >
        {result && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-blue/8 blur-[120px]" />
          </div>
        )}

        <div className="relative max-w-[640px] mx-auto">
          {result ? (
            <>
              {/* Hero: Common-law mid estimate */}
              <div className="text-center">
                <p className="text-blue-light text-sm font-semibold uppercase tracking-widest mb-4">
                  Common-Law Estimate
                </p>
                <p className="font-display text-[clamp(3.5rem,10vw,6rem)] leading-none text-white">
                  {result.commonLaw.midMonths} months
                </p>
                <p className="mt-2 font-display text-[clamp(1.5rem,4vw,2.5rem)] text-blue-light">
                  {formatDollars(midDollars)}
                </p>
                <p className="mt-4 text-lg text-white/50 max-w-md mx-auto">
                  {gapAboveEsa > 0
                    ? `That's ${formatDollars(gapAboveEsa)} above the statutory minimum your employer is required to pay.`
                    : "Based on the Bardal factors for your age, tenure, role, and province."}
                </p>
              </div>

              {/* Range: Low / Mid / High */}
              <div className="mt-12 flex items-center justify-center gap-8 sm:gap-12">
                <div className="text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Low</p>
                  <p className="mt-1 font-display text-xl text-white/70">{result.commonLaw.lowMonths} mo</p>
                  <p className="text-xs text-white/40">{formatDollars(lowDollars)}</p>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-light">Mid</p>
                  <p className="mt-1 font-display text-xl text-white">{result.commonLaw.midMonths} mo</p>
                  <p className="text-xs text-blue-light">{formatDollars(midDollars)}</p>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">High</p>
                  <p className="mt-1 font-display text-xl text-white/70">{result.commonLaw.highMonths} mo</p>
                  <p className="text-xs text-white/40">{formatDollars(highDollars)}</p>
                </div>
              </div>

              {/* ESA vs Common-law comparison */}
              <div className="mt-12 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">ESA Statutory Minimum</p>
                  <p className="font-display text-2xl text-white/60">{result.esa.totalWeeks} weeks</p>
                  <p className="text-sm text-white/40 mt-1">{formatDollars(result.esa.totalDollars)}</p>
                  <div className="mt-3 text-[10px] text-white/30 space-y-0.5">
                    <p>Termination: {result.esa.terminationWeeks} wks ({formatDollars(result.esa.terminationDollars)})</p>
                    <p>Severance: {result.esa.severanceWeeks} wks ({formatDollars(result.esa.severanceDollars)})</p>
                  </div>
                </div>
                <div className="rounded-xl bg-blue/10 border border-blue/20 p-5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-light mb-2">Common-Law Estimate</p>
                  <p className="font-display text-2xl text-white">{result.commonLaw.midMonths} months</p>
                  <p className="text-sm text-blue-light mt-1">{formatDollars(midDollars)}</p>
                  {gapAboveEsa > 0 && (
                    <p className="mt-3 text-xs text-emerald-400 font-semibold">
                      +{formatDollars(gapAboveEsa)} above ESA
                    </p>
                  )}
                </div>
              </div>

              {/* Exceptional case note */}
              {result.commonLaw.exceptionalCase && (
                <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-400/20">
                  <p className="text-sm text-purple-200">
                    <strong>Exceptional circumstances.</strong> Your combination of age, tenure, and seniority may justify exceeding the typical 24-month cap. Courts have awarded 26-27 months in cases like <em>Currie v Nylene</em> (2022) and <em>Hussain v Suzuki</em>.
                  </p>
                </div>
              )}

              {result.esa.notes && (
                <p className="mt-4 text-xs text-white/30 text-center">{result.esa.notes}</p>
              )}

              {/* Comparable Cases */}
              {result.comparableCases.length > 0 && (
                <div className="mt-12">
                  <h4 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4 text-center">
                    Comparable Court Decisions
                  </h4>
                  <div className="space-y-3">
                    {result.comparableCases.map((c) => (
                      <div key={c.name} className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-sm font-semibold text-white">{c.name}</span>
                            <span className="text-xs text-white/30 ml-2">({c.year})</span>
                          </div>
                          <span className="text-sm font-bold text-blue-light whitespace-nowrap">{c.award} months</span>
                        </div>
                        <p className="text-xs text-white/40 mt-1">
                          {c.age > 0 ? `${c.age} years old, ` : ""}{c.tenure} years tenure, {c.role}
                        </p>
                        <p className="text-xs text-white/50 mt-1">{c.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-text-muted text-lg">Fill in your details above, then click "Show Me My Estimate" to see the reveal.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Section 4: What to Do Next (light) ── */}
      {result && (
        <section className="bg-white py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-[560px] mx-auto">
            <p className="font-display text-sm italic text-text-muted">Chapter Three</p>
            <h3 className="font-display text-[clamp(1.25rem,3vw,1.75rem)] text-navy mt-1 mb-6">
              Points to Discuss With Your Lawyer
            </h3>

            <p className="text-[1rem] leading-[1.8] text-text-muted mb-6">
              If your employment lawyer confirms your common-law entitlement is above the offer, these are common negotiation points:
            </p>

            <div className="space-y-4">
              {[
                { n: "1", title: "Salary continuation", desc: `${result.commonLaw.lowMonths}-${result.commonLaw.highMonths} months (${formatDollars(lowDollars)}-${formatDollars(highDollars)})` },
                { n: "2", title: "Benefits continuation", desc: "for the full severance period (health, dental, vision, life insurance)" },
                { n: "3", title: "Pro-rated bonus", desc: "for the current year" },
                { n: "4", title: "Equity acceleration", desc: "or extended exercise window for unvested RSUs/options" },
                { n: "5", title: "Written reference", desc: "and agreed-upon reference language" },
                { n: "6", title: "Outplacement support", desc: "(career coaching, resume services)" },
              ].map((item) => (
                <div key={item.n} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mt-0.5">{item.n}</span>
                  <p className="text-[0.9375rem] text-text">
                    <strong className="text-navy">{item.title}</strong> {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Layoff Kit upsell */}
            <div className="mt-10 rounded-xl border-2 border-blue/20 bg-blue-bg p-6">
              <h4 className="font-semibold text-navy text-lg">Want the full playbook?</h4>
              <p className="mt-2 text-[0.9375rem] text-text-muted leading-relaxed">
                The calculator gives you a number. The Layoff Survival Kit gives you everything you need to act on it:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-text">
                <li className="flex gap-2"><span className="text-emerald-600">&#10003;</span> Severance negotiation playbook with email scripts</li>
                <li className="flex gap-2"><span className="text-emerald-600">&#10003;</span> Employment lawyer directory (30+ firms, free consult flags)</li>
                <li className="flex gap-2"><span className="text-emerald-600">&#10003;</span> Tax strategies to reduce withholding on severance</li>
                <li className="flex gap-2"><span className="text-emerald-600">&#10003;</span> 30/60/90 day job search plan + 7 more modules</li>
              </ul>
              <a
                href="/layoff-survival-kit"
                className="inline-flex items-center mt-4 rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-dark transition-colors"
              >
                See the Full Kit — $67 CAD
              </a>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 rounded-lg border border-border bg-gray-50 p-4">
              <p className="text-xs font-semibold text-text-muted mb-1">This is not legal advice</p>
              <p className="text-xs text-text-muted leading-relaxed">
                Educational estimates based on general legal precedent and statutory rules. Every situation is unique. A valid termination clause may limit your entitlement. Common-law estimates vary significantly. <strong>Consult an employment lawyer in your province before making any decisions.</strong>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 5: CTA (gradient) ── */}
      {result && (
        <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6" style={{ background: "linear-gradient(135deg, #0161EF 0%, #0450c8 50%, #030620 100%)" }}>
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -right-20 -top-20 w-[300px] h-[300px] rounded-full bg-white/5 blur-[80px]" />
          </div>
          <div className="relative max-w-[560px] mx-auto text-center">
            <p className="font-display text-sm italic text-white/60">Your Next Step</p>
            <h3 className="mt-2 font-display text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.15] text-white">
              You've seen what you may be owed. Now make sure you get it.
            </h3>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/layoff-survival-kit"
                className="inline-flex items-center justify-center rounded-lg bg-white text-blue px-8 py-3.5 text-base font-semibold hover:bg-gray-100 hover:shadow-lg transition-all"
              >
                Get the Layoff Survival Kit
              </a>
              <a
                href="https://calendly.com/clearcareer/discovery-call"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 text-white px-8 py-3.5 text-base font-semibold hover:bg-white/10 transition-colors"
              >
                Book a Free Audit
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
