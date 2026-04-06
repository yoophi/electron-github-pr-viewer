import type { SettingData } from '../../domain/types'

export interface SettingsPort {
  load(): SettingData
  save(data: SettingData): void
}
