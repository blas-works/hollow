import { ipcMain } from 'electron'
import { sessionRepository, streakRepository } from '../../database/repositories'
import { statsService } from '../../database/services/stats.service'
import type { NewSession } from '../../database/schema'

export function registerSessionIPC(): void {
  ipcMain.handle('session:create', (_event, data: NewSession) => {
    const session = sessionRepository.create(data)

    if (session.completed) {
      statsService.updateStreakOnSessionComplete(session.startTime)
    }

    return session
  })

  ipcMain.handle('session:get-all', () => {
    return sessionRepository.findAll()
  })

  ipcMain.handle('session:get-stats', () => {
    const today = sessionRepository.getTodayStats()
    const week = sessionRepository.getWeekStats()
    const total = sessionRepository.getTotalStats()

    return { today, week, total }
  })

  ipcMain.handle('session:get-full-stats', () => {
    return statsService.getFullStats()
  })

  ipcMain.handle('session:get-streak', () => {
    return streakRepository.getOrCreate()
  })

  ipcMain.handle('session:clear', () => {
    sessionRepository.clear()
    streakRepository.reset()
    return true
  })
}
