import { app, BrowserWindow, ipcMain, nativeImage } from 'electron'
import Store from 'electron-store'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { initDatabase, closeDatabase } from '../database/client'
import { registerSessionIPC } from './ipc'

interface Config {
  focusMinutes: number
  soundEnabled: boolean
}

interface StoreSchema {
  isPinned: boolean
  config: Config
}

const store = new Store<StoreSchema>({
  defaults: {
    isPinned: false,
    config: {
      focusMinutes: 25,
      soundEnabled: true
    }
  }
})

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  const isPinned = store.get('isPinned', false)

  const initWidth = 260
  const initHeight = 160

  let iconPath: string
  if (is.dev) {
    iconPath = join(__dirname, '../../resources/icon.png')
  } else {
    iconPath = join(process.resourcesPath, 'icon.png')
  }

  const icon = nativeImage.createFromPath(iconPath)

  mainWindow = new BrowserWindow({
    icon,
    width: initWidth,
    height: initHeight,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    resizable: false,
    alwaysOnTop: isPinned,
    skipTaskbar: false,
    hasShadow: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      experimentalFeatures: true,
      sandbox: false
    }
  })

  mainWindow.setVisibleOnAllWorkspaces(true)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('pinned-state', isPinned)
  })
}

app.whenReady().then(() => {
  initDatabase()
  registerSessionIPC()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    closeDatabase()
    app.quit()
  }
})

app.on('before-quit', () => {
  closeDatabase()
})

// ── Pin ──

ipcMain.handle('set-always-on-top', (_event, isPinned: boolean) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(isPinned)
    store.set('isPinned', isPinned)
  }
  return isPinned
})

ipcMain.handle('get-pinned-state', () => {
  return store.get('isPinned', false)
})

// ── Window ──

ipcMain.handle('resize-window', async (_event, targetW: number, targetH: number) => {
  if (!mainWindow) return

  const [startW, startH] = mainWindow.getSize()
  const [startX, startY] = mainWindow.getPosition()

  if (startW === targetW && startH === targetH) return

  const centerX = startX + startW / 2
  const centerY = startY + startH / 2

  const x = Math.round(centerX - targetW / 2)
  const y = Math.round(centerY - targetH / 2)

  mainWindow.setBounds({ x, y, width: targetW, height: targetH })
})

ipcMain.handle('minimize-window', () => {
  if (mainWindow) mainWindow.minimize()
})

ipcMain.handle('close-window', () => {
  if (mainWindow) mainWindow.close()
})

// ── Config ──

ipcMain.handle('save-config', (_event, config: Config) => {
  store.set('config', config)
})

ipcMain.handle('load-config', () => {
  return store.get('config')
})
