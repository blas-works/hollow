import { sqliteTable, integer } from 'drizzle-orm/sqlite-core'

export const streaks = sqliteTable('streaks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  currentStreak: integer('current_streak').notNull().default(0),
  bestStreak: integer('best_streak').notNull().default(0),
  lastActivityDate: integer('last_activity_date', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
})

export type Streak = typeof streaks.$inferSelect
export type NewStreak = typeof streaks.$inferInsert
