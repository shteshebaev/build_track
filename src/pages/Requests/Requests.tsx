import { useState } from 'react'
import { Table, Card, Button, Space, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader, StatusBadge } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { formatDate } from '@shared/lib'
import styles from './Requests.module.css'

interface Request {
  id: string
  requestNumber: string
  projectName: string
  requestedBy: string
  requestDate: string
  requiredDate: string
  status: string
  itemsCount: number
}

const mockRequests: Request[] = [
  { id: '1', requestNumber: 'REQ-001234', projectName: 'ЖК "Солнечный"', requestedBy: 'Алексей Иванов', requestDate: '2024-12-15', requiredDate: '2024-12-20', status: 'pending', itemsCount: 5 },
  { id: '2', requestNumber: 'REQ-001235', projectName: 'БЦ "Технопарк"', requestedBy: 'Мария Петрова', requestDate: '2024-12-14', requiredDate: '2024-12-18', status: 'approved', itemsCount: 3 },
  { id: '3', requestNumber: 'REQ-001236', projectName: 'ЖК "Зелёный квартал"', requestedBy: 'Сергей Козлов', requestDate: '2024-12-13', requiredDate: '2024-12-17', status: 'in_delivery', itemsCount: 8 },
  { id: '4', requestNumber: 'REQ-001237', projectName: 'ТЦ "Мега Молл"', requestedBy: 'Анна Смирнова', requestDate: '2024-12-12', requiredDate: '2024-12-16', status: 'completed', itemsCount: 2 },
  { id: '5', requestNumber: 'REQ-001238', projectName: 'ЖК "Солнечный"', requestedBy: 'Дмитрий Волков', requestDate: '2024-12-11', requiredDate: '2024-12-15', status: 'rejected', itemsCount: 4 },
]

export function Requests() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()
  const [search, setSearch] = useState('')

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: t('requests.status.draft'),
      pending: t('requests.status.pending'),
      approved: t('requests.status.approved'),
      rejected: t('requests.status.rejected'),
      in_delivery: t('requests.status.inDelivery'),
      completed: t('requests.status.completed'),
    }
    return labels[status] || status
  }

  const columns: ColumnsType<Request> = [
    { title: t('requests.requestNumber'), dataIndex: 'requestNumber', key: 'requestNumber', width: 140 },
    { title: 'Проект', dataIndex: 'projectName', key: 'projectName' },
    { title: t('requests.requestedBy'), dataIndex: 'requestedBy', key: 'requestedBy' },
    { title: t('requests.requestDate'), dataIndex: 'requestDate', key: 'requestDate', width: 120, render: (date) => formatDate(date) },
    { title: t('requests.requiredDate'), dataIndex: 'requiredDate', key: 'requiredDate', width: 120, render: (date) => formatDate(date) },
    { title: 'Позиций', dataIndex: 'itemsCount', key: 'itemsCount', width: 100, align: 'center' },
    { title: t('common.status'), dataIndex: 'status', key: 'status', width: 140, render: (status) => <StatusBadge status={status} label={getStatusLabel(status)} /> },
    { title: t('common.actions'), key: 'actions', width: 100, render: () => <Button type="link" size="small">{t('common.view')}</Button> },
  ]

  return (
    <PageContainer>
      <PageHeader
        title={t('requests.title')}
        subtitle={`${mockRequests.length} заявок`}
        primaryAction={{ label: t('requests.newRequest'), onClick: () => console.log('New request') }}
      />
      <Card className={`${styles.card} ${isDark ? styles.dark : ''}`}>
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder={t('common.search')} prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 280 }} allowClear />
        </Space>
        <Table dataSource={mockRequests} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 900 }} />
      </Card>
    </PageContainer>
  )
}

export default Requests
