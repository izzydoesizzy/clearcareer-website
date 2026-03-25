"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Program", href: "/programs/jsis" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blog", href: "/blog" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Playbooks", href: "/playbooks" },
      { label: "Free Tools", href: "/free-tools" },
      { label: "Career Tools", href: "/tools" },
      { label: "Guides & Templates", href: "/resources" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-border bg-white/95 transition-shadow ${
        scrolled ? "shadow-md" : ""
      }`}
      style={{
        backdropFilter: scrolled ? "blur(12px)" : "blur(4px)",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "blur(4px)",
      }}
    >
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue">
          ClearCareer
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-bg hover:text-blue ${
                    pathname.startsWith(item.href) ? "text-blue" : "text-text"
                  }`}
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  {item.label}
                  <svg
                    className="h-4 w-4 transition-transform group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="invisible absolute left-0 top-full z-50 min-w-[220px] rounded-lg border border-border bg-white py-2 shadow-lg opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-4 py-2 text-sm transition-colors hover:bg-blue-bg hover:text-blue ${
                        pathname === child.href ? "font-medium text-blue" : "text-text"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-bg hover:text-blue ${
                  item.href === "/"
                    ? pathname === "/"
                      ? "text-blue"
                      : "text-text"
                    : pathname.startsWith(item.href)
                      ? "text-blue"
                      : "text-text"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <a
          href="https://calendly.com/clearcareer"
          className="hidden rounded-lg bg-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-dark lg:inline-flex"
        >
          Book a Call
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-text transition-colors hover:bg-blue-bg lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-white lg:hidden">
          <nav className="mx-auto max-w-[1080px] px-4 py-4 sm:px-6" aria-label="Mobile navigation">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.label ? null : item.label)
                    }
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-blue-bg ${
                      pathname.startsWith(item.href) ? "text-blue" : "text-text"
                    }`}
                    aria-expanded={openDropdown === item.label}
                  >
                    {item.label}
                    <svg
                      className={`h-4 w-4 transition-transform ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === item.label && (
                    <div className="pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-blue-bg hover:text-blue ${
                            pathname === child.href ? "font-medium text-blue" : "text-text-muted"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-blue-bg ${
                    pathname === item.href ? "text-blue" : "text-text"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="mt-4 border-t border-border pt-4">
              <a
                href="https://calendly.com/clearcareer"
                className="block w-full rounded-lg bg-blue px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-dark"
              >
                Book a Call
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
