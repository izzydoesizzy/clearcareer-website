/**
 * Pre-optimised WebP files in public/images/llu/.
 * Faces are cropped from each person's own public LinkedIn review screenshot.
 */
import type { ReviewKey } from "@/data/llu";

export interface Img {
  src: string;
  srcset?: string;
  width: number;
  height: number;
}

const face = (name: string): Img => ({ src: `/images/llu/face-${name}-144.webp`, width: 144, height: 144 });
const set = (name: string, sizes: [number, number][]): Img => {
  const [w, h] = sizes[sizes.length - 1];
  return {
    src: `/images/llu/${name}-${sizes[0][0]}.webp`,
    srcset: sizes.map(([sw]) => `/images/llu/${name}-${sw}.webp ${sw}w`).join(", "),
    width: w,
    height: h,
  };
};

export const faces: Record<ReviewKey, Img> = {
  kristin: face("kristin"),
  darin: face("darin"),
  blake: face("blake"),
  sparsh: face("sparsh"),
  laura: face("laura"),
  tamara: face("tamara"),
  kira: face("kira"),
  raunika: face("raunika"),
};

/** Full LinkedIn screenshots, shown large on desktop. */
export const shots = {
  sparsh: set("review-sparsh", [[880, 387], [1542, 678]]),
  raunika: set("review-raunika", [[880, 426], [1536, 744]]),
};

/** The untouched originals, already public on /testimonials. */
export const originals: Record<ReviewKey, string> = {
  kristin: "/images/testimonials/kristin-davis.png",
  darin: "/images/testimonials/darin-mellor.png",
  blake: "/images/testimonials/blake-mcdermott.png",
  sparsh: "/images/testimonials/sparsh-kalia.png",
  laura: "/images/testimonials/laura-salamanca.png",
  tamara: "/images/testimonials/tamara-gordon.png",
  kira: "/images/testimonials/kira-howe.png",
  raunika: "/images/testimonials/raunika-lamge.png",
};

export const izzy = {
  face: face("izzy"),
  sofa: set("izzy-sofa", [[480, 480], [880, 880]]),
  events: set("izzy-events", [[440, 440], [768, 768]]),
};

export const profiles = {
  eblenBefore: set("eblen-before", [[480, 206], [817, 350]]),
  eblenAfter: set("eblen-after", [[480, 220], [817, 374]]),
};
