import { Card, Row, Col, Form, Input, Select, Switch, Button, Divider, Avatar, Space, Radio } from 'antd'
import { UserOutlined, SaveOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer, PageHeader } from '@shared/ui'
import { useThemeStore } from '@shared/store'
import styles from './Settings.module.css'

export function Settings() {
  const { t, i18n } = useTranslation()
  const { isDark, mode, setMode } = useThemeStore()

  return (
    <PageContainer>
      <PageHeader title={t('settings.title')} />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {/* Profile */}
          <Card title={t('settings.profile')} className={`${styles.card} ${isDark ? styles.dark : ''}`} style={{ marginBottom: 24 }}>
            <Space size={24} align="start">
              <Avatar size={80} style={{ backgroundColor: '#4f46e5' }} icon={<UserOutlined />} />
              <Form layout="vertical" style={{ flex: 1 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Имя"><Input defaultValue="Иван" /></Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Фамилия"><Input defaultValue="Петров" /></Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Email"><Input defaultValue="ivan@buildtrack.uz" /></Form.Item>
                <Form.Item label="Телефон"><Input defaultValue="+998 90 123 45 67" /></Form.Item>
                <Button type="primary" icon={<SaveOutlined />}>Сохранить</Button>
              </Form>
            </Space>
          </Card>

          {/* Security */}
          <Card title={t('settings.security')} className={`${styles.card} ${isDark ? styles.dark : ''}`}>
            <Form layout="vertical">
              <Form.Item label="Текущий пароль"><Input.Password /></Form.Item>
              <Form.Item label="Новый пароль"><Input.Password /></Form.Item>
              <Form.Item label="Подтверждение пароля"><Input.Password /></Form.Item>
              <Button type="primary">Изменить пароль</Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* Appearance */}
          <Card title="Внешний вид" className={`${styles.card} ${isDark ? styles.dark : ''}`} style={{ marginBottom: 24 }}>
            <Form layout="vertical">
              <Form.Item label={t('settings.theme')}>
                <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
                  <Space direction="vertical">
                    <Radio value="light">{t('settings.lightMode')}</Radio>
                    <Radio value="dark">{t('settings.darkMode')}</Radio>
                    <Radio value="system">{t('settings.systemMode')}</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
              <Divider />
              <Form.Item label={t('settings.language')}>
                <Select
                  value={i18n.language}
                  onChange={(lang) => { i18n.changeLanguage(lang); localStorage.setItem('buildtrack-language', lang) }}
                  options={[{ value: 'ru', label: 'Русский' }, { value: 'en', label: 'English' }]}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Form>
          </Card>

          {/* Notifications */}
          <Card title={t('settings.notifications')} className={`${styles.card} ${isDark ? styles.dark : ''}`}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className={styles.settingRow}>
                <span>Email уведомления</span>
                <Switch defaultChecked />
              </div>
              <div className={styles.settingRow}>
                <span>Push уведомления</span>
                <Switch defaultChecked />
              </div>
              <div className={styles.settingRow}>
                <span>Уведомления о заявках</span>
                <Switch defaultChecked />
              </div>
              <div className={styles.settingRow}>
                <span>Уведомления о низком остатке</span>
                <Switch defaultChecked />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  )
}

export default Settings
