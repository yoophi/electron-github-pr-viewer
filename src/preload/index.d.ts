import { ElectronAPI } from '@electron-toolkit/preload'
import type { Setting } from '@/entities/setting'
import type { IPCResponse } from '@/shared/model'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getSettings: () => Promise<IPCResponse<{ accessToken: string; org: string; repositories: string[] }>>
      writeSettings: (data: Setting) => Promise<IPCResponse<void>>
      getRepositories: (args: { accessToken: string; org: string }) => Promise<IPCResponse<any>>
      getPullRequests: (args: {
        accessToken: string
        repository: string
        params?: {
          state?: 'all' | 'open' | 'closed'
        }
      }) => Promise<IPCResponse<any>>
    }
  }
}
