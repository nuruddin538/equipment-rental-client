"use client";

import { useCallback, useEffect, useState } from "react";

import { Save, UserRound, ShieldCheck } from "lucide-react";

import { toast } from "sonner";

import { getMyProfile, updateMyProfile } from "@/lib/api/customer";

import type { CustomerProfile } from "@/lib/types/customer";

export default function CustomerProfileForm() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getMyProfile();
      setProfile(result.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  //   useEffect(() => {
  //     void loadProfile();
  //   }, [loadProfile]);
  useEffect(() => {
    const loadingProfile = async () => {
      void loadProfile();
    };

    void loadingProfile();
  }, [loadProfile]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const data = {
      name: String(form.get("name") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      address: String(form.get("address") || "").trim(),
      image: String(form.get("image") || "").trim(),
    };

    if (data.name.length < 2) {
      toast.error("Name must contain at least 2 characters");
      return;
    }

    if (data.address.length > 300) {
      toast.error("Address must be under 300 characters");
      return;
    }

    try {
      setSaving(true);

      await updateMyProfile(data);

      setProfile((current) => (current ? { ...current, ...data } : current));

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid animate-pulse gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="h-80 rounded-2xl bg-[#14211F]/10" />
        <div className="h-[480px] rounded-2xl bg-white" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">
          {error || "Profile not found"}
        </p>

        <button
          onClick={() => void loadProfile()}
          className="mt-4 rounded-xl bg-[#14211F] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="relative overflow-hidden rounded-2xl bg-[#14211F] p-7 text-[#F4F1E8] sm:p-9">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/10" />

        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={32} />
            )}
          </div>

          <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9DB83]">
            EQUIPORA account
          </p>

          <h2 className="mt-2 break-words text-2xl font-black">
            {profile.name}
          </h2>

          <p className="mt-2 break-all text-sm text-white/55">
            {profile.email}
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#C9DB83]/15 px-4 py-2 text-xs font-semibold capitalize text-[#C9DB83]">
            <ShieldCheck size={15} />
            {profile.role} account
          </div>

          <p className="mt-10 text-xs leading-6 text-white/45">
            Keep your account information accurate so we can provide a better
            rental experience.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#14211F]/10 bg-white p-6 sm:p-8"
      >
        <div className="mb-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F07842]">
            Account settings
          </p>

          <h2 className="mt-2 text-2xl font-black">Personal information.</h2>

          <p className="mt-2 text-sm text-[#14211F]/50">
            Update your profile details and contact information.
          </p>
        </div>

        <div className="space-y-5">
          <label className="block text-xs font-bold">
            Full name
            <input
              name="name"
              required
              minLength={2}
              maxLength={80}
              defaultValue={profile.name}
              className="mt-2 h-12 w-full rounded-xl border border-[#14211F]/15 px-4 text-sm font-normal outline-none transition focus:border-[#F07842]"
            />
          </label>

          <label className="block text-xs font-bold">
            Email address
            <input
              value={profile.email}
              disabled
              className="mt-2 h-12 w-full rounded-xl border border-[#14211F]/10 bg-[#F4F1E8] px-4 text-sm font-normal text-[#14211F]/45"
            />
            <span className="mt-1.5 block text-[10px] font-normal text-[#14211F]/40">
              Your registered email cannot be changed here.
            </span>
          </label>

          <label className="block text-xs font-bold">
            Profile image URL
            <input
              name="image"
              type="url"
              defaultValue={profile.image || ""}
              placeholder="https://example.com/profile.jpg"
              className="mt-2 h-12 w-full rounded-xl border border-[#14211F]/15 px-4 text-sm font-normal outline-none focus:border-[#F07842]"
            />
          </label>

          <label className="block text-xs font-bold">
            Phone number
            <input
              name="phone"
              type="tel"
              defaultValue={profile.phone || ""}
              placeholder="Enter your phone number"
              className="mt-2 h-12 w-full rounded-xl border border-[#14211F]/15 px-4 text-sm font-normal outline-none focus:border-[#F07842]"
            />
          </label>

          <label className="block text-xs font-bold">
            Address
            <textarea
              name="address"
              rows={3}
              maxLength={300}
              defaultValue={profile.address || ""}
              placeholder="Enter your full address"
              className="mt-2 w-full rounded-xl border border-[#14211F]/15 p-4 text-sm font-normal outline-none focus:border-[#F07842]"
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#14211F]/10 pt-6">
            <span className="rounded-full bg-[#C9DB83]/30 px-3 py-2 text-[10px] font-bold uppercase tracking-wider">
              {profile.role}
            </span>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#14211F] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#233A34] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
