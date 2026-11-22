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
  Package,
  CalendarCheck,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ChartNoAxesCombined,
} from "lucide-react";

import { getOwnerAnalytics } from "@/lib/api/analytics";
import type { OwnerAnalytics as OwnerAnalyticsType } from "@/lib/types/analytics";

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

export default function OwnerAnalytics() {
  const [analytics, setAnalytics] = useState<OwnerAnalyticsType | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      try {
        const data = await getOwnerAnalytics();

        if (!active) return;

        if (!data?.success || !data.analytics) {
          throw new Error("Invalid analytics response from server.");
        }

        const response = data.analytics;

        const normalizedData: OwnerAnalyticsType = {
          totalListedEquipment: safeNumber(response.totalListedEquipment),

          completedRentals: safeNumber(response.completedRentals),

          totalEarnings: safeNumber(response.totalEarnings),

          monthlyEarnings: Array.isArray(response.monthlyEarnings)
            ? response.monthlyEarnings.map((item) => ({
                key: String(item?.key ?? ""),
                month: String(item?.month ?? ""),
                year: safeNumber(item?.year),
                earnings: safeNumber(item?.earnings),
              }))
            : [],
        };

        setAnalytics(normalizedData);
        setError("");
      } catch (err) {
        if (active) {
          console.error("Owner analytics error:", err);

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-2xl bg-gray-200"
          />
        ))}
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-600">
          {error || "Analytics data not available."}
        </p>
      </div>
    );
  }

  const monthlyEarnings = Array.isArray(analytics.monthlyEarnings)
    ? [...analytics.monthlyEarnings].sort(
        (a, b) =>
          a.year - b.year ||
          new Date(`${a.month} 1, ${a.year}`).getMonth() -
            new Date(`${b.month} 1, ${b.year}`).getMonth()
      )
    : [];

  const totalEarnings = safeNumber(analytics.totalEarnings);

  const totalMonths = monthlyEarnings.length;

  const averageEarnings = totalMonths > 0 ? totalEarnings / totalMonths : 0;

  const bestMonth =
    monthlyEarnings.length > 0
      ? monthlyEarnings.reduce((best, current) =>
          safeNumber(current.earnings) > safeNumber(best.earnings)
            ? current
            : best
        )
      : null;

  const stats = [
    {
      title: "Total Equipment",
      value: formatNumber(analytics.totalListedEquipment),
      description: "Total listed equipment",
      icon: Package,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Completed Rentals",
      value: formatNumber(analytics.completedRentals),
      description: "Successfully completed rentals",
      icon: CalendarCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Earnings",
      value: currency(totalEarnings),
      description: "Your total rental earnings",
      icon: Wallet,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Average Monthly",
      value: currency(averageEarnings),
      description: "Average earnings per recorded month",
      icon: TrendingUp,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  const chartData = monthlyEarnings.map((item) => ({
    ...item,
    earnings: safeNumber(item.earnings),
    monthLabel: `${item.month} ${item.year}`,
  }));

  return (
    <section className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* Monthly Earnings Area Chart */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <ChartNoAxesCombined size={21} className="text-emerald-600" />
              </div>

              <div>
                <h2 className="text-lg font-black text-[#14211F]">
                  Earnings Overview
                </h2>

                <p className="text-xs text-gray-400">
                  Monthly rental earnings performance
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 px-4 py-3">
            <p className="text-xs font-medium text-emerald-700">
              Total Earnings
            </p>

            <p className="mt-1 text-xl font-black text-emerald-700">
              {currency(totalEarnings)}
            </p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex h-72 items-center justify-center">
            <p className="text-sm text-gray-400">
              No monthly earnings data available.
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
                    id="earningsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
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
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  tickFormatter={compactCurrency}
                  width={65}
                />

                <Tooltip
                  cursor={{
                    stroke: "#059669",
                    strokeDasharray: "4 4",
                  }}
                  formatter={(value) => [currency(value), "Earnings"]}
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
                  dataKey="earnings"
                  stroke="#059669"
                  strokeWidth={3}
                  fill="url(#earningsGradient)"
                  activeDot={{
                    r: 6,
                    stroke: "#059669",
                    strokeWidth: 3,
                    fill: "#FFFFFF",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Monthly Earnings Bar Chart */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-black text-[#14211F]">
            Monthly Revenue Statistics
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Compare your earnings month by month
          </p>
        </div>

        {chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-gray-400">
              No revenue statistics available.
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
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  tickFormatter={compactCurrency}
                  width={65}
                />

                <Tooltip
                  cursor={{ fill: "#F0FDF4" }}
                  formatter={(value) => [currency(value), "Earnings"]}
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
                  dataKey="earnings"
                  fill="#059669"
                  radius={[7, 7, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Best Performing Month */}
      <div className="rounded-2xl bg-[#173F35] p-6 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-[#F6A77F]">
              <TrendingUp size={19} />

              <p className="text-xs font-bold uppercase tracking-[0.18em]">
                Business Performance
              </p>
            </div>

            <h2 className="mt-3 text-xl font-black">
              {bestMonth
                ? "Your Best Performing Month"
                : "Grow Your Rental Business"}
            </h2>

            <p className="mt-2 text-sm text-white/65">
              {bestMonth
                ? `You earned ${currency(bestMonth.earnings)} in ${
                    bestMonth.month
                  } ${bestMonth.year}.`
                : "Your monthly earnings statistics will appear here when data is available."}
            </p>
          </div>

          {bestMonth && (
            <div className="rounded-xl bg-white/10 px-5 py-4">
              <p className="text-xs text-white/60">Highest Monthly Earnings</p>

              <p className="mt-1 text-2xl font-black">
                {currency(bestMonth.earnings)}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
