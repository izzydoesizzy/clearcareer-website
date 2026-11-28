/**
 * Paid product files: Claude skills, Start Here guides and setup instructions.
 *
 * They live in src/products/<slug>/ and are bundled into the server code at build time, so none of
 * them is a public URL. Buyers get them through /api/products/<slug>/download/<file>, which checks
 * their access first. Server only.
 *
 * Skill zips are built on request: one zip per skill, with the skill folder at the root
 * (`cc-resume/SKILL.md`, `cc-resume/references/...`), which is what Claude's upload expects.
 */
import { zipSync, strToU8 } from 'fflate';

const RAW = import.meta.glob('/src/products/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

/**
 * The Career Suite (members only) lives in skills/clearcareer-career-suite/, built by
 * scripts/build-career-suite.mjs. It's read from there so there's one copy:
 *   claude/<skill>/...  becomes  career-suite/skills/<skill>/...  (a normal skill, one zip each)
 *   chatgpt/... and gemini/...   become  career-suite/chatgpt/... and career-suite/gemini/...
 */
const SUITE = import.meta.glob(
  ['/skills/clearcareer-career-suite/claude/**/*.md', '/skills/clearcareer-career-suite/chatgpt/**/*.md', '/skills/clearcareer-career-suite/gemini/**/*.md'],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;

/** Paths relative to src/products, e.g. "vault/skills/cc-resume/SKILL.md". */
const FILES: Record<string, string> = Object.fromEntries([
  ...Object.entries(RAW).map(([k, v]) => [k.replace(/^.*\/src\/products\//, ''), v]),
  ...Object.entries(SUITE).map(([k, v]) => [
    k.replace(/^.*\/skills\/clearcareer-career-suite\//, 'career-suite/').replace(/^career-suite\/claude\//, 'career-suite/skills/'),
    v,
  ]),
]);

export interface SkillFile { path: string; bytes: number }
export interface SkillInfo { name: string; description: string; files: SkillFile[]; zipName: string }

export function frontmatter(md: string): Record<string, string> {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

const bytes = (s: string) => new TextEncoder().encode(s).length;

/** Every file under src/products/<slug>/, relative to that folder. */
export function productFiles(slug: string): Record<string, string> {
  const prefix = `${slug}/`;
  return Object.fromEntries(Object.entries(FILES).filter(([k]) => k.startsWith(prefix)).map(([k, v]) => [k.slice(prefix.length), v]));
}

/** The order buyers should meet the skills in (the job search order). Others follow, A to Z. */
const SKILL_ORDER = ['cc-resume', 'cc-linkedin', 'cc-interview', 'cc-outreach', 'cc-research', 'cc-offer', 'cc-resume-review', 'cc-linkedin-audit', 'cc-job-scan', 'cc-company-scorecards', 'cc-outreach-campaign', 'career-clarity', 'achievement-interviewer', 'job-match-rubric', 'job-search-autopilot', 'job-alerts-setup'];

export function skillsFor(slug: string): SkillInfo[] {
  const files = productFiles(slug);
  const rank = (n: string) => { const i = SKILL_ORDER.indexOf(n); return i === -1 ? 99 : i; };
  const names = [...new Set(Object.keys(files).filter((k) => /^skills\/[^/]+\/SKILL\.md$/.test(k)).map((k) => k.split('/')[1]))].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  return names.map((name) => {
    const fm = frontmatter(files[`skills/${name}/SKILL.md`]);
    const own = Object.keys(files)
      .filter((k) => k.startsWith(`skills/${name}/`))
      .sort((a, b) => (a.endsWith('SKILL.md') ? -1 : b.endsWith('SKILL.md') ? 1 : a.localeCompare(b)));
    return {
      name: fm.name || name,
      description: fm.description || '',
      files: own.map((k) => ({ path: k.slice('skills/'.length), bytes: bytes(files[k]) })),
      zipName: `${name}.zip`,
    };
  });
}

/** The zip for one skill, or null if it doesn't exist. Fixed timestamps, so the same files give the same zip. */
export function skillZip(slug: string, skill: string): Uint8Array | null {
  const files = productFiles(slug);
  const prefix = `skills/${skill}/`;
  if (!files[`${prefix}SKILL.md`]) return null;
  const mtime = new Date('2026-01-01T00:00:00Z');
  const tree: Record<string, [Uint8Array, { mtime: Date }]> = {};
  for (const [k, v] of Object.entries(files)) {
    if (k.startsWith(prefix)) tree[`${skill}/${k.slice(prefix.length)}`] = [strToU8(v), { mtime }];
  }
  return zipSync(tree, { level: 9 });
}

/** Platforms with a ready-made folder (one Custom GPT or Gem per tool, setup.md inside each). */
export const PLATFORMS = { chatgpt: 'ChatGPT', gemini: 'Gemini' } as const;
export type Platform = keyof typeof PLATFORMS;

/** Which platform folders a product has, e.g. the Career Suite has ChatGPT and Gemini versions. */
export function platformsFor(slug: string): Platform[] {
  const files = Object.keys(productFiles(slug));
  return (Object.keys(PLATFORMS) as Platform[]).filter((p) => files.some((k) => k.startsWith(`${p}/`)));
}

/** The whole ChatGPT or Gemini folder as one zip (each tool in its own folder), or null. */
export function platformZip(slug: string, platform: string): Uint8Array | null {
  if (!(platform in PLATFORMS)) return null;
  const files = productFiles(slug);
  const prefix = `${platform}/`;
  const mtime = new Date('2026-01-01T00:00:00Z');
  const tree: Record<string, [Uint8Array, { mtime: Date }]> = {};
  for (const [k, v] of Object.entries(files)) {
    if (k.startsWith(prefix)) tree[`${slug}-${platform}/${k.slice(prefix.length)}`] = [strToU8(v), { mtime }];
  }
  return Object.keys(tree).length ? zipSync(tree, { level: 9 }) : null;
}

export function startHere(slug: string): string | null {
  return productFiles(slug)['start-here.md'] ?? null;
}

/** Plain-text setup for a Claude Project, Custom GPT or Gemini Gem, when a product has one. */
export function projectInstructions(slug: string): string | null {
  return productFiles(slug)['project-instructions.md'] ?? null;
}

/** Bonus reading in src/products/<slug>/bonus/*.md, shown in the access hub with the guides. */
export function bonusDocs(slug: string): { id: string; title: string; markdown: string }[] {
  const files = productFiles(slug);
  return Object.keys(files)
    .filter((k) => /^bonus\/[^/]+\.md$/.test(k))
    .sort()
    .map((k) => {
      const md = files[k];
      const title = md.match(/^#\s+(.+)$/m)?.[1].trim() || k.slice(6, -3);
      return { id: `bonus-${k.slice(6, -3)}`, title: `Bonus: ${title.replace(/^bonus:\s*/i, '')}`, markdown: md };
    });
}

// ── Copy-paste prompt cards (from the skills' reference files) ─────────────────────────

export interface PromptStep { label: string; text: string }
export interface PromptCard { id: string; skill: string; title: string; whatItDoes: string; whenToUse: string; steps: PromptStep[]; replace: string }

/**
 * Prompts written in the house format (docs/products/SKILL-STYLE.md): `## Title`, "What it does",
 * "When to use it", `### Step N: label` and a `~~~text` fence. Fences are never nested, so this
 * parser doesn't trip over output templates the way the old one did.
 */
export function parsePrompts(md: string, skill = ''): PromptCard[] {
  const cards: PromptCard[] = [];
  const lines = md.replace(/^---\n[\s\S]*?\n---\n?/, '').split('\n');
  let card: PromptCard | null = null;
  let stepLabel = 'Prompt';
  let fence: string[] | null = null;
  const field = (line: string, label: string) => {
    const m = line.match(new RegExp(`^\\*\\*${label}:\\*\\*\\s*(.+)$`, 'i'));
    return m ? m[1].trim() : null;
  };
  const close = () => { if (card && card.steps.length) cards.push(card); card = null; };
  for (const line of lines) {
    if (fence) {
      if (/^~~~\s*$/.test(line)) { card?.steps.push({ label: stepLabel, text: fence.join('\n') }); fence = null; }
      else fence.push(line);
      continue;
    }
    if (/^~~~/.test(line)) { fence = []; continue; }
    if (/^## (?!#)/.test(line)) {
      close();
      card = { id: `${skill}-${cards.length + 1}`, skill, title: line.slice(3).trim(), whatItDoes: '', whenToUse: '', steps: [], replace: '' };
      stepLabel = 'Prompt';
      continue;
    }
    if (!card) continue;
    if (/^### /.test(line)) { stepLabel = line.slice(4).trim(); continue; }
    const c = card as PromptCard;
    c.whatItDoes ||= field(line, 'What it does') || '';
    c.whenToUse ||= field(line, 'When to use it') || '';
    c.replace ||= field(line, 'Replace') || '';
  }
  close();
  return cards.map((c, i) => ({ ...c, id: `${skill}-${i + 1}` }));
}

/** Every copy-paste prompt in a product's skill references, grouped by skill. */
export function promptCards(slug: string): { skill: string; cards: PromptCard[] }[] {
  const files = productFiles(slug);
  return skillsFor(slug)
    .map((s) => {
      const refs = Object.keys(files).filter((k) => k.startsWith(`skills/${s.name}/references/`)).sort();
      return { skill: s.name, cards: refs.flatMap((k) => parsePrompts(files[k], s.name)) };
    })
    .filter((g) => g.cards.length);
}
