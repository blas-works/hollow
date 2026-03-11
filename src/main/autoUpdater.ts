import { dialog, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import { is } from '@electron-toolkit/utils'

const RELEASE_URL = 'https://github.com/torrescereno/hollow/releases/latest'
const canAutoUpdate = process.platform !== 'linux' || !!process.env.APPIMAGE

export function setupAutoUpdater(): void {
  if (is.dev) return

  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-available', (info) => {
    if (!canAutoUpdate) {
      dialog
        .showMessageBox({
          type: 'info',
          title: 'Update Available',
          message: `A new version (${info.version}) is available. Please download it manually from GitHub.`,
          buttons: ['Open Downloads', 'Later']
        })
        .then((result) => {
          if (result.response === 0) {
            shell.openExternal(RELEASE_URL)
          }
        })
      return
    }

    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: `A new version (${info.version}) is available. Do you want to download it?`,
        buttons: ['Download', 'Later']
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate()
        }
      })
  })

  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'Update downloaded. The application will restart to apply the update.',
        buttons: ['Restart Now', 'Later']
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall()
        }
      })
  })

  autoUpdater.on('error', (error) => {
    console.error('Auto-updater error:', error.message)
  })
}

export function checkForUpdates(): void {
  if (is.dev) return

  try {
    autoUpdater.checkForUpdates()
  } catch (error) {
    console.error('Failed to check for updates:', error)
  }
}
