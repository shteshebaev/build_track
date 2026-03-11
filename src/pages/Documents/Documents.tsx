import { useState } from 'react'
import { Card, Table, Button, Input, Space } from 'antd'
import { SearchOutlined, UploadOutlined, FolderOutlined, FileOutlined, FilePdfOutlined, FileExcelOutlined, FileWordOutlined, MoreOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { formatDate } from '@shared/lib'
import { UploadDocumentModal, type DocumentFormValues } from './components'

interface Document {
  id: string
  name: string
  type: 'pdf' | 'excel' | 'word' | 'folder'
  size?: string
  project?: string
  uploadedBy: string
  uploadedAt: string
}

const mockDocuments: Document[] = [
  { id: '1', name: 'Проектная документация', type: 'folder', project: 'ЖК "Солнечный"', uploadedBy: 'Иванов А.', uploadedAt: '2024-12-10' },
  { id: '2', name: 'Смета_v3.xlsx', type: 'excel', size: '2.4 MB', project: 'ЖК "Солнечный"', uploadedBy: 'Петрова М.', uploadedAt: '2024-12-12' },
  { id: '3', name: 'Договор_подряда.pdf', type: 'pdf', size: '1.8 MB', project: 'БЦ "Технопарк"', uploadedBy: 'Сидоров К.', uploadedAt: '2024-12-14' },
  { id: '4', name: 'Акт_выполненных_работ.docx', type: 'word', size: '540 KB', project: 'ЖК "Зелёный квартал"', uploadedBy: 'Козлов М.', uploadedAt: '2024-12-15' },
]

export function Documents() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()
  const [modalOpen, setModalOpen] = useState(false)

  const handleUploadDocument = (values: DocumentFormValues) => {
    console.log('Upload document:', values)
  }

  const getFileIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      folder: <FolderOutlined style={{ color: '#F59E0B', fontSize: 20 }} />,
      pdf: <FilePdfOutlined style={{ color: '#EF4444', fontSize: 20 }} />,
      excel: <FileExcelOutlined style={{ color: '#10B981', fontSize: 20 }} />,
      word: <FileWordOutlined style={{ color: '#3B82F6', fontSize: 20 }} />,
    }
    return icons[type] || <FileOutlined style={{ fontSize: 20 }} />
  }

  const columns: ColumnsType<Document> = [
    { title: 'Название', dataIndex: 'name', key: 'name', render: (name, record) => (
      <Space><span>{getFileIcon(record.type)}</span><span style={{ color: isDark ? '#f9fafb' : '#111827', fontWeight: 500 }}>{name}</span></Space>
    )},
    { title: 'Проект', dataIndex: 'project', key: 'project' },
    { title: 'Размер', dataIndex: 'size', key: 'size', render: (s) => s || '—' },
    { title: 'Загрузил', dataIndex: 'uploadedBy', key: 'uploadedBy' },
    { title: 'Дата', dataIndex: 'uploadedAt', key: 'uploadedAt', render: (d) => formatDate(d) },
    { title: '', key: 'actions', width: 50, render: () => <Button type="text" icon={<MoreOutlined />} /> },
  ]

  return (
    <PageContainer>
      <PageHeader title={t('navigation.documents')} primaryAction={{ label: 'Загрузить', icon: <UploadOutlined />, onClick: () => setModalOpen(true) }} />
      <Card style={{ borderRadius: 16, border: 'none', background: isDark ? '#1f2937' : '#fff' }}>
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder={t('common.search')} prefix={<SearchOutlined />} style={{ width: 280 }} allowClear />
        </Space>
        <Table dataSource={mockDocuments} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <UploadDocumentModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleUploadDocument} />
    </PageContainer>
  )
}

export default Documents
