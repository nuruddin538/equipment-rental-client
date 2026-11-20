"use client";

import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Image as ImageIcon,
  Save,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { getOwnerProfile, updateOwnerProfile } from "@/lib/api/owner";

import type { OwnerProfile } from "@/lib/types/owner";

export default function OwnerProfileForm() {
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await getOwnerProfile();

        setProfile(result.profile);
        setName(result.profile.name);
        setPhone(result.profile.phone || "");
        setImage(result.profile.image || "");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    try {
      setSaving(true);

      await updateOwnerProfile({
        name: name.trim(),
        phone: phone.trim(),
        image: image.trim(),
      });

      setProfile((previous) =>
        previous
          ? {
              ...previous,
              name: name.trim(),
              phone: phone.trim(),
              image: image.trim(),
            }
          : previous
      );

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl bg-white p-7">
        <div className="h-24 w-24 rounded-full bg-gray-200" />
        <div className="mt-6 h-12 rounded-xl bg-gray-200" />
        <div className="mt-4 h-12 rounded-xl bg-gray-200" />
        <div className="mt-4 h-12 rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500">
        Unable to load owner profile. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
      {/* Profile preview */}
      <aside className="h-fit overflow-hidden rounded-2xl bg-[#14211F] text-[#F4F1E8]">
        <div className="h-28 bg-[#F07842]" />

        <div className="-mt-12 px-6 pb-7">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-[#14211F] bg-[#F4F1E8] text-[#14211F]">
            {image ? (
              <img
                src={image}
                alt={name || "Owner"}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={38} />
            )}
          </div>

          <h2 className="mt-5 text-xl font-black">{name || "Your Name"}</h2>

          <p className="mt-1 break-all text-sm text-[#A9B7B0]">
            {profile.email}
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-[#C9DB83]">
            <ShieldCheck size={15} />
            Verified Owner Account
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#82918A]">
              ACCOUNT TYPE
            </p>
            <p className="mt-2 font-bold capitalize">{profile.role}</p>
          </div>
        </div>
      </aside>

      {/* Edit profile form */}
      <section className="rounded-2xl border border-[#14211F]/10 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
            ACCOUNT SETTINGS
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#14211F]">
            Personal information
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Keep your owner profile accurate and up to date.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#14211F]">
              <UserRound size={16} />
              Full Name
            </label>

            <input
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-[#14211F]/15 px-4 py-3 text-sm outline-none transition focus:border-[#F07842] focus:ring-4 focus:ring-[#F07842]/10"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#14211F]">
              <Mail size={16} />
              Email Address
            </label>

            <input
              disabled
              value={profile.email}
              className="w-full cursor-not-allowed rounded-xl border border-[#14211F]/10 bg-gray-50 px-4 py-3 text-sm text-gray-500"
            />

            <p className="mt-2 text-xs text-gray-400">
              Email is managed by your authentication account.
            </p>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#14211F]">
              <Phone size={16} />
              Contact Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1XXXXXXXXX"
              className="w-full rounded-xl border border-[#14211F]/15 px-4 py-3 text-sm outline-none transition focus:border-[#F07842] focus:ring-4 focus:ring-[#F07842]/10"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#14211F]">
              <ImageIcon size={16} />
              Profile Image URL
            </label>

            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/profile.jpg"
              className="w-full rounded-xl border border-[#14211F]/15 px-4 py-3 text-sm outline-none transition focus:border-[#F07842] focus:ring-4 focus:ring-[#F07842]/10"
            />

            <p className="mt-2 text-xs text-gray-400">
              Use a valid HTTPS image URL.
            </p>
          </div>

          <div className="flex justify-end border-t border-[#14211F]/10 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F07842] px-6 py-3 text-sm font-black text-[#14211F] transition hover:bg-[#e96935] disabled:opacity-60 sm:w-auto"
            >
              {saving ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
