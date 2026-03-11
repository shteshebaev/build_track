import { useState } from 'react'
import { Table, Tag, Button, Row, Col, Input, Select, Tooltip, Space, Dropdown } from 'antd'
import {
  SearchOutlined,
  FolderOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileImageOutlined,
  FileZipOutlined,
  FileUnknownOutlined,
  DownloadOutlined,
  EyeOutlined,
  MoreOutlined,
  UploadOutlined,
  ProjectOutlined,
  SafetyCertificateOutlined,
  AuditOutlined,
  CompassOutlined,
  CameraOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleFilled,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { MenuProps } from 'antd'
import { useThemeStore } from '@shared/store'
import { formatDate } from '@shared/lib'
import {
  mockProjectDocuments,
  mockDocumentFolders,
  type ProjectDocument,
  type DocumentFolder,
} from '@mocks/projectDocuments'
import styles from './DocumentsTab.module.css'

interface DocumentsTabProps {
  projectId: string
}

export function DocumentsTab({ projectId }: DocumentsTabProps) {
  const { isDark } = useThemeStore()
  const [searchText, setSearchText] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  const documents = mockProjectDocuments
  const folders = mockDocumentFolders

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchText.toLowerCase())
    const matchesFolder = selectedFolder === 'all' || doc.category === selectedFolder
    const matchesType = selectedType === 'all' || doc.type === selectedType
    return matchesSearch && matchesFolder && matchesType
  })

  const totalDocuments = documents.length
  const totalSize = documents.reduce((acc, doc) => acc + doc.size, 0)
  const approvedDocs = documents.filter(d => d.status === 'approved').length

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' ГБ'
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' МБ'
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' КБ'
    return bytes + ' Б'
  }

  const getFileIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      pdf: <FilePdfOutlined style={{ color: '#EF4444' }} />,
      doc: <FileWordOutlined style={{ color: '#3B82F6' }} />,
      xls: <FileExcelOutlined style={{ color: '#10B981' }} />,
      dwg: <CompassOutlined style={{ color: '#8B5CF6' }} />,
      img: <FileImageOutlined style={{ color: '#F59E0B' }} />,
      zip: <FileZipOutlined style={{ color: '#6B7280' }} />,
      other: <FileUnknownOutlined style={{ color: '#9CA3AF' }} />,
    }
    return icons[type] || icons.other
  }

  const getFolderIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      project: <ProjectOutlined />,
      safety: <SafetyCertificateOutlined />,
      'file-text': <FileTextOutlined />,
      audit: <AuditOutlined />,
      compass: <CompassOutlined />,
      camera: <CameraOutlined />,
    }
    return icons[icon] || <FolderOutlined />
  }

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      approved: { color: 'success', label: 'Утверждён' },
      active: { color: 'processing', label: 'Актуальный' },
      draft: { color: 'default', label: 'Черновик' },
      archived: { color: 'warning', label: 'Архив' },
    }
    const { color, label } = config[status] || config.active
    return <Tag color={color}>{label}</Tag>
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pdf: 'PDF',
      doc: 'Word',
      xls: 'Excel',
      dwg: 'AutoCAD',
      img: 'Изображение',
      zip: 'Архив',
      other: 'Другое',
    }
    return labels[type] || type.toUpperCase()
  }

  const actionMenuItems: MenuProps['items'] = [
    { key: 'view', icon: <EyeOutlined />, label: 'Просмотр' },
    { key: 'download', icon: <DownloadOutlined />, label: 'Скачать' },
    { type: 'divider' },
    { key: 'history', icon: <ClockCircleOutlined />, label: 'История версий' },
  ]

  const columns: ColumnsType<ProjectDocument> = [
    {
      title: 'Документ',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className={styles.docName}>
          <div className={styles.docIcon}>{getFileIcon(record.type)}</div>
          <div className={styles.docInfo}>
            <span className={styles.docTitle}>{name}</span>
            {record.description && (
              <span className={styles.docDescription}>{record.description}</span>
            )}
            {record.tags && record.tags.length > 0 && (
              <div className={styles.docTags}>
                {record.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className={styles.docTag}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <span className={styles.typeLabel}>{getTypeLabel(type)}</span>
      ),
    },
    {
      title: 'Размер',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size) => (
        <span className={styles.fileSize}>{formatFileSize(size)}</span>
      ),
    },
    {
      title: 'Версия',
      dataIndex: 'version',
      key: 'version',
      width: 80,
      align: 'center',
      render: (version) => (
        <span className={styles.version}>v{version}</span>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Загружен',
      key: 'uploaded',
      width: 150,
      render: (_, record) => (
        <div className={styles.uploadInfo}>
          <span className={styles.uploadDate}>{formatDate(record.uploadedAt)}</span>
          <span className={styles.uploadBy}>{record.uploadedBy}</span>
        </div>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: () => (
        <Space>
          <Tooltip title="Скачать">
            <Button type="text" icon={<DownloadOutlined />} size="small" />
          </Tooltip>
          <Dropdown menu={{ items: actionMenuItems }} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ]

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
              <span className={styles.summaryValue}>{totalDocuments}</span>
              <span className={styles.summaryLabel}>Всего документов</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <CheckCircleFilled style={{ color: '#10B981', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <span className={styles.summaryValue}>{approvedDocs}</span>
              <span className={styles.summaryLabel}>Утверждено</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <FolderOutlined style={{ color: '#3B82F6', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <span className={styles.summaryValue}>{folders.length}</span>
              <span className={styles.summaryLabel}>Категорий</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <FileZipOutlined style={{ color: '#F59E0B', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <span className={styles.summaryValue}>{formatFileSize(totalSize)}</span>
              <span className={styles.summaryLabel}>Общий размер</span>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Folders Sidebar */}
        <Col xs={24} lg={6}>
          <div className={`${styles.foldersCard} ${isDark ? styles.dark : ''}`}>
            <h3 className={styles.foldersTitle}>Категории</h3>
            <div className={styles.foldersList}>
              <div
                className={`${styles.folderItem} ${selectedFolder === 'all' ? styles.active : ''}`}
                onClick={() => setSelectedFolder('all')}
              >
                <div className={styles.folderIcon}>
                  <FolderOutlined />
                </div>
                <div className={styles.folderInfo}>
                  <span className={styles.folderName}>Все документы</span>
                  <span className={styles.folderCount}>{totalDocuments}</span>
                </div>
              </div>
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={`${styles.folderItem} ${selectedFolder === folder.name ? styles.active : ''}`}
                  onClick={() => setSelectedFolder(folder.name)}
                >
                  <div className={styles.folderIcon}>
                    {getFolderIcon(folder.icon)}
                  </div>
                  <div className={styles.folderInfo}>
                    <span className={styles.folderName}>{folder.name}</span>
                    <span className={styles.folderCount}>{folder.documentsCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Documents Table */}
        <Col xs={24} lg={18}>
          <div className={`${styles.tableCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>
                {selectedFolder === 'all' ? 'Все документы' : selectedFolder}
              </h2>
              <div className={styles.tableActions}>
                <Input
                  placeholder="Поиск документов..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 220 }}
                />
                <Select
                  value={selectedType}
                  onChange={setSelectedType}
                  style={{ width: 140 }}
                  options={[
                    { value: 'all', label: 'Все типы' },
                    { value: 'pdf', label: 'PDF' },
                    { value: 'doc', label: 'Word' },
                    { value: 'xls', label: 'Excel' },
                    { value: 'dwg', label: 'AutoCAD' },
                    { value: 'zip', label: 'Архивы' },
                  ]}
                />
                <Button type="primary" icon={<UploadOutlined />}>
                  Загрузить
                </Button>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={filteredDocuments}
              rowKey="id"
              pagination={{ pageSize: 10, showSizeChanger: false }}
              className={`${styles.documentsTable} ${isDark ? styles.dark : ''}`}
              size="middle"
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}
