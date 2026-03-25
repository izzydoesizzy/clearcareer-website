import type { Metadata } from "next";

interface SEOParams {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishDate?: string;
  author?: string;
  noindex?: boolean;
}

const SITE_NAME = "ClearCareer";
const DEFAULT_IMAGE = "/images/og-default.png";
const BASE_URL = "https://joinclearcareer.com";

export function generatePageMetadata({
  title,
  description,
  image,
  url,
  type = "website",
  publishDate,
  author,
  noindex,
}: SEOParams): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const ogImage = image || DEFAULT_IMAGE;
  const canonical = url ? `${BASE_URL}${url}` : BASE_URL;

  return {
    title: fullTitle,
    description,
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: type === "article" ? "article" : "website",
      ...(publishDate && { publishedTime: publishDate }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`],
    },
    alternates: {
      canonical,
    },
  };
}
