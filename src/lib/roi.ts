/**
 * What landing sooner is worth, from a target salary. Shared by the emails, Izzy's sales plan
 * and the /roi calculator page, so the numbers always match.
 * Simple on purpose: salary before tax, 260 working days a year. No promises, just arithmetic.
 */
export const WORKING_DAYS = 260;

export interface RoiRow { label: string; value: number; multiple: number }
export interface Roi { perMonth: number; perWeek: number; perDay: number; daysOfPay: number; rows: RoiRow[] }

export function roi(salary: number, price: number): Roi | null {
  if (!(salary > 0) || !(price > 0)) return null;
  const perDay = salary / WORKING_DAYS;
  const perWeek = salary / 52;
  const perMonth = salary / 12;
  const row = (label: string, value: number): RoiRow => ({ label, value, multiple: value / price });
  return {
    perMonth,
    perWeek,
    perDay,
    daysOfPay: price / perDay,
    rows: [row('2 weeks sooner', perWeek * 2), row('1 month sooner', perMonth), row('3 months sooner', perMonth * 3)],
  };
}

export const money = (n: number) => `$${Math.round(n).toLocaleString('en-CA')}`;
/** "about 2 working days", "under 1 working day", "about 4 working days" */
export function daysLabel(d: number): string {
  if (d < 1) return 'less than 1 working day';
  const r = Math.round(d);
  return `about ${r} working day${r === 1 ? '' : 's'}`;
}
export const multipleLabel = (m: number) => (m >= 10 ? `${Math.round(m)}x` : `${m.toFixed(1)}x`);
