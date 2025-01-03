export type Member = {
  name: string
  ids: number[]
  groups: string[]
}

export type Setting = {
  accessToken: string
  repositories: string
  members: Member[]
}

export type SettingData = {
  accessToken: string
  repositories: string[]
  members: Member[]
}
