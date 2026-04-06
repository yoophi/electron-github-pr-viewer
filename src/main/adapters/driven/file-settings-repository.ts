import fs from 'fs'
import os from 'os'
import path from 'path'
import type { SettingsPort } from '../../application/ports/settings-port'
import type { SettingData } from '../../domain/types'

const SETTING_FILE_NAME = 'gh-pr-viewer.json'

const DEFAULT_SETTING: SettingData = {
  accessToken: '',
  org: 'payhereinc',
  repositories: [],
  members: []
}

export class FileSettingsRepository implements SettingsPort {
  private readonly filePath: string

  constructor() {
    this.filePath = path.join(os.homedir(), SETTING_FILE_NAME)
  }

  load(): SettingData {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8')
      return { ...DEFAULT_SETTING, ...JSON.parse(data) }
    } catch {
      return { ...DEFAULT_SETTING }
    }
  }

  save(data: SettingData): void {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8')
  }
}
