import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

// Adapters
import { FileSettingsRepository } from './adapters/driven/file-settings-repository'
import { OctokitGitHubRepository } from './adapters/driven/github-repository'
import { registerIpcHandlers } from './adapters/driving/ipc-handler'

// Use Cases
import { GetSettings } from './application/use-cases/get-settings'
import { SaveSettings } from './application/use-cases/save-settings'
import { GetRepositories } from './application/use-cases/get-repositories'
import { GetPullRequests } from './application/use-cases/get-pull-requests'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Composition Root: 의존성 조립
  const settingsRepo = new FileSettingsRepository()
  const githubRepo = new OctokitGitHubRepository()

  registerIpcHandlers({
    getSettings: new GetSettings(settingsRepo),
    saveSettings: new SaveSettings(settingsRepo),
    getRepositories: new GetRepositories(githubRepo),
    getPullRequests: new GetPullRequests(githubRepo)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
