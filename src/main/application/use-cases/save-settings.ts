import type { SettingsPort } from '../ports/settings-port'
import type { IPCResponse } from '../../domain/types'

export class SaveSettings {
  constructor(private readonly settingsPort: SettingsPort) {}

  execute(data: { accessToken: string; org?: string; repositories: string }): IPCResponse<void> {
    try {
      this.settingsPort.save({
        accessToken: data.accessToken,
        org: data.org || 'payhereinc',
        repositories: data.repositories.split(/\s+/).filter(Boolean),
        members: []
      })
      return { error: false, message: 'ok', data: undefined }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error'
      return { error: true, message: `failed to save settings: ${message}`, data: undefined }
    }
  }
}
