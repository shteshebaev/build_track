import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Tabs, Row, Col, Progress, Button, Descriptions, Space } from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer, StatCard, StatusBadge, EmptyState } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { formatCurrency, formatDate, formatPercent } from '@shared/lib'
import { mockProjects } from '@mocks'
import styles from './ProjectDetail.module.css'

export function ProjectDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isDark } = useThemeStore()

  const project = useMemo(
    () => mockProjects.find((p) => p.id === id),
    [id]
  )

  if (!project) {
    return (
      <PageContainer>
        <EmptyState
          title="Проект не найден"
          description="Запрашиваемый проект не существует"
          actionLabel="К списку проектов"
          onAction={() => navigate('/projects')}
        />
      </PageContainer>
    )
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planning: t('projects.status.planning'),
      in_progress: t('projects.status.inProgress'),
      on_hold: t('projects.status.onHold'),
      completed: t('projects.status.completed'),
      cancelled: t('projects.status.cancelled'),
    }
    return labels[status] || status
  }

  const budgetSpent = project.spent / project.budget * 100

  const tabItems = [
    {
      key: 'overview',
      label: t('projects.tabs.overview'),
      children: (
        <div className={styles.tabContent}>
          <Row gutter={[20, 20]}>
            <Col xs={24} md={16}>
              <Card className={`${styles.card} ${isDark ? styles.dark : ''}`}>
                <Descriptions
                  column={{ xs: 1, sm: 2 }}
                  labelStyle={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                  contentStyle={{ color: isDark ? '#f9fafb' : '#111827', fontWeight: 500 }}
                >
                  <Descriptions.Item label="Название">
                    {project.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Статус">
                    <StatusBadge
                      status={project.status}
                      label={getStatusLabel(project.status)}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Адрес" span={2}>
                    {project.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Дата начала">
                    {formatDate(project.startDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Дата окончания">
                    {formatDate(project.endDate)}
                  </Descriptions.Item>
                  {project.totalArea && (
                    <Descriptions.Item label="Общая площадь">
                      {project.totalArea.toLocaleString()} м²
                    </Descriptions.Item>
                  )}
                  {project.floors && (
                    <Descriptions.Item label="Этажей">
                      {project.floors}
                    </Descriptions.Item>
                  )}
                  {project.apartments && (
                    <Descriptions.Item label="Квартир">
                      {project.apartments}
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Описание" span={2}>
                    {project.description}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <div className={styles.statsColumn}>
                <StatCard
                  title="Прогресс"
                  value={`${project.progress}%`}
                  icon={
                    <Progress
                      type="circle"
                      percent={project.progress}
                      size={36}
                      strokeWidth={8}
                      strokeColor="#4F46E5"
                      trailColor={isDark ? '#374151' : '#E5E7EB'}
                      format={() => ''}
                    />
                  }
                />
                <StatCard
                  title="Бюджет"
                  value={formatCurrency(project.budget)}
                  icon={<DollarOutlined />}
                />
                <StatCard
                  title="Израсходовано"
                  value={formatCurrency(project.spent)}
                  suffix={`(${formatPercent(budgetSpent)})`}
                  icon={<DollarOutlined />}
                  trend={budgetSpent > 100 ? -5 : 0}
                />
              </div>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'construction',
      label: t('projects.tabs.construction'),
      children: (
        <EmptyState
          title="Этапы строительства"
          description="Здесь будет отображаться прогресс строительства"
        />
      ),
    },
    {
      key: 'estimates',
      label: t('projects.tabs.estimates'),
      children: (
        <EmptyState
          title="Сметы"
          description="Здесь будут отображаться сметы проекта"
        />
      ),
    },
    {
      key: 'warehouse',
      label: t('projects.tabs.warehouse'),
      children: (
        <EmptyState
          title="Склад"
          description="Здесь будут отображаться материалы на складе проекта"
        />
      ),
    },
    {
      key: 'requests',
      label: t('projects.tabs.requests'),
      children: (
        <EmptyState
          title="Заявки"
          description="Здесь будут отображаться заявки на материалы"
        />
      ),
    },
    {
      key: 'documents',
      label: t('projects.tabs.documents'),
      children: (
        <EmptyState
          title="Документы"
          description="Здесь будут отображаться документы проекта"
        />
      ),
    },
    {
      key: 'analytics',
      label: t('projects.tabs.analytics'),
      children: (
        <EmptyState
          title="Аналитика"
          description="Здесь будет отображаться аналитика проекта"
        />
      ),
    },
  ]

  return (
    <PageContainer>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/projects')}
            className={styles.backButton}
          />
          <div className={styles.headerInfo}>
            <div className={styles.titleRow}>
              <h1 className={`${styles.title} ${isDark ? styles.dark : ''}`}>
                {project.name}
              </h1>
              <StatusBadge
                status={project.status}
                label={getStatusLabel(project.status)}
              />
            </div>
            <Space size={16} className={styles.meta}>
              <span>
                <EnvironmentOutlined /> {project.location}
              </span>
              <span>
                <CalendarOutlined /> {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </Space>
          </div>
        </div>
        <Button type="primary" icon={<EditOutlined />}>
          Редактировать
        </Button>
      </div>

      {/* Cover Image */}
      {project.imageUrl && (
        <div
          className={styles.coverImage}
          style={{ backgroundImage: `url(${project.imageUrl})` }}
        />
      )}

      {/* Tabs */}
      <Tabs
        items={tabItems}
        className={styles.tabs}
        size="large"
      />
    </PageContainer>
  )
}

export default ProjectDetail
