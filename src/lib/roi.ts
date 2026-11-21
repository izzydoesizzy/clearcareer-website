/**
 * What landing sooner, and negotiating better, is worth, from a target salary. Shared by the emails,
 * Izzy's sales plan and the /roi calculator page, so the numbers always match.
 * Simple on purpose: salary before tax, 260 working days a year. No promises, just arithmetic.
 */
export const WORKING_DAYS = 260;

/** Default negotiated increase used in the math. Deliberately conservative next to real client results below. */
export const DEFAULT_RAISE_PCT = 5;

/** Real negotiation results, from public reviews and client testimonials (src/data/llu.ts). Not typical, not promised. */
export const NEGOTIATION_EXAMPLES = [
  { name: 'Laura S.', result: '$22,000 more a year (over 30%)' },
  { name: 'Chris C.', result: 'a $25k pay increase' },
  { name: 'Tamara G.', result: 'a $20,000 increase, plus bonuses' },
  { name: 'Septembre A.', result: '$10K above the offer' },
];

export interface RoiRow { label: string; value: number; multiple: number }
export interface Roi {
  perMonth: number;
  perWeek: number;
  perDay: number;
  daysOfPay: number;
  /** Landing sooner. */
  rows: RoiRow[];
  /** Negotiating a better offer: a raise is paid every year, so it's shown for year one and over 3 years. */
  raise: { pct: number; perYear: RoiRow; threeYears: RoiRow };
  /** Landing 1 month sooner and negotiating the raise, in year one. */
  both: RoiRow;
}

export function roi(salary: number, price: number, raisePct: number = DEFAULT_RAISE_PCT): Roi | null {
  if (!(salary > 0) || !(price > 0)) return null;
  const perDay = salary / WORKING_DAYS;
  const perWeek = salary / 52;
  const perMonth = salary / 12;
  const pct = Math.max(0, Math.min(50, raisePct || 0));
  const raise = (salary * pct) / 100;
  const row = (label: string, value: number): RoiRow => ({ label, value, multiple: value / price });
  return {
    perMonth,
    perWeek,
    perDay,
    daysOfPay: price / perDay,
    rows: [row('2 weeks sooner', perWeek * 2), row('1 month sooner', perMonth), row('3 months sooner', perMonth * 3)],
    raise: { pct, perYear: row(`Negotiate ${pct}% more`, raise), threeYears: row(`That raise over 3 years`, raise * 3) },
    both: row(`Land 1 month sooner and negotiate ${pct}% more`, perMonth + raise),
  };
}

export const money = (n: number) => `$${Math.round(n).toLocaleString('en-CA')}`;
/** "about 2 working days", "less than 1 working day" */
export function daysLabel(d: number): string {
  if (d < 1) return 'less than 1 working day';
  const r = Math.round(d);
  return `about ${r} working day${r === 1 ? '' : 's'}`;
}
export const multipleLabel = (m: number) => (m >= 10 ? `${Math.round(m)}x` : `${m.toFixed(1)}x`);
