import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "ClearCareer | Career Coaching That Gets Results",
  description:
    "200+ professionals coached. $1.2M+ in collective raises. 8-week done-with-you job search accelerator with 20+ career assets. Book a free strategy call.",
  metadataBase: new URL("https://joinclearcareer.com"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen bg-white font-sans text-text antialiased">
        {children}
      </body>
    </html>
  );
}
