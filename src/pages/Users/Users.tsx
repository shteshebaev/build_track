import { useState } from 'react'
import { Card, Table, Button, Input, Space, Avatar, Tag } from 'antd'
import { SearchOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { CreateUserModal, type UserFormValues } from './components'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
}

const mockUsers: User[] = [
  { id: '1', firstName: 'Иван', lastName: 'Петров', email: 'ivan@buildtrack.uz', role: 'admin', isActive: true },
  { id: '2', firstName: 'Мария', lastName: 'Сидорова', email: 'maria@buildtrack.uz', role: 'manager', isActive: true },
  { id: '3', firstName: 'Алексей', lastName: 'Козлов', email: 'alexey@buildtrack.uz', role: 'warehouse_keeper', isActive: true },
  { id: '4', firstName: 'Анна', lastName: 'Волкова', email: 'anna@buildtrack.uz', role: 'accountant', isActive: false },
]

export function Users() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()
  const [modalOpen, setModalOpen] = useState(false)

  const handleCreateUser = (values: UserFormValues) => {
    console.log('New user:', values)
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Администратор',
      manager: 'Менеджер',
      warehouse_keeper: 'Кладовщик',
      accountant: 'Бухгалтер',
      viewer: 'Наблюдатель',
    }
    return labels[role] || role
  }

  const columns: ColumnsType<User> = [
    { title: 'Пользователь', key: 'user', render: (_, r) => (
      <Space>
        <Avatar style={{ backgroundColor: '#4f46e5' }} icon={<UserOutlined />} />
        <div>
          <div style={{ fontWeight: 500, color: isDark ? '#f9fafb' : '#111827' }}>{r.firstName} {r.lastName}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{r.email}</div>
        </div>
      </Space>
    )},
    { title: 'Роль', dataIndex: 'role', key: 'role', render: (r) => <Tag>{getRoleLabel(r)}</Tag> },
    { title: 'Статус', dataIndex: 'isActive', key: 'isActive', render: (a) => <Tag color={a ? 'success' : 'default'}>{a ? 'Активен' : 'Неактивен'}</Tag> },
    { title: '', key: 'actions', render: () => <Button type="link" size="small">{t('common.edit')}</Button> },
  ]

  return (
    <PageContainer>
      <PageHeader title={t('navigation.users')} primaryAction={{ label: 'Добавить', icon: <UserAddOutlined />, onClick: () => setModalOpen(true) }} />
      <Card style={{ borderRadius: 16, border: 'none', background: isDark ? '#1f2937' : '#fff' }}>
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder={t('common.search')} prefix={<SearchOutlined />} style={{ width: 280 }} allowClear />
        </Space>
        <Table dataSource={mockUsers} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <CreateUserModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreateUser} />
    </PageContainer>
  )
}

export default Users
