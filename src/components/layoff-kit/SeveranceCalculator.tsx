
import { useState } from "react";
import {
  PROVINCES,
  calculateEsa,
  estimateCommonLaw,
  findComparableCases,
  type JobLevel,
  type EsaResult,
  type CommonLawEstimate,
  type ComparableCase,
} from "./calculator-data";

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

export function SeveranceCalculator() {
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

  function handleCalculate() {
    if (!years || !age || !salary) return;
    const esa = calculateEsa(province, years, salary);
    const commonLaw = estimateCommonLaw(years, age, jobLevel, inducement);
    const comparableCases = findComparableCases(age, years, jobLevel, inducement);
    setResult({ esa, commonLaw, comparableCases, weeklyPay: salary / 52 });
  }

  const isReady = years !== "" && age !== "" && salary !== "";

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Input form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Province
          </label>
          <select
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
              setResult(null);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0161EF] focus:ring-1 focus:ring-[#0161EF] outline-none"
          >
            {PROVINCES.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Years of Service
          </label>
          <input
            type="number"
            min="0"
            max="50"
            step="0.5"
            placeholder="e.g. 7"
            value={years}
            onChange={(e) => {
              setYears(e.target.value ? Number(e.target.value) : "");
              setResult(null);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0161EF] focus:ring-1 focus:ring-[#0161EF] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Your Age
          </label>
          <input
            type="number"
            min="18"
            max="80"
            placeholder="e.g. 45"
            value={age}
            onChange={(e) => {
              setAge(e.target.value ? Number(e.target.value) : "");
              setResult(null);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0161EF] focus:ring-1 focus:ring-[#0161EF] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Annual Salary (CAD)
          </label>
          <input
            type="number"
            min="0"
            step="1000"
            placeholder="e.g. 120000"
            value={salary}
            onChange={(e) => {
              setSalary(e.target.value ? Number(e.target.value) : "");
              setResult(null);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0161EF] focus:ring-1 focus:ring-[#0161EF] outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Job Level
          </label>
          <select
            value={jobLevel}
            onChange={(e) => {
              setJobLevel(e.target.value as JobLevel);
              setResult(null);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0161EF] focus:ring-1 focus:ring-[#0161EF] outline-none"
          >
            {JOB_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Inducement */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Were you recruited away from a stable job to take this position?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="inducement"
                checked={!inducement}
                onChange={() => { setInducement(false); setResult(null); }}
                className="accent-[#0161EF]"
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="inducement"
                checked={inducement}
                onChange={() => { setInducement(true); setResult(null); }}
                className="accent-[#0161EF]"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
          </div>
          {inducement && (
            <p className="mt-1 text-xs text-[#0161EF]">
              Courts increase severance when you were actively recruited away from secure employment (inducement).
              In <em>Rodgers v CEVA</em>, 3 years of service resulted in 14 months due to inducement.
            </p>
          )}
        </div>

        {/* Termination clause */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Does your employment contract have a termination clause?
          </label>
          <div className="flex gap-4">
            {(["unknown", "no", "yes"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="termclause"
                  checked={hasTermClause === v}
                  onChange={() => { setHasTermClause(v); setResult(null); }}
                  className="accent-[#0161EF]"
                />
                <span className="text-sm text-gray-700">
                  {v === "unknown" ? "I don't know" : v === "no" ? "No" : "Yes"}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Contract clause warning */}
      {hasTermClause === "yes" && (
        <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-sm font-semibold text-amber-800 mb-1">
            Important: A termination clause may limit your entitlement
          </p>
          <p className="text-sm text-amber-700">
            A valid termination clause can cap your severance at the ESA minimum.
            However, many termination clauses are poorly drafted and unenforceable
            under Ontario law. Have an employment lawyer review yours before
            accepting any offer. The estimates below assume no enforceable clause.
          </p>
        </div>
      )}

      <button
        onClick={handleCalculate}
        disabled={!isReady}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-base transition-all ${
          isReady
            ? "bg-[#0161EF] text-white hover:bg-[#0450c8] cursor-pointer"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Calculate My Severance Estimate
      </button>

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-6">
          {/* ESA Statutory Minimum */}
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Statutory Minimum (ESA)
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              The legal floor under employment standards legislation, assuming no valid termination clause limits this amount.
            </p>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Termination Pay
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {result.esa.terminationWeeks} wks
                </div>
                <div className="text-sm text-gray-600">
                  {formatDollars(result.esa.terminationDollars)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Severance Pay
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {result.esa.severanceWeeks} wks
                </div>
                <div className="text-sm text-gray-600">
                  {formatDollars(result.esa.severanceDollars)}
                </div>
              </div>
              <div className="border-l border-gray-200 pl-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  ESA Total
                </div>
                <div className="text-2xl font-bold text-[#0161EF]">
                  {result.esa.totalWeeks} wks
                </div>
                <div className="text-sm font-medium text-[#0161EF]">
                  {formatDollars(result.esa.totalDollars)}
                </div>
              </div>
            </div>

            {result.esa.notes && (
              <p className="mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                {result.esa.notes}
              </p>
            )}
          </div>

          {/* Common-law Estimate */}
          <div className="rounded-xl border-2 border-[#0161EF]/20 p-6 bg-[#EFF5FF]">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Common-Law Estimate (Based on Court Precedent)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Based on the Bardal factors (age, tenure, role seniority, job market).
              Courts have awarded amounts above the ESA minimum in many cases, depending on
              individual circumstances. An employment lawyer can assess your specific situation.
            </p>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Low Estimate
                </div>
                <div className="text-2xl font-bold text-gray-700">
                  {result.commonLaw.lowMonths} mo
                </div>
                <div className="text-sm text-gray-600">
                  {formatDollars(
                    Math.round(
                      (result.commonLaw.lowMonths / 12) *
                        (salary as number)
                    )
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#0161EF] uppercase tracking-wide font-semibold mb-1">
                  Mid Estimate
                </div>
                <div className="text-3xl font-bold text-[#0161EF]">
                  {result.commonLaw.midMonths} mo
                </div>
                <div className="text-sm font-medium text-[#0161EF]">
                  {formatDollars(
                    Math.round(
                      (result.commonLaw.midMonths / 12) *
                        (salary as number)
                    )
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  High Estimate
                </div>
                <div className="text-2xl font-bold text-gray-700">
                  {result.commonLaw.highMonths} mo
                </div>
                <div className="text-sm text-gray-600">
                  {formatDollars(
                    Math.round(
                      (result.commonLaw.highMonths / 12) *
                        (salary as number)
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Gap callout */}
            {result.commonLaw.midMonths * (result.weeklyPay * 52 / 12) >
              result.esa.totalDollars * 1.5 && (
              <div className="mt-4 p-3 rounded-lg bg-white/70 border border-[#0161EF]/10">
                <p className="text-sm font-medium text-gray-900">
                  Your common-law estimate is{" "}
                  <span className="text-[#0161EF] font-bold">
                    {formatDollars(
                      Math.round(
                        (result.commonLaw.midMonths / 12) *
                          (salary as number)
                      ) - result.esa.totalDollars
                    )}
                  </span>{" "}
                  above the statutory minimum. If your employer is only offering the ESA amount,
                  above the statutory minimum. Based on common-law precedent, there may be room
                  to negotiate a higher amount. An employment lawyer can assess your specific situation.
                </p>
              </div>
            )}

            {/* Exceptional case note */}
            {result.commonLaw.exceptionalCase && (
              <div className="mt-4 p-3 rounded-lg bg-white/70 border border-purple-200">
                <p className="text-sm text-purple-800">
                  <strong>Exceptional circumstances.</strong> Your combination of age, tenure, and seniority
                  may justify exceeding the typical 24-month cap. Courts have awarded 26-27 months in
                  cases like <em>Currie v Nylene</em> (2022) and <em>Hussain v Suzuki</em>.
                </p>
              </div>
            )}
          </div>

          {/* Comparable cases */}
          {result.comparableCases.length > 0 && (
            <div className="rounded-xl border border-gray-200 p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Comparable Court Decisions
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Real cases with similar profiles to yours. These help validate the estimate above.
              </p>
              <div className="space-y-3">
                {result.comparableCases.map((c) => (
                  <div
                    key={c.name}
                    className="p-3 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          {c.name}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">({c.year})</span>
                      </div>
                      <span className="text-sm font-bold text-[#0161EF] whitespace-nowrap">
                        {c.award} months
                      </span>
                    </div>
                    {c.age > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {c.age} years old, {c.tenure} years tenure, {c.role}
                      </p>
                    )}
                    {c.age === 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {c.tenure} years tenure, {c.role}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-1">{c.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What to negotiate for */}
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Points to Discuss With Your Lawyer
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              If your employment lawyer confirms your common-law entitlement is above the offer, these are common negotiation points:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-[#059669] font-bold mt-0.5">1.</span>
                <span>
                  <strong>Salary continuation:</strong> {result.commonLaw.lowMonths}-{result.commonLaw.highMonths} months
                  ({formatDollars(Math.round((result.commonLaw.lowMonths / 12) * (salary as number)))}-{formatDollars(Math.round((result.commonLaw.highMonths / 12) * (salary as number)))})
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#059669] font-bold mt-0.5">2.</span>
                <span>
                  <strong>Benefits continuation</strong> for the full severance period
                  (health, dental, vision, life insurance)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#059669] font-bold mt-0.5">3.</span>
                <span>
                  <strong>Pro-rated bonus</strong> for the current year
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#059669] font-bold mt-0.5">4.</span>
                <span>
                  <strong>Equity acceleration</strong> or extended exercise window for unvested RSUs/options
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#059669] font-bold mt-0.5">5.</span>
                <span>
                  <strong>Written reference</strong> and agreed-upon reference language
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#059669] font-bold mt-0.5">6.</span>
                <span>
                  <strong>Outplacement support</strong> (career coaching, resume services)
                </span>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <p className="text-xs font-semibold text-gray-600 mb-1">
              This is not legal advice
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              This calculator provides educational estimates based on general legal precedent
              and statutory rules. It is not legal advice and should not be relied upon as a
              prediction of any specific outcome. Every situation is unique. A valid termination
              clause in your employment contract may limit your entitlement to the statutory
              minimum. Common-law estimates are based on the Bardal factors framework and vary
              significantly based on specific case details, the court, and the judge.{" "}
              <strong>Consult an employment lawyer in your province before making any decisions
              about your severance package.</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
