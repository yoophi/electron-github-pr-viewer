import { ElectronAPI } from '@electron-toolkit/preload'
import type { Setting } from '../renderer/src/pages/settings/model'
import type { IPCResponse } from '../renderer/src/shared/model'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getSettings: () => Promise<IPCResponse<{ accessToken: string; repositories: string[] }>>
      writeSettings: (data: Setting) => Promise<IPCResponse<{ null }>>
    }
  }
}
