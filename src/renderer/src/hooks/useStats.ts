import { useState, useEffect, useCallback } from 'react'
import { sessionsService } from '../services'
import type { Stats } from '../schemas/stats.schema'

export function useStats(): Stats {
  const [stats, setStats] = useState<Stats>({
    today: { sessions: 0, minutes: 0 },
    week: { sessions: 0, minutes: 0 },
    total: { sessions: 0, minutes: 0 },
    streak: 0,
    bestStreak: 0,
    avgPerDay: 0,
    longestSession: 0,
    completionRate: 0,
    weeklyActivity: []
  })

  const loadStats = useCallback(async () => {
    const apiStats = await sessionsService.getFullStats()
    setStats({
      today: { sessions: apiStats.today.count, minutes: apiStats.today.totalMinutes },
      week: { sessions: apiStats.week.count, minutes: apiStats.week.totalMinutes },
      total: { sessions: apiStats.total.count, minutes: apiStats.total.totalMinutes },
      streak: apiStats.streak,
      bestStreak: apiStats.bestStreak,
      avgPerDay: apiStats.avgPerDay,
      longestSession: apiStats.longestSession,
      completionRate: apiStats.completionRate,
      weeklyActivity: apiStats.weeklyActivity
    })
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return stats
}
