"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
        callbackURL: "/dashboard",
      });
      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }
      toast.success("Welcome back to EQUIPORA!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      toast.error("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      {/* Visual Panel */}
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#17231F] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101915] via-[#17231F]/65 to-[#17231F]/50" />
        <Link href="/" className="relative z-10 inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D3E39A] text-2xl font-black text-[#17231F]">
            E
          </span>
          <span className="text-xl font-black tracking-tight text-white">
            EQUIPORA<span className="text-[#EF8051]">.</span>
          </span>
        </Link>
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-bold tracking-[3px] text-[#D3E39A]">
            ACCESS YOUR WORKSPACE
          </p>
          <h2 className="mt-6 text-5xl font-black leading-[1.08] tracking-[-2px] text-white xl:text-6xl">
            Your next big
            <br />
            project starts now.
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-white/65">
            Find the right equipment, connect with reliable owners and keep
            every project moving forward.
          </p>
          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#D3E39A]" />
            <span className="text-xs font-semibold tracking-wide text-white/80">
              A smarter rental experience
            </span>
          </div>
        </div>
        <p className="relative z-10 text-[10px] font-semibold tracking-[2px] text-white/35">
          RENT SMART . BUILD MORE.
        </p>
      </aside>
      {/* Login Panel */}
      <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-9 flex items-center justify-between lg:hidden">
            <Link href="/" className="text-xl font-black tracking-tight">
              EQUIPORA<span className="text-[#EF8051]">.</span>
            </Link>
            <Link href="/regiter" className="text-sm font-bold text-[#EF8051]">
              Create account
            </Link>
          </div>
          <div className="mb-9">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7EED1] text-[#34452C]">
              <ShieldCheck size={23} />
            </div>
            <p className="text-[10px] font-bold tracking-[3px] text-[#EF8051]">
              YOUR EQUIPORA WORKSPACE
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-1.7px] text-[#17231F]">
              Welcome back.
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#7B857F]">
              Sign in to continue where your next project begins.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold text-[#34413A]">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="auth-field"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-[#34413A]">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="auth-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89938C]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#17231F] px-5 py-4 text-sm font-bold text-white shadow-[0_10px_25px_rgba(23,35,31,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#EF8051] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>
          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#E0E3DC]" />
            <span className="text-[10px] font-bold tracking-[2px] text-[#9AA39D]">
              OR CONTINUE WITH
            </span>
            <span className="h-px flex-1 bg-[#E0E3DC]" />
          </div>
          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#DDE1DA] bg-white px-5 py-4 text-sm font-bold text-[#34413A] transition hover:border-[#17231F] hover:bg-[#F9FAF7] disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg viewBox="0 0 48 48" className="h-5 w-5">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.07 13.22l7.98 6.19C12.93 13.72 18.04 9.5 24 9.5z"
                  transform="translate(0 5)"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.98 46.98 31.9 46.98 24.55z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.05 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.18 2.3-5.96 0-11.07-4.22-12.95-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
            )}
            Continue with Google
          </button>
          <p className="mt-8 text-center text-sm text-[#7B857F]">
            New to EQUIPORA?{" "}
            <Link
              href="/register"
              className="font-bold text-[#EF8051] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
