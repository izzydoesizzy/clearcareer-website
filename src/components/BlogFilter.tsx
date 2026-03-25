"use client";
import { useState } from "react";
import Link from "next/link";
import BlogCardThumbnail from "./BlogCardThumbnail";

interface PostData {
  slug: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  category: string;
  type: string;
  publishDate: string;
  author: string;
}

interface BlogFilterProps {
  posts: PostData[];
  tags: string[];
}

export default function BlogFilter({ posts, tags }: BlogFilterProps) {
  const [activeTag, setActiveTag] = useState("all");

  const filtered =
    activeTag === "all"
      ? posts
      : posts.filter((p) => p.tags.includes(activeTag));

  return (
    <>
      {/* Tag Navigation */}
      {tags.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              activeTag === "all"
                ? "bg-blue text-white"
                : "border border-border bg-white text-text-muted hover:border-blue hover:text-blue"
            }`}
          >
            All Posts
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? "bg-blue text-white"
                  : "border border-border bg-white text-text-muted hover:border-blue hover:text-blue"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Post Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {post.image ? (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <BlogCardThumbnail title={post.title} category={post.category} />
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex flex-wrap gap-2 min-h-[28px]">
                  {post.type === "playbook" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue px-2.5 py-0.5 text-[0.6875rem] font-semibold text-white">
                      <svg
                        className="h-2.5 w-2.5"
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
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-bg px-3 py-1 text-xs font-medium text-blue"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-navy group-hover:text-blue transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-text-muted line-clamp-2">
                  {post.description}
                </p>
                <p className="mt-auto pt-4 text-xs text-text-muted">
                  {new Date(post.publishDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  &middot; {post.author}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-blue-bg p-12 text-center">
          <h2 className="text-xl font-semibold text-navy">No posts found</h2>
          <p className="mx-auto mt-3 max-w-md text-text-muted">
            Try selecting a different tag or browse all posts.
          </p>
        </div>
      )}
    </>
  );
}
