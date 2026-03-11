import { useState, useMemo } from 'react'
import { Table, Input, Select, Button, Space, Card, Progress } from 'antd'
import { SearchOutlined, WarningOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader, StatusBadge } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { formatCurrency, formatNumber } from '@shared/lib'
import { mockWarehouseItems, getStockStatus } from '@mocks'
import type { WarehouseItem } from '@shared/types'
import {
  ReceiptModal,
  IssueModal,
  TransferModal,
  InventoryModal,
  type ReceiptFormValues,
  type IssueFormValues,
  type TransferFormValues,
  type InventoryFormValues,
} from './components'
import styles from './Warehouse.module.css'

export function Warehouse() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()

  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState<string>('all')

  // Modal states
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [issueModalOpen, setIssueModalOpen] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false)

  const filteredItems = useMemo(() => {
    return mockWarehouseItems.filter((item) => {
      const materialName = item.material?.name || ''
      const matchesSearch = materialName.toLowerCase().includes(search.toLowerCase())

      if (stockFilter === 'all') return matchesSearch

      const minStock = item.material?.minStock || 0
      const status = getStockStatus(item.quantity, minStock)
      return matchesSearch && status === stockFilter
    })
  }, [search, stockFilter])

  const stockStatusOptions = [
    { value: 'all', label: t('common.all') },
    { value: 'in_stock', label: t('warehouse.inStock') },
    { value: 'low_stock', label: t('warehouse.lowStock') },
    { value: 'out_of_stock', label: t('warehouse.outOfStock') },
  ]

  const getStockStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      in_stock: t('warehouse.inStock'),
      low_stock: t('warehouse.lowStock'),
      out_of_stock: t('warehouse.outOfStock'),
    }
    return labels[status] || status
  }

  const columns: ColumnsType<WarehouseItem> = [
    {
      title: t('materials.materialName'),
      key: 'material',
      render: (_, record: WarehouseItem) => (
        <div>
          <div className={`${styles.materialName} ${isDark ? styles.dark : ''}`}>
            {record.material?.name || '-'}
          </div>
          <div className={styles.sku}>{record.material?.sku || '-'}</div>
        </div>
      ),
    },
    {
      title: 'Проект',
      key: 'project',
      width: 180,
      render: (_, record: WarehouseItem) => (
        <span>{record.project?.name || 'Центральный склад'}</span>
      ),
    },
    {
      title: 'Местоположение',
      dataIndex: 'warehouseLocation',
      key: 'warehouseLocation',
      width: 180,
    },
    {
      title: t('common.quantity'),
      key: 'quantity',
      width: 180,
      render: (_, record: WarehouseItem) => {
        const minStock = record.material?.minStock || 0
        const percentage = Math.min((record.quantity / (minStock * 2)) * 100, 100)
        const status = getStockStatus(record.quantity, minStock)

        return (
          <div className={styles.quantityCell}>
            <div className={styles.quantityHeader}>
              <span className={`${styles.quantityValue} ${isDark ? styles.dark : ''}`}>
                {formatNumber(record.quantity)} {record.material?.unit}
              </span>
              {status === 'low_stock' && (
                <WarningOutlined className={styles.warningIcon} />
              )}
            </div>
            <Progress
              percent={percentage}
              showInfo={false}
              strokeColor={status === 'low_stock' ? '#F59E0B' : status === 'out_of_stock' ? '#EF4444' : '#10B981'}
              trailColor={isDark ? '#374151' : '#E5E7EB'}
              size={['100%', 4]}
            />
            <div className={styles.stockInfo}>
              Мин: {formatNumber(minStock)} {record.material?.unit}
            </div>
          </div>
        )
      },
    },
    {
      title: t('warehouse.reserved'),
      key: 'reserved',
      width: 120,
      align: 'right',
      render: (_, record: WarehouseItem) => (
        <span className={styles.reserved}>
          {formatNumber(record.reservedQuantity)} {record.material?.unit}
        </span>
      ),
    },
    {
      title: t('warehouse.available'),
      key: 'available',
      width: 120,
      align: 'right',
      render: (_, record: WarehouseItem) => {
        const available = record.quantity - record.reservedQuantity
        return (
          <span className={`${styles.available} ${isDark ? styles.dark : ''}`}>
            {formatNumber(available)} {record.material?.unit}
          </span>
        )
      },
    },
    {
      title: t('common.status'),
      key: 'status',
      width: 130,
      align: 'center',
      render: (_, record: WarehouseItem) => {
        const minStock = record.material?.minStock || 0
        const status = getStockStatus(record.quantity, minStock)
        return (
          <StatusBadge
            status={status}
            label={getStockStatusLabel(status)}
          />
        )
      },
    },
    {
      title: 'Стоимость',
      key: 'value',
      width: 150,
      align: 'right',
      render: (_, record: WarehouseItem) => {
        const value = record.quantity * (record.material?.price || 0)
        return (
          <span className={`${styles.value} ${isDark ? styles.dark : ''}`}>
            {formatCurrency(value)}
          </span>
        )
      },
    },
  ]

  const totalValue = useMemo(() => {
    return filteredItems.reduce((sum, item) => {
      return sum + item.quantity * (item.material?.price || 0)
    }, 0)
  }, [filteredItems])

  // Modal handlers
  const handleReceipt = (values: ReceiptFormValues) => {
    console.log('Receipt:', values)
    setReceiptModalOpen(false)
  }

  const handleIssue = (values: IssueFormValues) => {
    console.log('Issue:', values)
    setIssueModalOpen(false)
  }

  const handleTransfer = (values: TransferFormValues) => {
    console.log('Transfer:', values)
    setTransferModalOpen(false)
  }

  const handleInventory = (values: InventoryFormValues) => {
    console.log('Inventory:', values)
    setInventoryModalOpen(false)
  }

  return (
    <PageContainer>
      <PageHeader
        title={t('warehouse.title')}
        subtitle={`${filteredItems.length} позиций на сумму ${formatCurrency(totalValue)}`}
        actions={
          <Space>
            <Button onClick={() => setReceiptModalOpen(true)}>
              {t('warehouse.receipt')}
            </Button>
            <Button onClick={() => setIssueModalOpen(true)}>
              {t('warehouse.issue')}
            </Button>
            <Button onClick={() => setTransferModalOpen(true)}>
              {t('warehouse.transfer')}
            </Button>
          </Space>
        }
        primaryAction={{
          label: t('warehouse.audit'),
          onClick: () => setInventoryModalOpen(true),
        }}
      />

      {/* Filters */}
      <Card className={`${styles.filtersCard} ${isDark ? styles.dark : ''}`}>
        <Space size={12} wrap>
          <Input
            placeholder={t('common.search')}
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
          <Select
            value={stockFilter}
            onChange={setStockFilter}
            style={{ width: 180 }}
            options={stockStatusOptions}
          />
        </Space>
      </Card>

      {/* Table */}
      <Card className={`${styles.tableCard} ${isDark ? styles.dark : ''}`}>
        <Table
          dataSource={filteredItems}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} из ${total}`,
          }}
          scroll={{ x: 1100 }}
        />
      </Card>

      {/* Modals */}
      <ReceiptModal
        open={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        onSubmit={handleReceipt}
      />
      <IssueModal
        open={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        onSubmit={handleIssue}
      />
      <TransferModal
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onSubmit={handleTransfer}
      />
      <InventoryModal
        open={inventoryModalOpen}
        onClose={() => setInventoryModalOpen(false)}
        onSubmit={handleInventory}
      />
    </PageContainer>
  )
}

export default Warehouse
