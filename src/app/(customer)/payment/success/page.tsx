"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, CircleAlert, Loader2, ArrowRight } from "lucide-react";
import { verifyCheckout } from "@/lib/api/payments";

type VerificationState = "loading" | "success" | "error";

function LoadingCard() {
  return (
    <>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C9DB83]/30">
        <Loader2 size={38} className="animate-spin" />
      </div>

      <h1 className="mt-6 text-2xl font-black">Verifying payment</h1>

      <p className="mt-3 text-sm text-[#14211F]/60">
        Please wait while we confirm your transaction.
      </p>
    </>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<VerificationState>("loading");
  const [message, setMessage] = useState("Verifying your payment...");
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    let active = true;

    async function verifyPayment() {
      if (!sessionId) {
        setStatus("error");
        setMessage("Payment session ID is missing.");
        return;
      }

      try {
        const result = await verifyCheckout(sessionId);

        if (!active) return;

        setStatus("success");
        setMessage(
          result.message || "Your payment has been verified successfully."
        );

        setBookingId(result.bookingId || result.booking?._id || "");
      } catch (error) {
        if (!active) return;

        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Payment verification failed."
        );
      }
    }

    verifyPayment();

    return () => {
      active = false;
    };
  }, [sessionId]);

  return (
    <>
      {status === "loading" && <LoadingCard />}

      {status === "success" && (
        <>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C9DB83]/40">
            <CheckCircle2 size={42} className="text-[#14211F]" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
            EQUIPORA / PAYMENT CONFIRMED
          </p>

          <h1 className="mt-3 text-3xl font-black">Payment successful!</h1>

          <p className="mt-3 text-sm leading-6 text-[#14211F]/60">{message}</p>

          {bookingId && (
            <div className="mt-6 rounded-xl bg-[#F4F1E8] p-4 text-left">
              <p className="text-xs text-[#14211F]/50">Booking reference</p>
              <p className="mt-1 break-all font-bold">{bookingId}</p>
            </div>
          )}

          <Link
            href="/dashboard/customer/rentals"
            className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#14211F] px-5 py-4 font-bold text-white transition hover:bg-[#263a36]"
          >
            View my rentals
            <ArrowRight size={18} />
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <CircleAlert size={40} className="text-red-600" />
          </div>

          <h1 className="mt-6 text-2xl font-black">
            Verification unsuccessful
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#14211F]/60">{message}</p>

          <Link
            href="/dashboard/customer/rentals"
            className="mt-7 block rounded-xl bg-[#14211F] px-5 py-4 font-bold text-white"
          >
            Go to my rentals
          </Link>
        </>
      )}
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#F4F1E8] px-4 py-12 text-[#14211F]">
      <div className="w-full max-w-lg rounded-3xl border border-[#14211F]/10 bg-white p-7 text-center shadow-sm sm:p-10">
        <Suspense fallback={<LoadingCard />}>
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </main>
  );
}
