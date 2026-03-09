import { useState } from 'react'
import { Card, Table, Button, Input, Space, Progress, Tag } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { formatCurrency, formatDate } from '@shared/lib'
import { CreateEstimateModal, type EstimateFormValues } from './components'

interface Estimate {
  id: string
  name: string
  project: string
  totalBudget: number
  spent: number
  status: string
  createdAt: string
}

const mockEstimates: Estimate[] = [
  { id: '1', name: 'Смета на общестроительные работы', project: 'ЖК "Солнечный"', totalBudget: 5000000000, spent: 3200000000, status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: 'Смета на электромонтаж', project: 'ЖК "Солнечный"', totalBudget: 800000000, spent: 450000000, status: 'active', createdAt: '2024-02-10' },
  { id: '3', name: 'Смета на фундамент', project: 'БЦ "Технопарк"', totalBudget: 2500000000, spent: 2500000000, status: 'completed', createdAt: '2024-03-01' },
  { id: '4', name: 'Смета на отделочные работы', project: 'ЖК "Зелёный квартал"', totalBudget: 1200000000, spent: 100000000, status: 'draft', createdAt: '2024-12-01' },
]

export function Estimates() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const handleCreateEstimate = (values: EstimateFormValues) => {
    console.log('Creating estimate:', values)
    // Here you would typically make an API call to create the estimate
    setCreateModalOpen(false)
  }

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      draft: { color: 'default', label: 'Черновик' },
      active: { color: 'processing', label: 'Активная' },
      completed: { color: 'success', label: 'Завершена' },
    }
    const { color, label } = config[status] || { color: 'default', label: status }
    return <Tag color={color}>{label}</Tag>
  }

  const columns: ColumnsType<Estimate> = [
    { title: 'Название', dataIndex: 'name', key: 'name', render: (n) => <span style={{ fontWeight: 500, color: isDark ? '#f9fafb' : '#111827' }}>{n}</span> },
    { title: 'Проект', dataIndex: 'project', key: 'project' },
    { title: 'Бюджет', dataIndex: 'totalBudget', key: 'totalBudget', render: (v) => formatCurrency(v), align: 'right' },
    { title: 'Израсходовано', key: 'spent', render: (_, r) => (
      <div style={{ minWidth: 150 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
          <span>{formatCurrency(r.spent)}</span>
          <span>{((r.spent / r.totalBudget) * 100).toFixed(0)}%</span>
        </div>
        <Progress percent={(r.spent / r.totalBudget) * 100} showInfo={false} size="small" strokeColor={r.spent > r.totalBudget ? '#EF4444' : '#4F46E5'} />
      </div>
    )},
    { title: 'Статус', dataIndex: 'status', key: 'status', render: (s) => getStatusTag(s) },
    { title: 'Создана', dataIndex: 'createdAt', key: 'createdAt', render: (d) => formatDate(d) },
    { title: '', key: 'actions', render: () => <Button type="link" size="small">{t('common.view')}</Button> },
  ]

  return (
    <PageContainer>
      <PageHeader title={t('navigation.estimates')} primaryAction={{ label: 'Новая смета', onClick: () => setCreateModalOpen(true) }} />
      <Card style={{ borderRadius: 16, border: 'none', background: isDark ? '#1f2937' : '#fff' }}>
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder={t('common.search')} prefix={<SearchOutlined />} style={{ width: 280 }} allowClear />
        </Space>
        <Table dataSource={mockEstimates} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      {/* Create Estimate Modal */}
      <CreateEstimateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateEstimate}
      />
    </PageContainer>
  )
}

export default Estimates
