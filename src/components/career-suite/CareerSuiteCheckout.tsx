import { useCallback, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

interface Props {
  publishableKey: string;
}

// Shows a plain message instead of an empty box when checkout can't start,
// so a missing key or price is obvious right away.
function CheckoutProblem({ detail }: { detail: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-navy">
      <p className="font-semibold">Checkout couldn't load.</p>
      <p className="mt-1 text-text-muted">
        Please email <a className="text-blue underline" href="mailto:izzy@joinclearcareer.com">izzy@joinclearcareer.com</a> and we'll get you set up.
      </p>
      <p className="mt-2 text-xs text-text-muted">Details: {detail}</p>
    </div>
  );
}

export default function CareerSuiteCheckout({ publishableKey }: Props) {
  const [error, setError] = useState("");
  const stripePromise = useMemo(() => (publishableKey ? loadStripe(publishableKey) : null), [publishableKey]);

  const fetchClientSecret = useCallback(async () => {
    try {
      const res = await fetch("/api/career-suite/checkout", { method: "POST" });
      const data = await res.json().catch(() => ({ error: `Server returned ${res.status}` }));
      if (!res.ok || data.error || !data.clientSecret) {
        const msg = data.error || `Server returned ${res.status}`;
        console.error("Career Suite checkout error:", msg);
        setError(msg);
        return "";
      }
      return data.clientSecret as string;
    } catch (err: any) {
      const msg = err?.message || "Network error";
      console.error("Career Suite checkout error:", msg);
      setError(msg);
      return "";
    }
  }, []);

  if (!stripePromise) return <CheckoutProblem detail="Stripe publishable key is not set for this environment." />;
  if (error) return <CheckoutProblem detail={error} />;

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
