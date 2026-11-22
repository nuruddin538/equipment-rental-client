"use client";

import { useEffect, useState } from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Users,
  Package,
  ClipboardList,
  Clock3,
  CalendarCheck,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";

import { getAdminAnalytics } from "@/lib/api/analytics";

import type { AdminAnalytics as AdminAnalyticsType } from "@/lib/types/analytics";

// Safely convert API values into numbers
const safeNumber = (value: unknown): number => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

// USD currency formatter
const currency = (amount: unknown): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeNumber(amount));
};

// Compact currency formatter
const compactCurrency = (amount: unknown): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(safeNumber(amount));
};

// Number formatter
const formatNumber = (value: unknown): string => {
  return new Intl.NumberFormat("en-US").format(safeNumber(value));
};

// Month names
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AdminAnalyticsType | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Analytics
  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      try {
        const data = await getAdminAnalytics();

        if (!active) return;

        if (!data?.success || !data.analytics) {
          throw new Error("Invalid analytics response from server.");
        }

        const response = data.analytics;

        const normalizedData: AdminAnalyticsType = {
          totalUsers: safeNumber(response.totalUsers),

          totalEquipment: safeNumber(response.totalEquipment),

          totalBookings: safeNumber(response.totalBookings),

          pendingApprovals: safeNumber(response.pendingApprovals),

          completedRentals: safeNumber(response.completedRentals),

          totalRevenue: safeNumber(response.totalRevenue),

          monthlyBookingStats: Array.isArray(response.monthlyBookingStats)
            ? response.monthlyBookingStats.map((item) => ({
                key: String(item?.key ?? ""),
                month: String(item?.month ?? ""),
                year: safeNumber(item?.year),
                bookings: safeNumber(item?.bookings),
              }))
            : [],
        };

        setAnalytics(normalizedData);
        setError("");
      } catch (err) {
        if (active) {
          console.error("Admin analytics error:", err);

          setError(
            err instanceof Error ? err.message : "Failed to load analytics."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      active = false;
    };
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-2xl bg-gray-200"
          />
        ))}
      </div>
    );
  }

  // Error State
  if (error || !analytics) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-600">
          {error || "Analytics data not available."}
        </p>
      </div>
    );
  }

  // Monthly Booking Statistics
  const monthlyStats = Array.isArray(analytics.monthlyBookingStats)
    ? [...analytics.monthlyBookingStats].sort(
        (a, b) =>
          a.year - b.year ||
          monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
      )
    : [];

  const chartData = monthlyStats.map((item) => ({
    ...item,
    bookings: safeNumber(item.bookings),
    monthLabel: `${item.month} ${item.year}`,
  }));

  const totalBookings = safeNumber(analytics.totalBookings);

  const completedRentals = safeNumber(analytics.completedRentals);

  const completionRate =
    totalBookings > 0 ? (completedRentals / totalBookings) * 100 : 0;

  const totalMonths = chartData.length;

  const averageBookings = totalMonths > 0 ? totalBookings / totalMonths : 0;

  const bestMonth =
    chartData.length > 0
      ? chartData.reduce((best, current) =>
          current.bookings > best.bookings ? current : best
        )
      : null;

  // Statistics Cards
  const stats = [
    {
      title: "Total Users",
      value: formatNumber(analytics.totalUsers),
      description: "Registered platform users",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Equipment",
      value: formatNumber(analytics.totalEquipment),
      description: "Equipment listed on platform",
      icon: Package,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Bookings",
      value: formatNumber(totalBookings),
      description: "All rental bookings",
      icon: ClipboardList,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Pending Approvals",
      value: formatNumber(analytics.pendingApprovals),
      description: "Waiting for admin approval",
      icon: Clock3,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      title: "Completed Rentals",
      value: formatNumber(completedRentals),
      description: "Successfully completed rentals",
      icon: CalendarCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Revenue",
      value: currency(analytics.totalRevenue),
      description: "Total platform revenue",
      icon: Wallet,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <section className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon size={23} className={stat.iconColor} />
                </div>

                <ArrowUpRight
                  size={20}
                  className="text-gray-300 transition group-hover:text-[#F07842]"
                />
              </div>

              <p className="mt-5 text-sm font-medium text-gray-500">
                {stat.title}
              </p>

              <h3 className="mt-2 break-words text-2xl font-black text-[#14211F]">
                {stat.value}
              </h3>

              <p className="mt-2 text-xs text-gray-400">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly Booking Area Chart */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                <ChartNoAxesCombined size={21} className="text-[#F07842]" />
              </div>

              <div>
                <h2 className="text-lg font-black text-[#14211F]">
                  Booking Overview
                </h2>

                <p className="text-xs text-gray-400">
                  Monthly platform booking performance
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-orange-50 px-4 py-3">
            <p className="text-xs font-medium text-orange-700">
              Total Bookings
            </p>

            <p className="mt-1 text-xl font-black text-orange-700">
              {formatNumber(totalBookings)}
            </p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex h-72 items-center justify-center">
            <p className="text-sm text-gray-400">
              No monthly booking data available.
            </p>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 5,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient
                    id="bookingGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#F07842" stopOpacity={0.3} />

                    <stop offset="95%" stopColor="#F07842" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  dy={10}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  width={45}
                />

                <Tooltip
                  cursor={{
                    stroke: "#F07842",
                    strokeDasharray: "4 4",
                  }}
                  formatter={(value) => [formatNumber(value), "Bookings"]}
                  labelFormatter={(label, payload) =>
                    payload?.[0]?.payload?.monthLabel || String(label)
                  }
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#F07842"
                  strokeWidth={3}
                  fill="url(#bookingGradient)"
                  activeDot={{
                    r: 6,
                    stroke: "#F07842",
                    strokeWidth: 3,
                    fill: "#FFFFFF",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Monthly Booking Bar Chart */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-black text-[#14211F]">
            Monthly Booking Statistics
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Compare platform bookings month by month
          </p>
        </div>

        {chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-gray-400">
              No booking statistics available.
            </p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  dy={10}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  width={45}
                />

                <Tooltip
                  cursor={{ fill: "#FFF7ED" }}
                  formatter={(value) => [formatNumber(value), "Bookings"]}
                  labelFormatter={(label, payload) =>
                    payload?.[0]?.payload?.monthLabel || String(label)
                  }
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                  }}
                />

                <Bar
                  dataKey="bookings"
                  fill="#F07842"
                  radius={[7, 7, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Platform Performance */}
      <div className="rounded-2xl bg-[#173F35] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-[#F6A77F]">
              <ShieldCheck size={19} />

              <p className="text-xs font-bold uppercase tracking-[0.18em]">
                Platform Performance
              </p>
            </div>

            <h2 className="mt-3 text-xl font-black">
              Platform Analytics Summary
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
              Monitor platform growth, rental completion and monthly booking
              activities from your admin dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/10 px-5 py-4">
              <p className="text-xs text-white/60">Rental Completion Rate</p>

              <p className="mt-2 text-2xl font-black">
                {completionRate.toFixed(1)}%
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-5 py-4">
              <p className="text-xs text-white/60">Average Monthly Bookings</p>

              <p className="mt-2 text-2xl font-black">
                {formatNumber(Math.round(averageBookings))}
              </p>
            </div>
          </div>
        </div>

        {bestMonth && (
          <div className="mt-6 flex flex-col justify-between gap-3 border-t border-white/15 pt-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-[#F6A77F]">
                <TrendingUp size={17} />

                <p className="text-xs font-bold uppercase tracking-wider">
                  Best Performing Month
                </p>
              </div>

              <p className="mt-2 text-sm text-white/70">
                {bestMonth.month} {bestMonth.year}
              </p>
            </div>

            <div className="text-2xl font-black">
              {formatNumber(bestMonth.bookings)} Bookings
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
