import type { SettingsPort } from '../ports/settings-port'
import type { IPCResponse, SettingData } from '../../domain/types'

export class GetSettings {
  constructor(private readonly settingsPort: SettingsPort) {}

  execute(): IPCResponse<SettingData> {
    try {
      const data = this.settingsPort.load()
      return { error: false, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error'
      return {
        error: true,
        message: `failed to load settings: ${message}`,
        data: { accessToken: '', org: '', repositories: [], members: [] }
      }
    }
  }
}
