export interface UserAchievementDto {
  id: string;
  userId: string;
  achievementId: string;
  achievement?: {
    id: string;
    name: string;
    code?: string;
    description?: string;
    iconUrl?: string;
    points?: number;
  };
  earnedAt?: string;
  progress?: number;
  isActive?: boolean;
  isClaimed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AwardAchievementRequest {
  achievementCode: string;
  userId: string;
}

