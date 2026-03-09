import { Card, Row, Col, Button, DatePicker, Select, Space } from 'antd'
import { FileExcelOutlined, FilePdfOutlined, BarChartOutlined, DollarOutlined, AppstoreOutlined, ProjectOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import styles from './Reports.module.css'

const { RangePicker } = DatePicker

const reportTypes = [
  { key: 'financial', title: 'Финансовый отчёт', description: 'Доходы, расходы, прибыль по проектам', icon: <DollarOutlined /> },
  { key: 'materials', title: 'Отчёт по материалам', description: 'Использование, остатки, закупки материалов', icon: <AppstoreOutlined /> },
  { key: 'construction', title: 'Отчёт по строительству', description: 'Прогресс, этапы, отклонения от плана', icon: <ProjectOutlined /> },
  { key: 'analytics', title: 'Аналитический отчёт', description: 'Сравнительный анализ проектов', icon: <BarChartOutlined /> },
]

export function Reports() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()

  return (
    <PageContainer>
      <PageHeader title={t('reports.title')} />

      <Card className={`${styles.filtersCard} ${isDark ? styles.dark : ''}`} style={{ marginBottom: 24 }}>
        <Space wrap>
          <RangePicker style={{ width: 280 }} />
          <Select placeholder="Выберите проект" style={{ width: 200 }} options={[{ value: 'all', label: 'Все проекты' }]} />
        </Space>
      </Card>

      <Row gutter={[20, 20]}>
        {reportTypes.map((report) => (
          <Col xs={24} sm={12} lg={6} key={report.key}>
            <Card className={`${styles.reportCard} ${isDark ? styles.dark : ''}`} hoverable>
              <div className={styles.reportIcon}>{report.icon}</div>
              <h3 className={`${styles.reportTitle} ${isDark ? styles.darkText : ''}`}>{report.title}</h3>
              <p className={styles.reportDescription}>{report.description}</p>
              <Space style={{ marginTop: 16 }}>
                <Button icon={<FilePdfOutlined />} size="small">PDF</Button>
                <Button icon={<FileExcelOutlined />} size="small">Excel</Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  )
}

export default Reports
