import { useMemo } from 'react'
import { Tooltip } from 'antd'
import type { ChartDataPoint } from '@shared/types'
import { useCurrencyStore, formatCurrencyCompact } from '@shared/store'
import styles from './Charts.module.css'

interface MaterialUsageChartProps {
  data: ChartDataPoint[]
  isDark: boolean
}

export function MaterialUsageChart({ data, isDark }: MaterialUsageChartProps) {
  const { unit } = useCurrencyStore()

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

  const formatValue = (value: number) => {
    const { formatted, suffix, fullValue } = formatCurrencyCompact(value, unit)
    return { display: formatted + suffix, full: fullValue }
  }

  return (
    <div className={styles.barChart}>
      {sortedData.map((item, index) => {
        const percentage = (item.value / maxValue) * 100
        const formattedValue = formatValue(item.value)

        return (
          <Tooltip key={item.date} title={formattedValue.full} placement="left">
            <div className={styles.barItem}>
              <div className={styles.barLabel}>
                <span className={`${styles.barName} ${isDark ? styles.dark : ''}`}>
                  {item.date}
                </span>
                <span className={styles.barValue}>
                  {formattedValue.display}
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
          </Tooltip>
        )
      })}
    </div>
  )
}
