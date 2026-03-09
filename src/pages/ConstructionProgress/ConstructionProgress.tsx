import { Card, Progress, Row, Col, Select, Timeline } from 'antd'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { mockProjects } from '@mocks'
import styles from './ConstructionProgress.module.css'

const mockStages = [
  { name: 'Подготовительные работы', progress: 100, status: 'completed' },
  { name: 'Фундамент', progress: 100, status: 'completed' },
  { name: 'Каркас здания', progress: 85, status: 'in_progress' },
  { name: 'Кровля', progress: 60, status: 'in_progress' },
  { name: 'Фасадные работы', progress: 30, status: 'in_progress' },
  { name: 'Внутренняя отделка', progress: 0, status: 'pending' },
  { name: 'Благоустройство', progress: 0, status: 'pending' },
]

export function ConstructionProgress() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()

  return (
    <PageContainer>
      <PageHeader
        title={t('navigation.constructionProgress')}
        actions={
          <Select defaultValue="1" style={{ width: 250 }} options={mockProjects.map(p => ({ value: p.id, label: p.name }))} />
        }
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <Card title="Этапы строительства" className={`${styles.card} ${isDark ? styles.dark : ''}`}>
            <div className={styles.stages}>
              {mockStages.map((stage, index) => (
                <div key={index} className={styles.stage}>
                  <div className={styles.stageHeader}>
                    <span className={`${styles.stageName} ${isDark ? styles.dark : ''}`}>{stage.name}</span>
                    <span className={styles.stageProgress}>{stage.progress}%</span>
                  </div>
                  <Progress
                    percent={stage.progress}
                    showInfo={false}
                    strokeColor={stage.status === 'completed' ? '#10B981' : stage.status === 'in_progress' ? '#4F46E5' : '#E5E7EB'}
                    trailColor={isDark ? '#374151' : '#E5E7EB'}
                    size={['100%', 8]}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="История изменений" className={`${styles.card} ${isDark ? styles.dark : ''}`}>
            <Timeline
              items={[
                { color: 'green', children: 'Кровля: 60% завершено (сегодня)' },
                { color: 'blue', children: 'Каркас: 85% завершено (вчера)' },
                { color: 'blue', children: 'Фасадные работы начаты (3 дня назад)' },
                { color: 'green', children: 'Фундамент завершён (1 неделю назад)' },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  )
}

export default ConstructionProgress
