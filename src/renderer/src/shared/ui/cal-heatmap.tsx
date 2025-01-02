import CalHeatmap from 'cal-heatmap'
import 'cal-heatmap/cal-heatmap.css'
import { useEffect, useRef } from 'react'

type CalProps = {
  foo: string
  data: {
    date: string
    value: number
  }[]
}
export function Cal({ data }: CalProps) {
  const calRef = useRef<HTMLDivElement>()
  const calHeatmapRef = useRef<any>()

  useEffect(() => {
    ;(async () => {
      if (!calRef.current) {
        return
      }
      if (calHeatmapRef.current) {
        calRef.current.innerHTML = ''
      }

      const cal = new CalHeatmap()
      await cal.paint(
        {
          itemSelector: calRef.current,
          animationDuration: 0,
          // itemSelector: `#${calItemId}`,
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
      calHeatmapRef.current = cal

      const chElements = calRef.current.querySelectorAll('svg.ch-container')
      Array.from(chElements).forEach((svg, index) => {
        if (index > 0) {
          svg.remove()
        }
      })

      return
    })()
  }, [data])

  return <div ref={calRef}></div>
}
