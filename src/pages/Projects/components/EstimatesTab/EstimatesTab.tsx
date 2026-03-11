import { useState } from 'react'
import { Table, Tag, Button, Row, Col, Progress, Modal, Collapse, Tooltip } from 'antd'
import {
  FileTextOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  EditOutlined,
  CloseCircleFilled,
  ExclamationCircleFilled,
  CalendarOutlined,
  UserOutlined,
  ExpandOutlined,
  DollarOutlined,
  ToolOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useThemeStore, useCurrencyStore, formatCurrencyCompact } from '@shared/store'
import { formatDate } from '@shared/lib'
import { mockProjectEstimates, type ProjectEstimate, type EstimateSection, type EstimateItem } from '@mocks/estimates'
import styles from './EstimatesTab.module.css'

interface EstimatesTabProps {
  projectId: string
}

export function EstimatesTab(_props: EstimatesTabProps) {
  const { isDark } = useThemeStore()
  const { unit } = useCurrencyStore()
  const [selectedEstimate, setSelectedEstimate] = useState<ProjectEstimate | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  const estimates = mockProjectEstimates

  const totalPlanned = estimates.reduce((acc, est) => acc + est.totalPlanned, 0)
  const totalActual = estimates.reduce((acc, est) => acc + est.totalActual, 0)
  const approvedCount = estimates.filter(e => e.status === 'approved').length

  const formatCost = (value: number) => {
    const { formatted, suffix } = formatCurrencyCompact(value, unit)
    return formatted + suffix
  }

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
      draft: { color: 'default', label: 'Черновик', icon: <EditOutlined /> },
      pending: { color: 'processing', label: 'На согласовании', icon: <ClockCircleFilled /> },
      approved: { color: 'success', label: 'Утверждена', icon: <CheckCircleFilled /> },
      rejected: { color: 'error', label: 'Отклонена', icon: <CloseCircleFilled /> },
      revision: { color: 'warning', label: 'На доработке', icon: <ExclamationCircleFilled /> },
    }
    return config[status] || config.draft
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return <ToolOutlined />
      case 'material': return <AppstoreOutlined />
      case 'equipment': return <SettingOutlined />
      default: return <FileTextOutlined />
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      work: 'Работы',
      material: 'Материалы',
      equipment: 'Оборудование',
      other: 'Прочее',
    }
    return labels[category] || category
  }

  const handleViewEstimate = (estimate: ProjectEstimate) => {
    setSelectedEstimate(estimate)
    setDetailModalOpen(true)
  }

  const columns: ColumnsType<ProjectEstimate> = [
    {
      title: 'Номер',
      dataIndex: 'number',
      key: 'number',
      width: 130,
      render: (number) => (
        <span className={styles.estimateNumber}>{number}</span>
      ),
    },
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className={styles.estimateName}>
          <span className={styles.nameText}>{name}</span>
          <span className={styles.stageText}>{record.stage}</span>
        </div>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => {
        const config = getStatusConfig(status)
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        )
      },
    },
    {
      title: 'Сумма по смете',
      dataIndex: 'totalPlanned',
      key: 'totalPlanned',
      width: 150,
      align: 'right',
      render: (value) => (
        <span className={styles.amount}>{formatCost(value)}</span>
      ),
    },
    {
      title: 'Факт',
      dataIndex: 'totalActual',
      key: 'totalActual',
      width: 150,
      align: 'right',
      render: (value, record) => {
        const percent = record.totalPlanned > 0
          ? Math.round((value / record.totalPlanned) * 100)
          : 0
        return (
          <div className={styles.actualAmount}>
            <span className={styles.amount}>{formatCost(value)}</span>
            <Progress
              percent={percent}
              size="small"
              showInfo={false}
              strokeColor={percent > 100 ? '#EF4444' : '#10B981'}
              trailColor={isDark ? '#374151' : '#E5E7EB'}
            />
          </div>
        )
      },
    },
    {
      title: 'Дата',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      render: (date) => formatDate(date),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<ExpandOutlined />}
          onClick={() => handleViewEstimate(record)}
        >
          Открыть
        </Button>
      ),
    },
  ]

  const itemColumns: ColumnsType<EstimateItem> = [
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category) => (
        <Tooltip title={getCategoryLabel(category)}>
          <span className={styles.categoryIcon}>{getCategoryIcon(category)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ед. изм.',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
      align: 'center',
    },
    {
      title: 'Кол-во',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
      render: (qty) => qty.toLocaleString(),
    },
    {
      title: 'Цена за ед.',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      align: 'right',
      render: (price) => formatCost(price),
    },
    {
      title: 'Сумма',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 130,
      align: 'right',
      render: (price) => (
        <span className={styles.itemTotal}>{formatCost(price)}</span>
      ),
    },
  ]

  const renderSectionPanel = (section: EstimateSection) => {
    const workItems = section.items.filter(i => i.category === 'work')
    const materialItems = section.items.filter(i => i.category === 'material')
    const equipmentItems = section.items.filter(i => i.category === 'equipment')

    const workTotal = workItems.reduce((acc, i) => acc + i.totalPrice, 0)
    const materialTotal = materialItems.reduce((acc, i) => acc + i.totalPrice, 0)
    const equipmentTotal = equipmentItems.reduce((acc, i) => acc + i.totalPrice, 0)

    return (
      <div className={styles.sectionContent}>
        <div className={styles.sectionSummary}>
          <div className={styles.summaryItem}>
            <ToolOutlined />
            <span>Работы: {formatCost(workTotal)}</span>
          </div>
          <div className={styles.summaryItem}>
            <AppstoreOutlined />
            <span>Материалы: {formatCost(materialTotal)}</span>
          </div>
          {equipmentTotal > 0 && (
            <div className={styles.summaryItem}>
              <SettingOutlined />
              <span>Оборудование: {formatCost(equipmentTotal)}</span>
            </div>
          )}
        </div>
        <Table
          columns={itemColumns}
          dataSource={section.items}
          rowKey="id"
          pagination={false}
          size="small"
          className={`${styles.itemsTable} ${isDark ? styles.dark : ''}`}
        />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Summary Cards */}
      <Row gutter={[16, 16]} className={styles.summaryRow}>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
              <FileTextOutlined style={{ color: '#4F46E5', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <span className={styles.summaryValue}>{estimates.length}</span>
              <span className={styles.summaryLabel}>Всего смет</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <CheckCircleFilled style={{ color: '#10B981', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <span className={styles.summaryValue}>{approvedCount}</span>
              <span className={styles.summaryLabel}>Утверждено</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <DollarOutlined style={{ color: '#3B82F6', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <Tooltip title="Общая сумма по сметам">
                <span className={styles.summaryValue}>{formatCost(totalPlanned)}</span>
              </Tooltip>
              <span className={styles.summaryLabel}>Сумма по сметам</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <DollarOutlined style={{ color: '#F59E0B', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <Tooltip title="Фактически освоено">
                <span className={styles.summaryValue}>{formatCost(totalActual)}</span>
              </Tooltip>
              <span className={styles.summaryLabel}>Освоено</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Estimates Table */}
      <div className={`${styles.tableCard} ${isDark ? styles.dark : ''}`}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Сметы проекта</h2>
          <Button type="primary" icon={<FileTextOutlined />}>
            Создать смету
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={estimates}
          rowKey="id"
          pagination={false}
          className={`${styles.estimatesTable} ${isDark ? styles.dark : ''}`}
          onRow={(record) => ({
            onClick: () => handleViewEstimate(record),
            style: { cursor: 'pointer' },
          })}
        />
      </div>

      {/* Detail Modal */}
      <Modal
        title={null}
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={1000}
        className={`${styles.detailModal} ${isDark ? styles.dark : ''}`}
      >
        {selectedEstimate && (
          <div className={styles.estimateDetail}>
            <div className={styles.detailHeader}>
              <div className={styles.detailTitleRow}>
                <div>
                  <span className={styles.detailNumber}>{selectedEstimate.number}</span>
                  <h2 className={styles.detailTitle}>{selectedEstimate.name}</h2>
                </div>
                {(() => {
                  const config = getStatusConfig(selectedEstimate.status)
                  return (
                    <Tag color={config.color} icon={config.icon} className={styles.detailStatus}>
                      {config.label}
                    </Tag>
                  )
                })()}
              </div>
              {selectedEstimate.description && (
                <p className={styles.detailDescription}>{selectedEstimate.description}</p>
              )}
              <div className={styles.detailMeta}>
                <span className={styles.metaItem}>
                  <CalendarOutlined />
                  Создана: {formatDate(selectedEstimate.createdAt)}
                </span>
                {selectedEstimate.approvedAt && (
                  <span className={styles.metaItem}>
                    <CheckCircleFilled style={{ color: '#10B981' }} />
                    Утверждена: {formatDate(selectedEstimate.approvedAt)}
                  </span>
                )}
                {selectedEstimate.approvedBy && (
                  <span className={styles.metaItem}>
                    <UserOutlined />
                    {selectedEstimate.approvedBy}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.detailSummary}>
              <div className={styles.detailSummaryItem}>
                <span className={styles.detailSummaryLabel}>Сумма по смете</span>
                <span className={styles.detailSummaryValue}>{formatCost(selectedEstimate.totalPlanned)}</span>
              </div>
              <div className={styles.detailSummaryItem}>
                <span className={styles.detailSummaryLabel}>Фактически освоено</span>
                <span className={styles.detailSummaryValue}>{formatCost(selectedEstimate.totalActual)}</span>
              </div>
              <div className={styles.detailSummaryItem}>
                <span className={styles.detailSummaryLabel}>Выполнение</span>
                <span className={styles.detailSummaryValue}>
                  {selectedEstimate.totalPlanned > 0
                    ? Math.round((selectedEstimate.totalActual / selectedEstimate.totalPlanned) * 100)
                    : 0}%
                </span>
              </div>
            </div>

            <div className={styles.sectionsWrapper}>
              <Collapse
                defaultActiveKey={selectedEstimate.sections.map(s => s.id)}
                className={`${styles.sectionsCollapse} ${isDark ? styles.dark : ''}`}
                items={selectedEstimate.sections.map(section => ({
                  key: section.id,
                  label: (
                    <div className={styles.sectionHeader}>
                      <span className={styles.sectionName}>{section.name}</span>
                      <span className={styles.sectionTotal}>{formatCost(section.totalPlanned)}</span>
                    </div>
                  ),
                  children: renderSectionPanel(section),
                }))}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
