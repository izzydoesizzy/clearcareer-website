export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No Header/Footer — standalone sales pages
  return <>{children}</>;
}
