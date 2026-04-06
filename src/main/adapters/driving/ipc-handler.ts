import { ipcMain } from 'electron'
import type { GetSettings } from '../../application/use-cases/get-settings'
import type { SaveSettings } from '../../application/use-cases/save-settings'
import type { GetRepositories } from '../../application/use-cases/get-repositories'
import type { GetPullRequests } from '../../application/use-cases/get-pull-requests'

type UseCases = {
  getSettings: GetSettings
  saveSettings: SaveSettings
  getRepositories: GetRepositories
  getPullRequests: GetPullRequests
}

export function registerIpcHandlers(useCases: UseCases): void {
  ipcMain.handle('get-settings', () => {
    return useCases.getSettings.execute()
  })

  ipcMain.handle('write-settings', (_, data) => {
    return useCases.saveSettings.execute(data)
  })

  ipcMain.handle('get-repositories', async (_, params) => {
    return useCases.getRepositories.execute(params)
  })

  ipcMain.handle('get-pull-requests', async (_, params) => {
    return useCases.getPullRequests.execute(params)
  })
}
