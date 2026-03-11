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
  SwapOutlined,
  DeleteOutlined,
  PlusOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useThemeStore } from '@shared/store'
import { mockMaterials, mockProjects, mockWarehouseItems } from '@mocks'
import { formatNumber } from '@shared/lib'
import styles from '../WarehouseModals.module.css'

interface TransferModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: TransferFormValues) => void
}

export interface TransferItem {
  materialId: string
  quantity: number
}

export interface TransferFormValues {
  documentNumber: string
  date: dayjs.Dayjs
  fromLocation: string
  toLocation: string
  fromProjectId?: string
  toProjectId?: string
  items: TransferItem[]
  reason: string
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

const transferReasons = [
  { value: 'project_needs', label: 'Потребности проекта' },
  { value: 'optimization', label: 'Оптимизация хранения' },
  { value: 'consolidation', label: 'Консолидация запасов' },
  { value: 'rebalancing', label: 'Перебалансировка' },
  { value: 'other', label: 'Другое' },
]

export function TransferModal({ open, onClose, onSubmit }: TransferModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<TransferFormValues>()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<TransferItem[]>([
    { materialId: '', quantity: 0 },
  ])
  const [fromLocation, setFromLocation] = useState<string>('')

  const generateDocNumber = () => {
    const date = dayjs().format('YYYYMMDD')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `ПМ-${date}-${random}`
  }

  const getAvailableAtLocation = (materialId: string, location: string): number => {
    const warehouseItem = mockWarehouseItems.find(
      w => w.materialId === materialId && w.warehouseLocation === location
    )
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

  const handleItemChange = (index: number, field: keyof TransferItem, value: unknown) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleFromLocationChange = (value: string) => {
    setFromLocation(value)
    // Reset items when source location changes
    setItems([{ materialId: '', quantity: 0 }])
  }

  // Get materials available at selected source location
  const availableMaterials = fromLocation
    ? mockWarehouseItems
        .filter(w => w.warehouseLocation === fromLocation && (w.quantity - w.reservedQuantity) > 0)
        .map(w => ({
          ...mockMaterials.find(m => m.id === w.materialId),
          available: w.quantity - w.reservedQuantity,
        }))
        .filter(m => m.id)
    : []

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
        const available = getAvailableAtLocation(item.materialId, values.fromLocation)
        if (item.quantity > available) {
          const material = mockMaterials.find(m => m.id === item.materialId)
          message.error(`Недостаточно ${material?.name} на выбранном складе`)
          return
        }
      }

      // Validate different locations
      if (values.fromLocation === values.toLocation) {
        message.error('Выберите разные местоположения')
        return
      }

      await new Promise(resolve => setTimeout(resolve, 800))

      onSubmit({ ...values, items: validItems })
      message.success('Перемещение успешно оформлено')
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
    setFromLocation('')
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
        <div className={`${styles.header} ${styles.headerTransfer}`}>
          <div className={`${styles.headerIcon} ${styles.iconTransfer}`}>
            <SwapOutlined />
          </div>
          <h2 className={styles.title}>Перемещение материалов</h2>
          <p className={styles.subtitle}>Перемещение между складами/проектами</p>
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
                      placeholder="ПМ-20241215-001"
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

            {/* From/To Locations */}
            <Row gutter={16} align="middle">
              <Col xs={24} sm={11}>
                <Form.Item
                  name="fromLocation"
                  rules={[{ required: true, message: 'Выберите откуда' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Откуда <span className={styles.required}>*</span>
                    </label>
                    <Select
                      size="large"
                      className={styles.select}
                      placeholder="Выберите склад"
                      options={warehouseLocations}
                      onChange={handleFromLocationChange}
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={2} style={{ textAlign: 'center', paddingTop: 12 }}>
                <ArrowRightOutlined style={{ fontSize: 20, color: '#6b7280' }} />
              </Col>
              <Col xs={24} sm={11}>
                <Form.Item
                  name="toLocation"
                  rules={[{ required: true, message: 'Выберите куда' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Куда <span className={styles.required}>*</span>
                    </label>
                    <Select
                      size="large"
                      className={styles.select}
                      placeholder="Выберите склад"
                      options={warehouseLocations.filter(l => l.value !== fromLocation)}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            {/* Projects (optional) */}
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="fromProjectId">
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Проект-источник</label>
                    <Select
                      size="large"
                      className={styles.select}
                      placeholder="Выберите проект"
                      allowClear
                      options={[
                        { value: '', label: 'Центральный склад' },
                        ...mockProjects.map(p => ({
                          value: p.id,
                          label: p.name,
                        })),
                      ]}
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="toProjectId">
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Проект-получатель</label>
                    <Select
                      size="large"
                      className={styles.select}
                      placeholder="Выберите проект"
                      allowClear
                      options={[
                        { value: '', label: 'Центральный склад' },
                        ...mockProjects.map(p => ({
                          value: p.id,
                          label: p.name,
                        })),
                      ]}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            {/* Reason */}
            <Form.Item
              name="reason"
              rules={[{ required: true, message: 'Выберите причину' }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Причина перемещения <span className={styles.required}>*</span>
                </label>
                <Select
                  size="large"
                  className={styles.select}
                  placeholder="Выберите причину"
                  options={transferReasons}
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
                  disabled={!fromLocation}
                  style={{ opacity: fromLocation ? 1 : 0.5 }}
                >
                  <PlusOutlined /> Добавить
                </button>
              </div>

              {!fromLocation && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  Сначала выберите склад-источник
                </div>
              )}

              {fromLocation && items.map((item, index) => {
                const available = item.materialId
                  ? getAvailableAtLocation(item.materialId, fromLocation)
                  : 0
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
                        options={availableMaterials.map(m => ({
                          value: m.id,
                          label: `${m.name} (${formatNumber(m.available || 0)} ${m.unit})`,
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
                <span className={styles.summaryLabel}>Позиций к перемещению</span>
                <span className={styles.summaryValue}>
                  {items.filter(i => i.materialId && i.quantity > 0).length}
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
            className={`${styles.button} ${styles.primaryButton} ${styles.primaryTransfer} ${loading ? styles.loading : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            <SwapOutlined />
            {loading ? 'Оформление...' : 'Оформить перемещение'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
