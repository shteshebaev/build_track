import { useState, useMemo } from 'react'
import { Table, Input, Select, Button, Space, Card, Tag } from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { formatCurrency } from '@shared/lib'
import { mockMaterials, materialCategories } from '@mocks'
import type { Material, MaterialCategory } from '@shared/types'
import styles from './Materials.module.css'

export function Materials() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<MaterialCategory | 'all'>('all')

  const filteredMaterials = useMemo(() => {
    return mockMaterials.filter((material) => {
      const matchesSearch =
        material.name.toLowerCase().includes(search.toLowerCase()) ||
        material.sku.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        categoryFilter === 'all' || material.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [search, categoryFilter])

  const getCategoryLabel = (category: MaterialCategory): string => {
    return materialCategories.find((c) => c.value === category)?.label || category
  }

  const getCategoryColor = (category: MaterialCategory): string => {
    const colors: Record<MaterialCategory, string> = {
      concrete: 'blue',
      metal: 'purple',
      brick: 'orange',
      wood: 'green',
      electrical: 'yellow',
      plumbing: 'cyan',
      finishing: 'magenta',
      insulation: 'lime',
      other: 'default',
    }
    return colors[category]
  }

  const columns: ColumnsType<Material> = [
    {
      title: 'Артикул',
      dataIndex: 'sku',
      key: 'sku',
      width: 140,
      sorter: (a, b) => a.sku.localeCompare(b.sku),
      render: (sku: string) => (
        <span className={styles.sku}>{sku}</span>
      ),
    },
    {
      title: t('materials.materialName'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record: Material) => (
        <div>
          <div className={`${styles.materialName} ${isDark ? styles.dark : ''}`}>
            {name}
          </div>
          {record.description && (
            <div className={styles.materialDescription}>{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: t('materials.category'),
      dataIndex: 'category',
      key: 'category',
      width: 140,
      filters: materialCategories.map((c) => ({ text: c.label, value: c.value })),
      onFilter: (value, record) => record.category === value,
      render: (category: MaterialCategory) => (
        <Tag color={getCategoryColor(category)} style={{ borderRadius: 6 }}>
          {getCategoryLabel(category)}
        </Tag>
      ),
    },
    {
      title: t('materials.unit'),
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
      align: 'center',
    },
    {
      title: t('materials.price'),
      dataIndex: 'price',
      key: 'price',
      width: 150,
      align: 'right',
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => (
        <span className={`${styles.price} ${isDark ? styles.dark : ''}`}>
          {formatCurrency(price)}
        </span>
      ),
    },
    {
      title: t('materials.minStock'),
      dataIndex: 'minStock',
      key: 'minStock',
      width: 120,
      align: 'right',
      render: (minStock: number, record: Material) => (
        <span>{minStock.toLocaleString()} {record.unit}</span>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 100,
      align: 'center',
      render: () => (
        <Button type="link" size="small">
          {t('common.view')}
        </Button>
      ),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title={t('materials.catalog')}
        subtitle={`${filteredMaterials.length} материалов`}
        primaryAction={{
          label: t('materials.newMaterial'),
          onClick: () => console.log('Create material'),
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
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: 180 }}
            options={[
              { value: 'all', label: t('common.all') },
              ...materialCategories.map((c) => ({
                value: c.value,
                label: c.label,
              })),
            ]}
          />
          <Button icon={<FilterOutlined />}>
            {t('common.filters')}
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Card className={`${styles.tableCard} ${isDark ? styles.dark : ''}`}>
        <Table
          dataSource={filteredMaterials}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} из ${total}`,
          }}
          scroll={{ x: 900 }}
        />
      </Card>
    </PageContainer>
  )
}

export default Materials
