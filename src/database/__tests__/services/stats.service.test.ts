import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../repositories', () => ({
  sessionRepository: {
    getTodayStats: vi.fn(),
    getWeekStats: vi.fn(),
    getTotalStats: vi.fn(),
    getCompletionRate: vi.fn(),
    getLongestSession: vi.fn(),
    getAvgPerDay: vi.fn(),
    getWeeklyActivity: vi.fn()
  },
  streakRepository: {
    getOrCreate: vi.fn(),
    updateStreak: vi.fn()
  }
}))

import { statsService } from '../../services/stats.service'
import { sessionRepository, streakRepository } from '../../repositories'

describe('StatsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getFullStats', () => {
    it('should return full stats when database is empty', () => {
      vi.mocked(streakRepository.getOrCreate).mockReturnValue({
        id: 1,
        currentStreak: 0,
        bestStreak: 0,
        lastActivityDate: null,
        updatedAt: new Date()
      })

      vi.mocked(sessionRepository.getTodayStats).mockReturnValue({ count: 0, totalMinutes: 0 })
      vi.mocked(sessionRepository.getWeekStats).mockReturnValue({ count: 0, totalMinutes: 0 })
      vi.mocked(sessionRepository.getTotalStats).mockReturnValue({ count: 0, totalMinutes: 0 })
      vi.mocked(sessionRepository.getCompletionRate).mockReturnValue(0)
      vi.mocked(sessionRepository.getLongestSession).mockReturnValue(0)
      vi.mocked(sessionRepository.getAvgPerDay).mockReturnValue(0)
      vi.mocked(sessionRepository.getWeeklyActivity).mockReturnValue([
        { day: 'Lu', active: false, isToday: false },
        { day: 'Ma', active: false, isToday: false },
        { day: 'Mi', active: false, isToday: false },
        { day: 'Ju', active: false, isToday: false },
        { day: 'Vi', active: false, isToday: false },
        { day: 'Sa', active: false, isToday: false },
        { day: 'Do', active: false, isToday: false }
      ])

      const result = statsService.getFullStats()

      expect(result.today.sessions).toBe(0)
      expect(result.today.minutes).toBe(0)
      expect(result.week.sessions).toBe(0)
      expect(result.total.sessions).toBe(0)
      expect(result.streak).toBe(0)
      expect(result.completionRate).toBe(0)
    })

    it('should return full stats with data', () => {
      vi.mocked(streakRepository.getOrCreate).mockReturnValue({
        id: 1,
        currentStreak: 7,
        bestStreak: 12,
        lastActivityDate: new Date(),
        updatedAt: new Date()
      })

      vi.mocked(sessionRepository.getTodayStats).mockReturnValue({ count: 5, totalMinutes: 125 })
      vi.mocked(sessionRepository.getWeekStats).mockReturnValue({ count: 25, totalMinutes: 625 })
      vi.mocked(sessionRepository.getTotalStats).mockReturnValue({ count: 100, totalMinutes: 2500 })
      vi.mocked(sessionRepository.getCompletionRate).mockReturnValue(85)
      vi.mocked(sessionRepository.getLongestSession).mockReturnValue(45)
      vi.mocked(sessionRepository.getAvgPerDay).mockReturnValue(4.2)
      vi.mocked(sessionRepository.getWeeklyActivity).mockReturnValue([
        { day: 'Lu', active: true, isToday: false },
        { day: 'Ma', active: false, isToday: false },
        { day: 'Mi', active: true, isToday: false },
        { day: 'Ju', active: false, isToday: false },
        { day: 'Vi', active: true, isToday: true },
        { day: 'Sa', active: false, isToday: false },
        { day: 'Do', active: false, isToday: false }
      ])

      const result = statsService.getFullStats()

      expect(result.today.sessions).toBe(5)
      expect(result.today.minutes).toBe(125)
      expect(result.week.sessions).toBe(25)
      expect(result.total.sessions).toBe(100)
      expect(result.streak).toBe(7)
      expect(result.bestStreak).toBe(12)
      expect(result.completionRate).toBe(85)
      expect(result.longestSession).toBe(45)
      expect(result.avgPerDay).toBe(4.2)
      expect(result.weeklyActivity).toHaveLength(7)
    })

    it('should call all repository methods', () => {
      vi.mocked(streakRepository.getOrCreate).mockReturnValue({
        id: 1,
        currentStreak: 0,
        bestStreak: 0,
        lastActivityDate: null,
        updatedAt: new Date()
      })

      vi.mocked(sessionRepository.getTodayStats).mockReturnValue({ count: 0, totalMinutes: 0 })
      vi.mocked(sessionRepository.getWeekStats).mockReturnValue({ count: 0, totalMinutes: 0 })
      vi.mocked(sessionRepository.getTotalStats).mockReturnValue({ count: 0, totalMinutes: 0 })
      vi.mocked(sessionRepository.getCompletionRate).mockReturnValue(0)
      vi.mocked(sessionRepository.getLongestSession).mockReturnValue(0)
      vi.mocked(sessionRepository.getAvgPerDay).mockReturnValue(0)
      vi.mocked(sessionRepository.getWeeklyActivity).mockReturnValue([])

      statsService.getFullStats()

      expect(streakRepository.getOrCreate).toHaveBeenCalled()
      expect(sessionRepository.getTodayStats).toHaveBeenCalled()
      expect(sessionRepository.getWeekStats).toHaveBeenCalled()
      expect(sessionRepository.getTotalStats).toHaveBeenCalled()
      expect(sessionRepository.getCompletionRate).toHaveBeenCalled()
      expect(sessionRepository.getLongestSession).toHaveBeenCalled()
      expect(sessionRepository.getAvgPerDay).toHaveBeenCalled()
      expect(sessionRepository.getWeeklyActivity).toHaveBeenCalled()
    })
  })

  describe('updateStreakOnSessionComplete', () => {
    it('should call streak repository updateStreak', () => {
      const completedDate = new Date()

      vi.mocked(streakRepository.updateStreak).mockReturnValue({
        id: 1,
        currentStreak: 1,
        bestStreak: 1,
        lastActivityDate: completedDate,
        updatedAt: new Date()
      })

      const result = statsService.updateStreakOnSessionComplete(completedDate)

      expect(streakRepository.updateStreak).toHaveBeenCalledWith(completedDate)
      expect(result.currentStreak).toBe(1)
    })

    it('should return updated streak', () => {
      const completedDate = new Date()
      const updatedStreak = {
        id: 1,
        currentStreak: 5,
        bestStreak: 10,
        lastActivityDate: completedDate,
        updatedAt: new Date()
      }

      vi.mocked(streakRepository.updateStreak).mockReturnValue(updatedStreak)

      const result = statsService.updateStreakOnSessionComplete(completedDate)

      expect(result).toEqual(updatedStreak)
    })
  })
})
