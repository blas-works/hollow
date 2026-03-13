import { contextBridge, ipcRenderer } from 'electron'
import type { NewSession, Session, FullSessionStats } from '../database/schema'
import type { AppConfig } from '../shared/types'

contextBridge.exposeInMainWorld('electronAPI', {
  setAlwaysOnTop: (isPinned: boolean) => ipcRenderer.invoke('set-always-on-top', isPinned),
  getPinnedState: () => ipcRenderer.invoke('get-pinned-state'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  resizeWindow: (width: number, height: number) =>
    ipcRenderer.invoke('resize-window', width, height),
  saveConfig: (config: AppConfig) => ipcRenderer.invoke('save-config', config),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  onPinnedState: (callback: (isPinned: boolean) => void) => {
    ipcRenderer.on('pinned-state', (_event, isPinned: boolean) => callback(isPinned))
  },

  session: {
    create: (data: NewSession) => ipcRenderer.invoke('session:create', data),
    getAll: (): Promise<Session[]> => ipcRenderer.invoke('session:get-all'),
    getFullStats: (): Promise<FullSessionStats> => ipcRenderer.invoke('session:get-full-stats'),
    clear: () => ipcRenderer.invoke('session:clear'),
    exportCsv: (): Promise<boolean> => ipcRenderer.invoke('session:export-csv')
  }
})
