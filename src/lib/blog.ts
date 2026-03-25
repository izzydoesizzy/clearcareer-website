import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

// Strip import lines from MDX content (components are provided via the components prop)
function stripImports(raw: string): string {
  return raw.replace(/^import\s+.*from\s+['"].*['"]\s*;?\s*$/gm, "").trim();
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  publishDate: string;
  author: string;
  image?: string;
  tags: string[];
  category: string;
  type: "playbook" | "article";
  featured: boolean;
  draft: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}

const defaultFrontmatter: Partial<BlogFrontmatter> = {
  author: "Izzy Piyale-Sheard",
  tags: [],
  category: "announcement",
  type: "article",
  featured: false,
  draft: false,
};

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const now = new Date();

  const posts: BlogPost[] = [];

  for (const file of files) {
    const filepath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(filepath, "utf-8");
    const { data, content } = matter(raw);

    const frontmatter: BlogFrontmatter = {
      ...defaultFrontmatter,
      ...data,
    } as BlogFrontmatter;

    if (frontmatter.draft) continue;
    if (new Date(frontmatter.publishDate) > now) continue;

    posts.push({
      slug: file.replace(/\.mdx$/, ""),
      frontmatter,
      content: stripImports(content),
    });
  }

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.publishDate).getTime() -
      new Date(a.frontmatter.publishDate).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filepath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);

  const frontmatter: BlogFrontmatter = {
    ...defaultFrontmatter,
    ...data,
  } as BlogFrontmatter;

  return { slug, frontmatter, content: stripImports(content) };
}

export function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 3
): BlogPost[] {
  const allPosts = getAllPosts();

  return allPosts
    .filter((post) => {
      if (post.slug === currentSlug) return false;
      return post.frontmatter.tags.some((tag) => tags.includes(tag));
    })
    .sort((a, b) => {
      const aMatches = a.frontmatter.tags.filter((tag) =>
        tags.includes(tag)
      ).length;
      const bMatches = b.frontmatter.tags.filter((tag) =>
        tags.includes(tag)
      ).length;
      return bMatches - aMatches;
    })
    .slice(0, limit);
}
