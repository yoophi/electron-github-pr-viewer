export type Member = {
  name: string
  ids: number[]
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
