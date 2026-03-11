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
  PlusCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  InboxOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useThemeStore } from '@shared/store'
import { mockMaterials, mockProjects } from '@mocks'
import { formatCurrency } from '@shared/lib'
import styles from '../WarehouseModals.module.css'

interface ReceiptModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: ReceiptFormValues) => void
}

export interface ReceiptItem {
  materialId: string
  quantity: number
  price: number
}

export interface ReceiptFormValues {
  documentNumber: string
  date: dayjs.Dayjs
  supplierId?: string
  projectId?: string
  warehouseLocation: string
  items: ReceiptItem[]
  notes?: string
}

const warehouseLocations = [
  { value: 'Склад А, секция 1', label: 'Склад А, секция 1' },
  { value: 'Склад А, секция 2', label: 'Склад А, секция 2' },
  { value: 'Склад А, секция 3', label: 'Склад А, секция 3' },
  { value: 'Склад Б, открытая площадка', label: 'Склад Б, открытая площадка' },
  { value: 'Склад В, крытый', label: 'Склад В, крытый' },
  { value: 'Центральный склад', label: 'Центральный склад' },
]

export function ReceiptModal({ open, onClose, onSubmit }: ReceiptModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<ReceiptFormValues>()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<ReceiptItem[]>([
    { materialId: '', quantity: 0, price: 0 },
  ])

  const generateDocNumber = () => {
    const date = dayjs().format('YYYYMMDD')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `ПР-${date}-${random}`
  }

  const handleAddItem = () => {
    setItems([...items, { materialId: '', quantity: 0, price: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleItemChange = (index: number, field: keyof ReceiptItem, value: unknown) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Auto-fill price when material is selected
    if (field === 'materialId') {
      const material = mockMaterials.find(m => m.id === value)
      if (material) {
        newItems[index].price = material.price
      }
    }

    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
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

      await new Promise(resolve => setTimeout(resolve, 800))

      onSubmit({ ...values, items: validItems })
      message.success('Приход успешно оформлен')
      handleClose()
    } catch {
      message.error('Пожалуйста, заполните все обязательные поля')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setItems([{ materialId: '', quantity: 0, price: 0 }])
    onClose()
  }

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
        <div className={`${styles.header} ${styles.headerReceipt}`}>
          <div className={`${styles.headerIcon} ${styles.iconReceipt}`}>
            <PlusCircleOutlined />
          </div>
          <h2 className={styles.title}>Приход материалов</h2>
          <p className={styles.subtitle}>Оформление поступления на склад</p>
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
                      placeholder="ПР-20241215-001"
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

            {/* Project and Location */}
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="projectId">
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Проект</label>
                    <Select
                      size="large"
                      className={styles.select}
                      placeholder="Выберите проект"
                      allowClear
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
                  name="warehouseLocation"
                  rules={[{ required: true, message: 'Выберите склад' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Место хранения <span className={styles.required}>*</span>
                    </label>
                    <Select
                      size="large"
                      className={styles.select}
                      placeholder="Выберите склад"
                      options={warehouseLocations}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>

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

              {items.map((item, index) => (
                <div key={index} className={styles.itemCard}>
                  <div className={styles.itemNumber}>{index + 1}</div>
                  <div className={styles.itemContent}>
                    <Select
                      size="large"
                      className={`${styles.select} ${styles.itemSelect}`}
                      placeholder="Выберите материал"
                      value={item.materialId || undefined}
                      onChange={(value) => handleItemChange(index, 'materialId', value)}
                      options={mockMaterials.map(m => ({
                        value: m.id,
                        label: `${m.name} (${m.unit})`,
                      }))}
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
                      value={item.quantity || undefined}
                      onChange={(value) => handleItemChange(index, 'quantity', value || 0)}
                    />
                    <InputNumber
                      size="large"
                      className={`${styles.inputNumber} ${styles.itemQuantity}`}
                      placeholder="Цена"
                      min={0}
                      value={item.price || undefined}
                      onChange={(value) => handleItemChange(index, 'price', value || 0)}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                      parser={(value) => value!.replace(/\s/g, '') as unknown as number}
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
              ))}
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
                <span className={styles.summaryLabel}>Итого</span>
                <span className={`${styles.summaryValue} ${styles.summaryTotal}`}>
                  {formatCurrency(calculateTotal())}
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
            className={`${styles.button} ${styles.primaryButton} ${styles.primaryReceipt} ${loading ? styles.loading : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            <InboxOutlined />
            {loading ? 'Оформление...' : 'Оформить приход'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
