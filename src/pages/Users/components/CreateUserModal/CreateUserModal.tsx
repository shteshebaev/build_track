import { useState } from 'react'
import { Modal, Form, Input, Select, message, Row, Col } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { useThemeStore } from '@shared/store'
import styles from './CreateUserModal.module.css'

interface CreateUserModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: UserFormValues) => void
}

export interface UserFormValues {
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  department?: string
  position?: string
}

const roles = [
  { value: 'admin', label: 'Администратор' },
  { value: 'manager', label: 'Менеджер проектов' },
  { value: 'engineer', label: 'Инженер' },
  { value: 'accountant', label: 'Бухгалтер' },
  { value: 'warehouse', label: 'Кладовщик' },
  { value: 'viewer', label: 'Наблюдатель' },
]

const departments = [
  { value: 'management', label: 'Руководство' },
  { value: 'construction', label: 'Строительство' },
  { value: 'design', label: 'Проектирование' },
  { value: 'procurement', label: 'Снабжение' },
  { value: 'finance', label: 'Финансы' },
]

export function CreateUserModal({ open, onClose, onSubmit }: CreateUserModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<UserFormValues>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      await new Promise(resolve => setTimeout(resolve, 800))
      onSubmit(values)
      message.success('Пользователь успешно создан')
      handleClose()
    } catch {
      message.error('Заполните все обязательные поля')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal open={open} onCancel={handleClose} footer={null} width={600} centered destroyOnClose
      className={`${styles.modal} ${isDark ? styles.dark : ''}`}
      closeIcon={<span className={styles.closeButton}>✕</span>}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <div className={styles.headerIcon}><UserAddOutlined /></div>
          <h2 className={styles.title}>Новый пользователь</h2>
          <p className={styles.subtitle}>Добавление сотрудника в систему</p>
        </div>

        <Form form={form} layout="vertical" requiredMark={false}>
          <div className={styles.formContent}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="firstName" rules={[{ required: true, message: 'Введите имя' }]}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Имя <span className={styles.required}>*</span></label>
                    <Input size="large" className={styles.input} placeholder="Введите имя" />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="lastName" rules={[{ required: true, message: 'Введите фамилию' }]}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Фамилия <span className={styles.required}>*</span></label>
                    <Input size="large" className={styles.input} placeholder="Введите фамилию" />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="email" rules={[
                  { required: true, message: 'Введите email' },
                  { type: 'email', message: 'Некорректный email' }
                ]}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Email <span className={styles.required}>*</span></label>
                    <Input size="large" className={styles.input} placeholder="email@example.com" />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="phone">
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Телефон</label>
                    <Input size="large" className={styles.input} placeholder="+7 (999) 123-45-67" />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="role" rules={[{ required: true, message: 'Выберите роль' }]}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Роль в системе <span className={styles.required}>*</span></label>
                <Select size="large" className={styles.select} placeholder="Выберите роль" options={roles} />
              </div>
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="department">
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Отдел</label>
                    <Select size="large" className={styles.select} placeholder="Выберите отдел"
                      options={departments} allowClear />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="position">
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Должность</label>
                    <Input size="large" className={styles.input} placeholder="Введите должность" />
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>

        <div className={styles.footer}>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handleClose}>Отмена</button>
          <button className={`${styles.button} ${styles.primaryButton} ${loading ? styles.loading : ''}`}
            onClick={handleSubmit} disabled={loading}>
            {loading ? 'Создание...' : 'Создать пользователя'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
