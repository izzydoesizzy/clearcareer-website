interface Deliverable {
  name: string;
  description: string;
}

interface Pillar {
  name: string;
  icon: string;
  weeks: string;
  deliverables: Deliverable[];
}

interface DeliverableGridProps {
  pillars: Pillar[];
}

const iconColors: Record<string, string> = {
  building: "text-blue",
  target: "text-success",
  send: "text-blue-dark",
  mic: "text-warning",
};

const iconBgColors: Record<string, string> = {
  building: "bg-blue/10",
  target: "bg-success/10",
  send: "bg-blue-dark/10",
  mic: "bg-warning/10",
};

function PillarIcon({ icon }: { icon: string }) {
  const colorClass = iconColors[icon] || "text-blue";

  switch (icon) {
    case "building":
      return (
        <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "target":
      return (
        <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "send":
      return (
        <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      );
    case "mic":
      return (
        <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
        </svg>
      );
    default:
      return null;
  }
}

export default function DeliverableGrid({ pillars }: DeliverableGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {pillars.map((pillar) => (
        <div
          key={pillar.name}
          className="rounded-xl border border-border bg-white p-6 shadow-[0_4px_24px_-4px_rgba(1,97,239,0.10)] transition-shadow duration-300 hover:shadow-[0_8px_40px_-4px_rgba(1,97,239,0.18)]"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBgColors[pillar.icon] || "bg-blue/10"}`}>
              <PillarIcon icon={pillar.icon} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy">{pillar.name}</h3>
              <span className="inline-block rounded-full bg-blue-bg px-2.5 py-0.5 text-xs font-semibold text-blue">
                Weeks {pillar.weeks}
              </span>
            </div>
          </div>
          <ul className="space-y-3">
            {pillar.deliverables.map((deliverable) => (
              <li key={deliverable.name} className="flex items-start gap-2.5">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-semibold text-text">{deliverable.name}</span>
                  <span className="text-text-muted"> — {deliverable.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
