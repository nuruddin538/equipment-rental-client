"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function CustomerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Customer dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-[#14211F]/10 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <AlertTriangle size={26} />
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F07842]">
          Customer dashboard
        </p>

        <h2 className="mt-2 text-2xl font-black">Something went wrong.</h2>

        <p className="mt-3 text-sm leading-6 text-[#14211F]/55">
          We couldn&apos;t load this page. Please try again.
        </p>

        {error.digest && (
          <p className="mt-3 text-[10px] text-[#14211F]/35">
            Error reference: {error.digest}
          </p>
        )}

        <button
          onClick={() => reset()}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#14211F] px-6 py-3 text-sm font-bold text-white"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    </div>
  );
}
