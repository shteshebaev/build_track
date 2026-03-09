import { Card, Row, Col, Button, Select, DatePicker, Upload, Image } from 'antd'
import { CameraOutlined, UploadOutlined, FilterOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import { formatDate } from '@shared/lib'
import styles from './PhotoReports.module.css'

const mockPhotos = [
  { id: '1', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', date: '2024-12-15', project: 'ЖК "Солнечный"', stage: 'Каркас', author: 'Иванов А.' },
  { id: '2', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400', date: '2024-12-14', project: 'ЖК "Солнечный"', stage: 'Фасад', author: 'Петров В.' },
  { id: '3', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400', date: '2024-12-13', project: 'БЦ "Технопарк"', stage: 'Фундамент', author: 'Сидоров К.' },
  { id: '4', url: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=400', date: '2024-12-12', project: 'ЖК "Зелёный квартал"', stage: 'Кровля', author: 'Козлов М.' },
]

export function PhotoReports() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()

  return (
    <PageContainer>
      <PageHeader
        title={t('navigation.photoReports')}
        subtitle={`${mockPhotos.length} фотографий`}
        primaryAction={{ label: 'Загрузить фото', icon: <UploadOutlined />, onClick: () => {} }}
      />

      <Card className={`${styles.filtersCard} ${isDark ? styles.dark : ''}`} style={{ marginBottom: 24 }}>
        <Row gutter={12} align="middle">
          <Col><Select placeholder="Проект" style={{ width: 200 }} /></Col>
          <Col><Select placeholder="Этап" style={{ width: 160 }} /></Col>
          <Col><DatePicker.RangePicker style={{ width: 280 }} /></Col>
        </Row>
      </Card>

      <Row gutter={[20, 20]}>
        {mockPhotos.map((photo) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={photo.id}>
            <Card className={`${styles.photoCard} ${isDark ? styles.dark : ''}`} hoverable cover={
              <Image src={photo.url} alt={photo.stage} className={styles.photoImage} preview={{ mask: 'Просмотр' }} />
            }>
              <div className={`${styles.photoTitle} ${isDark ? styles.darkText : ''}`}>{photo.stage}</div>
              <div className={styles.photoMeta}>
                <span>{photo.project}</span>
                <span>{formatDate(photo.date)}</span>
              </div>
              <div className={styles.photoAuthor}>Автор: {photo.author}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  )
}

export default PhotoReports
