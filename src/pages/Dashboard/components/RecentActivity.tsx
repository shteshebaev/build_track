import {
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import styles from './Charts.module.css'

interface Activity {
  id: string
  type: string
  title: string
  description: string
  time: string
  status: 'success' | 'warning' | 'info' | 'error'
}

interface RecentActivityProps {
  activities: Activity[]
  isDark: boolean
}

export function RecentActivity({ activities, isDark }: RecentActivityProps) {
  const getIcon = (status: Activity['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#10B981' }} />
      case 'warning':
        return <WarningOutlined style={{ color: '#F59E0B' }} />
      case 'error':
        return <WarningOutlined style={{ color: '#EF4444' }} />
      default:
        return <InfoCircleOutlined style={{ color: '#3B82F6' }} />
    }
  }

  return (
    <div className={styles.activityList}>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className={`${styles.activityItem} ${isDark ? styles.dark : ''}`}
        >
          <div className={styles.activityIcon}>{getIcon(activity.status)}</div>
          <div className={styles.activityContent}>
            <div className={styles.activityTitle}>{activity.title}</div>
            <div className={styles.activityDescription}>{activity.description}</div>
          </div>
          <div className={styles.activityTime}>{activity.time}</div>
        </div>
      ))}
    </div>
  )
}
