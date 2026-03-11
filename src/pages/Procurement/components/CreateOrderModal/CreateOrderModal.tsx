import { useState } from 'react'
import { Modal, Form, Input, Select, InputNumber, DatePicker, message, Row, Col } from 'antd'
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useThemeStore } from '@shared/store'
import { mockMaterials, mockProjects } from '@mocks'
import { formatCurrency } from '@shared/lib'
import styles from './CreateOrderModal.module.css'

interface CreateOrderModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: OrderFormValues) => void
}

interface OrderItem {
  materialId: string
  quantity: number
  unitPrice: number
}

export interface OrderFormValues {
  supplierId: string
  projectId?: string
  expectedDeliveryDate: dayjs.Dayjs
  items: OrderItem[]
  notes?: string
}

const mockSuppliers = [
  { id: '1', name: 'СтройМатериалы ООО' },
  { id: '2', name: 'МеталлТорг' },
  { id: '3', name: 'ЭлектроСнаб' },
]

export function CreateOrderModal({ open, onClose, onSubmit }: CreateOrderModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<OrderFormValues>()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<OrderItem[]>([{ materialId: '', quantity: 1, unitPrice: 0 }])

  const handleAddItem = () => setItems([...items, { materialId: '', quantity: 1, unitPrice: 0 }])

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: keyof OrderItem, value: unknown) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    if (field === 'materialId') {
      const material = mockMaterials.find(m => m.id === value)
      if (material) newItems[index].unitPrice = material.price
    }
    setItems(newItems)
  }

  const calculateTotal = () => items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const validItems = items.filter(item => item.materialId && item.quantity > 0)
      if (validItems.length === 0) {
        message.error('Добавьте хотя бы один материал')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 800))
      onSubmit({ ...values, items: validItems })
      message.success('Заказ успешно создан')
      handleClose()
    } catch {
      message.error('Заполните все обязательные поля')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setItems([{ materialId: '', quantity: 1, unitPrice: 0 }])
    onClose()
  }

  return (
    <Modal open={open} onCancel={handleClose} footer={null} width={700} centered destroyOnClose
      className={`${styles.modal} ${isDark ? styles.dark : ''}`}
      closeIcon={<span className={styles.closeButton}>✕</span>}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <div className={styles.headerIcon}><ShoppingCartOutlined /></div>
          <h2 className={styles.title}>Новый заказ</h2>
          <p className={styles.subtitle}>Заказ материалов у поставщика</p>
        </div>

        <Form form={form} layout="vertical" requiredMark={false}>
          <div className={styles.formContent}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="supplierId" rules={[{ required: true, message: 'Выберите поставщика' }]}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Поставщик <span className={styles.required}>*</span></label>
                    <Select size="large" className={styles.select} placeholder="Выберите поставщика"
                      options={mockSuppliers.map(s => ({ value: s.id, label: s.name }))} />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="expectedDeliveryDate" rules={[{ required: true, message: 'Выберите дату' }]}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Ожидаемая доставка <span className={styles.required}>*</span></label>
                    <DatePicker size="large" className={styles.datePicker} format="DD.MM.YYYY" placeholder="Выберите дату"
                      disabledDate={(current) => current && current < dayjs().startOf('day')} />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="projectId">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Проект</label>
                <Select size="large" className={styles.select} placeholder="Выберите проект" allowClear
                  options={mockProjects.map(p => ({ value: p.id, label: p.name }))} />
              </div>
            </Form.Item>

            <div className={styles.itemsSection}>
              <div className={styles.itemsHeader}>
                <span className={styles.itemsTitle}>Материалы</span>
                <button type="button" className={styles.addItemBtn} onClick={handleAddItem}>
                  <PlusOutlined /> Добавить
                </button>
              </div>

              {items.map((item, index) => (
                <div key={index} className={styles.itemCard}>
                  <div className={styles.itemNumber}>{index + 1}</div>
                  <div className={styles.itemContent}>
                    <Select size="large" className={styles.materialSelect} placeholder="Материал"
                      value={item.materialId || undefined}
                      onChange={(v) => handleItemChange(index, 'materialId', v)}
                      options={mockMaterials.map(m => ({ value: m.id, label: `${m.name} (${m.unit})` }))}
                      showSearch filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())} />
                    <InputNumber size="large" className={styles.quantityInput} placeholder="Кол-во" min={1}
                      value={item.quantity} onChange={(v) => handleItemChange(index, 'quantity', v || 1)} />
                    <InputNumber size="large" className={styles.priceInput} placeholder="Цена" min={0}
                      value={item.unitPrice} onChange={(v) => handleItemChange(index, 'unitPrice', v || 0)}
                      formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                      parser={(v) => v!.replace(/\s/g, '') as unknown as number} />
                  </div>
                  <button type="button" className={styles.removeItemBtn} onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1} style={{ opacity: items.length === 1 ? 0.3 : 1 }}>
                    <DeleteOutlined />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <span className={styles.summaryLabel}>Итого:</span>
              <span className={styles.summaryValue}>{formatCurrency(calculateTotal())}</span>
            </div>

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
          <button className={`${styles.button} ${styles.primaryButton} ${loading ? styles.loading : ''}`}
            onClick={handleSubmit} disabled={loading}>
            {loading ? 'Создание...' : 'Создать заказ'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
