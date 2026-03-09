import { Row, Col, Card, Tooltip } from 'antd'
import {
  ProjectOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  BarChartOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader, StatCard, CurrencyUnitSwitcher } from '@shared/ui'
import { formatPercent } from '@shared/lib'
import { useThemeStore, useCurrencyStore, formatCurrencyCompact } from '@shared/store'
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
  const { unit } = useCurrencyStore()
  const stats = mockDashboardStats

  // Format currency values with the selected unit
  const formatValue = (value: number) => {
    const { formatted, suffix, fullValue } = formatCurrencyCompact(value, unit)
    return { display: formatted + suffix, full: fullValue }
  }

  const warehouseValue = formatValue(stats.warehouseValue)
  const materialsValue = formatValue(stats.materialsUsed)
  const salesValue = formatValue(stats.salesRevenue)

  return (
    <PageContainer>
      <PageHeader
        title={t('dashboard.title')}
        subtitle={`${t('dashboard.welcome')}, Иван!`}
        actions={<CurrencyUnitSwitcher />}
      />

      {/* KPI Cards */}
      <Row gutter={[20, 20]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <div className={styles.cardWrapper}>
            <StatCard
              title={t('dashboard.totalProjects')}
              value={stats.totalProjects}
              icon={<ProjectOutlined />}
              trend={stats.projectsTrend}
              trendLabel={t('dashboard.vsLastMonth')}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Tooltip title={warehouseValue.full} placement="bottom">
            <div className={styles.cardWrapper}>
              <StatCard
                title={t('dashboard.warehouseValue')}
                value={warehouseValue.display}
                icon={<DatabaseOutlined />}
                trend={stats.warehouseTrend}
                trendLabel={t('dashboard.vsLastMonth')}
              />
            </div>
          </Tooltip>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Tooltip title={materialsValue.full} placement="bottom">
            <div className={styles.cardWrapper}>
              <StatCard
                title={t('dashboard.materialsUsed')}
                value={materialsValue.display}
                icon={<AppstoreOutlined />}
                trend={stats.materialsTrend}
                trendLabel={t('dashboard.thisMonth')}
              />
            </div>
          </Tooltip>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <div className={styles.cardWrapper}>
            <StatCard
              title={t('dashboard.activeRequests')}
              value={stats.activeRequests}
              icon={<FileTextOutlined />}
              trend={stats.requestsTrend}
              trendLabel={t('dashboard.vsLastMonth')}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <div className={styles.cardWrapper}>
            <StatCard
              title={t('dashboard.constructionProgress')}
              value={formatPercent(stats.avgProgress)}
              icon={<BarChartOutlined />}
              trend={stats.progressTrend}
              trendLabel={t('dashboard.vsLastMonth')}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Tooltip title={salesValue.full} placement="bottom">
            <div className={styles.cardWrapper}>
              <StatCard
                title={t('dashboard.salesRevenue')}
                value={salesValue.display}
                icon={<DollarOutlined />}
                trend={stats.salesTrend}
                trendLabel={t('dashboard.vsLastMonth')}
              />
            </div>
          </Tooltip>
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
