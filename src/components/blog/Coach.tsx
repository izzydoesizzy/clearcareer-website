export default function Coach({ children }: { children: React.ReactNode }) {
  return (
    <div className="coaching-bubble coaching-bubble-coach">
      <span className="coaching-label">Coach</span>
      {children}
    </div>
  );
}
