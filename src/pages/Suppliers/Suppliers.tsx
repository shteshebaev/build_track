import { useState } from 'react'
import { Table, Card, Button, Rate } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { CreateSupplierModal, type SupplierFormValues } from './components'

interface Supplier {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  rating: number
}

const mockSuppliers: Supplier[] = [
  { id: '1', name: 'СтройМатериалы ООО', contactPerson: 'Иванов Пётр', phone: '+998 90 123 45 67', email: 'info@stroymat.uz', rating: 4.5 },
  { id: '2', name: 'МеталлТорг', contactPerson: 'Смирнова Анна', phone: '+998 91 234 56 78', email: 'sales@metaltorg.uz', rating: 4.8 },
  { id: '3', name: 'ЭлектроСнаб', contactPerson: 'Козлов Сергей', phone: '+998 93 345 67 89', email: 'order@electrosnab.uz', rating: 4.2 },
]

export function Suppliers() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()
  const [modalOpen, setModalOpen] = useState(false)

  const handleCreateSupplier = (values: SupplierFormValues) => {
    console.log('New supplier:', values)
  }

  const columns: ColumnsType<Supplier> = [
    { title: t('suppliers.companyName'), dataIndex: 'name', key: 'name' },
    { title: t('suppliers.contactPerson'), dataIndex: 'contactPerson', key: 'contactPerson' },
    { title: t('suppliers.phone'), dataIndex: 'phone', key: 'phone' },
    { title: t('suppliers.email'), dataIndex: 'email', key: 'email' },
    { title: t('suppliers.rating'), dataIndex: 'rating', key: 'rating', render: (r) => <Rate disabled defaultValue={r} allowHalf style={{ fontSize: 14 }} /> },
    { title: t('common.actions'), key: 'actions', render: () => <Button type="link" size="small">{t('common.view')}</Button> },
  ]

  return (
    <PageContainer>
      <PageHeader title={t('suppliers.title')} primaryAction={{ label: t('suppliers.newSupplier'), onClick: () => setModalOpen(true) }} />
      <Card style={{ borderRadius: 16, border: 'none', background: isDark ? '#1f2937' : '#fff' }}>
        <Table dataSource={mockSuppliers} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <CreateSupplierModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreateSupplier} />
    </PageContainer>
  )
}

export default Suppliers
