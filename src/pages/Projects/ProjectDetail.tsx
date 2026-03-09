import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tabs, Row, Col, Progress, Button, Tooltip } from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  HomeOutlined,
  BuildOutlined,
  ExpandAltOutlined,
  TeamOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  LineChartOutlined,
  FolderOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer, StatusBadge, EmptyState } from '@shared/ui'
import { useThemeStore, useCurrencyStore, formatCurrencyCompact } from '@shared/store'
import { formatDate } from '@shared/lib'
import { mockProjects } from '@mocks'
import styles from './ProjectDetail.module.css'

export function ProjectDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isDark } = useThemeStore()
  const { unit } = useCurrencyStore()

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

  const formatValue = (value: number) => {
    const { formatted, suffix, fullValue } = formatCurrencyCompact(value, unit)
    return { display: formatted + suffix, full: fullValue }
  }

  const budgetValue = formatValue(project.budget)
  const spentValue = formatValue(project.spent)
  const budgetPercent = Math.round((project.spent / project.budget) * 100)

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span className={styles.tabLabel}>
          <AppstoreOutlined />
          {t('projects.tabs.overview')}
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          <Row gutter={[24, 24]}>
            {/* Left Column - Project Info */}
            <Col xs={24} lg={16}>
              {/* Quick Stats Row */}
              <div className={styles.quickStats}>
                {project.totalArea && (
                  <div className={`${styles.quickStatItem} ${isDark ? styles.dark : ''}`}>
                    <ExpandAltOutlined className={styles.quickStatIcon} />
                    <div className={styles.quickStatContent}>
                      <span className={styles.quickStatValue}>
                        {project.totalArea.toLocaleString()} м²
                      </span>
                      <span className={styles.quickStatLabel}>Площадь</span>
                    </div>
                  </div>
                )}
                {project.floors && (
                  <div className={`${styles.quickStatItem} ${isDark ? styles.dark : ''}`}>
                    <BuildOutlined className={styles.quickStatIcon} />
                    <div className={styles.quickStatContent}>
                      <span className={styles.quickStatValue}>{project.floors}</span>
                      <span className={styles.quickStatLabel}>Этажей</span>
                    </div>
                  </div>
                )}
                {project.apartments && (
                  <div className={`${styles.quickStatItem} ${isDark ? styles.dark : ''}`}>
                    <HomeOutlined className={styles.quickStatIcon} />
                    <div className={styles.quickStatContent}>
                      <span className={styles.quickStatValue}>{project.apartments}</span>
                      <span className={styles.quickStatLabel}>Квартир</span>
                    </div>
                  </div>
                )}
                <div className={`${styles.quickStatItem} ${isDark ? styles.dark : ''}`}>
                  <TeamOutlined className={styles.quickStatIcon} />
                  <div className={styles.quickStatContent}>
                    <span className={styles.quickStatValue}>24</span>
                    <span className={styles.quickStatLabel}>Сотрудников</span>
                  </div>
                </div>
              </div>

              {/* Description Card */}
              <div className={`${styles.infoCard} ${isDark ? styles.dark : ''}`}>
                <h3 className={styles.infoCardTitle}>О проекте</h3>
                <p className={styles.infoCardText}>{project.description}</p>
              </div>

              {/* Timeline */}
              <div className={`${styles.infoCard} ${isDark ? styles.dark : ''}`}>
                <h3 className={styles.infoCardTitle}>Сроки проекта</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={`${styles.timelineDot} ${styles.active}`} />
                    <div className={styles.timelineContent}>
                      <span className={styles.timelineLabel}>Начало</span>
                      <span className={styles.timelineValue}>{formatDate(project.startDate, 'long')}</span>
                    </div>
                  </div>
                  <div className={styles.timelineLine}>
                    <div
                      className={styles.timelineProgress}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={`${styles.timelineDot} ${project.progress === 100 ? styles.active : ''}`} />
                    <div className={styles.timelineContent}>
                      <span className={styles.timelineLabel}>Завершение</span>
                      <span className={styles.timelineValue}>{formatDate(project.endDate, 'long')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className={`${styles.infoCard} ${isDark ? styles.dark : ''}`}>
                <h3 className={styles.infoCardTitle}>Местоположение</h3>
                <div className={styles.addressContent}>
                  <EnvironmentOutlined className={styles.addressIcon} />
                  <div>
                    <p className={styles.addressText}>{project.address}</p>
                    <span className={styles.addressRegion}>{project.location}</span>
                  </div>
                </div>
                {/* Map Placeholder */}
                <div className={`${styles.mapPlaceholder} ${isDark ? styles.dark : ''}`}>
                  <EnvironmentOutlined />
                  <span>Показать на карте</span>
                </div>
              </div>

              {/* Team Card */}
              <div className={`${styles.infoCard} ${isDark ? styles.dark : ''}`}>
                <h3 className={styles.infoCardTitle}>Команда проекта</h3>
                <div className={styles.teamList}>
                  <div className={styles.teamMember}>
                    <div className={styles.teamAvatar} style={{ background: '#4F46E5' }}>АК</div>
                    <div className={styles.teamInfo}>
                      <span className={styles.teamName}>Алексей Козлов</span>
                      <span className={styles.teamRole}>Руководитель проекта</span>
                    </div>
                  </div>
                  <div className={styles.teamMember}>
                    <div className={styles.teamAvatar} style={{ background: '#10B981' }}>ИС</div>
                    <div className={styles.teamInfo}>
                      <span className={styles.teamName}>Иван Сидоров</span>
                      <span className={styles.teamRole}>Главный инженер</span>
                    </div>
                  </div>
                  <div className={styles.teamMember}>
                    <div className={styles.teamAvatar} style={{ background: '#F59E0B' }}>МП</div>
                    <div className={styles.teamInfo}>
                      <span className={styles.teamName}>Мария Петрова</span>
                      <span className={styles.teamRole}>Архитектор</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            {/* Right Column - Stats */}
            <Col xs={24} lg={8}>
              {/* Progress Card */}
              <div className={`${styles.progressCard} ${isDark ? styles.dark : ''}`}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressTitle}>Прогресс строительства</span>
                </div>
                <div className={styles.progressCircleWrapper}>
                  <Progress
                    type="circle"
                    percent={project.progress}
                    size={140}
                    strokeWidth={10}
                    strokeColor={{
                      '0%': '#4F46E5',
                      '100%': '#7C3AED',
                    }}
                    trailColor={isDark ? '#374151' : '#E5E7EB'}
                    format={(percent) => (
                      <div className={styles.progressCircleContent}>
                        <span className={styles.progressPercent}>{percent}%</span>
                        <span className={styles.progressLabel}>выполнено</span>
                      </div>
                    )}
                  />
                </div>
                <div className={styles.progressStages}>
                  <div className={`${styles.progressStage} ${styles.completed}`}>
                    <span className={styles.stageDot} />
                    <span>Фундамент</span>
                  </div>
                  <div className={`${styles.progressStage} ${styles.completed}`}>
                    <span className={styles.stageDot} />
                    <span>Каркас</span>
                  </div>
                  <div className={`${styles.progressStage} ${styles.active}`}>
                    <span className={styles.stageDot} />
                    <span>Отделка</span>
                  </div>
                  <div className={styles.progressStage}>
                    <span className={styles.stageDot} />
                    <span>Сдача</span>
                  </div>
                </div>
              </div>

              {/* Budget Card */}
              <div className={`${styles.budgetCard} ${isDark ? styles.dark : ''}`}>
                <div className={styles.budgetHeader}>
                  <span className={styles.budgetTitle}>Бюджет</span>
                </div>
                <Tooltip title={budgetValue.full}>
                  <div className={styles.budgetAmount}>{budgetValue.display}</div>
                </Tooltip>
                <div className={styles.budgetProgress}>
                  <div className={styles.budgetProgressHeader}>
                    <span>Израсходовано</span>
                    <span className={styles.budgetPercent}>{budgetPercent}%</span>
                  </div>
                  <Progress
                    percent={budgetPercent}
                    showInfo={false}
                    strokeColor={budgetPercent > 90 ? '#EF4444' : budgetPercent > 70 ? '#F59E0B' : '#10B981'}
                    trailColor={isDark ? '#374151' : '#E5E7EB'}
                    size={['100%', 8]}
                  />
                  <Tooltip title={spentValue.full}>
                    <div className={styles.budgetSpent}>{spentValue.display}</div>
                  </Tooltip>
                </div>
                <div className={styles.budgetRemaining}>
                  <span className={styles.budgetRemainingLabel}>Остаток</span>
                  <span className={styles.budgetRemainingValue}>
                    {formatValue(project.budget - project.spent).display}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'construction',
      label: (
        <span className={styles.tabLabel}>
          <ToolOutlined />
          {t('projects.tabs.construction')}
        </span>
      ),
      children: (
        <EmptyState
          title="Этапы строительства"
          description="Здесь будет отображаться прогресс строительства"
        />
      ),
    },
    {
      key: 'estimates',
      label: (
        <span className={styles.tabLabel}>
          <FileTextOutlined />
          {t('projects.tabs.estimates')}
        </span>
      ),
      children: (
        <EmptyState
          title="Сметы"
          description="Здесь будут отображаться сметы проекта"
        />
      ),
    },
    {
      key: 'warehouse',
      label: (
        <span className={styles.tabLabel}>
          <AppstoreOutlined />
          {t('projects.tabs.warehouse')}
        </span>
      ),
      children: (
        <EmptyState
          title="Склад"
          description="Здесь будут отображаться материалы на складе проекта"
        />
      ),
    },
    {
      key: 'documents',
      label: (
        <span className={styles.tabLabel}>
          <FolderOutlined />
          {t('projects.tabs.documents')}
        </span>
      ),
      children: (
        <EmptyState
          title="Документы"
          description="Здесь будут отображаться документы проекта"
        />
      ),
    },
    {
      key: 'analytics',
      label: (
        <span className={styles.tabLabel}>
          <LineChartOutlined />
          {t('projects.tabs.analytics')}
        </span>
      ),
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
      {/* Hero Section */}
      <div className={styles.hero}>
        {/* Background Image */}
        {project.imageUrl && (
          <div
            className={styles.heroImage}
            style={{ backgroundImage: `url(${project.imageUrl})` }}
          >
            <div className={styles.heroOverlay} />
          </div>
        )}

        {/* Hero Content */}
        <div className={styles.heroContent}>
          <div className={styles.heroTop}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/projects')}
              className={styles.backButton}
            >
              Проекты
            </Button>
            <Button type="primary" icon={<EditOutlined />} className={styles.editButton}>
              Редактировать
            </Button>
          </div>

          <div className={styles.heroInfo}>
            <div className={styles.heroTitleRow}>
              <h1 className={styles.heroTitle}>{project.name}</h1>
              <StatusBadge
                status={project.status}
                label={getStatusLabel(project.status)}
              />
            </div>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}>
                <EnvironmentOutlined /> {project.location}
              </span>
              <span className={styles.heroMetaDivider}>•</span>
              <span className={styles.heroMetaItem}>
                <CalendarOutlined /> {formatDate(project.startDate)} — {formatDate(project.endDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        items={tabItems}
        className={`${styles.tabs} ${isDark ? styles.dark : ''}`}
        size="large"
      />
    </PageContainer>
  )
}

export default ProjectDetail
