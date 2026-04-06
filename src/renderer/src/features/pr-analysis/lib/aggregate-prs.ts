import dayjs from 'dayjs'
import type { PullRequest } from '@/entities/pull-request'

export function flattenQueryResults(queries: { data?: PullRequest[] }[]): PullRequest[] {
  const result: PullRequest[] = []
  queries.forEach((query) => {
    if (Array.isArray(query.data)) {
      result.push(...query.data)
    }
  })
  return result
}

export function aggregateUserStats(pullRequests: PullRequest[]): Record<string, Record<string, number>> {
  const users: Record<string, Record<string, number>> = {}
  pullRequests.forEach((pull) => {
    const login = pull.user.login
    if (!users[login]) {
      users[login] = {}
    }
    users[login][pull.state] = (users[login][pull.state] || 0) + 1
  })
  return users
}

export function aggregateByRepository(pullRequests: PullRequest[]): Map<string, number> {
  const counts = new Map<string, number>()
  pullRequests.forEach((pull) => {
    const name = pull.base.repo.full_name
    counts.set(name, (counts.get(name) || 0) + 1)
  })
  return counts
}

export function aggregateByDate(pullRequests: PullRequest[]): { date: string; value: number }[] {
  const counts = new Map<string, number>()
  pullRequests.forEach((pull) => {
    const date = dayjs(pull.created_at).format('YYYY-MM-DDT00:00:00')
    counts.set(date, (counts.get(date) || 0) + 1)
  })
  return [...counts.keys()].map((key) => ({ date: key, value: counts.get(key)! }))
}

export function aggregateContributors(
  pullRequests: PullRequest[],
  groupBy: 'user' | 'repository'
): Record<string, number> {
  const result: Record<string, number> = {}
  pullRequests.forEach((pull) => {
    const key = groupBy === 'user' ? pull.user.login : pull.base.repo.full_name
    result[key] = (result[key] || 0) + 1
  })
  return result
}

export function stringToHue(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

export function toChartData(
  data: Record<string, number>
): { browser: string; visitors: number; fill: string }[] {
  return Object.keys(data).map((key) => ({
    browser: key,
    visitors: data[key],
    fill: `hsl(${stringToHue(key)}, 70%, 50%)`
  }))
}
