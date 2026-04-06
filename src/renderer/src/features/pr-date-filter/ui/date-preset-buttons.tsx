import { Button } from '@/shared/ui/button'
import { datePresets } from '../model/presets'

type DatePresetButtonsProps = {
  activePreset: string | null
  onSelect: (label: string) => void
}

export function DatePresetButtons({ activePreset, onSelect }: DatePresetButtonsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {datePresets.map((preset) => (
        <Button
          key={preset.label}
          variant={activePreset === preset.label ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(preset.label)}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  )
}
