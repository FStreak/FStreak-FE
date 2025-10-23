export interface StreakDetail {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string;
  timeZone: string | null;
  streakHistory: string[]; // ISO dates
}

export interface StreakLeaderboardItem {
  userId: string;
  displayName: string;
  currentStreak: number;
}

export interface StreakLeaderboardResponse {
  period: number; // e.g. 7, 30
  items: StreakLeaderboardItem[];
}
export interface CheckInRequest {
  date: string;  // ISO string
  source: number; // 0 = default (manual), có thể mở rộng sau này
}

