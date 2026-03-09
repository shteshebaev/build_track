import { Card, Row, Col, Select, Button, Tag, Space } from 'antd'
import { PlayCircleOutlined, ExpandOutlined, SettingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { mockProjects } from '@mocks'
import styles from './Cameras.module.css'

const mockCameras = [
  { id: '1', name: 'Камера 1 - Главный въезд', project: 'ЖК "Солнечный"', status: 'online' },
  { id: '2', name: 'Камера 2 - Строительная площадка', project: 'ЖК "Солнечный"', status: 'online' },
  { id: '3', name: 'Камера 3 - Склад материалов', project: 'ЖК "Солнечный"', status: 'offline' },
  { id: '4', name: 'Камера 1 - Общий вид', project: 'БЦ "Технопарк"', status: 'online' },
  { id: '5', name: 'Камера 2 - Монтаж конструкций', project: 'БЦ "Технопарк"', status: 'online' },
  { id: '6', name: 'Камера 1 - Фасад', project: 'ЖК "Зелёный квартал"', status: 'online' },
]

export function Cameras() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()

  return (
    <PageContainer>
      <PageHeader
        title={t('navigation.cameras')}
        subtitle={`${mockCameras.length} камер`}
        actions={
          <Select
            placeholder="Фильтр по проекту"
            style={{ width: 220 }}
            options={[
              { value: 'all', label: 'Все проекты' },
              ...mockProjects.map(p => ({ value: p.id, label: p.name }))
            ]}
          />
        }
      />

      <Row gutter={[20, 20]}>
        {mockCameras.map((camera) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={camera.id}>
            <Card className={`${styles.cameraCard} ${isDark ? styles.dark : ''}`} hoverable>
              <div className={styles.videoPlaceholder}>
                <PlayCircleOutlined className={styles.playIcon} />
                {camera.status === 'offline' && (
                  <div className={styles.offlineOverlay}>
                    <span>Камера недоступна</span>
                  </div>
                )}
              </div>
              <div className={styles.cameraInfo}>
                <div className={styles.cameraHeader}>
                  <span className={`${styles.cameraName} ${isDark ? styles.darkText : ''}`}>{camera.name}</span>
                  <Tag color={camera.status === 'online' ? 'success' : 'error'}>
                    {camera.status === 'online' ? 'Онлайн' : 'Оффлайн'}
                  </Tag>
                </div>
                <div className={styles.cameraProject}>{camera.project}</div>
                <Space style={{ marginTop: 12 }}>
                  <Button type="primary" icon={<ExpandOutlined />} size="small">Полный экран</Button>
                  <Button icon={<SettingOutlined />} size="small" />
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  )
}

export default Cameras
