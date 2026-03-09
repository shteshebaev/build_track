import { Modal, Progress, Tag, Table } from 'antd'
import {
  FileTextOutlined,
  ProjectOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useThemeStore, useCurrencyStore, formatCurrencyCompact } from '@shared/store'
import { formatDate } from '@shared/lib'
import styles from './EstimateDetailModal.module.css'

interface EstimateItem {
  id: string
  name: string
  unit: string
  quantity: number
  unitPrice: number
  total: number
}

interface Estimate {
  id: string
  name: string
  project: string
  totalBudget: number
  spent: number
  status: string
  createdAt: string
}

interface EstimateDetailModalProps {
  open: boolean
  estimate: Estimate | null
  onClose: () => void
  onEdit?: () => void
}

// Mock estimate items
const mockEstimateItems: EstimateItem[] = [
  { id: '1', name: 'Бетон М300', unit: 'м³', quantity: 500, unitPrice: 850000, total: 425000000 },
  { id: '2', name: 'Арматура А500', unit: 'т', quantity: 120, unitPrice: 12000000, total: 1440000000 },
  { id: '3', name: 'Кирпич облицовочный', unit: 'шт', quantity: 50000, unitPrice: 8500, total: 425000000 },
  { id: '4', name: 'Цемент ПЦ-500', unit: 'т', quantity: 200, unitPrice: 1200000, total: 240000000 },
  { id: '5', name: 'Песок строительный', unit: 'м³', quantity: 800, unitPrice: 180000, total: 144000000 },
  { id: '6', name: 'Монтажные работы', unit: 'усл', quantity: 1, unitPrice: 526000000, total: 526000000 },
]

export function EstimateDetailModal({ open, estimate, onClose, onEdit }: EstimateDetailModalProps) {
  const { isDark } = useThemeStore()
  const { unit } = useCurrencyStore()

  if (!estimate) return null

  const spentPercent = Math.round((estimate.spent / estimate.totalBudget) * 100)
  const remaining = estimate.totalBudget - estimate.spent

  const formatValue = (value: number) => {
    const { formatted, suffix } = formatCurrencyCompact(value, unit)
    return formatted + suffix
  }

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
      draft: { color: 'default', label: 'Черновик', icon: <EditOutlined /> },
      active: { color: 'processing', label: 'Активная', icon: <ClockCircleOutlined /> },
      completed: { color: 'success', label: 'Завершена', icon: <CheckCircleOutlined /> },
    }
    return config[status] || { color: 'default', label: status, icon: null }
  }

  const statusConfig = getStatusConfig(estimate.status)

  const columns: ColumnsType<EstimateItem> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    { title: 'Ед.', dataIndex: 'unit', key: 'unit', width: 50, align: 'center' },
    {
      title: 'Кол-во',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
      width: 70,
      render: (q) => q.toLocaleString('ru-RU')
    },
    {
      title: 'Сумма',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      width: 120,
      render: (t) => <strong>{formatValue(t)}</strong>
    },
  ]

  const totalSum = mockEstimateItems.reduce((sum, item) => sum + item.total, 0)

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      centered
      destroyOnClose
      className={`${styles.modal} ${isDark ? styles.dark : ''}`}
      closeIcon={<span className={styles.closeButton}>✕</span>}
    >
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <FileTextOutlined />
          </div>
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>{estimate.name}</h2>
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <ProjectOutlined /> {estimate.project}
              </span>
              <span className={styles.metaItem}>
                <CalendarOutlined /> {formatDate(estimate.createdAt)}
              </span>
            </div>
          </div>
          <Tag color={statusConfig.color} className={styles.statusTag}>
            {statusConfig.label}
          </Tag>
        </div>

        {/* Budget Summary */}
        <div className={styles.budgetSection}>
          <div className={styles.budgetRow}>
            <div className={styles.budgetItem}>
              <span className={styles.budgetLabel}>Бюджет</span>
              <span className={styles.budgetValue}>{formatValue(estimate.totalBudget)}</span>
            </div>
            <div className={styles.budgetItem}>
              <span className={styles.budgetLabel}>Израсходовано</span>
              <span className={styles.budgetValueSpent}>{formatValue(estimate.spent)}</span>
            </div>
            <div className={styles.budgetItem}>
              <span className={styles.budgetLabel}>Остаток</span>
              <span className={styles.budgetValueRemaining}>{formatValue(remaining)}</span>
            </div>
          </div>

          <div className={styles.progressRow}>
            <Progress
              percent={spentPercent}
              showInfo={false}
              strokeColor={spentPercent > 90 ? '#ef4444' : spentPercent > 70 ? '#f59e0b' : '#10b981'}
              trailColor={isDark ? '#374151' : '#e5e7eb'}
              size={['100%', 8]}
            />
            <span className={styles.progressPercent}>{spentPercent}%</span>
          </div>
        </div>

        {/* Items Table */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <span className={styles.tableTitle}>Позиции сметы</span>
            <span className={styles.tableCount}>{mockEstimateItems.length} позиций</span>
          </div>
          <Table
            dataSource={mockEstimateItems}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="small"
            className={styles.table}
          />
          <div className={styles.totalRow}>
            <span>Итого:</span>
            <strong>{formatValue(totalSum)}</strong>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onClose}>
            Закрыть
          </button>
          {onEdit && (
            <button className={`${styles.button} ${styles.primaryButton}`} onClick={onEdit}>
              <EditOutlined /> Редактировать
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
