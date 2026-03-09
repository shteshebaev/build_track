import { Modal, Progress, Tag, Table } from 'antd'
import {
  FileTextOutlined,
  ProjectOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useThemeStore } from '@shared/store'
import { formatCurrency, formatDate } from '@shared/lib'
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
  { id: '2', name: 'Арматура А500', unit: 'тонн', quantity: 120, unitPrice: 12000000, total: 1440000000 },
  { id: '3', name: 'Кирпич облицовочный', unit: 'шт', quantity: 50000, unitPrice: 8500, total: 425000000 },
  { id: '4', name: 'Цемент ПЦ-500', unit: 'тонн', quantity: 200, unitPrice: 1200000, total: 240000000 },
  { id: '5', name: 'Песок строительный', unit: 'м³', quantity: 800, unitPrice: 180000, total: 144000000 },
  { id: '6', name: 'Работы по монтажу', unit: 'услуга', quantity: 1, unitPrice: 526000000, total: 526000000 },
]

export function EstimateDetailModal({ open, estimate, onClose, onEdit }: EstimateDetailModalProps) {
  const { isDark } = useThemeStore()

  if (!estimate) return null

  const spentPercent = Math.round((estimate.spent / estimate.totalBudget) * 100)
  const remaining = estimate.totalBudget - estimate.spent

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
      render: (name) => <span style={{ fontWeight: 500 }}>{name}</span>
    },
    { title: 'Ед. изм.', dataIndex: 'unit', key: 'unit', width: 80 },
    {
      title: 'Кол-во',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
      width: 100,
      render: (q) => q.toLocaleString('ru-RU')
    },
    {
      title: 'Цена за ед.',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'right',
      width: 140,
      render: (p) => formatCurrency(p)
    },
    {
      title: 'Сумма',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      width: 150,
      render: (t) => <span style={{ fontWeight: 600 }}>{formatCurrency(t)}</span>
    },
  ]

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnClose
      className={`${styles.modal} ${isDark ? styles.dark : ''}`}
      closeIcon={<span className={styles.closeButton}>✕</span>}
    >
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerIcon}>
              <FileTextOutlined />
            </div>
            <Tag color={statusConfig.color} className={styles.statusTag}>
              {statusConfig.icon} {statusConfig.label}
            </Tag>
          </div>
          <h2 className={styles.title}>{estimate.name}</h2>
          <div className={styles.projectInfo}>
            <ProjectOutlined />
            <span>{estimate.project}</span>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
              <DollarOutlined />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Бюджет</span>
              <span className={styles.statValue}>{formatCurrency(estimate.totalBudget)}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <ClockCircleOutlined />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Израсходовано</span>
              <span className={styles.statValue}>{formatCurrency(estimate.spent)}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <CheckCircleOutlined />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Остаток</span>
              <span className={styles.statValue}>{formatCurrency(remaining)}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
              <CalendarOutlined />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Создана</span>
              <span className={styles.statValue}>{formatDate(estimate.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Исполнение бюджета</span>
            <span className={styles.progressValue}>{spentPercent}%</span>
          </div>
          <Progress
            percent={spentPercent}
            showInfo={false}
            strokeColor={spentPercent > 90 ? '#ef4444' : spentPercent > 70 ? '#f59e0b' : '#10b981'}
            trailColor={isDark ? '#374151' : '#e5e7eb'}
            size={['100%', 12]}
            style={{ borderRadius: 6 }}
          />
        </div>

        {/* Items Table */}
        <div className={styles.tableSection}>
          <h3 className={styles.sectionTitle}>Позиции сметы</h3>
          <Table
            dataSource={mockEstimateItems}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="small"
            className={styles.table}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4}>
                    <strong>Итого:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <strong style={{ color: '#4f46e5' }}>
                      {formatCurrency(mockEstimateItems.reduce((sum, item) => sum + item.total, 0))}
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={onClose}
          >
            Закрыть
          </button>
          {onEdit && (
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={onEdit}
            >
              <EditOutlined /> Редактировать
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
