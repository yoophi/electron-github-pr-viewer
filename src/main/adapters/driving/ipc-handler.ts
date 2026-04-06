import { ipcMain } from 'electron'
import type { GetSettings } from '../../application/use-cases/get-settings'
import type { SaveSettings } from '../../application/use-cases/save-settings'
import type { GetRepositories } from '../../application/use-cases/get-repositories'
import type { GetPullRequests } from '../../application/use-cases/get-pull-requests'

type IPCResponse<T> = {
  error: boolean
  message?: string
  data: T
}

function ok<T>(data: T): IPCResponse<T> {
  return { error: false, data }
}

function fail<T>(message: string, data: T): IPCResponse<T> {
  return { error: true, message, data }
}

type UseCases = {
  getSettings: GetSettings
  saveSettings: SaveSettings
  getRepositories: GetRepositories
  getPullRequests: GetPullRequests
}

export function registerIpcHandlers(useCases: UseCases): void {
  ipcMain.handle('get-settings', () => {
    try {
      const data = useCases.getSettings.execute()
      return ok(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error'
      return fail(`failed to load settings: ${message}`, {
        accessToken: '',
        org: '',
        repositories: [],
        members: []
      })
    }
  })

  ipcMain.handle('write-settings', (_, data) => {
    try {
      // DTO → domain 변환 (driving adapter 책임)
      const domainData = {
        accessToken: data.accessToken,
        org: data.org || 'payhereinc',
        repositories:
          typeof data.repositories === 'string'
            ? data.repositories.split(/\s+/).filter(Boolean)
            : data.repositories
      }
      useCases.saveSettings.execute(domainData)
      return ok(undefined)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error'
      return fail(`failed to save settings: ${message}`, undefined)
    }
  })

  ipcMain.handle('get-repositories', async (_, params) => {
    try {
      const data = await useCases.getRepositories.execute(params)
      return ok(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error'
      return fail(`failed to get repositories: ${message}`, [])
    }
  })

  ipcMain.handle('get-pull-requests', async (_, params) => {
    try {
      const data = await useCases.getPullRequests.execute(params)
      return ok(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error'
      return fail(`failed to get pull requests: ${message}`, [])
    }
  })
}
