export type PullRequestUser = {
  id: number
  login: string
  avatar_url: string
}

export type PullRequestLabel = {
  id: number
  name: string
  color: string
}

export type PullRequestBase = {
  ref: string
  repo: {
    full_name: string
  }
}

export type PullRequest = {
  id: number
  title: string
  html_url: string
  state: 'open' | 'closed'
  created_at: string
  updated_at: string
  user: PullRequestUser
  labels: PullRequestLabel[]
  base: PullRequestBase
}
