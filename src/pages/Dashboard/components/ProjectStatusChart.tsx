import styles from './Charts.module.css'

interface ProjectStatusData {
  status: string
  count: number
  color: string
}

interface ProjectStatusChartProps {
  data: ProjectStatusData[]
  isDark: boolean
}

export function ProjectStatusChart({ data, isDark }: ProjectStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0)

  // Calculate segments for pie chart
  let currentAngle = 0
  const segments = data.map((item) => {
    const angle = (item.count / total) * 360
    const segment = {
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    }
    currentAngle += angle
    return segment
  })

  // Create SVG path for each segment
  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180

    const x1 = 100 + radius * Math.cos(startRad)
    const y1 = 100 + radius * Math.sin(startRad)
    const x2 = 100 + radius * Math.cos(endRad)
    const y2 = 100 + radius * Math.sin(endRad)

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

    return `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
  }

  return (
    <div className={styles.pieChart}>
      <svg viewBox="0 0 200 200" className={styles.pieSvg}>
        {segments.map((segment, index) => (
          <path
            key={segment.status}
            d={createArcPath(segment.startAngle, segment.endAngle, 80)}
            fill={segment.color}
            className={styles.pieSegment}
          />
        ))}
        {/* Center circle for donut effect */}
        <circle
          cx="100"
          cy="100"
          r="50"
          fill={isDark ? '#1F2937' : '#FFFFFF'}
        />
        {/* Center text */}
        <text
          x="100"
          y="95"
          textAnchor="middle"
          className={styles.pieTotal}
          fill={isDark ? '#F9FAFB' : '#111827'}
        >
          {total}
        </text>
        <text
          x="100"
          y="115"
          textAnchor="middle"
          className={styles.pieTotalLabel}
          fill={isDark ? '#9CA3AF' : '#6B7280'}
        >
          проектов
        </text>
      </svg>

      <div className={styles.pieLegend}>
        {data.map((item) => (
          <div key={item.status} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: item.color }}
            />
            <span className={`${styles.legendLabel} ${isDark ? styles.dark : ''}`}>
              {item.status}
            </span>
            <span className={styles.legendCount}>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
