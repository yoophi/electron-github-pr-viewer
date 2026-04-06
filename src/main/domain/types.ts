export type SettingData = {
  accessToken: string
  org: string
  repositories: string[]
  members: Member[]
}

export type Member = {
  name: string
  ids: number[]
  groups: string[]
}

export type PullRequestState = 'all' | 'open' | 'closed'

export type GetPullRequestsParams = {
  accessToken: string
  repository: string
  params?: {
    state?: PullRequestState
  }
}

export type GetRepositoriesParams = {
  accessToken: string
  org: string
}

export type IPCResponse<T> = {
  error: boolean
  message?: string
  data: T
}
