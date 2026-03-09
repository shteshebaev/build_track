import { Card } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { useThemeStore } from '@shared/store'
import styles from './StatCard.module.css'

interface StatCardProps {
  title: string
  value: string | number
  prefix?: React.ReactNode
  suffix?: string
  trend?: number
  trendLabel?: string
  icon?: React.ReactNode
  loading?: boolean
  onClick?: () => void
}

export function StatCard({
  title,
  value,
  prefix,
  suffix,
  trend,
  trendLabel,
  icon,
  loading = false,
  onClick,
}: StatCardProps) {
  const { isDark } = useThemeStore()
  const isPositiveTrend = trend !== undefined && trend >= 0

  return (
    <Card
      className={`${styles.card} ${isDark ? styles.dark : styles.light}`}
      loading={loading}
      onClick={onClick}
      hoverable={!!onClick}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      <div className={styles.valueRow}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <span className={styles.value}>{value}</span>
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {trend !== undefined && (
        <div className={styles.trendRow}>
          <span
            className={`${styles.trend} ${isPositiveTrend ? styles.positive : styles.negative}`}
          >
            {isPositiveTrend ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {Math.abs(trend).toFixed(1)}%
          </span>
          {trendLabel && <span className={styles.trendLabel}>{trendLabel}</span>}
        </div>
      )}
    </Card>
  )
}
