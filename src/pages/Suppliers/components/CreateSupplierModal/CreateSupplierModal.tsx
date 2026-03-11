import { useState } from 'react'
import { Modal, Form, Input, Select, Rate, message, Row, Col } from 'antd'
import {
  ShopOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import { useThemeStore } from '@shared/store'
import type { MaterialCategory } from '@shared/types'
import { materialCategories } from '@mocks'
import styles from './CreateSupplierModal.module.css'

interface CreateSupplierModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: SupplierFormValues) => void
}

export interface SupplierFormValues {
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  categories: MaterialCategory[]
  rating: number
  notes?: string
}

export function CreateSupplierModal({ open, onClose, onSubmit }: CreateSupplierModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<SupplierFormValues>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      await new Promise(resolve => setTimeout(resolve, 800))
      onSubmit(values)
      message.success('Поставщик успешно добавлен')
      handleClose()
    } catch {
      message.error('Пожалуйста, заполните все обязательные поля')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={560}
      centered
      destroyOnClose
      className={`${styles.modal} ${isDark ? styles.dark : ''}`}
      closeIcon={<span className={styles.closeButton}>✕</span>}
    >
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <ShopOutlined />
          </div>
          <h2 className={styles.title}>Новый поставщик</h2>
          <p className={styles.subtitle}>Добавление поставщика в систему</p>
        </div>

        <Form form={form} layout="vertical" requiredMark={false} initialValues={{ rating: 4 }}>
          <div className={styles.formContent}>
            <Form.Item name="name" rules={[{ required: true, message: 'Введите название' }]}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Название компании <span className={styles.required}>*</span></label>
                <Input size="large" className={styles.input} placeholder="ООО «Название»" prefix={<ShopOutlined className={styles.inputIcon} />} />
              </div>
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="contactPerson" rules={[{ required: true, message: 'Введите контактное лицо' }]}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Контактное лицо <span className={styles.required}>*</span></label>
                    <Input size="large" className={styles.input} placeholder="ФИО" prefix={<UserOutlined className={styles.inputIcon} />} />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="phone" rules={[{ required: true, message: 'Введите телефон' }]}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Телефон <span className={styles.required}>*</span></label>
                    <Input size="large" className={styles.input} placeholder="+998 90 123 45 67" prefix={<PhoneOutlined className={styles.inputIcon} />} />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Введите корректный email' }]}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Email <span className={styles.required}>*</span></label>
                <Input size="large" className={styles.input} placeholder="info@company.uz" prefix={<MailOutlined className={styles.inputIcon} />} />
              </div>
            </Form.Item>

            <Form.Item name="address">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Адрес</label>
                <Input size="large" className={styles.input} placeholder="Город, улица, дом" prefix={<EnvironmentOutlined className={styles.inputIcon} />} />
              </div>
            </Form.Item>

            <Form.Item name="categories" rules={[{ required: true, message: 'Выберите категории' }]}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Категории материалов <span className={styles.required}>*</span></label>
                <Select
                  mode="multiple"
                  size="large"
                  className={styles.select}
                  placeholder="Выберите категории"
                  options={materialCategories.map(c => ({ value: c.value, label: c.label }))}
                />
              </div>
            </Form.Item>

            <Form.Item name="rating">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Рейтинг</label>
                <Rate allowHalf className={styles.rate} />
              </div>
            </Form.Item>

            <Form.Item name="notes">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Примечание</label>
                <Input.TextArea rows={2} className={styles.textarea} placeholder="Дополнительная информация..." />
              </div>
            </Form.Item>
          </div>
        </Form>

        <div className={styles.footer}>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handleClose}>Отмена</button>
          <button className={`${styles.button} ${styles.primaryButton} ${loading ? styles.loading : ''}`} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Добавление...' : 'Добавить поставщика'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
