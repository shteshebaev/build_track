import { useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  message,
  Row,
  Col,
} from 'antd'
import {
  MinusCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useThemeStore } from '@shared/store'
import { mockMaterials, mockProjects, mockWarehouseItems } from '@mocks'
import { formatCurrency, formatNumber } from '@shared/lib'
import styles from '../WarehouseModals.module.css'

interface IssueModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: IssueFormValues) => void
}

export interface IssueItem {
  materialId: string
  quantity: number
}

export interface IssueFormValues {
  documentNumber: string
  date: dayjs.Dayjs
  projectId: string
  recipient: string
  purpose: string
  items: IssueItem[]
  notes?: string
}

const purposes = [
  { value: 'construction', label: 'Строительные работы' },
  { value: 'repair', label: 'Ремонтные работы' },
  { value: 'installation', label: 'Монтажные работы' },
  { value: 'finishing', label: 'Отделочные работы' },
  { value: 'other', label: 'Прочее' },
]

export function IssueModal({ open, onClose, onSubmit }: IssueModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<IssueFormValues>()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<IssueItem[]>([
    { materialId: '', quantity: 0 },
  ])

  const generateDocNumber = () => {
    const date = dayjs().format('YYYYMMDD')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `РС-${date}-${random}`
  }

  const getAvailableQuantity = (materialId: string): number => {
    const warehouseItem = mockWarehouseItems.find(w => w.materialId === materialId)
    if (!warehouseItem) return 0
    return warehouseItem.quantity - warehouseItem.reservedQuantity
  }

  const getMaterialUnit = (materialId: string): string => {
    const material = mockMaterials.find(m => m.id === materialId)
    return material?.unit || ''
  }

  const handleAddItem = () => {
    setItems([...items, { materialId: '', quantity: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleItemChange = (index: number, field: keyof IssueItem, value: unknown) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const calculateTotalValue = () => {
    return items.reduce((sum, item) => {
      const material = mockMaterials.find(m => m.id === item.materialId)
      return sum + (item.quantity * (material?.price || 0))
    }, 0)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      // Validate items
      const validItems = items.filter(item => item.materialId && item.quantity > 0)
      if (validItems.length === 0) {
        message.error('Добавьте хотя бы один материал')
        return
      }

      // Check available quantities
      for (const item of validItems) {
        const available = getAvailableQuantity(item.materialId)
        if (item.quantity > available) {
          const material = mockMaterials.find(m => m.id === item.materialId)
          message.error(`Недостаточно ${material?.name}. Доступно: ${formatNumber(available)} ${material?.unit}`)
          return
        }
      }

      await new Promise(resolve => setTimeout(resolve, 800))

      onSubmit({ ...values, items: validItems })
      message.success('Расход успешно оформлен')
      handleClose()
    } catch {
      message.error('Пожалуйста, заполните все обязательные поля')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setItems([{ materialId: '', quantity: 0 }])
    onClose()
  }

  // Available materials (only those in stock)
  const availableMaterials = mockMaterials.filter(m => {
    const warehouseItem = mockWarehouseItems.find(w => w.materialId === m.id)
    return warehouseItem && (warehouseItem.quantity - warehouseItem.reservedQuantity) > 0
  })

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
      <div>
        {/* Header */}
        <div className={`${styles.header} ${styles.headerIssue}`}>
          <div className={`${styles.headerIcon} ${styles.iconIssue}`}>
            <MinusCircleOutlined />
          </div>
          <h2 className={styles.title}>Расход материалов</h2>
          <p className={styles.subtitle}>Оформление выдачи со склада</p>
        </div>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={{
            documentNumber: generateDocNumber(),
            date: dayjs(),
          }}
        >
          <div className={styles.formContent}>
            {/* Document Info */}
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="documentNumber"
                  rules={[{ required: true, message: 'Введите номер документа' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Номер документа <span className={styles.required}>*</span>
                    </label>
                    <Input
                      size="large"
                      className={styles.input}
                      placeholder="РС-20241215-001"
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="date"
                  rules={[{ required: true, message: 'Выберите дату' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Дата <span className={styles.required}>*</span>
                    </label>
                    <DatePicker
                      size="large"
                      className={styles.datePicker}
                      format="DD.MM.YYYY"
                      placeholder="Выберите дату"
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            {/* Project and Recipient */}
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="projectId"
                  rules={[{ required: true, message: 'Выберите проект' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Проект <span className={styles.required}>*</span>
                    </label>
                    <Select
                      size="large"
                      className={styles.select}
                      placeholder="Выберите проект"
                      options={mockProjects.map(p => ({
                        value: p.id,
                        label: p.name,
                      }))}
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="recipient"
                  rules={[{ required: true, message: 'Введите получателя' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Получатель <span className={styles.required}>*</span>
                    </label>
                    <Input
                      size="large"
                      className={styles.input}
                      placeholder="ФИО получателя"
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            {/* Purpose */}
            <Form.Item
              name="purpose"
              rules={[{ required: true, message: 'Выберите назначение' }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Назначение <span className={styles.required}>*</span>
                </label>
                <Select
                  size="large"
                  className={styles.select}
                  placeholder="Выберите назначение"
                  options={purposes}
                />
              </div>
            </Form.Item>

            {/* Items */}
            <div className={styles.itemsList}>
              <div className={styles.itemsHeader}>
                <span className={styles.itemsTitle}>Материалы</span>
                <button
                  type="button"
                  className={styles.addItemBtn}
                  onClick={handleAddItem}
                >
                  <PlusOutlined /> Добавить
                </button>
              </div>

              {items.map((item, index) => {
                const available = item.materialId ? getAvailableQuantity(item.materialId) : 0
                const unit = item.materialId ? getMaterialUnit(item.materialId) : ''

                return (
                  <div key={index} className={styles.itemCard}>
                    <div className={styles.itemNumber}>{index + 1}</div>
                    <div className={styles.itemContent}>
                      <Select
                        size="large"
                        className={`${styles.select} ${styles.itemSelect}`}
                        placeholder="Выберите материал"
                        value={item.materialId || undefined}
                        onChange={(value) => handleItemChange(index, 'materialId', value)}
                        options={availableMaterials.map(m => {
                          const qty = getAvailableQuantity(m.id)
                          return {
                            value: m.id,
                            label: `${m.name} (доступно: ${formatNumber(qty)} ${m.unit})`,
                          }
                        })}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                      />
                      <InputNumber
                        size="large"
                        className={`${styles.inputNumber} ${styles.itemQuantity}`}
                        placeholder="Кол-во"
                        min={1}
                        max={available}
                        value={item.quantity || undefined}
                        onChange={(value) => handleItemChange(index, 'quantity', value || 0)}
                        addonAfter={unit}
                      />
                    </div>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length === 1}
                      style={{ opacity: items.length === 1 ? 0.3 : 1 }}
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Позиций</span>
                <span className={styles.summaryValue}>
                  {items.filter(i => i.materialId).length}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Стоимость</span>
                <span className={`${styles.summaryValue} ${styles.summaryTotal}`}>
                  {formatCurrency(calculateTotalValue())}
                </span>
              </div>
            </div>

            {/* Notes */}
            <Form.Item name="notes">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Примечание</label>
                <Input.TextArea
                  rows={2}
                  className={styles.textarea}
                  placeholder="Дополнительная информация..."
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
            className={`${styles.button} ${styles.primaryButton} ${styles.primaryIssue} ${loading ? styles.loading : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            <ExportOutlined />
            {loading ? 'Оформление...' : 'Оформить расход'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
