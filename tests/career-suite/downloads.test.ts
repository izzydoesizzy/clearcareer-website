import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  PLATFORMS,
  SUITE_SKILLS,
  isSuiteSessionValid,
  suiteDownloadPath,
} from "../../src/data/career-suite";

const DIST = join(process.cwd(), "skills", "clearcareer-career-suite", "dist");

describe("Career Suite downloads", () => {
  it("every download button points at a file that exists", () => {
    for (const p of PLATFORMS) {
      for (const skill of [...SUITE_SKILLS.map((s) => s.slug), "all", "guide"]) {
        const rel = suiteDownloadPath(p.id, skill);
        expect(rel, `${p.id}/${skill}`).not.toBeNull();
        expect(existsSync(join(DIST, rel!)), `${rel} missing: run node scripts/build-career-suite.mjs`).toBe(true);
      }
    }
  });

  it("rejects anything not on the list", () => {
    expect(suiteDownloadPath("claude", "../../.env")).toBeNull();
    expect(suiteDownloadPath("../secrets", "career-clarity")).toBeNull();
    expect(suiteDownloadPath("copilot", "career-clarity")).toBeNull();
    expect(suiteDownloadPath("claude", "")).toBeNull();
  });

  it("only paid or free-with-code Career Suite sessions get access", () => {
    const meta = { product: "career-suite" };
    expect(isSuiteSessionValid({ payment_status: "paid", status: "complete", metadata: meta })).toBe(true);
    expect(isSuiteSessionValid({ payment_status: "no_payment_required", status: "complete", metadata: meta })).toBe(true);
    expect(isSuiteSessionValid({ payment_status: "no_payment_required", status: "open", metadata: meta })).toBe(false);
    expect(isSuiteSessionValid({ payment_status: "unpaid", status: "complete", metadata: meta })).toBe(false);
    expect(isSuiteSessionValid({ payment_status: "paid", status: "complete", metadata: { product: "vault" } })).toBe(false);
    expect(isSuiteSessionValid({ payment_status: "paid", status: "complete", metadata: null })).toBe(false);
  });
});
