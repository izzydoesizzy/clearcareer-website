"use client";

import { useCallback, useMemo, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

interface ProductCheckoutProps {
  productSlug: string;
  publishableKey: string;
}

/** Stripe's embedded checkout for one shop product. Says so plainly if the product can't be bought yet. */
export default function ProductCheckout({ productSlug, publishableKey }: ProductCheckoutProps) {
  const stripePromise = useMemo(() => (publishableKey ? loadStripe(publishableKey) : null), [publishableKey]);
  const [error, setError] = useState("");

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch(`/api/products/${productSlug}/checkout`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.clientSecret) {
      setError("Checkout for this product isn't open yet. Email izzy@joinclearcareer.com and I'll sort it out.");
      throw new Error("checkout unavailable");
    }
    return data.clientSecret as string;
  }, [productSlug]);

  if (!stripePromise || error) {
    return (
      <p className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-4 text-center text-sm text-gray-600">
        {error || "Checkout isn't open yet. Email izzy@joinclearcareer.com and I'll sort it out."}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
