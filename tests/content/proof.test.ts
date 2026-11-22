import { describe, it, expect } from 'vitest';
import testimonials from '../../src/data/testimonials.json';
import { wins, wallReviews, splitMark } from '../../src/data/proof';
import { reviews } from '../../src/data/llu';

const norm = (s: string) => s.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
const sources = [
  ...testimonials.map((t: any) => t.quote),
  ...Object.values(reviews).map((r) => r.before + r.mark + r.after),
].map(norm);

describe('social proof is real', () => {
  it('every win quote is an exact excerpt of a real review, and its highlight is in it', () => {
    for (const w of wins) {
      expect(sources.some((s) => s.includes(norm(w.quote))), w.name).toBe(true);
      expect(splitMark(w.quote, w.mark)[1], w.name).toBe(w.mark);
    }
  });
  it('the wall shows real reviews, skips names already shown, and has no duplicates', () => {
    const all = wallReviews();
    expect(all.length).toBeGreaterThan(70);
    const some = wallReviews(['Chris C.']);
    expect(some.find((r) => r.name === 'Chris C.')).toBeUndefined();
    expect(new Set(all.map((r) => r.quote)).size).toBe(all.length);
  });
});
