export type DateRange = {
  from: Date
  to: Date
}

export type DatePreset = {
  label: string
  range: () => DateRange
}
