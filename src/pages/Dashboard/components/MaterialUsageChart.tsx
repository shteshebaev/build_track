import { useMemo } from 'react'
import type { ChartDataPoint } from '@shared/types'
import { formatCurrency } from '@shared/lib'
import styles from './Charts.module.css'

interface MaterialUsageChartProps {
  data: ChartDataPoint[]
  isDark: boolean
}

export function MaterialUsageChart({ data, isDark }: MaterialUsageChartProps) {
  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.value)),
    [data]
  )

  const sortedData = useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data]
  )

  const colors = [
    '#4F46E5',
    '#7C3AED',
    '#EC4899',
    '#F59E0B',
    '#10B981',
    '#3B82F6',
  ]

  return (
    <div className={styles.barChart}>
      {sortedData.map((item, index) => {
        const percentage = (item.value / maxValue) * 100

        return (
          <div key={item.date} className={styles.barItem}>
            <div className={styles.barLabel}>
              <span className={`${styles.barName} ${isDark ? styles.dark : ''}`}>
                {item.date}
              </span>
              <span className={styles.barValue}>
                {formatCurrency(item.value)}
              </span>
            </div>
            <div
              className={styles.barTrack}
              style={{ background: isDark ? '#374151' : '#F3F4F6' }}
            >
              <div
                className={styles.barFill}
                style={{
                  width: `${percentage}%`,
                  background: colors[index % colors.length],
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
