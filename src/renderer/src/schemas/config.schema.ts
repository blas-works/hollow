export interface AppConfig {
  focusMinutes: number
  soundEnabled: boolean
}

export const DEFAULT_CONFIG: AppConfig = {
  focusMinutes: 25,
  soundEnabled: true
}

export const MIN_MINUTES = 20
export const MAX_MINUTES = 90
