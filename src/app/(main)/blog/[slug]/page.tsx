import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPosts, getRelatedPosts } from "@lib/blog";
import { generatePageMetadata } from "@components/SEOHead";
import Coach from "@components/blog/Coach";
import Client from "@components/blog/Client";
import PromptBlockWrapper from "@components/blog/PromptBlockWrapper";
import type { Metadata } from "next";

// MDX components map
const mdxComponents = {
  Coach,
  Client,
  PromptBlock: PromptBlockWrapper,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return generatePageMetadata({
    title: `${post.frontmatter.title} | ClearCareer`,
    description: post.frontmatter.description,
    image: post.frontmatter.image,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter, content } = post;
  const isPlaybook = frontmatter.type === "playbook";
  const relatedPosts = getRelatedPosts(slug, frontmatter.tags, 3);

  const formattedDate = new Date(frontmatter.publishDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const siteUrl = "https://joinclearcareer.com";
  const articleUrl = `${siteUrl}/blog/${slug}`;
  const ogImage = frontmatter.image?.startsWith("http")
    ? frontmatter.image
    : frontmatter.image
      ? `${siteUrl}${frontmatter.image}`
      : undefined;

  // Article JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: ogImage,
    wordCount,
    author: { "@type": "Person", name: frontmatter.author, url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: "ClearCareer",
      url: siteUrl,
    },
    datePublished: frontmatter.publishDate,
    dateModified: frontmatter.publishDate,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: isPlaybook ? "Playbooks" : "Blog",
        item: `${siteUrl}${isPlaybook ? "/playbooks" : "/blog"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: frontmatter.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="mx-auto max-w-[720px] px-4 py-12 sm:px-6 md:py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-muted">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-blue">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            {isPlaybook ? (
              <li>
                <Link href="/playbooks" className="hover:text-blue">
                  Playbooks
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/blog" className="hover:text-blue">
                  Blog
                </Link>
              </li>
            )}
            <li aria-hidden="true">/</li>
            <li className="truncate text-text" aria-current="page">
              {frontmatter.title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {isPlaybook && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue px-3 py-1 text-xs font-semibold text-white">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Playbook
              </span>
            )}
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-bg px-3 py-1 text-xs font-medium text-blue"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-[1.05] text-navy">
            {frontmatter.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-text-muted">
            <span>{frontmatter.author}</span>
            <span aria-hidden="true">&middot;</span>
            <time dateTime={frontmatter.publishDate}>{formattedDate}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{readingTime} min read</span>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <MDXRemote source={content} components={mdxComponents} />
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-blue-bg p-8 text-center">
          <h3 className="text-xl font-bold text-navy">
            Want personalized help with your job search?
          </h3>
          <p className="mx-auto mt-2 max-w-md text-[1.0625rem] text-text-muted">
            Book a free 20-minute audit with Izzy. We&apos;ll diagnose
            what&apos;s not working and map out your next steps.
          </p>
          <a
            href="https://calendly.com/clearcareer/discovery-call"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-dark"
          >
            Book a Free Audit
          </a>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 border-t border-border pt-10">
            <h3 className="text-xl font-bold text-navy">Keep Reading</h3>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group rounded-lg border border-border p-4 transition-shadow hover:shadow-md"
                >
                  <h4 className="text-sm font-semibold text-navy group-hover:text-blue transition-colors line-clamp-2">
                    {rp.frontmatter.title}
                  </h4>
                  <p className="mt-2 text-xs text-text-muted line-clamp-2">
                    {rp.frontmatter.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
