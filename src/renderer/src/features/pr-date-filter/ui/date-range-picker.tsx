import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Calendar } from '@/shared/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import type { DateRange } from '../model/types'

type DateRangePickerProps = {
  dateRange: DateRange
  onChange: (range: DateRange) => void
}

export function DateRangePicker({ dateRange, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">기간:</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <CalendarIcon className="w-4 h-4" />
            {format(dateRange.from, 'yyyy-MM-dd', { locale: ko })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateRange.from}
            onSelect={(date) => {
              if (date) {
                onChange({ ...dateRange, from: date })
              }
            }}
            defaultMonth={dateRange.from}
          />
        </PopoverContent>
      </Popover>
      <span className="text-sm text-muted-foreground">~</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <CalendarIcon className="w-4 h-4" />
            {format(dateRange.to, 'yyyy-MM-dd', { locale: ko })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateRange.to}
            onSelect={(date) => {
              if (date) {
                onChange({ ...dateRange, to: date })
              }
            }}
            defaultMonth={dateRange.to}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
