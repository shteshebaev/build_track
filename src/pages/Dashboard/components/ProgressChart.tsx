import { useMemo } from 'react'
import { Progress, Space } from 'antd'
import type { ProjectProgressData } from '@shared/types'
import styles from './Charts.module.css'

interface ProgressChartProps {
  data: ProjectProgressData[]
  isDark: boolean
}

export function ProgressChart({ data, isDark }: ProgressChartProps) {
  const sortedData = useMemo(
    () => [...data].sort((a, b) => b.actual - a.actual),
    [data]
  )

  return (
    <div className={styles.progressChart}>
      {sortedData.map((item) => {
        const diff = item.actual - item.planned
        const isOnTrack = diff >= 0

        return (
          <div key={item.projectId} className={styles.progressItem}>
            <div className={styles.progressHeader}>
              <span className={`${styles.projectName} ${isDark ? styles.dark : ''}`}>
                {item.projectName}
              </span>
              <Space size={16}>
                <span className={styles.progressLabel}>
                  <span className={styles.dot} style={{ background: '#4F46E5' }} />
                  План: {item.planned}%
                </span>
                <span className={styles.progressLabel}>
                  <span className={styles.dot} style={{ background: '#10B981' }} />
                  Факт: {item.actual}%
                </span>
                <span
                  className={`${styles.progressDiff} ${isOnTrack ? styles.positive : styles.negative}`}
                >
                  {isOnTrack ? '+' : ''}{diff}%
                </span>
              </Space>
            </div>
            <div className={styles.progressBars}>
              <Progress
                percent={item.planned}
                showInfo={false}
                strokeColor="#E5E7EB"
                trailColor={isDark ? '#374151' : '#F3F4F6'}
                size={['100%', 8]}
                className={styles.plannedBar}
              />
              <Progress
                percent={item.actual}
                showInfo={false}
                strokeColor={{
                  '0%': '#4F46E5',
                  '100%': '#7C3AED',
                }}
                trailColor="transparent"
                size={['100%', 8]}
                className={styles.actualBar}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
