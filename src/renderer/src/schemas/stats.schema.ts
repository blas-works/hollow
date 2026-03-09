export interface WeeklyActivity {
  day: string
  active: boolean
  isToday: boolean
}

export interface Stats {
  today: { sessions: number; minutes: number }
  week: { sessions: number; minutes: number }
  total: { sessions: number; minutes: number }
  streak: number
  bestStreak: number
  avgPerDay: number
  longestSession: number
  completionRate: number
  weeklyActivity: WeeklyActivity[]
}
