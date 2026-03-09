import { type ReactNode } from 'react'
import { Button, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
}

export function PageHeader({ title, subtitle, actions, primaryAction }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.actions}>
        <Space size={12}>
          {actions}
          {primaryAction && (
            <Button
              type="primary"
              icon={primaryAction.icon || <PlusOutlined />}
              onClick={primaryAction.onClick}
              size="large"
            >
              {primaryAction.label}
            </Button>
          )}
        </Space>
      </div>
    </div>
  )
}
