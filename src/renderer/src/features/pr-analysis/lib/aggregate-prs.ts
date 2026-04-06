import dayjs from 'dayjs'

export function flattenQueryResults(queries: { data: any }[]): any[] {
  const result: any[] = []
  queries.forEach((query) => {
    if (Array.isArray(query.data)) {
      result.push(...query.data)
    }
  })
  return result
}

export function aggregateUserStats(pullRequests: any[]): Record<string, Record<string, number>> {
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

export function aggregateByRepository(pullRequests: any[]): Map<string, number> {
  const counts = new Map<string, number>()
  pullRequests.forEach((pull) => {
    const name = pull.base.repo.full_name
    counts.set(name, (counts.get(name) || 0) + 1)
  })
  return counts
}

export function aggregateByDate(pullRequests: any[]): { date: string; value: number }[] {
  const counts = new Map<string, number>()
  pullRequests.forEach((pull) => {
    const date = dayjs(pull.created_at).format('YYYY-MM-DDT00:00:00')
    counts.set(date, (counts.get(date) || 0) + 1)
  })
  return [...counts.keys()].map((key) => ({ date: key, value: counts.get(key)! }))
}

export function aggregateContributors(
  pullRequests: any[],
  groupBy: 'user' | 'repository'
): Record<string, number> {
  return pullRequests.reduce((prev, curr) => {
    const key = groupBy === 'user' ? curr.user.login : curr.base.repo.full_name
    return { ...prev, [key]: (prev[key] || 0) + 1 }
  }, {} as Record<string, number>)
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
