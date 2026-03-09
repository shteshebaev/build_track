import { useEffect, useRef } from 'react'
import { Card, List, Tag, Progress } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { mockProjects } from '@mocks'
import styles from './MapView.module.css'

export function MapView() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Leaflet map would be initialized here
    // For now, showing a placeholder
  }, [])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'blue',
      in_progress: 'processing',
      completed: 'success',
      on_hold: 'warning',
    }
    return colors[status] || 'default'
  }

  return (
    <PageContainer>
      <PageHeader title={t('navigation.mapView')} subtitle="Все объекты на карте" />

      <div className={styles.container}>
        <div className={`${styles.mapContainer} ${isDark ? styles.dark : ''}`} ref={mapRef}>
          <div className={styles.mapPlaceholder}>
            <EnvironmentOutlined style={{ fontSize: 48, color: '#4f46e5' }} />
            <p>Карта Leaflet</p>
            <p className={styles.mapNote}>Интеграция с Leaflet для отображения объектов</p>
          </div>
        </div>

        <Card className={`${styles.projectsList} ${isDark ? styles.dark : ''}`} title="Объекты">
          <List
            dataSource={mockProjects}
            renderItem={(project) => (
              <List.Item className={styles.projectItem}>
                <div className={styles.projectInfo}>
                  <div className={`${styles.projectName} ${isDark ? styles.darkText : ''}`}>{project.name}</div>
                  <div className={styles.projectLocation}>
                    <EnvironmentOutlined /> {project.location}
                  </div>
                  <Progress percent={project.progress} size="small" strokeColor="#4f46e5" />
                </div>
                <Tag color={getStatusColor(project.status)}>{project.status}</Tag>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </PageContainer>
  )
}

export default MapView
