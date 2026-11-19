import type { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar";
// import Footer from "@/components/shared/Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />

      <main className="min-h-[70vh]">{children}</main>

      {/* <Footer /> */}
    </>
  );
}
