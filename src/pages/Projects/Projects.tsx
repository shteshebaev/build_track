import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Input, Select, Progress, Button, Space, Segmented } from 'antd'
import {
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader, StatusBadge } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { formatCurrency, formatDate } from '@shared/lib'
import { mockProjects } from '@mocks'
import type { ProjectStatus } from '@shared/types'
import styles from './Projects.module.css'

export function Projects() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isDark } = useThemeStore()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const statusOptions = [
    { value: 'all', label: t('common.all') },
    { value: 'planning', label: t('projects.status.planning') },
    { value: 'in_progress', label: t('projects.status.inProgress') },
    { value: 'on_hold', label: t('projects.status.onHold') },
    { value: 'completed', label: t('projects.status.completed') },
    { value: 'cancelled', label: t('projects.status.cancelled') },
  ]

  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.location.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' || project.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const getStatusLabel = (status: ProjectStatus) => {
    const labels: Record<ProjectStatus, string> = {
      planning: t('projects.status.planning'),
      in_progress: t('projects.status.inProgress'),
      on_hold: t('projects.status.onHold'),
      completed: t('projects.status.completed'),
      cancelled: t('projects.status.cancelled'),
    }
    return labels[status]
  }

  const handleProjectClick = (id: string) => {
    navigate(`/projects/${id}`)
  }

  return (
    <PageContainer>
      <PageHeader
        title={t('projects.title')}
        subtitle={`${filteredProjects.length} ${t('projects.allProjects').toLowerCase()}`}
        primaryAction={{
          label: t('projects.newProject'),
          onClick: () => console.log('Create project'),
        }}
      />

      {/* Filters */}
      <div className={`${styles.filters} ${isDark ? styles.dark : ''}`}>
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
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            style={{ width: 180 }}
          />
        </Space>
        <Segmented
          value={viewMode}
          onChange={(value) => setViewMode(value as 'grid' | 'list')}
          options={[
            { value: 'grid', icon: <AppstoreOutlined /> },
            { value: 'list', icon: <UnorderedListOutlined /> },
          ]}
        />
      </div>

      {/* Projects Grid */}
      <Row gutter={[20, 20]}>
        {filteredProjects.map((project) => (
          <Col
            key={project.id}
            xs={24}
            sm={viewMode === 'grid' ? 12 : 24}
            lg={viewMode === 'grid' ? 8 : 24}
            xl={viewMode === 'grid' ? 6 : 24}
          >
            <Card
              className={`${styles.projectCard} ${isDark ? styles.dark : styles.light}`}
              hoverable
              onClick={() => handleProjectClick(project.id)}
              cover={
                viewMode === 'grid' && project.imageUrl ? (
                  <div
                    className={styles.projectImage}
                    style={{ backgroundImage: `url(${project.imageUrl})` }}
                  />
                ) : null
              }
            >
              <div className={viewMode === 'list' ? styles.listContent : ''}>
                {viewMode === 'list' && project.imageUrl && (
                  <div
                    className={styles.listImage}
                    style={{ backgroundImage: `url(${project.imageUrl})` }}
                  />
                )}
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.projectName}>{project.name}</h3>
                    <StatusBadge
                      status={project.status}
                      label={getStatusLabel(project.status)}
                    />
                  </div>

                  <p className={styles.projectLocation}>
                    <EnvironmentOutlined /> {project.location}
                  </p>

                  <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                      <span>{t('projects.progress')}</span>
                      <span className={styles.progressValue}>{project.progress}%</span>
                    </div>
                    <Progress
                      percent={project.progress}
                      showInfo={false}
                      strokeColor={{
                        '0%': '#4F46E5',
                        '100%': '#7C3AED',
                      }}
                      trailColor={isDark ? '#374151' : '#E5E7EB'}
                      size={['100%', 6]}
                    />
                  </div>

                  <div className={styles.projectMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>{t('projects.budget')}</span>
                      <span className={styles.metaValue}>
                        {formatCurrency(project.budget)}
                      </span>
                    </div>
                    {project.apartments && (
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Квартир</span>
                        <span className={styles.metaValue}>{project.apartments}</span>
                      </div>
                    )}
                    {project.floors && (
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Этажей</span>
                        <span className={styles.metaValue}>{project.floors}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.dateLabel}>
                      Обновлено: {formatDate(project.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  )
}

export default Projects
