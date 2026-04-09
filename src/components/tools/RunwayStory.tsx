import { useState, useRef } from "react";

/* ── Formatting ── */

const fmtCAD = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  const whole = Math.floor(months);
  const frac = months - whole;
  d.setMonth(d.getMonth() + whole);
  d.setDate(d.getDate() + Math.round(frac * 30));
  return d;
}

function fmtDate(date: Date): string {
  return date.toLocaleDateString("en-CA", { month: "long", year: "numeric" });
}

/* ── PDF / Print ── */

function handlePrint() {
  // Open a new window with the branded report, then trigger print
  const printWindow = window.open("", "_blank", "width=800,height=1100");
  if (!printWindow) return;

  const reportEl = document.getElementById("branded-pdf-report");
  if (!reportEl) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Financial Runway Report - ClearCareer</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', system-ui, sans-serif; color: #0f0f0f; line-height: 1.6; padding: 40px; max-width: 700px; margin: 0 auto; }
        .font-display { font-family: 'DM Serif Display', Georgia, serif; }
        .text-navy { color: #030620; }
        .text-blue { color: #0161EF; }
        .text-muted { color: #6b7280; }
        .text-emerald { color: #059669; }
        .text-amber { color: #D97706; }
        .text-red { color: #dc2626; }
        h1 { font-family: 'DM Serif Display', Georgia, serif; }
        a { color: #0161EF; text-decoration: underline; }
        @media print {
          body { padding: 0; }
          .no-print { display: none !important; }
          @page { margin: 1.5cm; size: letter; }
        }
      </style>
    </head>
    <body>
      ${reportEl.innerHTML}
      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); window.close(); }, 300);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/* ── Main Component ── */

export default function RunwayStory() {
  const [savings, setSavings] = useState("");
  const [expenses, setExpenses] = useState("");
  const [sevWeeks, setSevWeeks] = useState("0");
  const [sevPay, setSevPay] = useState("0");
  const [unemployment, setUnemployment] = useState("0");
  const [sideIncome, setSideIncome] = useState("0");
  const [revealed, setRevealed] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);

  const savingsNum = parseFloat(savings) || 0;
  const expensesNum = parseFloat(expenses) || 0;
  const sevWeeksNum = parseFloat(sevWeeks) || 0;
  const sevPayNum = parseFloat(sevPay) || 0;
  const unemploymentNum = parseFloat(unemployment) || 0;
  const sideIncomeNum = parseFloat(sideIncome) || 0;

  const totalSeverance = sevWeeksNum * sevPayNum;
  const totalFunds = savingsNum + totalSeverance;
  const monthlyIncome = unemploymentNum + sideIncomeNum;
  const monthlyBurn = expensesNum - monthlyIncome;
  const isInfinite = monthlyBurn <= 0;
  const runwayMonths = isInfinite ? Infinity : totalFunds / monthlyBurn;

  const today = new Date();
  const depletionDate = isInfinite ? null : addMonths(today, runwayMonths);
  const worryDate = isInfinite ? null : addMonths(today, runwayMonths * 0.7);

  const isReady = savingsNum > 0 && expensesNum > 0;

  // Color coding
  const tier = isInfinite ? "green" : runwayMonths > 6 ? "green" : runwayMonths >= 3 ? "amber" : "red";
  const tierColors = {
    green: { text: "text-emerald-400", bg: "bg-emerald-400", bar: "bg-emerald-500", light: "text-emerald-300" },
    amber: { text: "text-amber-400", bg: "bg-amber-400", bar: "bg-amber-500", light: "text-amber-300" },
    red: { text: "text-red-400", bg: "bg-red-400", bar: "bg-red-500", light: "text-red-300" },
  };
  const tc = tierColors[tier];

  const progressPct = isInfinite ? 100 : Math.min((runwayMonths / 12) * 100, 100);

  function handleReveal() {
    if (!isReady) return;
    setRevealed(true);
    setTimeout(() => revealRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  const getInterpretation = () => {
    if (isInfinite) return "Your income covers your expenses. You have unlimited runway. Use this time to be highly selective about your next role.";
    if (runwayMonths > 12) return "You have over a year. This is rare. Be extremely selective. Target dream roles. Don't settle out of impatience.";
    if (runwayMonths > 6) return "Breathing room. You can afford to be selective, not passive. Target roles that actually fit, not just the first thing that comes along.";
    if (runwayMonths >= 3) return "Solid, but the clock is ticking. Treat your search like a part-time job. 15-20 hours a week, structured and intentional.";
    return "Full sprint. Focus on highest-probability leads. Consider contract or freelance work to extend your timeline. Every week counts.";
  };

  return (
    <div>
      {/* ── Section 1: Context (dark) ── */}
      <section className="bg-navy py-16 sm:py-24 px-4 sm:px-6 text-center relative overflow-hidden print:hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue/5 blur-[100px]" />
        </div>
        <div className="relative max-w-[560px] mx-auto">
          <p className="text-blue-light text-sm font-semibold uppercase tracking-widest mb-6">Financial Runway Calculator</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] leading-[1.1] text-white">
            The average job search takes <span className="text-blue-light">3-6 months.</span> Senior roles take longer.
          </h2>
          <p className="mt-6 text-white/50 text-lg">Do you have enough time?</p>
          <div className="mt-8 animate-bounce">
            <svg className="w-6 h-6 mx-auto text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Section 2: Your Numbers (light) ── */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6 print:hidden">
        <div className="max-w-[520px] mx-auto">
          <div className="text-center mb-10">
            <p className="font-display text-sm italic text-text-muted">Chapter One</p>
            <h3 className="font-display text-[clamp(1.25rem,3vw,1.75rem)] text-navy mt-1">Your Numbers</h3>
          </div>

          <div className="space-y-6">
            {/* Savings + Expenses */}
            <div>
              <p className="font-display italic text-text-muted text-sm mb-2">How much do you have saved?</p>
              <div className="relative">
                <span className="absolute left-0 bottom-3 text-text-muted text-lg">$</span>
                <input type="number" inputMode="numeric" placeholder="50,000" value={savings}
                  onChange={(e) => { setSavings(e.target.value); setRevealed(false); }}
                  className="w-full border-0 border-b-2 border-border bg-transparent py-3 pl-6 text-xl text-navy placeholder:text-text-muted/40 focus:border-blue focus:outline-none focus:ring-0 transition-colors" />
              </div>
            </div>

            <div>
              <p className="font-display italic text-text-muted text-sm mb-2">What are your monthly expenses?</p>
              <div className="relative">
                <span className="absolute left-0 bottom-3 text-text-muted text-lg">$</span>
                <input type="number" inputMode="numeric" placeholder="4,000" value={expenses}
                  onChange={(e) => { setExpenses(e.target.value); setRevealed(false); }}
                  className="w-full border-0 border-b-2 border-border bg-transparent py-3 pl-6 text-xl text-navy placeholder:text-text-muted/40 focus:border-blue focus:outline-none focus:ring-0 transition-colors" />
              </div>
            </div>

            {/* Severance */}
            <div className="pt-4 border-t border-border">
              <p className="font-display italic text-text-muted text-sm mb-4">Any severance?</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Weeks</label>
                  <input type="number" inputMode="numeric" min={0} value={sevWeeks}
                    onChange={(e) => { setSevWeeks(e.target.value); setRevealed(false); }}
                    className="mt-1 w-full border-0 border-b-2 border-border bg-transparent py-2 text-lg text-navy focus:border-blue focus:outline-none focus:ring-0 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Weekly pay</label>
                  <div className="relative mt-1">
                    <span className="absolute left-0 bottom-2 text-text-muted">$</span>
                    <input type="number" inputMode="numeric" min={0} value={sevPay}
                      onChange={(e) => { setSevPay(e.target.value); setRevealed(false); }}
                      className="w-full border-0 border-b-2 border-border bg-transparent py-2 pl-5 text-lg text-navy focus:border-blue focus:outline-none focus:ring-0 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Income offsets */}
            <div className="pt-4 border-t border-border">
              <p className="font-display italic text-text-muted text-sm mb-4">Any income while you search?</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Unemployment/mo</label>
                  <div className="relative mt-1">
                    <span className="absolute left-0 bottom-2 text-text-muted">$</span>
                    <input type="number" inputMode="numeric" min={0} value={unemployment}
                      onChange={(e) => { setUnemployment(e.target.value); setRevealed(false); }}
                      className="w-full border-0 border-b-2 border-border bg-transparent py-2 pl-5 text-lg text-navy focus:border-blue focus:outline-none focus:ring-0 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Side income/mo</label>
                  <div className="relative mt-1">
                    <span className="absolute left-0 bottom-2 text-text-muted">$</span>
                    <input type="number" inputMode="numeric" min={0} value={sideIncome}
                      onChange={(e) => { setSideIncome(e.target.value); setRevealed(false); }}
                      className="w-full border-0 border-b-2 border-border bg-transparent py-2 pl-5 text-lg text-navy focus:border-blue focus:outline-none focus:ring-0 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleReveal} disabled={!isReady}
            className={`mt-10 w-full rounded-full py-4 text-lg font-semibold transition-all ${
              isReady ? "bg-navy text-white hover:bg-navy/90 hover:shadow-lg cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            Calculate My Runway
          </button>
        </div>
      </section>

      {/* ── Section 3: The Reveal (dark) ── */}
      <section ref={revealRef}
        className={`relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 transition-all duration-700 ${revealed ? "bg-navy" : "bg-gray-100"}`}
        id="runway-results">
        {revealed && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-blue/8 blur-[120px]" />
          </div>
        )}

        <div className="relative max-w-[600px] mx-auto">
          {revealed ? (
            <>
              {/* Hero stat */}
              <div className="text-center">
                <p className={`text-sm font-semibold uppercase tracking-widest mb-4 ${tc.light}`}>
                  {isInfinite ? "Unlimited Runway" : "Your Financial Runway"}
                </p>
                <p className={`font-display text-[clamp(3.5rem,10vw,6rem)] leading-none text-white`}>
                  {isInfinite ? "∞" : `${runwayMonths.toFixed(1)}`}
                </p>
                {!isInfinite && (
                  <p className="text-2xl text-white/60 font-display mt-1">months</p>
                )}
                <p className="mt-4 text-lg text-white/50 max-w-md mx-auto">
                  {getInterpretation()}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-10">
                <div className="flex justify-between text-[10px] text-white/30 uppercase tracking-widest mb-2">
                  <span>0 months</span>
                  <span>12+ months</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ease-out ${tc.bar}`}
                    style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              {/* Date cards */}
              {!isInfinite && (
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Savings Run Out</p>
                    <p className="mt-1 font-display text-lg text-white">{depletionDate ? fmtDate(depletionDate) : "---"}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Start Search Sprint By</p>
                    <p className="mt-1 font-display text-lg text-white">{worryDate ? fmtDate(worryDate) : "---"}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">70% mark, 30% buffer</p>
                  </div>
                </div>
              )}

              {/* Monthly breakdown */}
              <div className="mt-8 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="px-5 py-3 border-b border-white/10">
                  <h4 className="text-sm font-semibold text-white/60">Monthly Breakdown</h4>
                </div>
                <div className="divide-y divide-white/5">
                  {[
                    { label: "Total funds (savings + severance)", value: fmtCAD(totalFunds), color: "text-white" },
                    { label: "Monthly expenses", value: fmtCAD(expensesNum), color: "text-white/70 print:text-text" },
                    { label: "Monthly income (unemployment + side)", value: `+${fmtCAD(monthlyIncome)}`, color: "text-emerald-400" },
                    { label: "Net monthly burn", value: fmtCAD(monthlyBurn > 0 ? monthlyBurn : 0), color: `${tier === "red" ? "text-red-400" : "text-white"} font-semibold` },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-white/50">{row.label}</span>
                      <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download PDF button */}
              <div className="mt-8 text-center print:hidden">
                <button onClick={handlePrint}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF Report
                </button>
              </div>

            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-text-muted text-lg">Fill in your numbers above, then click "Calculate My Runway."</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Section 4: What This Means (light) ── */}
      {revealed && (
        <section className="bg-white py-14 sm:py-20 px-4 sm:px-6 print:hidden">
          <div className="max-w-[560px] mx-auto">
            <p className="font-display text-sm italic text-text-muted">Chapter Three</p>
            <h3 className="font-display text-[clamp(1.25rem,3vw,1.75rem)] text-navy mt-1 mb-6">What This Means</h3>

            <div className="text-[1rem] leading-[1.8] text-text space-y-4">
              <p>
                The formula: <strong className="text-navy">(Savings + Severance) / (Monthly Expenses - Income) = Months of Runway.</strong> Severance is treated as a lump sum added to savings, not monthly income, because that's how you'll actually spend it.
              </p>

              {!isInfinite && worryDate && (
                <blockquote className="border-l-4 border-blue bg-blue-bg rounded-r-xl p-4 my-6 text-[0.9375rem]">
                  Your "start searching seriously" date is <strong>{fmtDate(worryDate)}</strong>. That's the 70% mark, giving you a 30% buffer for slow hiring, holidays, and ghosting.
                </blockquote>
              )}

              <h4 className="font-semibold text-navy pt-4">Quick Ways to Reduce Your Burn Rate</h4>
              <div className="space-y-3">
                {[
                  { title: "Audit subscriptions.", desc: "Most people find $100-$300/month they forgot about." },
                  { title: "Switch health plans.", desc: "Marketplace plans or COBRA alternatives can save hundreds between jobs." },
                  { title: "Pick up freelance work.", desc: "Even 10-15 hours a week adds months to your timeline and fills a resume gap." },
                  { title: "Talk to your partner early.", desc: "Make decisions together on day one, not under stress at month 4." },
                ].map((tip) => (
                  <div key={tip.title} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mt-0.5">&#10003;</span>
                    <p className="text-[0.9375rem] text-text">
                      <strong className="text-navy">{tip.title}</strong> {tip.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-border bg-white p-5">
                <h4 className="text-base font-semibold text-navy">Related Reading</h4>
                <p className="mt-2 text-[0.9375rem] leading-[1.7] text-text-muted">
                  Just got laid off? Here's your step-by-step plan:
                  <a href="/blog/what-to-do-after-getting-laid-off" className="font-medium text-blue underline underline-offset-2 hover:text-blue-dark transition-colors ml-1">
                    What to Do After Getting Laid Off
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 5: CTA (gradient) ── */}
      {revealed && (
        <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 print:hidden"
          style={{ background: "linear-gradient(135deg, #0161EF 0%, #0450c8 50%, #030620 100%)" }}>
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -right-20 -top-20 w-[300px] h-[300px] rounded-full bg-white/5 blur-[80px]" />
          </div>
          <div className="relative max-w-[560px] mx-auto text-center">
            <p className="font-display text-sm italic text-white/60">Your Next Step</p>
            <h3 className="mt-2 font-display text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.15] text-white">
              You know your number. Now make every month count.
            </h3>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://calendly.com/clearcareer/discovery-call"
                className="inline-flex items-center justify-center rounded-lg bg-white text-blue px-8 py-3.5 text-base font-semibold hover:bg-gray-100 hover:shadow-lg transition-all">
                Book a Free Audit
              </a>
              <a href="/jsis"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 text-white px-8 py-3.5 text-base font-semibold hover:bg-white/10 transition-colors">
                Explore the Program
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── Hidden Branded PDF Report ── */}
      {revealed && (
        <div id="branded-pdf-report" style={{ position: "absolute", left: "-9999px", top: 0 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #0161EF", paddingBottom: "16px", marginBottom: "24px" }}>
            <div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#030620", fontFamily: "'DM Serif Display', Georgia, serif" }}>Financial Runway Report</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>Prepared for you by ClearCareer</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>joinclearcareer.com</div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>{today.toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })}</div>
            </div>
          </div>

          {/* Hero Result */}
          <div style={{ textAlign: "center", padding: "32px 0", background: "#f8fafc", borderRadius: "12px", marginBottom: "24px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: tier === "green" ? "#059669" : tier === "amber" ? "#D97706" : "#dc2626", marginBottom: "8px" }}>
              {isInfinite ? "Unlimited Runway" : "Your Financial Runway"}
            </div>
            <div style={{ fontSize: "56px", fontWeight: 700, color: "#030620", fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: 1 }}>
              {isInfinite ? "∞" : runwayMonths.toFixed(1)}
            </div>
            {!isInfinite && <div style={{ fontSize: "20px", color: "#6b7280", fontFamily: "'DM Serif Display', Georgia, serif" }}>months</div>}
            <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "12px", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
              {getInterpretation()}
            </div>
          </div>

          {/* Key Dates */}
          {!isInfinite && (
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              <div style={{ flex: 1, padding: "16px", background: "#f8fafc", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280" }}>Savings Run Out</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#030620", marginTop: "4px", fontFamily: "'DM Serif Display', Georgia, serif" }}>{depletionDate ? fmtDate(depletionDate) : ""}</div>
              </div>
              <div style={{ flex: 1, padding: "16px", background: "#f8fafc", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280" }}>Start Search Sprint By</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#030620", marginTop: "4px", fontFamily: "'DM Serif Display', Georgia, serif" }}>{worryDate ? fmtDate(worryDate) : ""}</div>
                <div style={{ fontSize: "11px", color: "#9ca3af" }}>70% mark, 30% buffer</div>
              </div>
            </div>
          )}

          {/* Monthly Breakdown Table */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#030620", marginBottom: "8px" }}>Monthly Breakdown</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <tbody>
                {[
                  { label: "Total funds (savings + severance)", value: fmtCAD(totalFunds), color: "#030620" },
                  { label: "Monthly expenses", value: fmtCAD(expensesNum), color: "#0f0f0f" },
                  { label: "Monthly income (unemployment + side)", value: `+${fmtCAD(monthlyIncome)}`, color: "#059669" },
                  { label: "Net monthly burn", value: fmtCAD(monthlyBurn > 0 ? monthlyBurn : 0), color: tier === "red" ? "#dc2626" : "#030620" },
                ].map((row) => (
                  <tr key={row.label}>
                    <td style={{ padding: "10px 0", borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>{row.label}</td>
                    <td style={{ padding: "10px 0", borderBottom: "1px solid #e5e7eb", textAlign: "right", fontWeight: 600, color: row.color }}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Input Summary */}
          <div style={{ marginBottom: "32px", padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280", marginBottom: "8px" }}>Your Inputs</div>
            <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.8 }}>
              Savings: {fmtCAD(savingsNum)} | Monthly expenses: {fmtCAD(expensesNum)}
              {totalSeverance > 0 && <> | Severance: {sevWeeksNum} wks x {fmtCAD(sevPayNum)}/wk = {fmtCAD(totalSeverance)}</>}
              {unemploymentNum > 0 && <> | Unemployment: {fmtCAD(unemploymentNum)}/mo</>}
              {sideIncomeNum > 0 && <> | Side income: {fmtCAD(sideIncomeNum)}/mo</>}
            </div>
          </div>

          {/* Divider */}
          <hr style={{ border: "none", borderTop: "2px solid #0161EF", margin: "32px 0" }} />

          {/* CTA 1: Layoff Survival Kit */}
          <div style={{ padding: "24px", background: "#EFF5FF", borderRadius: "12px", marginBottom: "20px", border: "1px solid rgba(1,97,239,0.15)" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                <img src="/images/izzy-coaching.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#030620" }}>Just got laid off? Get the Layoff Survival Kit.</div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px", lineHeight: 1.6 }}>
                  Severance negotiation playbook with email scripts. Employment lawyer directory (30+ firms). Tax strategies for your severance payout. 30/60/90 day job search plan. 10 complete modules for $67 CAD.
                </div>
                <div style={{ marginTop: "12px" }}>
                  <a href="https://joinclearcareer.com/layoff-survival-kit" style={{ display: "inline-block", background: "#0161EF", color: "white", padding: "10px 24px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                    Get the Kit → joinclearcareer.com/layoff-survival-kit
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CTA 2: JSIS Group Program */}
          <div style={{ padding: "24px", background: "#f8fafc", borderRadius: "12px", marginBottom: "20px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#030620" }}>Ready for a structured job search? Join the next cohort.</div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px", lineHeight: 1.6 }}>
              The Job Search Ignition System is an 8-week group coaching program for senior professionals. You get a done-for-you resume, LinkedIn profile, outreach templates, and three 1:1 sessions with Izzy. Cohorts are capped at 10 people.
            </div>
            <div style={{ marginTop: "12px" }}>
              <a href="https://joinclearcareer.com/programs/jsis" style={{ display: "inline-block", background: "#030620", color: "white", padding: "10px 24px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                Explore the Program → joinclearcareer.com/programs/jsis
              </a>
            </div>
          </div>

          {/* CTA 3: Free Audit */}
          <div style={{ padding: "20px", textAlign: "center", background: "white", borderRadius: "12px", border: "2px solid #0161EF" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#030620" }}>Not sure where to start? Book a free 20-minute career audit.</div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>No pitch. Just an honest assessment of where you stand and what to do next.</div>
            <div style={{ marginTop: "12px" }}>
              <a href="https://calendly.com/clearcareer/discovery-call" style={{ color: "#0161EF", fontSize: "13px", fontWeight: 600 }}>
                calendly.com/clearcareer/discovery-call
              </a>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "32px", paddingTop: "16px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>This is an estimate, not financial advice. Consult a financial advisor for personalized guidance.</div>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>Generated by ClearCareer on {today.toLocaleDateString("en-CA")}</div>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#0161EF" }}>joinclearcareer.com</div>
          </div>
        </div>
      )}
    </div>
  );
}
