"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import AdminTableSkeleton from "./AdminTableSkeleton";
import { deleteUser, getAllUsers, updateUserRole } from "@/lib/api/admin";

import type { AdminUser, UserRole } from "@/lib/types/admin";

const roles: UserRole[] = ["customer", "owner", "admin"];

export default function AllUsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [busyId, setBusyId] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAllUsers();
      setUsers(result.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadEquipment = async () => {
      void loadUsers();
    };

    void loadEquipment();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleRoleChange = async (user: AdminUser, role: UserRole) => {
    if (user.role === role) return;

    try {
      setBusyId(user._id);
      await updateUserRole(user._id, role);

      setUsers((current) =>
        current.map((item) =>
          item._id === user._id ? { ...item, role } : item
        )
      );

      toast.success("User role updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Role update failed");
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (user: AdminUser) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        user.name || user.email
      }? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setBusyId(user._id);
      await deleteUser(user._id);

      setUsers((current) => current.filter((item) => item._id !== user._id));

      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId("");
    }
  };

  if (loading) return <AdminTableSkeleton rows={7} columns={5} />;

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">{error}</p>
        <button
          onClick={() => void loadUsers()}
          className="mt-4 rounded-xl bg-[#14211F] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#14211F]/10 bg-white">
      <div className="flex flex-col gap-4 border-b border-[#14211F]/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold">Registered users</p>
          <p className="mt-1 text-xs text-[#14211F]/45">
            {filteredUsers.length} users found
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#14211F]/40"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or email"
              className="h-10 w-full rounded-xl border border-[#14211F]/10 pl-9 pr-3 text-sm outline-none focus:border-[#F07842] sm:w-56"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="h-10 rounded-xl border border-[#14211F]/10 bg-white px-3 text-sm outline-none"
          >
            <option value="all">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <button
            onClick={() => void loadUsers()}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#14211F] px-4 text-sm font-semibold text-white"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <Users className="mx-auto text-[#14211F]/25" size={34} />
          <p className="mt-3 font-semibold">No users found</p>
          <p className="mt-1 text-sm text-[#14211F]/45">
            Try changing your search or filter.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#F4F1E8]/70 text-[10px] uppercase tracking-wider text-[#14211F]/50">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Registered</th>
                  <th className="px-6 py-4 text-right">Manage</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#14211F]/8">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#F4F1E8]/35">
                    <td className="px-6 py-4 font-semibold">
                      {user.name || "Unnamed user"}
                    </td>
                    <td className="px-6 py-4 text-[#14211F]/60">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        disabled={busyId === user._id}
                        onChange={(event) =>
                          void handleRoleChange(
                            user,
                            event.target.value as UserRole
                          )
                        }
                        className="rounded-lg border border-[#14211F]/10 bg-white px-3 py-2 text-xs font-semibold capitalize outline-none"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-[#14211F]/55">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        disabled={busyId === user._id}
                        onClick={() => void handleDelete(user)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-40"
                        aria-label="Delete user"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-[#14211F]/10 md:hidden">
            {filteredUsers.map((user) => (
              <div key={user._id} className="space-y-3 p-5">
                <div>
                  <p className="font-bold">{user.name || "Unnamed user"}</p>
                  <p className="mt-1 break-all text-xs text-[#14211F]/50">
                    {user.email}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <select
                    value={user.role}
                    disabled={busyId === user._id}
                    onChange={(event) =>
                      void handleRoleChange(
                        user,
                        event.target.value as UserRole
                      )
                    }
                    className="rounded-lg border border-[#14211F]/10 bg-white px-3 py-2 text-xs font-semibold capitalize"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

                  <button
                    disabled={busyId === user._id}
                    onClick={() => void handleDelete(user)}
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>

                <p className="text-xs text-[#14211F]/45">
                  Joined:{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
