import type { SettingsPort } from '../ports/settings-port'
import type { SettingData } from '../../domain/types'

export class SaveSettings {
  constructor(private readonly settingsPort: SettingsPort) {}

  execute(data: Partial<SettingData>): void {
    const existing = this.settingsPort.load()
    const merged: SettingData = {
      ...existing,
      ...data,
      members: data.members ?? existing.members
    }
    this.settingsPort.save(merged)
  }
}
