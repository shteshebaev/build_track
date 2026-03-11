import { Row, Col, Progress, Tag, Tooltip, Table } from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TeamOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useThemeStore, useCurrencyStore, formatCurrencyCompact } from '@shared/store'
import {
  mockBudgetData,
  mockProgressData,
  mockCostBreakdown,
  mockResourceUsage,
  mockRisks,
  mockKPIs,
  mockMonthlyExpenses,
  mockWorkforceData,
  type RiskItem,
} from '@mocks/projectAnalytics'
import styles from './AnalyticsTab.module.css'

interface AnalyticsTabProps {
  projectId: string
}

export function AnalyticsTab({ projectId }: AnalyticsTabProps) {
  const { isDark } = useThemeStore()
  const { unit } = useCurrencyStore()

  const formatCost = (value: number) => {
    const { formatted, suffix } = formatCurrencyCompact(value * 1000000, unit)
    return formatted + suffix
  }

  const currentProgress = mockProgressData[mockProgressData.length - 1]
  const currentBudget = mockBudgetData[mockBudgetData.length - 1]
  const budgetVariance = ((currentBudget.actual - currentBudget.planned) / currentBudget.planned) * 100
  const scheduleVariance = ((currentProgress.actual - currentProgress.planned) / currentProgress.planned) * 100

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpOutlined style={{ color: '#10B981' }} />
      case 'down': return <ArrowDownOutlined style={{ color: '#EF4444' }} />
      default: return <MinusOutlined style={{ color: '#6B7280' }} />
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#EF4444'
      case 'medium': return '#F59E0B'
      default: return '#10B981'
    }
  }

  const getRiskTag = (level: string) => {
    const config: Record<string, { color: string; label: string }> = {
      high: { color: 'error', label: 'Высокий' },
      medium: { color: 'warning', label: 'Средний' },
      low: { color: 'success', label: 'Низкий' },
    }
    return config[level] || config.low
  }

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      active: { color: 'processing', label: 'Активный' },
      mitigated: { color: 'success', label: 'Снижен' },
      closed: { color: 'default', label: 'Закрыт' },
    }
    return config[status] || config.active
  }

  const riskColumns: ColumnsType<RiskItem> = [
    {
      title: 'Риск',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div className={styles.riskCell}>
          <span className={styles.riskTitle}>{title}</span>
          <span className={styles.riskCategory}>{record.category}</span>
        </div>
      ),
    },
    {
      title: 'Вероятность',
      dataIndex: 'probability',
      key: 'probability',
      width: 110,
      render: (prob) => {
        const config = getRiskTag(prob)
        return <Tag color={config.color}>{config.label}</Tag>
      },
    },
    {
      title: 'Влияние',
      dataIndex: 'impact',
      key: 'impact',
      width: 100,
      render: (impact) => {
        const config = getRiskTag(impact)
        return <Tag color={config.color}>{config.label}</Tag>
      },
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const config = getStatusTag(status)
        return <Tag color={config.color}>{config.label}</Tag>
      },
    },
  ]

  const maxExpense = Math.max(...mockMonthlyExpenses.map(e => e.materials + e.labor + e.equipment + e.other))

  return (
    <div className={styles.container}>
      {/* KPI Cards */}
      <Row gutter={[16, 16]} className={styles.kpiRow}>
        {mockKPIs.map((kpi, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <div className={`${styles.kpiCard} ${isDark ? styles.dark : ''}`}>
              <div className={styles.kpiHeader}>
                <span className={styles.kpiName}>{kpi.name}</span>
                <div className={styles.kpiTrend}>
                  {getTrendIcon(kpi.trend)}
                  {kpi.trendValue !== 0 && (
                    <span className={kpi.trend === 'up' ? styles.trendUp : styles.trendDown}>
                      {kpi.trendValue > 0 ? '+' : ''}{kpi.trendValue}%
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.kpiValue}>
                {kpi.value}{kpi.unit && <span className={styles.kpiUnit}> {kpi.unit}</span>}
              </div>
              <Progress
                percent={(kpi.value / kpi.target) * 100}
                showInfo={false}
                strokeColor={kpi.value >= kpi.target ? '#10B981' : '#F59E0B'}
                trailColor={isDark ? '#374151' : '#E5E7EB'}
                size={['100%', 4]}
              />
              <span className={styles.kpiTarget}>Цель: {kpi.target}{kpi.unit}</span>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Budget Chart */}
        <Col xs={24} lg={12}>
          <div className={`${styles.chartCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.chartHeader}>
              <div>
                <h3 className={styles.chartTitle}>
                  <DollarOutlined /> Освоение бюджета
                </h3>
                <p className={styles.chartSubtitle}>План vs Факт (млн сум)</p>
              </div>
              <div className={styles.chartLegend}>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: '#4F46E5' }} />
                  План
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: '#10B981' }} />
                  Факт
                </span>
              </div>
            </div>
            <div className={styles.chartArea}>
              <div className={styles.barChart}>
                {mockBudgetData.map((item, index) => (
                  <div key={index} className={styles.barGroup}>
                    <div className={styles.bars}>
                      <Tooltip title={`План: ${item.planned} млн`}>
                        <div
                          className={styles.bar}
                          style={{
                            height: `${(item.planned / 2500) * 100}%`,
                            background: '#4F46E5',
                          }}
                        />
                      </Tooltip>
                      <Tooltip title={`Факт: ${item.actual} млн`}>
                        <div
                          className={styles.bar}
                          style={{
                            height: `${(item.actual / 2500) * 100}%`,
                            background: '#10B981',
                          }}
                        />
                      </Tooltip>
                    </div>
                    <span className={styles.barLabel}>{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.chartFooter}>
              <div className={`${styles.varianceCard} ${budgetVariance > 0 ? styles.negative : styles.positive}`}>
                <span className={styles.varianceLabel}>Отклонение</span>
                <span className={styles.varianceValue}>
                  {budgetVariance > 0 ? '+' : ''}{budgetVariance.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </Col>

        {/* Progress Chart */}
        <Col xs={24} lg={12}>
          <div className={`${styles.chartCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.chartHeader}>
              <div>
                <h3 className={styles.chartTitle}>
                  <BarChartOutlined /> Прогресс строительства
                </h3>
                <p className={styles.chartSubtitle}>Плановый vs Фактический (%)</p>
              </div>
              <div className={styles.chartLegend}>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: '#3B82F6' }} />
                  План
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: '#F59E0B' }} />
                  Факт
                </span>
              </div>
            </div>
            <div className={styles.chartArea}>
              <div className={styles.lineChart}>
                <svg viewBox="0 0 400 150" className={styles.lineSvg}>
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((val, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={150 - (val / 100) * 150}
                      x2="400"
                      y2={150 - (val / 100) * 150}
                      stroke={isDark ? '#374151' : '#E5E7EB'}
                      strokeDasharray="4"
                    />
                  ))}
                  {/* Planned line */}
                  <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    points={mockProgressData.map((d, i) =>
                      `${(i / (mockProgressData.length - 1)) * 400},${150 - (d.planned / 100) * 150}`
                    ).join(' ')}
                  />
                  {/* Actual line */}
                  <polyline
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    points={mockProgressData.map((d, i) =>
                      `${(i / (mockProgressData.length - 1)) * 400},${150 - (d.actual / 100) * 150}`
                    ).join(' ')}
                  />
                  {/* Dots */}
                  {mockProgressData.map((d, i) => (
                    <g key={i}>
                      <circle
                        cx={(i / (mockProgressData.length - 1)) * 400}
                        cy={150 - (d.actual / 100) * 150}
                        r="4"
                        fill="#F59E0B"
                      />
                    </g>
                  ))}
                </svg>
              </div>
            </div>
            <div className={styles.chartFooter}>
              <div className={`${styles.varianceCard} ${scheduleVariance < 0 ? styles.negative : styles.positive}`}>
                <span className={styles.varianceLabel}>Отставание</span>
                <span className={styles.varianceValue}>
                  {scheduleVariance.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </Col>

        {/* Cost Breakdown */}
        <Col xs={24} lg={8}>
          <div className={`${styles.chartCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>
                <PieChartOutlined /> Структура затрат
              </h3>
            </div>
            <div className={styles.pieChartWrapper}>
              <div className={styles.pieChart}>
                {mockCostBreakdown.map((item, index) => {
                  const rotation = mockCostBreakdown
                    .slice(0, index)
                    .reduce((acc, i) => acc + i.value, 0) * 3.6
                  return (
                    <div
                      key={index}
                      className={styles.pieSlice}
                      style={{
                        background: `conic-gradient(${item.color} 0deg, ${item.color} ${item.value * 3.6}deg, transparent ${item.value * 3.6}deg)`,
                        transform: `rotate(${rotation}deg)`,
                      }}
                    />
                  )
                })}
                <div className={styles.pieCenter}>
                  <span className={styles.pieCenterValue}>100%</span>
                  <span className={styles.pieCenterLabel}>Всего</span>
                </div>
              </div>
            </div>
            <div className={styles.pieList}>
              {mockCostBreakdown.map((item, index) => (
                <div key={index} className={styles.pieListItem}>
                  <span className={styles.pieDot} style={{ background: item.color }} />
                  <span className={styles.pieLabel}>{item.category}</span>
                  <span className={styles.pieValue}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Resource Usage */}
        <Col xs={24} lg={8}>
          <div className={`${styles.chartCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>
                <TeamOutlined /> Использование ресурсов
              </h3>
            </div>
            <div className={styles.resourceList}>
              {mockResourceUsage.map((res, index) => {
                const percent = (res.actual / res.planned) * 100
                return (
                  <div key={index} className={styles.resourceItem}>
                    <div className={styles.resourceHeader}>
                      <span className={styles.resourceName}>{res.resource}</span>
                      <span className={styles.resourceValues}>
                        {res.actual.toLocaleString()} / {res.planned.toLocaleString()} {res.unit}
                      </span>
                    </div>
                    <Progress
                      percent={percent}
                      showInfo={false}
                      strokeColor={percent > 90 ? '#EF4444' : percent > 70 ? '#F59E0B' : '#10B981'}
                      trailColor={isDark ? '#374151' : '#E5E7EB'}
                      size={['100%', 8]}
                    />
                    <span className={styles.resourcePercent}>{percent.toFixed(0)}% использовано</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Col>

        {/* Risks */}
        <Col xs={24} lg={8}>
          <div className={`${styles.chartCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>
                <WarningOutlined /> Риски проекта
              </h3>
            </div>
            <Table
              columns={riskColumns}
              dataSource={mockRisks}
              rowKey="id"
              pagination={false}
              size="small"
              className={`${styles.riskTable} ${isDark ? styles.dark : ''}`}
            />
          </div>
        </Col>

        {/* Monthly Expenses */}
        <Col xs={24}>
          <div className={`${styles.chartCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.chartHeader}>
              <div>
                <h3 className={styles.chartTitle}>
                  <BarChartOutlined /> Ежемесячные расходы по категориям
                </h3>
                <p className={styles.chartSubtitle}>Распределение затрат (млн сум)</p>
              </div>
              <div className={styles.chartLegend}>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: '#4F46E5' }} />
                  Материалы
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: '#10B981' }} />
                  Работы
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: '#F59E0B' }} />
                  Оборудование
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: '#6B7280' }} />
                  Прочее
                </span>
              </div>
            </div>
            <div className={styles.stackedChart}>
              {mockMonthlyExpenses.map((item, index) => {
                const total = item.materials + item.labor + item.equipment + item.other
                return (
                  <div key={index} className={styles.stackedBarGroup}>
                    <div className={styles.stackedBar} style={{ height: `${(total / maxExpense) * 100}%` }}>
                      <Tooltip title={`Материалы: ${item.materials} млн`}>
                        <div style={{ height: `${(item.materials / total) * 100}%`, background: '#4F46E5' }} />
                      </Tooltip>
                      <Tooltip title={`Работы: ${item.labor} млн`}>
                        <div style={{ height: `${(item.labor / total) * 100}%`, background: '#10B981' }} />
                      </Tooltip>
                      <Tooltip title={`Оборудование: ${item.equipment} млн`}>
                        <div style={{ height: `${(item.equipment / total) * 100}%`, background: '#F59E0B' }} />
                      </Tooltip>
                      <Tooltip title={`Прочее: ${item.other} млн`}>
                        <div style={{ height: `${(item.other / total) * 100}%`, background: '#6B7280' }} />
                      </Tooltip>
                    </div>
                    <span className={styles.stackedLabel}>{item.month}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
