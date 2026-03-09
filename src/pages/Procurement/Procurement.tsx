import { Table, Card } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader, StatusBadge } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { formatDate, formatCurrency } from '@shared/lib'

interface Order {
  id: string
  orderNumber: string
  supplier: string
  orderDate: string
  deliveryDate: string
  totalAmount: number
  status: string
}

const mockOrders: Order[] = [
  { id: '1', orderNumber: 'PO-001234', supplier: 'СтройМатериалы', orderDate: '2024-12-10', deliveryDate: '2024-12-18', totalAmount: 15000000, status: 'confirmed' },
  { id: '2', orderNumber: 'PO-001235', supplier: 'МеталлТорг', orderDate: '2024-12-12', deliveryDate: '2024-12-20', totalAmount: 28000000, status: 'shipped' },
  { id: '3', orderNumber: 'PO-001236', supplier: 'ЭлектроСнаб', orderDate: '2024-12-14', deliveryDate: '2024-12-22', totalAmount: 8500000, status: 'sent' },
]

export function Procurement() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = { draft: 'Черновик', sent: 'Отправлен', confirmed: 'Подтверждён', shipped: 'Отгружен', delivered: 'Доставлен' }
    return labels[status] || status
  }

  const columns: ColumnsType<Order> = [
    { title: t('procurement.orderNumber'), dataIndex: 'orderNumber', key: 'orderNumber', width: 140 },
    { title: t('procurement.supplier'), dataIndex: 'supplier', key: 'supplier' },
    { title: t('procurement.orderDate'), dataIndex: 'orderDate', key: 'orderDate', render: (d) => formatDate(d) },
    { title: t('procurement.deliveryDate'), dataIndex: 'deliveryDate', key: 'deliveryDate', render: (d) => formatDate(d) },
    { title: t('procurement.totalAmount'), dataIndex: 'totalAmount', key: 'totalAmount', render: (v) => formatCurrency(v), align: 'right' },
    { title: t('common.status'), dataIndex: 'status', key: 'status', render: (s) => <StatusBadge status={s} label={getStatusLabel(s)} /> },
  ]

  return (
    <PageContainer>
      <PageHeader title={t('procurement.title')} primaryAction={{ label: t('procurement.newOrder'), onClick: () => {} }} />
      <Card style={{ borderRadius: 16, border: 'none', background: isDark ? '#1f2937' : '#fff' }}>
        <Table dataSource={mockOrders} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </PageContainer>
  )
}

export default Procurement
