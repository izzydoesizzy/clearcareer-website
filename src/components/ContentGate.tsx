import { useState, useEffect, type ReactNode } from 'react';

interface ContentGateProps {
  source?: string;
  storageKey?: string;
  children: ReactNode;
}

export default function ContentGate({
  source = 'make-it-count',
  storageKey = 'makeitcount_unlocked',
  children,
}: ContentGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(storageKey) === 'true') {
      setUnlocked(true);
    }
  }, [storageKey]);

  if (unlocked) {
    return <>{children}</>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      if (res.ok) {
        localStorage.setItem(storageKey, 'true');
        setStatus('success');
        setTimeout(() => setUnlocked(true), 800);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="my-12">
      {/* Gate */}
      <div className="rounded-xl border-2 border-blue/30 bg-blue-bg p-8 text-center sm:p-10">
        <div className="mx-auto max-w-lg">
          <div className="mb-4 text-4xl">🔓</div>
          <h3 className="font-display text-2xl leading-tight text-navy sm:text-3xl">
            Unlock the Full Guide + All 10 AI Prompts
          </h3>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-text-muted sm:text-lg">
            Enter your email to access the complete playbook with frameworks, real coaching examples, and copy-paste prompts.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="gate-email" className="sr-only">
              Email address
            </label>
            <input
              id="gate-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 rounded-lg border border-border bg-white px-4 py-3 text-text placeholder:text-text-muted focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="rounded-lg bg-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'idle' && 'Unlock the Guide'}
              {status === 'loading' && 'Sending...'}
              {status === 'success' && 'Check your inbox!'}
              {status === 'error' && 'Try Again'}
            </button>
          </form>

          <p className="mt-3 text-xs text-text-muted">
            Plus one career tip per week. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* Blurred Preview */}
      <div className="relative mt-8 overflow-hidden rounded-xl">
        <div className="pointer-events-none select-none blur-sm opacity-50" aria-hidden="true">
          <div className="prose prose-lg max-w-none">
            <h2>Find Your Numbers: The 5 Dimensions</h2>
            <p>
              When I coach people through achievement mining, I use five dimensions. These are five
              different lenses for finding numbers in any role...
            </p>
            <h3>1. Volume: How Many?</h3>
            <p>This is the most straightforward dimension. How many projects did you complete?...</p>
            <h3>2. Time: How Fast? How Long?</h3>
            <p>Time is money, and employers know it...</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white" />
      </div>
    </div>
  );
}
