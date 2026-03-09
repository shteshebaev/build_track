import { Row, Col, Card } from 'antd'
import {
  ProjectOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  BarChartOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader, StatCard } from '@shared/ui'
import { formatCurrency, formatPercent } from '@shared/lib'
import { useThemeStore } from '@shared/store'
import {
  mockDashboardStats,
  mockMaterialUsageData,
  mockProjectsProgressData,
  mockProjectStatusData,
  mockRecentActivity,
} from '@mocks'
import { ProgressChart } from './components/ProgressChart'
import { MaterialUsageChart } from './components/MaterialUsageChart'
import { ProjectStatusChart } from './components/ProjectStatusChart'
import { RecentActivity } from './components/RecentActivity'
import styles from './Dashboard.module.css'

export function Dashboard() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()
  const stats = mockDashboardStats

  return (
    <PageContainer>
      <PageHeader
        title={t('dashboard.title')}
        subtitle={`${t('dashboard.welcome')}, Иван!`}
      />

      {/* KPI Cards */}
      <Row gutter={[20, 20]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard
            title={t('dashboard.totalProjects')}
            value={stats.totalProjects}
            icon={<ProjectOutlined />}
            trend={stats.projectsTrend}
            trendLabel={t('dashboard.vsLastMonth')}
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard
            title={t('dashboard.warehouseValue')}
            value={formatCurrency(stats.warehouseValue)}
            icon={<DatabaseOutlined />}
            trend={stats.warehouseTrend}
            trendLabel={t('dashboard.vsLastMonth')}
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard
            title={t('dashboard.materialsUsed')}
            value={formatCurrency(stats.materialsUsed)}
            icon={<AppstoreOutlined />}
            trend={stats.materialsTrend}
            trendLabel={t('dashboard.thisMonth')}
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard
            title={t('dashboard.activeRequests')}
            value={stats.activeRequests}
            icon={<FileTextOutlined />}
            trend={stats.requestsTrend}
            trendLabel={t('dashboard.vsLastMonth')}
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard
            title={t('dashboard.constructionProgress')}
            value={formatPercent(stats.avgProgress)}
            icon={<BarChartOutlined />}
            trend={stats.progressTrend}
            trendLabel={t('dashboard.vsLastMonth')}
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard
            title={t('dashboard.salesRevenue')}
            value={formatCurrency(stats.salesRevenue)}
            icon={<DollarOutlined />}
            trend={stats.salesTrend}
            trendLabel={t('dashboard.vsLastMonth')}
          />
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[20, 20]} className={styles.chartsRow}>
        <Col xs={24} lg={16}>
          <Card
            title="Прогресс строительства"
            className={`${styles.chartCard} ${isDark ? styles.dark : styles.light}`}
          >
            <ProgressChart
              data={mockProjectsProgressData}
              isDark={isDark}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="Статус проектов"
            className={`${styles.chartCard} ${isDark ? styles.dark : styles.light}`}
          >
            <ProjectStatusChart
              data={mockProjectStatusData}
              isDark={isDark}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[20, 20]} className={styles.chartsRow}>
        <Col xs={24} lg={14}>
          <Card
            title="Использование материалов"
            className={`${styles.chartCard} ${isDark ? styles.dark : styles.light}`}
          >
            <MaterialUsageChart
              data={mockMaterialUsageData}
              isDark={isDark}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title={t('dashboard.recentActivity')}
            className={`${styles.chartCard} ${isDark ? styles.dark : styles.light}`}
          >
            <RecentActivity
              activities={mockRecentActivity}
              isDark={isDark}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  )
}

export default Dashboard
