import type { DatePreset } from './types'

function today(): Date {
  return new Date()
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
}

function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

export const datePresets: DatePreset[] = [
  {
    label: '올해 1Q',
    range: () => {
      const year = today().getFullYear()
      return { from: new Date(year, 0, 1), to: endOfDay(new Date(year, 2, 31)) }
    }
  },
  {
    label: '올해 2Q',
    range: () => {
      const year = today().getFullYear()
      return { from: new Date(year, 3, 1), to: endOfDay(new Date(year, 5, 30)) }
    }
  },
  {
    label: '올해',
    range: () => {
      return { from: new Date(today().getFullYear(), 0, 1), to: endOfDay(today()) }
    }
  },
  {
    label: '작년',
    range: () => {
      const lastYear = today().getFullYear() - 1
      return { from: new Date(lastYear, 0, 1), to: endOfDay(new Date(lastYear, 11, 31)) }
    }
  },
  {
    label: '최근 1년',
    range: () => {
      const now = today()
      const oneYearAgo = new Date(now)
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      return { from: startOfDay(oneYearAgo), to: endOfDay(now) }
    }
  },
  {
    label: '최근 1개월',
    range: () => {
      const now = today()
      const oneMonthAgo = new Date(now)
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      return { from: startOfDay(oneMonthAgo), to: endOfDay(now) }
    }
  }
]
