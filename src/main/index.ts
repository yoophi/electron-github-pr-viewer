import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import fs from 'fs'
import os from 'os'
import path, { join } from 'path'
import icon from '../../resources/icon.png?asset'
import dayjs from 'dayjs'

const settingFileName = 'gh-pr-viewer.json'

function getSettingPath(): string {
  const homeDir = os.homedir()
  return path.join(homeDir, settingFileName)
}

function createWindow(): void {
  // Create the browser window.
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

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.handle('get-settings', () => {
    const settingsPath = getSettingPath()
    const defaultSetting = {
      accessToken: '',
      repositories: [],
      members: []
    }

    try {
      const data = fs.readFileSync(settingsPath, 'utf-8')
      return { error: false, data: JSON.parse(data) }
    } catch (err) {
      const message = `failed to read ${settingsPath}`
      if (err instanceof Error) {
        return { error: true, message: `${message}: ${err.message}`, data: defaultSetting }
      }
      return { error: true, message: `${message}: unknown error`, data: defaultSetting }
    }
  })
  ipcMain.handle('write-settings', (_, data) => {
    const settingsPath = getSettingPath()
    const userSetting = {
      accessToken: data.accessToken,
      repositories: data.repositories.split(/\s+/).filter(Boolean)
    }

    fs.writeFileSync(settingsPath, JSON.stringify(userSetting, null, 2), 'utf-8')

    return { error: false, message: 'ok' }
  })
  ipcMain.handle('get-repositories', async (_, accessToken) => {
    const { Octokit } = await import('octokit')
    const octokit = new Octokit({ auth: accessToken })
    const iterator = octokit.paginate.iterator(octokit.rest.repos.listForOrg, {
      org: 'payhereinc',
      per_page: 100,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    const result: any[] = []
    for await (const { data: repos } of iterator) {
      for (const repo of repos) {
        result.push(repo)
      }
    }

    return { data: result }
  })
  ipcMain.handle('get-pull-requests', async (_, { accessToken, repository, params }) => {
    try {
      const { Octokit } = await import('octokit')
      const octokit = new Octokit({ auth: accessToken })
      const [owner, repo] = repository.split('/')
      const options: Record<string, any> = {
        owner,
        repo,
        per_page: 100,
        sort: 'created',
        direction: 'desc',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
      if (params?.state) {
        options.state = params.state
      }
      const iterator = octokit.paginate.iterator(octokit.rest.pulls.list, options)

      const result: any[] = []
      // const oneYearAgo = dayjs().subtract(1, 'year')
      const oneYearAgo = dayjs('2024-10-01')
      outer: for await (const { data: pulls } of iterator) {
        for (const pull of pulls) {
          const pullCreatedAt = dayjs(pull.created_at)
          if (pullCreatedAt.isBefore(oneYearAgo)) {
            break outer
          }
          result.push(pull)
        }
      }

      return { data: result }
    } catch (err) {
      const message = `failed to get pull requests}`
      if (err instanceof Error) {
        return { error: true, message: `${message}: ${err.message}`, data: [] }
      }
      return { error: true, message: `${message}: unknown error`, data: [] }
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
