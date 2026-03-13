interface StreakInfo {
  streak: number
  bestStreak: number
}

export function getMotivationalMessage(stats: StreakInfo): string {
  const daysLeft = stats.bestStreak - stats.streak

  if (stats.bestStreak === 0) return '¡Comienza tu primera racha hoy!'
  if (stats.streak === 0) return `¡Vuelve al ritmo! Récord: ${stats.bestStreak} días`
  if (daysLeft <= 0) return '¡Estás en tu mejor racha histórica!'
  if (stats.streak <= 3) return `¡Buen comienzo! A ${daysLeft} días de tu récord`
  return `¡Vas en racha! A ${daysLeft} días de tu récord`
}
