import { app, ipcMain, shell } from 'electron'

export function registerAppIPC(): void {
  ipcMain.handle('app:get-version', () => {
    return app.getVersion()
  })

  ipcMain.handle('shell:open-external', async (_event, url: string) => {
    try {
      await shell.openExternal(url)
      return true
    } catch (error) {
      console.error('Failed to open external URL:', error)
      return false
    }
  })
}
