"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function RegisterForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const passwordChecks = [
    {
      label: "At least 6 characters",
      valid: password.length >= 6,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
  ];
  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    const apiKey = process.env.NEXT_PUBLIC_IMAGE_API_KEY;
    if (!apiKey) {
      toast.error("Image upload is not configured");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "Image upload failed.");
      }
      setImage(result.data.display_url || result.data.url);
      toast.success("Profile photo uploaded");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to upload image."
      );
    } finally {
      setUploading(false);
    }
  };
  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Plase enter your full name");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain an uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain a lowercase letter.");
      return;
    }
    if (uploading) {
      toast.error("Please wait until the image upload finishes.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        image: image || undefined,
        callbackURL: "/dashboard",
      });
      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }
      toast.success("Welcome to EQUIPORA! Account created.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
              "url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#101915] via-[#17231F]/70 to-[#17231F]/50" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D3E39A] text-2xl font-black text-[#17231F]">
              E
            </span>

            <span className="text-xl font-black tracking-tight text-white">
              EQUIPORA<span className="text-[#EF8051]">.</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-bold tracking-[3px] text-[#D3E39A]">
            YOUR NEXT PROJECT STARTS HERE
          </p>

          <h2 className="mt-6 text-5xl font-black leading-[1.08] tracking-[-2px] text-white xl:text-6xl">
            Better tools.
            <br />
            Bigger possibilities.
          </h2>

          <p className="mt-6 max-w-md text-base leading-8 text-white/65">
            Join a community where quality equipment, trusted owners and
            ambitious projects come together.
          </p>

          <div className="mt-10 flex items-center gap-4 border-t border-white/15 pt-7">
            <div className="flex -space-x-3">
              {[
                "photo-1500648767791-00dcc994a43e",
                "photo-1534528741775-53994a69daeb",
                "photo-1506794778202-cad84cf45f1d",
              ].map((photo) => (
                <img
                  key={photo}
                  src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=100&q=80`}
                  alt="EQUIPORA community member"
                  className="h-10 w-10 rounded-full border-2 border-[#17231F] object-cover"
                />
              ))}
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                Built for people who build.
              </p>
              <p className="mt-1 text-xs text-white/50">
                One platform. Endless possibilities.
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[10px] font-semibold tracking-[2px] text-white/35">
          RENT SMART. BUILD MORE.
        </p>
      </aside>

      {/* Form Panel */}
      <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-9 flex items-center justify-between lg:hidden">
            <Link href="/" className="text-xl font-black tracking-tight">
              EQUIPORA<span className="text-[#EF8051]">.</span>
            </Link>

            <Link href="/login" className="text-sm font-bold text-[#EF8051]">
              Sign in
            </Link>
          </div>

          <div className="mb-8">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7EED1] text-[#34452C]">
              <UserRound size={22} />
            </div>

            <p className="text-[10px] font-bold tracking-[3px] text-[#EF8051]">
              CREATE YOUR ACCOUNT
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-[-1.7px] text-[#17231F]">
              Join EQUIPORA.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#7B857F]">
              Create your account and get access to a smarter equipment rental
              experience.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-xs font-bold text-[#34413A]">
                FULL NAME
              </label>

              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                className="auth-field"
              />
            </div>

            {/* Email */}
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

            {/* Photo */}
            <div>
              <label className="mb-2 block text-xs font-bold text-[#34413A]">
                PROFILE PHOTO
                <span className="ml-2 font-normal text-[#9AA39D]">
                  OPTIONAL
                </span>
              </label>

              <div className="flex gap-3">
                <input
                  type="url"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  placeholder="Paste image URL"
                  className="auth-field min-w-0 flex-1"
                />

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-[#D9DED8] bg-white px-4 text-xs font-bold text-[#34413A] transition hover:border-[#EF8051] hover:text-[#EF8051] disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ImagePlus size={16} />
                  )}
                  Upload
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadImage(file);
                    event.target.value = "";
                  }}
                />
              </div>

              {image && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#DCE5CC] bg-[#F0F4E7] p-3">
                  <img
                    src={image}
                    alt="Profile preview"
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <span className="flex-1 text-xs font-semibold text-[#34413A]">
                    Profile photo selected
                  </span>

                  <button
                    type="button"
                    onClick={() => setImage("")}
                    aria-label="Remove photo"
                    className="text-[#758079] hover:text-red-500"
                  >
                    <X size={17} />
                  </button>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs font-bold text-[#34413A]">
                PASSWORD
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a strong password"
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

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {passwordChecks.map((check) => (
                  <span
                    key={check.label}
                    className={`flex items-center gap-1.5 text-[10px] font-semibold ${
                      check.valid ? "text-[#52713D]" : "text-[#9AA39D]"
                    }`}
                  >
                    <Check size={12} />
                    {check.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#17231F] px-5 py-4 text-sm font-bold text-white shadow-[0_10px_25px_rgba(23,35,31,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#EF8051] hover:shadow-[0_14px_28px_rgba(239,128,81,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-[#87918A]">
            <ShieldCheck size={15} className="text-[#6E8C55]" />
            Your account is protected with secure authentication.
          </div>

          <p className="mt-7 text-center text-sm text-[#7B857F]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#EF8051] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
