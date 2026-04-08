import Link from "next/link";
import { getAllPosts } from "@lib/blog";
import { generatePageMetadata } from "@components/SEOHead";
import Hero from "@components/Hero";
import CTASection from "@components/CTASection";
import BlogFilter from "@components/BlogFilter";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Career Blog | ClearCareer",
  description:
    "Career advice, job search strategies, resume tips, and salary negotiation guides from ClearCareer.",
});

export default function BlogPage() {
  const posts = getAllPosts();
  const allTags = [...new Set(posts.flatMap((p) => p.frontmatter.tags))].sort();
  const siteUrl = "https://joinclearcareer.com";

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ClearCareer Career Blog",
    description:
      "Career advice, job search strategies, resume tips, and salary negotiation guides.",
    url: `${siteUrl}/blog`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 10).map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteUrl}/blog/${post.slug}`,
        name: post.frontmatter.title,
      })),
    },
  };

  // Serialize posts data for the client filter component
  const postsData = posts.map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    image: post.frontmatter.image,
    tags: post.frontmatter.tags,
    category: post.frontmatter.category,
    type: post.frontmatter.type,
    publishDate: post.frontmatter.publishDate,
    author: post.frontmatter.author,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Hero
        variant="page"
        eyebrow="Career Blog"
        headline="Strategies That Actually Work"
        subheadline="Practical career advice from the trenches. No fluff, no filler."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          {/* Playbooks Banner */}
          <Link
            href="/playbooks"
            className="mb-8 flex items-center justify-between rounded-xl border border-blue/20 bg-blue-bg/50 p-4 transition-all hover:border-blue/40 hover:shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue/10">
                <svg
                  className="h-5 w-5 text-blue"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">
                  Looking for step-by-step guides?
                </p>
                <p className="text-xs text-text-muted">
                  Browse all playbooks organized by topic
                </p>
              </div>
            </div>
            <svg
              className="h-5 w-5 text-blue transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <BlogFilter posts={postsData} tags={allTags} />
        </div>
      </section>

      <CTASection
        heading="Want Personalized Career Advice?"
        primaryCTA={{
          text: "Book a Free Audit",
          href: "https://calendly.com/clearcareer/discovery-call",
        }}
        variant="blue"
      />
    </>
  );
}
