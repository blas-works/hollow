import '@testing-library/jest-dom/vitest'
import { vi, afterEach } from 'vitest'

// Mock Better-sqlite3
vi.mock('better-sqlite3', () => {
  const mockDatabase = {
    prepare: vi.fn(() => ({
      run: vi.fn(),
      get: vi.fn(),
      all: vi.fn()
    })),
    exec: vi.fn(),
    close: vi.fn()
  }

  return {
    default: vi.fn(() => mockDatabase)
  }
})

// Mock Electron main process modules
vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(() => '/mock/app/path'),
    on: vi.fn()
  },
  BrowserWindow: vi.fn(),
  ipcMain: {
    handle: vi.fn(),
    on: vi.fn()
  }
}))

// Mock Electron store
vi.mock('electron-store', () => ({
  default: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
    has: vi.fn()
  }))
}))

// Mock Audio API
global.HTMLAudioElement = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  volume: 1
}))

// Mock AudioContext
global.AudioContext = vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: {
      setValueAtTime: vi.fn()
    }
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn()
    }
  })),
  destination: {},
  currentTime: 0
}))

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})
