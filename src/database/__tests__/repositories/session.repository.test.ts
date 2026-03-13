import { describe, it, expect, beforeEach, vi } from 'vitest'
import { sessionRepository } from '../../repositories/session.repository'

// Mock the database client
const mockGet = vi.fn()
const mockAll = vi.fn()
const mockGroupBy = vi.fn(() => ({
  all: mockAll
}))
const mockWhere = vi.fn(() => ({
  get: mockGet,
  all: mockAll
}))

const mockSelect = vi.fn(() => ({
  from: vi.fn(() => ({
    where: mockWhere,
    groupBy: mockGroupBy,
    get: mockGet,
    all: mockAll
  })),
  get: mockGet
}))

const mockInsert = vi.fn(() => ({
  values: vi.fn(() => ({
    returning: vi.fn(() => ({
      get: mockGet
    }))
  }))
}))

const mockDb = {
  insert: mockInsert,
  select: mockSelect,
  delete: vi.fn(() => ({
    run: vi.fn()
  }))
}

vi.mock('../../client', () => ({
  getDb: () => mockDb
}))

describe('SessionRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('should create a session with valid data', () => {
      const newSession = {
        startTime: new Date(),
        endTime: new Date(),
        durationSeconds: 1500,
        focusMinutes: 25,
        completed: true
      }

      const expectedSession = {
        id: 1,
        ...newSession,
        createdAt: new Date()
      }

      mockGet.mockReturnValue(expectedSession)

      const result = sessionRepository.create(newSession)

      expect(mockInsert).toHaveBeenCalled()
      expect(result).toEqual(expectedSession)
    })

    it('should create a session with minimal data', () => {
      const newSession = {
        startTime: new Date(),
        endTime: new Date(),
        durationSeconds: 1500,
        focusMinutes: 25
      }

      const expectedSession = {
        id: 1,
        ...newSession,
        completed: false,
        createdAt: new Date()
      }

      mockGet.mockReturnValue(expectedSession)

      const result = sessionRepository.create(newSession)

      expect(result).toBeDefined()
      expect(result.completed).toBe(false)
    })
  })

  describe('findAll', () => {
    it('should return all sessions', () => {
      const sessions = [
        { id: 1, focusMinutes: 25 },
        { id: 2, focusMinutes: 30 }
      ]

      mockAll.mockReturnValue(sessions)

      const result = sessionRepository.findAll()

      expect(result).toHaveLength(2)
      expect(mockSelect).toHaveBeenCalled()
    })

    it('should return empty array when no sessions', () => {
      mockAll.mockReturnValue([])

      const result = sessionRepository.findAll()

      expect(result).toHaveLength(0)
    })
  })

  describe('findByDateRange', () => {
    it('should find sessions within date range', () => {
      const sessions = [
        { id: 1, startTime: new Date('2024-01-15') },
        { id: 2, startTime: new Date('2024-01-16') }
      ]

      mockAll.mockReturnValue(sessions)

      const start = new Date('2024-01-01')
      const end = new Date('2024-01-31')
      const result = sessionRepository.findByDateRange(start, end)

      expect(result).toHaveLength(2)
    })
  })

  describe('getTodayStats', () => {
    it('should return today stats with sessions', () => {
      mockGet.mockReturnValue({
        count: 5,
        totalMinutes: 125
      })

      const result = sessionRepository.getTodayStats()

      expect(result.count).toBe(5)
      expect(result.totalMinutes).toBe(125)
    })

    it('should return zero stats when no sessions today', () => {
      mockGet.mockReturnValue(null)

      const result = sessionRepository.getTodayStats()

      expect(result.count).toBe(0)
      expect(result.totalMinutes).toBe(0)
    })
  })

  describe('getWeekStats', () => {
    it('should return week stats with sessions', () => {
      mockGet.mockReturnValue({
        count: 20,
        totalMinutes: 500
      })

      const result = sessionRepository.getWeekStats()

      expect(result.count).toBe(20)
      expect(result.totalMinutes).toBe(500)
    })

    it('should return zero when no sessions this week', () => {
      mockGet.mockReturnValue(null)

      const result = sessionRepository.getWeekStats()

      expect(result.count).toBe(0)
      expect(result.totalMinutes).toBe(0)
    })
  })

  describe('getTotalStats', () => {
    it('should return total stats', () => {
      mockGet.mockReturnValue({
        count: 100,
        totalMinutes: 2500
      })

      const result = sessionRepository.getTotalStats()

      expect(result.count).toBe(100)
      expect(result.totalMinutes).toBe(2500)
    })
  })

  describe('getCompletionRate', () => {
    it('should return 100% when all sessions completed', () => {
      mockGet.mockReturnValue({
        total: 10,
        completed: 10
      })

      const result = sessionRepository.getCompletionRate()

      expect(result).toBe(100)
    })

    it('should return 0% when no sessions', () => {
      mockGet.mockReturnValue({
        total: 0,
        completed: 0
      })

      const result = sessionRepository.getCompletionRate()

      expect(result).toBe(0)
    })

    it('should return correct percentage for partial completion', () => {
      mockGet.mockReturnValue({
        total: 10,
        completed: 7
      })

      const result = sessionRepository.getCompletionRate()

      expect(result).toBe(70)
    })

    it('should handle null result', () => {
      mockGet.mockReturnValue(null)

      const result = sessionRepository.getCompletionRate()

      expect(result).toBe(0)
    })
  })

  describe('getLongestSession', () => {
    it('should return longest session duration', () => {
      mockGet.mockReturnValue({
        maxDuration: 45
      })

      const result = sessionRepository.getLongestSession()

      expect(result).toBe(45)
    })

    it('should return 0 when no sessions', () => {
      mockGet.mockReturnValue(null)

      const result = sessionRepository.getLongestSession()

      expect(result).toBe(0)
    })
  })

  describe('getAvgPerDay', () => {
    it('should calculate average sessions per day', () => {
      mockAll.mockReturnValue([
        { date: '2024-01-15', count: 5 },
        { date: '2024-01-16', count: 3 },
        { date: '2024-01-17', count: 4 }
      ])

      const result = sessionRepository.getAvgPerDay()

      expect(result).toBe(4)
    })

    it('should return 0 when no sessions', () => {
      mockAll.mockReturnValue([])

      const result = sessionRepository.getAvgPerDay()

      expect(result).toBe(0)
    })

    it('should handle sessions with null count', () => {
      mockAll.mockReturnValue([
        { date: '2024-01-15', count: 5 },
        { date: '2024-01-16', count: null }
      ])

      const result = sessionRepository.getAvgPerDay()

      expect(result).toBe(2.5)
    })
  })

  describe('getWeeklyActivity', () => {
    it('should return weekly activity with active days', () => {
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]

      mockAll.mockReturnValue([{ date: todayStr }])

      const result = sessionRepository.getWeeklyActivity()

      expect(result).toHaveLength(7)
      expect(result.some((d) => d.active)).toBe(true)
      expect(result.some((d) => d.isToday)).toBe(true)
    })

    it('should mark correct day as today', () => {
      mockAll.mockReturnValue([])

      const result = sessionRepository.getWeeklyActivity()
      const todayEntry = result.find((d) => d.isToday)

      expect(todayEntry).toBeDefined()
    })

    it('should handle all inactive days', () => {
      mockAll.mockReturnValue([])

      const result = sessionRepository.getWeeklyActivity()

      expect(result.every((d) => d.active === false)).toBe(true)
    })
  })

  describe('clear', () => {
    it('should delete all sessions', () => {
      const mockRun = vi.fn()
      mockDb.delete.mockReturnValue({ run: mockRun })

      sessionRepository.clear()

      expect(mockDb.delete).toHaveBeenCalled()
      expect(mockRun).toHaveBeenCalled()
    })
  })
})
