"use client";

import Link from "next/link";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const columns: FooterColumn[] = [
  {
    title: "Program",
    links: [
      { label: "Job Search Ignition System", href: "/programs/jsis" },
      { label: "Outcomes Report", href: "/outcomes" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Book a Free Audit", href: "https://calendly.com/clearcareer/discovery-call" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Playbooks", href: "/playbooks" },
      { label: "Free Tools", href: "/free-tools" },
      { label: "Career Tools", href: "/tools" },
      { label: "Guides & Templates", href: "/resources" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Izzy", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  function handleNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const btn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (btn) {
      btn.textContent = "Coming soon!";
      btn.disabled = true;
      btn.classList.add("opacity-60", "cursor-not-allowed");
    }
  }

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-[1080px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block text-xl font-bold text-white">
              ClearCareer
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
              Helping professionals land jobs they love, faster. Career coaching that turns your job
              search into a clear, actionable plan.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://linkedin.com/in/izzydoesizzy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-gray-400 transition-colors hover:bg-blue hover:text-white"
                aria-label="Follow ClearCareer on LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@clearcareer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-gray-400 transition-colors hover:bg-blue hover:text-white"
                aria-label="Subscribe to ClearCareer on YouTube"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Nav Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        className="text-sm text-gray-300 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-300 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-semibold text-white">Get career tips in your inbox</h3>
              <p className="mt-1 text-sm text-gray-400">
                Actionable job search strategies. No fluff.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-3" onSubmit={handleNewsletterSubmit}>
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/50"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-dark"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} ClearCareer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
