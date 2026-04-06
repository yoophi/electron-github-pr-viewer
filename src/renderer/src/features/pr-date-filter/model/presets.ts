import type { DatePreset } from './types'

const today = () => new Date()
const startOfYear = (year: number) => new Date(year, 0, 1)
const endOfYear = (year: number) => new Date(year, 11, 31)

export const datePresets: DatePreset[] = [
  {
    label: '올해 1Q',
    range: () => {
      const year = today().getFullYear()
      return { from: new Date(year, 0, 1), to: new Date(year, 2, 31) }
    }
  },
  {
    label: '올해 2Q',
    range: () => {
      const year = today().getFullYear()
      return { from: new Date(year, 3, 1), to: new Date(year, 5, 30) }
    }
  },
  {
    label: '올해',
    range: () => {
      return { from: startOfYear(today().getFullYear()), to: today() }
    }
  },
  {
    label: '작년',
    range: () => {
      const lastYear = today().getFullYear() - 1
      return { from: startOfYear(lastYear), to: endOfYear(lastYear) }
    }
  },
  {
    label: '최근 1년',
    range: () => {
      const now = today()
      const oneYearAgo = new Date(now)
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      return { from: oneYearAgo, to: now }
    }
  },
  {
    label: '최근 1개월',
    range: () => {
      const now = today()
      const oneMonthAgo = new Date(now)
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      return { from: oneMonthAgo, to: now }
    }
  }
]
