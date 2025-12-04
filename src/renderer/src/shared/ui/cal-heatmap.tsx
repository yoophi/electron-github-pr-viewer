// @ts-nocheck
import CalHeatmap from 'cal-heatmap'
import 'cal-heatmap/cal-heatmap.css'
import { useEffect, useRef } from 'react'

type CalProps = {
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
      const max = Math.max(...data.map((d) => d.value)) || 0
      const maxValue = max < 10 ? 10 : max

      await cal.paint(
        {
          itemSelector: calRef.current,
          animationDuration: 0,
          theme: 'light',
          // date: { start: new Date('2025-04-01') },
          date: { start: new Date('2025-01-01') },
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
              domain: [
                0, 1, 2, 3, 4, 5
                // 0,
                // maxValue * 0.1,
                // maxValue * 0.2,
                // maxValue * 0.3,
                // maxValue * 0.4,
                // maxValue * 0.5,
                // maxValue * 0.6,
                // maxValue * 0.7,
                // maxValue * 0.8,
                // maxValue * 0.9,
                // maxValue
              ]
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
