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

async function handleWith<T>(fn: () => T | Promise<T>, label: string, fallback: T): Promise<IPCResponse<T>> {
  try {
    const data = await fn()
    return ok(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    return fail(`${label}: ${message}`, fallback)
  }
}

type UseCases = {
  getSettings: GetSettings
  saveSettings: SaveSettings
  getRepositories: GetRepositories
  getPullRequests: GetPullRequests
}

export function registerIpcHandlers(useCases: UseCases): void {
  ipcMain.handle('get-settings', () =>
    handleWith(
      () => useCases.getSettings.execute(),
      'failed to load settings',
      { accessToken: '', org: '', repositories: [], members: [] }
    )
  )

  ipcMain.handle('write-settings', (_, data) =>
    handleWith(
      () => {
        const domainData = {
          accessToken: data.accessToken,
          org: data.org || 'payhereinc',
          repositories:
            typeof data.repositories === 'string'
              ? data.repositories.split(/\s+/).filter(Boolean)
              : data.repositories
        }
        useCases.saveSettings.execute(domainData)
        return undefined
      },
      'failed to save settings',
      undefined
    )
  )

  ipcMain.handle('get-repositories', (_, params) =>
    handleWith(
      () => useCases.getRepositories.execute(params),
      'failed to get repositories',
      []
    )
  )

  ipcMain.handle('get-pull-requests', (_, params) =>
    handleWith(
      () => useCases.getPullRequests.execute(params),
      'failed to get pull requests',
      []
    )
  )
}
