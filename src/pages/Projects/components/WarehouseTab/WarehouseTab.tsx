import { useState } from 'react'
import { Table, Tag, Row, Col, Input, Select, Progress, Timeline, Tooltip } from 'antd'
import {
  SearchOutlined,
  AppstoreOutlined,
  ToolOutlined,
  BuildOutlined,
  ContainerOutlined,
  BorderOutlined,
  ExperimentOutlined,
  FireOutlined,
  ThunderboltOutlined,
  ApartmentOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SwapOutlined,
  WarningOutlined,
  InboxOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useThemeStore, useCurrencyStore, formatCurrencyCompact } from '@shared/store'
import { formatDate } from '@shared/lib'
import {
  mockProjectWarehouseItems,
  mockWarehouseMovements,
  mockWarehouseCategories,
  type WarehouseItem,
} from '@mocks/projectWarehouse'
import styles from './WarehouseTab.module.css'

interface WarehouseTabProps {
  projectId: string
}

export function WarehouseTab(_props: WarehouseTabProps) {
  const { isDark } = useThemeStore()
  const { unit } = useCurrencyStore()
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const items = mockProjectWarehouseItems
  const movements = mockWarehouseMovements
  const categories = mockWarehouseCategories

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalValue = items.reduce((acc, item) => acc + item.totalValue, 0)
  const totalItems = items.length
  const lowStockItems = items.filter(item => item.quantity <= item.minStock).length
  const reservedValue = items.reduce((acc, item) => acc + (item.reserved * item.price), 0)

  const formatCost = (value: number) => {
    const { formatted, suffix } = formatCurrencyCompact(value, unit)
    return formatted + suffix
  }

  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      tool: <ToolOutlined />,
      build: <BuildOutlined />,
      container: <ContainerOutlined />,
      border: <BorderOutlined />,
      experiment: <ExperimentOutlined />,
      fire: <FireOutlined />,
      thunderbolt: <ThunderboltOutlined />,
      apartment: <ApartmentOutlined />,
    }
    return icons[iconName] || <AppstoreOutlined />
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in': return <ArrowDownOutlined style={{ color: '#10B981' }} />
      case 'out': return <ArrowUpOutlined style={{ color: '#EF4444' }} />
      case 'transfer': return <SwapOutlined style={{ color: '#3B82F6' }} />
      default: return <SwapOutlined />
    }
  }

  const getMovementLabel = (type: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      in: { text: 'Приход', color: 'success' },
      out: { text: 'Расход', color: 'error' },
      transfer: { text: 'Перемещение', color: 'processing' },
    }
    return labels[type] || { text: type, color: 'default' }
  }

  const getStockStatus = (item: WarehouseItem) => {
    const available = item.quantity - item.reserved
    if (item.quantity <= item.minStock) {
      return { status: 'critical', label: 'Критично', color: '#EF4444' }
    }
    if (available <= item.minStock * 0.5) {
      return { status: 'low', label: 'Мало', color: '#F59E0B' }
    }
    return { status: 'ok', label: 'В норме', color: '#10B981' }
  }

  const columns: ColumnsType<WarehouseItem> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className={styles.itemName}>
          <span className={styles.nameText}>{name}</span>
          <span className={styles.categoryText}>{record.category}</span>
        </div>
      ),
    },
    {
      title: 'Количество',
      key: 'quantity',
      width: 180,
      render: (_, record) => {
        const available = record.quantity - record.reserved
        const stockStatus = getStockStatus(record)
        const percent = Math.min((record.quantity / (record.minStock * 2)) * 100, 100)

        return (
          <div className={styles.quantityCell}>
            <div className={styles.quantityRow}>
              <span className={styles.quantityValue}>
                {record.quantity.toLocaleString()} {record.unit}
              </span>
              {record.reserved > 0 && (
                <Tooltip title={`Зарезервировано: ${record.reserved} ${record.unit}`}>
                  <span className={styles.reservedBadge}>-{record.reserved}</span>
                </Tooltip>
              )}
            </div>
            <Progress
              percent={percent}
              size="small"
              showInfo={false}
              strokeColor={stockStatus.color}
              trailColor={isDark ? '#374151' : '#E5E7EB'}
            />
            <span className={styles.availableText}>
              Доступно: {available.toLocaleString()} {record.unit}
            </span>
          </div>
        )
      },
    },
    {
      title: 'Статус',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const status = getStockStatus(record)
        return (
          <Tag color={status.status === 'critical' ? 'error' : status.status === 'low' ? 'warning' : 'success'}>
            {status.label}
          </Tag>
        )
      },
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      align: 'right',
      render: (price) => (
        <span className={styles.price}>{formatCost(price)}</span>
      ),
    },
    {
      title: 'Стоимость',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 140,
      align: 'right',
      render: (value) => (
        <span className={styles.totalValue}>{formatCost(value)}</span>
      ),
    },
    {
      title: 'Расположение',
      dataIndex: 'location',
      key: 'location',
      width: 130,
      render: (location) => (
        <span className={styles.location}>
          <EnvironmentOutlined /> {location}
        </span>
      ),
    },
    {
      title: 'Обновлено',
      dataIndex: 'lastMovement',
      key: 'lastMovement',
      width: 110,
      render: (date) => formatDate(date),
    },
  ]

  return (
    <div className={styles.container}>
      {/* Summary Cards */}
      <Row gutter={[16, 16]} className={styles.summaryRow}>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
              <InboxOutlined style={{ color: '#4F46E5', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <span className={styles.summaryValue}>{totalItems}</span>
              <span className={styles.summaryLabel}>Позиций на складе</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <AppstoreOutlined style={{ color: '#10B981', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <Tooltip title="Общая стоимость материалов">
                <span className={styles.summaryValue}>{formatCost(totalValue)}</span>
              </Tooltip>
              <span className={styles.summaryLabel}>Стоимость склада</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <ContainerOutlined style={{ color: '#3B82F6', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <span className={styles.summaryValue}>{formatCost(reservedValue)}</span>
              <span className={styles.summaryLabel}>Зарезервировано</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''} ${lowStockItems > 0 ? styles.warning : ''}`}>
            <div className={styles.summaryIcon} style={{ background: lowStockItems > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(156, 163, 175, 0.1)' }}>
              <WarningOutlined style={{ color: lowStockItems > 0 ? '#EF4444' : '#9CA3AF', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <span className={styles.summaryValue}>{lowStockItems}</span>
              <span className={styles.summaryLabel}>Требуется закупка</span>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Main Table */}
        <Col xs={24} lg={16}>
          <div className={`${styles.tableCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>Материалы на складе</h2>
              <div className={styles.tableActions}>
                <Input
                  placeholder="Поиск материалов..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className={styles.searchInput}
                  style={{ width: 220 }}
                />
                <Select
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  style={{ width: 180 }}
                  options={[
                    { value: 'all', label: 'Все категории' },
                    ...categories.map(c => ({ value: c.name, label: c.name }))
                  ]}
                />
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={filteredItems}
              rowKey="id"
              pagination={{ pageSize: 8, showSizeChanger: false }}
              className={`${styles.itemsTable} ${isDark ? styles.dark : ''}`}
              size="middle"
            />
          </div>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          {/* Categories */}
          <div className={`${styles.sideCard} ${isDark ? styles.dark : ''}`}>
            <h3 className={styles.sideCardTitle}>Категории</h3>
            <div className={styles.categoriesList}>
              {categories.map((cat, index) => (
                <div
                  key={index}
                  className={`${styles.categoryItem} ${selectedCategory === cat.name ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'all' : cat.name)}
                >
                  <div className={styles.categoryIcon}>
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <div className={styles.categoryInfo}>
                    <span className={styles.categoryName}>{cat.name}</span>
                    <span className={styles.categoryCount}>{cat.count} поз.</span>
                  </div>
                  <span className={styles.categoryValue}>{formatCost(cat.totalValue)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Movements */}
          <div className={`${styles.sideCard} ${isDark ? styles.dark : ''}`}>
            <h3 className={styles.sideCardTitle}>Последние движения</h3>
            <Timeline
              className={styles.movementTimeline}
              items={movements.slice(0, 5).map((mov) => {
                const movLabel = getMovementLabel(mov.type)
                return {
                  dot: getMovementIcon(mov.type),
                  children: (
                    <div className={styles.movementItem}>
                      <div className={styles.movementHeader}>
                        <Tag color={movLabel.color} className={styles.movementTag}>
                          {movLabel.text}
                        </Tag>
                        <span className={styles.movementDate}>{formatDate(mov.date)}</span>
                      </div>
                      <div className={styles.movementName}>{mov.itemName}</div>
                      <div className={styles.movementDetails}>
                        <span>{mov.quantity} {mov.unit}</span>
                        {mov.toLocation && <span>→ {mov.toLocation}</span>}
                        {mov.fromLocation && !mov.toLocation && <span>из {mov.fromLocation}</span>}
                      </div>
                    </div>
                  ),
                }
              })}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}
