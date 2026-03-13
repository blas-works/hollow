import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useSessions } from '../../hooks/useSessions'
import { sessionsService } from '../../services'
import type { SessionRecord } from '../../schemas'

vi.mock('../../services', () => ({
  sessionsService: {
    load: vi.fn(),
    create: vi.fn(),
    clear: vi.fn(),
    exportCsv: vi.fn()
  }
}))

describe('useSessions', () => {
  const mockSession: SessionRecord = {
    id: 1,
    startTime: new Date(),
    endTime: new Date(),
    durationSeconds: 1500,
    focusMinutes: 25,
    completed: true,
    createdAt: new Date()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load sessions on mount', async () => {
    vi.mocked(sessionsService.load).mockResolvedValue([mockSession])

    const { result } = renderHook(() => useSessions())

    await waitFor(() => {
      expect(result.current.sessions).toHaveLength(1)
    })

    expect(sessionsService.load).toHaveBeenCalled()
  })

  it('should start with empty sessions array', () => {
    vi.mocked(sessionsService.load).mockResolvedValue([] as [])

    const { result } = renderHook(() => useSessions())

    expect(result.current.sessions).toEqual([])
  })

  it('should log a new session', async () => {
    vi.mocked(sessionsService.load).mockResolvedValue([])
    vi.mocked(sessionsService.create).mockResolvedValue(mockSession)

    const { result } = renderHook(() => useSessions())

    await waitFor(() => {
      expect(result.current.sessions).toBeDefined()
    })

    const newSession = {
      startTime: new Date(),
      endTime: new Date(),
      durationSeconds: 1500,
      focusMinutes: 25,
      completed: true
    }

    await act(async () => {
      await result.current.logSession(newSession)
    })

    expect(sessionsService.create).toHaveBeenCalled()
    expect(result.current.sessions).toHaveLength(1)
  })

  it('should call onSessionLogged callback', async () => {
    vi.mocked(sessionsService.load).mockResolvedValue([])
    vi.mocked(sessionsService.create).mockResolvedValue(mockSession)

    const onSessionLogged = vi.fn()

    const { result } = renderHook(() => useSessions({ onSessionLogged }))

    await waitFor(() => {
      expect(result.current.sessions).toBeDefined()
    })

    const newSession = {
      startTime: new Date(),
      endTime: new Date(),
      durationSeconds: 1500,
      focusMinutes: 25,
      completed: true
    }

    await act(async () => {
      await result.current.logSession(newSession)
    })

    expect(onSessionLogged).toHaveBeenCalled()
  })

  it('should clear all sessions', async () => {
    vi.mocked(sessionsService.load).mockResolvedValue([mockSession])
    vi.mocked(sessionsService.clear).mockResolvedValue(undefined)

    const { result } = renderHook(() => useSessions())

    await waitFor(() => {
      expect(result.current.sessions).toHaveLength(1)
    })

    await act(async () => {
      await result.current.clearSessions()
    })

    expect(sessionsService.clear).toHaveBeenCalled()
    expect(result.current.sessions).toHaveLength(0)
  })

  it('should export sessions to CSV', async () => {
    vi.mocked(sessionsService.load).mockResolvedValue([])
    vi.mocked(sessionsService.exportCsv).mockResolvedValue(true)

    const { result } = renderHook(() => useSessions())

    await waitFor(() => {
      expect(result.current.sessions).toBeDefined()
    })

    await act(async () => {
      await result.current.exportCsv()
    })

    expect(sessionsService.exportCsv).toHaveBeenCalled()
  })

  it('should add session to existing list', async () => {
    const existingSession = { ...mockSession, id: 1 }
    const newSession = { ...mockSession, id: 2 }

    vi.mocked(sessionsService.load).mockResolvedValue([existingSession])
    vi.mocked(sessionsService.create).mockResolvedValue(newSession)

    const { result } = renderHook(() => useSessions())

    await waitFor(() => {
      expect(result.current.sessions).toHaveLength(1)
    })

    await act(async () => {
      await result.current.logSession({
        startTime: new Date(),
        endTime: new Date(),
        durationSeconds: 1500,
        focusMinutes: 25,
        completed: true
      })
    })

    expect(result.current.sessions).toHaveLength(2)
  })
})
