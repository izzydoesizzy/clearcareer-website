/**
 * The paid products: Claude skills, guides, zips, access and the bundle. These check the rules in
 * docs/products/SKILL-STYLE.md that a machine can check. Voice is still a human review.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { unzipSync, strFromU8 } from 'fflate';
import { PRODUCTS, bundlesIncluding } from '../../src/data/product-config';
import { skillsFor, skillZip, startHere, promptCards, productFiles, frontmatter, parsePrompts } from '../../src/lib/product-files';
import { verifyAccess } from '../../src/lib/product-access';
import { makeAccessToken } from '../../src/lib/access';
import testimonials from '../../src/data/testimonials.json';

const ROOT = join(__dirname, '..', '..');
const NEW_PACKS = ['vault', 'salary-generator', 'outreach-templates', 'interview-confidence', 'salary-negotiation'];
const WITH_START_HERE = [...NEW_PACKS, 'complete-toolkit'];
const GUIDE_DIRS = ['outreach-templates-guides', 'salary-negotiation-guides', 'complete-toolkit-guides', 'interview-confidence-guides', 'salary-generator-guides'];

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const productFilesOnDisk = walk(join(ROOT, 'src', 'products'));
const newGuideFiles = GUIDE_DIRS.flatMap((d) => walk(join(ROOT, 'src', 'data', d)));
const allNew = [...productFilesOnDisk, ...newGuideFiles];

const list = (testimonials as unknown as { testimonials?: { name: string }[] }).testimonials || (testimonials as unknown as { name: string }[]);
// Full names only (first names alone would match ordinary sample names like "Sam").
const CLIENT_NAMES = list.map((t) => t.name).filter((n) => /\s/.test(n) && !/izzy/i.test(n));

describe('product files', () => {
  it('every product in the first release has skills and a Start Here guide', () => {
    for (const slug of NEW_PACKS) expect(skillsFor(slug).length, slug).toBeGreaterThan(0);
    for (const slug of WITH_START_HERE) expect(startHere(slug), slug).toBeTruthy();
    expect(skillsFor('vault').map((s) => s.name)).toEqual(['cc-resume', 'cc-linkedin', 'cc-interview', 'cc-outreach', 'cc-research', 'cc-offer']);
  });

  it('skills hold text files only', () => {
    const skillFiles = productFilesOnDisk.filter((f) => f.includes(`${join('', 'skills')}`));
    expect(skillFiles.length).toBeGreaterThan(0);
    for (const f of skillFiles) expect(f.endsWith('.md'), f).toBe(true);
  });

  it('every guide listed for a product exists', () => {
    for (const p of Object.values(PRODUCTS)) {
      for (const g of p.guides) expect(existsSync(join(ROOT, 'src', 'data', p.guidesDir, g.file)), `${p.slug}/${g.file}`).toBe(true);
    }
  });
});

describe('SKILL.md rules', () => {
  const skills = NEW_PACKS.flatMap((slug) => skillsFor(slug).map((s) => ({ slug, ...s })));

  it('frontmatter has only a cc- name and a description that says when to use it', () => {
    for (const s of skills) {
      const md = productFiles(s.slug)[`skills/${s.name}/SKILL.md`];
      const fm = frontmatter(md);
      expect(Object.keys(fm).sort(), s.name).toEqual(['description', 'name']);
      expect(fm.name).toMatch(/^cc-[a-z0-9-]{2,60}$/);
      expect(fm.name).not.toMatch(/claude|anthropic/);
      expect(fm.description.length, s.name).toBeGreaterThan(40);
      expect(fm.description.length, s.name).toBeLessThan(1024);
    }
  });

  it('has the attribution line once, with its own name, and nothing salesy', () => {
    for (const s of skills) {
      const md = productFiles(s.slug)[`skills/${s.name}/SKILL.md`];
      const line = `Created by [Izzy Piyale-Sheard](https://www.linkedin.com/in/izzydoesizzy/?utm_source=claude-skill&utm_campaign=${s.name}) · [ClearCareer](https://joinclearcareer.com/?utm_source=claude-skill&utm_campaign=${s.name})`;
      expect(md.split(line).length - 1, s.name).toBe(1);
      expect(md, s.name).toMatch(/## Finishing a deliverable/);
    }
  });

  it('references use tilde fences, never nested backticks', () => {
    for (const f of productFilesOnDisk.filter((p) => p.includes(join('skills', '')) && p.includes('references'))) {
      expect(readFileSync(f, 'utf8'), f).not.toMatch(/```/);
    }
  });
});

describe('writing rules (all new product content)', () => {
  it('has no em or en dashes', () => {
    for (const f of allNew) expect(readFileSync(f, 'utf8'), f).not.toMatch(/[—–]/);
  });

  it('has no ChatGPT-era or coach-only leftovers, and never mentions CHARM', () => {
    for (const f of allNew) {
      const t = readFileSync(f, 'utf8');
      expect(t, f).not.toMatch(/chatgpt\s*(3|4)|best with:|client-slug|data\/clients|\bCHARM\b/i);
      expect(t, f).not.toMatch(/\bRED TEXT\b/);
      // Skills talk to the job seeker, not to a coach about "the client". (Sample text may use the word.)
      if (f.endsWith('SKILL.md') || f.endsWith('start-here.md')) expect(t, f).not.toMatch(/\bthe client\b/i);
    }
  });

  it('names no real clients', () => {
    for (const f of allNew) {
      const t = readFileSync(f, 'utf8');
      for (const n of CLIENT_NAMES) expect(t.includes(n), `${f} mentions ${n}`).toBe(false);
    }
  });

  it('negotiation content says it is not legal or financial advice', () => {
    for (const slug of ['salary-negotiation', 'salary-generator']) {
      const md = productFiles(slug);
      const all = Object.values(md).join('\n');
      expect(all, slug).toMatch(/not legal or financial advice/i);
    }
  });
});

describe('copy-paste prompts', () => {
  it('the Vault keeps all 50 frameworks', () => {
    const total = promptCards('vault').reduce((n, g) => n + g.cards.length, 0);
    expect(total).toBeGreaterThanOrEqual(50);
  });

  it('parses steps, and ignores headings inside a prompt', () => {
    const cards = parsePrompts(`## Write a headline\n\n**What it does:** One.\n**When to use it:** Two.\n\n### Step 1: Draft\n\n~~~text\nWrite it.\n## Not a title\n~~~\n\n**Replace:** [Job title]\n`, 'cc-x');
    expect(cards).toHaveLength(1);
    expect(cards[0].steps[0]).toEqual({ label: 'Step 1: Draft', text: 'Write it.\n## Not a title' });
    expect(cards[0].replace).toBe('[Job title]');
  });
});

describe('skill zips', () => {
  it('each zip opens to one folder with SKILL.md at its root', () => {
    for (const slug of NEW_PACKS) {
      for (const s of skillsFor(slug)) {
        const zip = skillZip(slug, s.name);
        expect(zip, s.name).toBeTruthy();
        const files = unzipSync(zip!);
        const names = Object.keys(files);
        expect(names.every((n) => n.startsWith(`${s.name}/`)), s.name).toBe(true);
        expect(strFromU8(files[`${s.name}/SKILL.md`])).toMatch(/^---\nname: /);
      }
    }
    expect(skillZip('vault', 'not-a-skill')).toBeNull();
  });
});

describe('access', () => {
  const env = { ACCESS_SECRET: 'test-secret' };
  it('a bundle token opens every product in the bundle, and nothing else', async () => {
    const t = await makeAccessToken('complete-toolkit', 'sam@example.com', 'test-secret');
    for (const p of PRODUCTS['complete-toolkit'].includes!) expect((await verifyAccess(p, t, env)).ok, p).toBe(true);
    expect((await verifyAccess('adhd-command-center', t, env)).ok).toBe(false);
    expect(bundlesIncluding('vault')).toContain('complete-toolkit');
  });
  it('a product token opens only that product', async () => {
    const t = await makeAccessToken('outreach-templates', 'sam@example.com', 'test-secret');
    expect((await verifyAccess('outreach-templates', t, env)).ok).toBe(true);
    expect((await verifyAccess('salary-negotiation', t, env)).ok).toBe(false);
    expect((await verifyAccess('outreach-templates', '', env)).ok).toBe(false);
    expect((await verifyAccess('outreach-templates', 'not-a-token', env)).ok).toBe(false);
  });
});

describe('paid files are not public', () => {
  it('nothing from the Vault is left in public/', () => {
    expect(existsSync(join(ROOT, 'public', 'downloads', 'nova'))).toBe(false);
  });
});
