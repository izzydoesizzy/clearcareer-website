export default function Client({ children }: { children: React.ReactNode }) {
  return (
    <div className="coaching-bubble coaching-bubble-client">
      <span className="coaching-label">Client</span>
      {children}
    </div>
  );
}
