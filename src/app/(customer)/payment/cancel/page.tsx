import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#F4F1E8] px-4 py-12 text-[#14211F]">
      <div className="w-full max-w-lg rounded-3xl border border-[#14211F]/10 bg-white p-7 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
          <XCircle size={42} className="text-[#F07842]" />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
          EQUIPORA / CHECKOUT
        </p>

        <h1 className="mt-3 text-3xl font-black">Payment cancelled</h1>

        <p className="mt-3 text-sm leading-6 text-[#14211F]/60">
          Your checkout was cancelled. No successful payment has been confirmed.
          You can return to the equipment page and try again.
        </p>

        <Link
          href="/equipment"
          className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#14211F] px-5 py-4 font-bold text-white transition hover:bg-[#263a36]"
        >
          <RefreshCw size={18} />
          Browse equipment
        </Link>

        <Link
          href="/dashboard/customer/rentals"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#14211F]/60 hover:text-[#F07842]"
        >
          <ArrowLeft size={16} />
          My rentals
        </Link>
      </div>
    </main>
  );
}
