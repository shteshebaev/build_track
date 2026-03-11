import { useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Row,
  Col,
} from 'antd'
import {
  AppstoreOutlined,
  BarcodeOutlined,
  TagOutlined,
  DollarOutlined,
  InboxOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { useThemeStore } from '@shared/store'
import type { MaterialCategory } from '@shared/types'
import { materialCategories } from '@mocks'
import styles from './CreateMaterialModal.module.css'

interface CreateMaterialModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: MaterialFormValues) => void
}

export interface MaterialFormValues {
  name: string
  sku: string
  category: MaterialCategory
  unit: string
  price: number
  minStock: number
  description?: string
}

const commonUnits = [
  { value: 'шт', label: 'шт (штуки)' },
  { value: 'кг', label: 'кг (килограммы)' },
  { value: 'тонна', label: 'тонна' },
  { value: 'м', label: 'м (метры)' },
  { value: 'м²', label: 'м² (кв. метры)' },
  { value: 'м³', label: 'м³ (куб. метры)' },
  { value: 'л', label: 'л (литры)' },
  { value: 'лист', label: 'лист' },
  { value: 'упак', label: 'упак (упаковка)' },
  { value: 'рулон', label: 'рулон' },
]

export function CreateMaterialModal({ open, onClose, onSubmit }: CreateMaterialModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<MaterialFormValues>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      onSubmit(values)
      message.success('Материал успешно создан')
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

  const generateSku = () => {
    const category = form.getFieldValue('category')
    const prefix = category ? category.substring(0, 3).toUpperCase() : 'MAT'
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    form.setFieldsValue({ sku: `${prefix}-${random}` })
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      centered
      destroyOnClose
      className={`${styles.modal} ${isDark ? styles.dark : ''}`}
      closeIcon={<span className={styles.closeButton}>✕</span>}
    >
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <AppstoreOutlined />
          </div>
          <h2 className={styles.title}>Новый материал</h2>
          <p className={styles.subtitle}>Заполните информацию о материале</p>
        </div>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          className={styles.form}
          requiredMark={false}
        >
          <div className={styles.formContent}>
            {/* Name */}
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Введите название материала' }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Название материала <span className={styles.required}>*</span>
                </label>
                <Input
                  placeholder="например, Цемент М500"
                  size="large"
                  className={styles.input}
                  prefix={<TagOutlined className={styles.inputIcon} />}
                />
              </div>
            </Form.Item>

            {/* SKU and Category Row */}
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="sku"
                  rules={[{ required: true, message: 'Введите артикул' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Артикул (SKU) <span className={styles.required}>*</span>
                    </label>
                    <Input
                      placeholder="CEM-M500-001"
                      size="large"
                      className={styles.input}
                      prefix={<BarcodeOutlined className={styles.inputIcon} />}
                      suffix={
                        <button
                          type="button"
                          className={styles.generateBtn}
                          onClick={generateSku}
                        >
                          Генерировать
                        </button>
                      }
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="category"
                  rules={[{ required: true, message: 'Выберите категорию' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Категория <span className={styles.required}>*</span>
                    </label>
                    <Select
                      placeholder="Выберите категорию"
                      size="large"
                      className={styles.select}
                      options={materialCategories.map((c) => ({
                        value: c.value,
                        label: c.label,
                      }))}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            {/* Unit and Price Row */}
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="unit"
                  rules={[{ required: true, message: 'Выберите единицу измерения' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Единица измерения <span className={styles.required}>*</span>
                    </label>
                    <Select
                      placeholder="Выберите единицу"
                      size="large"
                      className={styles.select}
                      options={commonUnits}
                      showSearch
                      allowClear
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="price"
                  rules={[{ required: true, message: 'Введите цену' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Цена за единицу <span className={styles.required}>*</span>
                    </label>
                    <InputNumber
                      placeholder="0"
                      size="large"
                      className={styles.inputNumber}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                      parser={(value) => value!.replace(/\s/g, '') as unknown as number}
                      addonAfter="UZS"
                      prefix={<DollarOutlined className={styles.inputIcon} />}
                      min={0}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            {/* Min Stock */}
            <Form.Item
              name="minStock"
              rules={[{ required: true, message: 'Введите минимальный остаток' }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Минимальный остаток <span className={styles.required}>*</span>
                </label>
                <InputNumber
                  placeholder="0"
                  size="large"
                  className={styles.inputNumber}
                  prefix={<InboxOutlined className={styles.inputIcon} />}
                  min={0}
                  style={{ width: '100%' }}
                />
                <span className={styles.inputHint}>
                  Уведомление при остатке ниже этого значения
                </span>
              </div>
            </Form.Item>

            {/* Description */}
            <Form.Item name="description">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Описание</label>
                <Input.TextArea
                  placeholder="Дополнительная информация о материале..."
                  rows={3}
                  className={styles.textarea}
                />
              </div>
            </Form.Item>
          </div>
        </Form>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={handleClose}
          >
            Отмена
          </button>
          <button
            className={`${styles.button} ${styles.primaryButton} ${loading ? styles.loading : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать материал'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
