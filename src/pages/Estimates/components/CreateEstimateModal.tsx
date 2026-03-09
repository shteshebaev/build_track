import { useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Button,
} from 'antd'
import {
  FileTextOutlined,
  ProjectOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useThemeStore, useCurrencyStore, formatCurrencyCompact } from '@shared/store'
import { mockProjects } from '@mocks'
import styles from './CreateEstimateModal.module.css'

interface CreateEstimateModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: EstimateFormValues) => void
}

interface EstimateItem {
  id: string
  name: string
  unit: string
  quantity: number
  unitPrice: number
}

export interface EstimateFormValues {
  name: string
  description?: string
  projectId: string
  status: 'draft' | 'active'
  items: EstimateItem[]
}

const unitOptions = [
  { value: 'м³', label: 'м³' },
  { value: 'м²', label: 'м²' },
  { value: 'м.п.', label: 'м.п.' },
  { value: 'т', label: 'тонн' },
  { value: 'кг', label: 'кг' },
  { value: 'шт', label: 'шт' },
  { value: 'компл', label: 'компл' },
  { value: 'усл', label: 'услуга' },
]

export function CreateEstimateModal({ open, onClose, onSubmit }: CreateEstimateModalProps) {
  const { isDark } = useThemeStore()
  const { unit } = useCurrencyStore()
  const [form] = Form.useForm<EstimateFormValues>()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<EstimateItem[]>([
    { id: '1', name: '', unit: 'м³', quantity: 0, unitPrice: 0 }
  ])

  const formatValue = (value: number) => {
    const { formatted, suffix } = formatCurrencyCompact(value, unit)
    return formatted + suffix
  }

  const handleAddItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      name: '',
      unit: 'шт',
      quantity: 0,
      unitPrice: 0
    }])
  }

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleItemChange = (id: string, field: keyof EstimateItem, value: string | number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      // Validate items
      const validItems = items.filter(item => item.name && item.quantity > 0 && item.unitPrice > 0)
      if (validItems.length === 0) {
        message.error('Добавьте хотя бы одну позицию сметы')
        setLoading(false)
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      onSubmit({ ...values, items: validItems })
      message.success('Смета успешно создана')
      handleClose()
    } catch {
      message.error('Пожалуйста, заполните все обязательные поля')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setItems([{ id: '1', name: '', unit: 'м³', quantity: 0, unitPrice: 0 }])
    onClose()
  }

  const projectOptions = mockProjects.map(p => ({
    value: p.id,
    label: p.name,
  }))

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={700}
      centered
      destroyOnClose
      className={`${styles.modal} ${isDark ? styles.dark : ''}`}
      closeIcon={<span className={styles.closeButton}>✕</span>}
    >
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <FileTextOutlined />
          </div>
          <h2 className={styles.title}>Новая смета</h2>
          <p className={styles.subtitle}>Заполните данные сметы и добавьте позиции</p>
        </div>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          className={styles.form}
          requiredMark={false}
          initialValues={{ status: 'draft' }}
        >
          <div className={styles.formContent}>
            {/* Basic Info Row */}
            <div className={styles.row}>
              <Form.Item
                name="projectId"
                rules={[{ required: true, message: 'Выберите проект' }]}
                className={styles.flex1}
              >
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Проект</label>
                  <Select
                    size="large"
                    className={styles.select}
                    placeholder="Выберите проект"
                    options={projectOptions}
                    suffixIcon={<ProjectOutlined />}
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="status"
                rules={[{ required: true }]}
                style={{ width: 160 }}
              >
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Статус</label>
                  <Select
                    size="large"
                    className={styles.select}
                    options={[
                      { value: 'draft', label: 'Черновик' },
                      { value: 'active', label: 'Активная' },
                    ]}
                  />
                </div>
              </Form.Item>
            </div>

            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Введите название сметы' }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Название сметы</label>
                <Input
                  size="large"
                  placeholder="например, Смета на общестроительные работы"
                  className={styles.input}
                />
              </div>
            </Form.Item>

            {/* Items Section */}
            <div className={styles.itemsSection}>
              <div className={styles.itemsHeader}>
                <span className={styles.itemsTitle}>Позиции сметы</span>
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={handleAddItem}
                  className={styles.addButton}
                >
                  Добавить
                </Button>
              </div>

              <div className={styles.itemsTableHeader}>
                <span style={{ flex: 2 }}>Наименование</span>
                <span style={{ width: 70, textAlign: 'center' }}>Ед.</span>
                <span style={{ width: 80, textAlign: 'right' }}>Кол-во</span>
                <span style={{ width: 120, textAlign: 'right' }}>Цена</span>
                <span style={{ width: 110, textAlign: 'right' }}>Сумма</span>
                <span style={{ width: 32 }}></span>
              </div>

              <div className={styles.itemsList}>
                {items.map((item, index) => (
                  <div key={item.id} className={styles.itemRow}>
                    <Input
                      placeholder={`Позиция ${index + 1}`}
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      className={styles.itemInput}
                      style={{ flex: 2 }}
                    />
                    <Select
                      value={item.unit}
                      onChange={(value) => handleItemChange(item.id, 'unit', value)}
                      options={unitOptions}
                      className={styles.itemSelect}
                      style={{ width: 70 }}
                      popupMatchSelectWidth={100}
                    />
                    <InputNumber
                      value={item.quantity || undefined}
                      onChange={(value) => handleItemChange(item.id, 'quantity', value || 0)}
                      placeholder="0"
                      min={0}
                      className={styles.itemNumber}
                      style={{ width: 80 }}
                    />
                    <InputNumber
                      value={item.unitPrice || undefined}
                      onChange={(value) => handleItemChange(item.id, 'unitPrice', value || 0)}
                      placeholder="0"
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                      parser={(value) => value!.replace(/\s/g, '') as unknown as number}
                      className={styles.itemNumber}
                      style={{ width: 120 }}
                    />
                    <span className={styles.itemSum} style={{ width: 110 }}>
                      {formatValue(item.quantity * item.unitPrice)}
                    </span>
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={items.length === 1}
                      className={styles.deleteButton}
                    />
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className={styles.totalRow}>
                <span>Итого по смете:</span>
                <strong>{formatValue(calculateTotal())}</strong>
              </div>
            </div>
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
            {loading ? 'Создание...' : 'Создать смету'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
