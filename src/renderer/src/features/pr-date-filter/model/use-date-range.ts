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
    setDateRange(range)
    setActivePreset(null)
  }

  return { dateRange, activePreset, selectPreset, setCustomRange }
}
