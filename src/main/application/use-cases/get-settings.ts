import type { SettingsPort } from '../ports/settings-port'
import type { SettingData } from '../../domain/types'

export class GetSettings {
  constructor(private readonly settingsPort: SettingsPort) {}

  execute(): SettingData {
    return this.settingsPort.load()
  }
}
