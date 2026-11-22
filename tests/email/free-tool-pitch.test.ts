import { test, expect } from 'vitest';
import * as samples from '../../src/lib/email/sample-data';
import * as tpl from '../../src/lib/email/templates/warm-branded';
test('upsell uses the Land and Level Up pitch', () => {
  const data: any = Object.values(samples).find((v: any) => v && v.upsell && /corner/.test(v.upsell.headline));
  expect(data).toBeTruthy();
  const fn: any = Object.values(tpl).find((v) => typeof v === 'function');
  const html = String(fn(data));
  expect(html).toContain('Want people in your corner');
  expect(html).toContain('30+ AI prompts');
  expect(html).not.toMatch(/Ignition|1:1 coaching sessions|WhatsApp/);
});
