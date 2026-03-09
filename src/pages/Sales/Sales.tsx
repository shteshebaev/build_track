import { Card, Row, Col, Table, Tag, Statistic, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader, StatCard } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { formatCurrency } from '@shared/lib'
import { DollarOutlined, HomeOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons'

const mockApartments = [
  { id: '1', number: '1-101', floor: 1, rooms: 2, area: 65, price: 850000000, status: 'available' },
  { id: '2', number: '1-102', floor: 1, rooms: 3, area: 85, price: 1100000000, status: 'reserved' },
  { id: '3', number: '1-201', floor: 2, rooms: 2, area: 68, price: 900000000, status: 'sold' },
  { id: '4', number: '1-202', floor: 2, rooms: 4, area: 120, price: 1500000000, status: 'available' },
]

export function Sales() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = { available: 'success', reserved: 'warning', sold: 'default' }
    return colors[status]
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = { available: 'Свободна', reserved: 'Забронирована', sold: 'Продана' }
    return labels[status]
  }

  const columns = [
    { title: '№ Квартиры', dataIndex: 'number', key: 'number' },
    { title: 'Этаж', dataIndex: 'floor', key: 'floor', align: 'center' as const },
    { title: 'Комнат', dataIndex: 'rooms', key: 'rooms', align: 'center' as const },
    { title: 'Площадь', dataIndex: 'area', key: 'area', render: (v: number) => `${v} м²` },
    { title: 'Цена', dataIndex: 'price', key: 'price', render: (v: number) => formatCurrency(v), align: 'right' as const },
    { title: 'Статус', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={getStatusColor(s)}>{getStatusLabel(s)}</Tag> },
  ]

  return (
    <PageContainer>
      <PageHeader title={t('sales.title')} />

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Всего квартир" value={256} icon={<HomeOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Продано" value={145} icon={<FileTextOutlined />} trend={12.5} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Забронировано" value={28} icon={<UserOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Выручка" value={formatCurrency(125000000000)} icon={<DollarOutlined />} trend={18.2} />
        </Col>
      </Row>

      <Card style={{ borderRadius: 16, border: 'none', background: isDark ? '#1f2937' : '#fff' }}>
        <Table dataSource={mockApartments} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </PageContainer>
  )
}

export default Sales
