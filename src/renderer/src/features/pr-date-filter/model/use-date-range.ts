import { useState } from 'react'
import type { DateRange } from './types'
import { datePresets } from './presets'

const defaultRange = datePresets.find((p) => p.label === '최근 1년')!.range()

export function useDateRange(initial?: DateRange) {
  const [dateRange, setDateRange] = useState<DateRange>(initial ?? defaultRange)
  const [activePreset, setActivePreset] = useState<string | null>('최근 1년')

  const selectPreset = (label: string) => {
    const preset = datePresets.find((p) => p.label === label)
    if (preset) {
      setDateRange(preset.range())
      setActivePreset(label)
    }
  }

  const setCustomRange = (range: DateRange) => {
    // from은 startOfDay, to는 endOfDay로 정규화
    const from = new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate(), 0, 0, 0, 0)
    const to = new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate(), 23, 59, 59, 999)
    setDateRange({ from, to })
    setActivePreset(null)
  }

  return { dateRange, activePreset, selectPreset, setCustomRange }
}
