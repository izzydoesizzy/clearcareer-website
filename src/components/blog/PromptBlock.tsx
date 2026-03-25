import CopyButton from "./CopyButton";

interface PromptBlockProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

export default function PromptBlock({ id, label, children }: PromptBlockProps) {
  return (
    <div className="prompt-block" id={id}>
      <div className="prompt-header">
        <span className="prompt-label">{label}</span>
      </div>
      <div className="prompt-content">{children}</div>
    </div>
  );
}
