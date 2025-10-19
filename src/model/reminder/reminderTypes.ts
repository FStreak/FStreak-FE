export type ReminderType = 'streak' | 'studyRoom' | 'lesson';

export interface ReminderEntry {
  id: string;
  userId: string;
  type: ReminderType;
  title: string;
  enabled: boolean;
  status: number; // custom status codes from backend
  detail?: string;
  instance?: string;
  channel?: 'email' | 'push' | 'sms' | 'in-app';
  schedule?: string; // ISO datetime or cron-like description
  createdAt: string;
  updatedAt?: string | null;
}

export interface StreakReminderPayload {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string; // ISO
  timeZone: string;
  streakHistory: string[]; // ISO dates
}

export interface ApiError {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [k: string]: unknown;
}
