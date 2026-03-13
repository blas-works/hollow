import { ipcMain } from 'electron'
import type Store from 'electron-store'
import type { StoreSchema } from '../index'
import type { AppConfig } from '../../shared/types'

export function registerConfigIPC(store: Store<StoreSchema>): void {
  ipcMain.handle('save-config', (_event, config: AppConfig) => {
    try {
      store.set('config', config)
    } catch (error) {
      console.error('Failed to save config:', error)
    }
  })

  ipcMain.handle('load-config', () => {
    try {
      return store.get('config')
    } catch (error) {
      console.error('Failed to load config:', error)
      return null
    }
  })
}
