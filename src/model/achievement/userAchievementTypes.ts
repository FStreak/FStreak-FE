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
  earnedAt: string;
  isActive?: boolean;
}

export interface AwardAchievementRequest {
  achievementCode: string;
  userId: string;
}

