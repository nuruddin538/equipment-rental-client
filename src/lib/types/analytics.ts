export interface MonthlyBookingStat {
  key: string;
  month: string;
  year: number;
  bookings: number;
}

export interface MonthlyEarningStat {
  key: string;
  month: string;
  year: number;
  earnings: number;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalEquipment: number;
  totalBookings: number;
  pendingApprovals: number;
  completedRentals: number;
  totalRevenue: number;
  monthlyBookingStats: MonthlyBookingStat[];
}

export interface OwnerAnalytics {
  totalListedEquipment: number;
  completedRentals: number;
  totalEarnings: number;
  monthlyEarnings: MonthlyEarningStat[];
}

export interface AnalyticsResponse<T> {
  success: boolean;
  message?: string;
  analytics: T;
}
