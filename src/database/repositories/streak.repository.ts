import { eq } from 'drizzle-orm'
import { getDb } from '../client'
import { streaks, type Streak } from '../schema/streak.schema'

function getStartOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function getDaysDifference(date1: Date, date2: Date): number {
  const d1 = getStartOfDay(date1)
  const d2 = getStartOfDay(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export const streakRepository = {
  get: (): Streak | undefined => {
    const db = getDb()
    return db.select().from(streaks).get()
  },

  getOrCreate: (): Streak => {
    const db = getDb()
    let streak = db.select().from(streaks).get()

    if (!streak) {
      streak = db.insert(streaks).values({}).returning().get()
    }

    return streak
  },

  updateStreak: (completedDate: Date): Streak => {
    const db = getDb()
    const current = streakRepository.getOrCreate()
    const today = getStartOfDay(completedDate)

    let newCurrentStreak = current.currentStreak
    let newBestStreak = current.bestStreak

    if (!current.lastActivityDate) {
      newCurrentStreak = 1
    } else {
      const lastActivity = getStartOfDay(current.lastActivityDate)
      const daysDiff = getDaysDifference(today, lastActivity)

      if (daysDiff === 0) {
        return current
      } else if (daysDiff === 1) {
        newCurrentStreak = current.currentStreak + 1
      } else {
        newCurrentStreak = 1
      }
    }

    if (newCurrentStreak > newBestStreak) {
      newBestStreak = newCurrentStreak
    }

    return db
      .update(streaks)
      .set({
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
        lastActivityDate: today,
        updatedAt: new Date()
      })
      .where(eq(streaks.id, current.id))
      .returning()
      .get()
  },

  reset: (): void => {
    const db = getDb()
    db.delete(streaks).run()
  }
}
