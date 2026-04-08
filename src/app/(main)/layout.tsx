import Header from "@components/Header";
import Footer from "@components/Footer";
import ScrollAnimator from "@components/ScrollAnimator";
import { generateWebsiteSchema } from "@lib/seo";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ScrollAnimator />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebsiteSchema()),
        }}
      />
    </>
  );
}
