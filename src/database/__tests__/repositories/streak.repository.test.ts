import { describe, it, expect, beforeEach, vi } from 'vitest'
import { streakRepository } from '../../repositories/streak.repository'

// Mock the database client
const mockGet = vi.fn()
const mockSelect = vi.fn(() => ({
  from: vi.fn(() => ({
    get: mockGet
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

const mockUpdate = vi.fn(() => ({
  set: vi.fn(() => ({
    where: vi.fn(() => ({
      returning: vi.fn(() => ({
        get: mockGet
      }))
    }))
  }))
}))

const mockDb = {
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
  delete: vi.fn(() => ({
    run: vi.fn()
  }))
}

vi.mock('../../client', () => ({
  getDb: () => mockDb
}))

describe('StreakRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('should return undefined when no streak exists', () => {
      mockGet.mockReturnValue(undefined)

      const result = streakRepository.get()

      expect(result).toBeUndefined()
    })

    it('should return existing streak', () => {
      const expectedStreak = {
        id: 1,
        currentStreak: 5,
        bestStreak: 10,
        lastActivityDate: new Date(),
        updatedAt: new Date()
      }

      mockGet.mockReturnValue(expectedStreak)

      const result = streakRepository.get()

      expect(result).toEqual(expectedStreak)
    })
  })

  describe('getOrCreate', () => {
    it('should create new streak when none exists', () => {
      mockGet.mockReturnValueOnce(undefined)

      const newStreak = {
        id: 1,
        currentStreak: 0,
        bestStreak: 0,
        lastActivityDate: null,
        updatedAt: new Date()
      }

      mockGet.mockReturnValueOnce(newStreak)

      const result = streakRepository.getOrCreate()

      expect(mockInsert).toHaveBeenCalled()
      expect(result.currentStreak).toBe(0)
    })

    it('should return existing streak when one exists', () => {
      const existingStreak = {
        id: 1,
        currentStreak: 7,
        bestStreak: 12,
        lastActivityDate: new Date(),
        updatedAt: new Date()
      }

      mockGet.mockReturnValue(existingStreak)

      const result = streakRepository.getOrCreate()

      expect(result).toEqual(existingStreak)
      expect(mockInsert).not.toHaveBeenCalled()
    })
  })

  describe('updateStreak', () => {
    it('should set streak to 1 on first activity', () => {
      mockGet.mockReturnValueOnce({
        id: 1,
        currentStreak: 0,
        bestStreak: 0,
        lastActivityDate: null,
        updatedAt: new Date()
      })

      const updatedStreak = {
        id: 1,
        currentStreak: 1,
        bestStreak: 1,
        lastActivityDate: new Date(),
        updatedAt: new Date()
      }

      mockGet.mockReturnValue(updatedStreak)

      const result = streakRepository.updateStreak(new Date())

      expect(result.currentStreak).toBe(1)
      expect(result.bestStreak).toBe(1)
    })

    it('should increment streak on consecutive day', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      mockGet.mockReturnValueOnce({
        id: 1,
        currentStreak: 5,
        bestStreak: 10,
        lastActivityDate: yesterday,
        updatedAt: yesterday
      })

      const updatedStreak = {
        id: 1,
        currentStreak: 6,
        bestStreak: 10,
        lastActivityDate: new Date(),
        updatedAt: new Date()
      }

      mockGet.mockReturnValue(updatedStreak)

      const result = streakRepository.updateStreak(new Date())

      expect(result.currentStreak).toBe(6)
    })

    it('should not change streak on same day', () => {
      const today = new Date()

      mockGet.mockReturnValue({
        id: 1,
        currentStreak: 5,
        bestStreak: 10,
        lastActivityDate: today,
        updatedAt: today
      })

      const result = streakRepository.updateStreak(today)

      expect(result.currentStreak).toBe(5)
    })

    it('should reset streak when days are skipped', () => {
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

      mockGet.mockReturnValueOnce({
        id: 1,
        currentStreak: 10,
        bestStreak: 15,
        lastActivityDate: threeDaysAgo,
        updatedAt: threeDaysAgo
      })

      const updatedStreak = {
        id: 1,
        currentStreak: 1,
        bestStreak: 15,
        lastActivityDate: new Date(),
        updatedAt: new Date()
      }

      mockGet.mockReturnValue(updatedStreak)

      const result = streakRepository.updateStreak(new Date())

      expect(result.currentStreak).toBe(1)
      expect(result.bestStreak).toBe(15)
    })

    it('should update best streak when current exceeds it', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      mockGet.mockReturnValueOnce({
        id: 1,
        currentStreak: 10,
        bestStreak: 10,
        lastActivityDate: yesterday,
        updatedAt: yesterday
      })

      const updatedStreak = {
        id: 1,
        currentStreak: 11,
        bestStreak: 11,
        lastActivityDate: new Date(),
        updatedAt: new Date()
      }

      mockGet.mockReturnValue(updatedStreak)

      const result = streakRepository.updateStreak(new Date())

      expect(result.currentStreak).toBe(11)
      expect(result.bestStreak).toBe(11)
    })
  })

  describe('reset', () => {
    it('should delete streak records', () => {
      const mockRun = vi.fn()
      mockDb.delete.mockReturnValue({ run: mockRun })

      streakRepository.reset()

      expect(mockDb.delete).toHaveBeenCalled()
      expect(mockRun).toHaveBeenCalled()
    })
  })
})
