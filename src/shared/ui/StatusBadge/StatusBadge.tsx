import { Tag } from 'antd'
import { getStatusColor } from '@shared/lib'

interface StatusBadgeProps {
  status: string
  label: string
  size?: 'small' | 'default'
}

export function StatusBadge({ status, label, size = 'default' }: StatusBadgeProps) {
  const color = getStatusColor(status)

  return (
    <Tag
      color={color}
      style={{
        borderRadius: 6,
        padding: size === 'small' ? '0 6px' : '2px 10px',
        fontSize: size === 'small' ? 11 : 12,
        fontWeight: 500,
        margin: 0,
      }}
    >
      {label}
    </Tag>
  )
}
