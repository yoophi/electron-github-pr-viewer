import CalHeatmap from 'cal-heatmap'
import { useRef, useEffect } from 'react'
import 'cal-heatmap/cal-heatmap.css'

type CalProps = {
  foo: string
  data: {
    date: string
    value: number
  }[]
}
export function Cal({ data }: CalProps) {
  const calRef = useRef<HTMLDivElement>()

  useEffect(() => {
    ;(async () => {
      if (!calRef.current) {
        return
      }
      calRef.current.innerHTML = ''

      const cal = new CalHeatmap()
      cal.paint(
        {
          itemSelector: calRef.current,
          theme: 'light',
          date: { start: new Date('2024-01-01') },
          data: {
            source: data,
            x: 'date',
            y: 'value'
          },
          range: 12,
          scale: {
            color: {
              type: 'quantize',
              scheme: 'Greens',
              domain: [0, 1, 2, 3, 4, 5]
            }
          },
          domain: {
            type: 'month'
          },
          subDomain: { type: 'day' }
        },
        []
      )
    })()
  }, [data])

  return <div ref={calRef}></div>
}
