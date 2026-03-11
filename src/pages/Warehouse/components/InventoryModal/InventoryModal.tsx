import { useState, useMemo } from 'react'
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
  AuditOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useThemeStore } from '@shared/store'
import { mockMaterials, mockWarehouseItems } from '@mocks'
import { formatNumber } from '@shared/lib'
import styles from '../WarehouseModals.module.css'

interface InventoryModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: InventoryFormValues) => void
}

export interface InventoryItem {
  materialId: string
  systemQuantity: number
  actualQuantity: number
  difference: number
}

export interface InventoryFormValues {
  documentNumber: string
  date: dayjs.Dayjs
  warehouseLocation: string
  responsiblePerson: string
  items: InventoryItem[]
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

export function InventoryModal({ open, onClose, onSubmit }: InventoryModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<InventoryFormValues>()
  const [loading, setLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])

  const generateDocNumber = () => {
    const date = dayjs().format('YYYYMMDD')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `ИНВ-${date}-${random}`
  }

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location)

    // Get all items at this location
    const locationItems = mockWarehouseItems
      .filter(w => w.warehouseLocation === location)
      .map(w => ({
        materialId: w.materialId,
        systemQuantity: w.quantity,
        actualQuantity: w.quantity, // Default to system quantity
        difference: 0,
      }))

    setInventoryItems(locationItems)
  }

  const handleActualQuantityChange = (materialId: string, actualQuantity: number) => {
    setInventoryItems(prev =>
      prev.map(item => {
        if (item.materialId === materialId) {
          return {
            ...item,
            actualQuantity,
            difference: actualQuantity - item.systemQuantity,
          }
        }
        return item
      })
    )
  }

  const summary = useMemo(() => {
    const totalItems = inventoryItems.length
    const matchingItems = inventoryItems.filter(i => i.difference === 0).length
    const surplusItems = inventoryItems.filter(i => i.difference > 0).length
    const shortageItems = inventoryItems.filter(i => i.difference < 0).length

    return { totalItems, matchingItems, surplusItems, shortageItems }
  }, [inventoryItems])

  const getMaterialInfo = (materialId: string) => {
    return mockMaterials.find(m => m.id === materialId)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      if (inventoryItems.length === 0) {
        message.error('Нет материалов для инвентаризации')
        return
      }

      await new Promise(resolve => setTimeout(resolve, 800))

      onSubmit({ ...values, items: inventoryItems })
      message.success('Инвентаризация успешно завершена')
      handleClose()
    } catch {
      message.error('Пожалуйста, заполните все обязательные поля')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setSelectedLocation('')
    setInventoryItems([])
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
      className={`${styles.modal} ${isDark ? styles.dark : ''}`}
      closeIcon={<span className={styles.closeButton}>✕</span>}
    >
      <div>
        {/* Header */}
        <div className={`${styles.header} ${styles.headerInventory}`}>
          <div className={`${styles.headerIcon} ${styles.iconInventory}`}>
            <AuditOutlined />
          </div>
          <h2 className={styles.title}>Инвентаризация</h2>
          <p className={styles.subtitle}>Сверка фактических остатков</p>
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
              <Col xs={24} sm={8}>
                <Form.Item
                  name="documentNumber"
                  rules={[{ required: true, message: 'Введите номер' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Номер документа <span className={styles.required}>*</span>
                    </label>
                    <Input
                      size="large"
                      className={styles.input}
                      placeholder="ИНВ-20241215-001"
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
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
              <Col xs={24} sm={8}>
                <Form.Item
                  name="responsiblePerson"
                  rules={[{ required: true, message: 'Введите ФИО' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Ответственный <span className={styles.required}>*</span>
                    </label>
                    <Input
                      size="large"
                      className={styles.input}
                      placeholder="ФИО"
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            {/* Location Selection */}
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
                  placeholder="Выберите склад для инвентаризации"
                  options={warehouseLocations}
                  onChange={handleLocationChange}
                />
              </div>
            </Form.Item>

            {/* Inventory Table */}
            {selectedLocation && (
              <>
                <div className={styles.inventoryTable}>
                  <div className={`${styles.inventoryRow} ${styles.inventoryHeader}`}>
                    <div>Материал</div>
                    <div style={{ textAlign: 'center' }}>По системе</div>
                    <div style={{ textAlign: 'center' }}>Факт</div>
                    <div style={{ textAlign: 'center' }}>Разница</div>
                  </div>

                  {inventoryItems.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                      <FileSearchOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                      <div>На выбранном складе нет материалов</div>
                    </div>
                  ) : (
                    inventoryItems.map(item => {
                      const material = getMaterialInfo(item.materialId)
                      const diffClass = item.difference > 0
                        ? styles.positive
                        : item.difference < 0
                        ? styles.negative
                        : styles.neutral

                      return (
                        <div key={item.materialId} className={styles.inventoryRow}>
                          <div className={styles.inventoryCell}>
                            <div style={{ fontWeight: 500 }}>{material?.name}</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>
                              {material?.sku}
                            </div>
                          </div>
                          <div className={styles.inventoryCell} style={{ textAlign: 'center' }}>
                            {formatNumber(item.systemQuantity)} {material?.unit}
                          </div>
                          <div className={styles.inventoryCell}>
                            <InputNumber
                              size="middle"
                              min={0}
                              value={item.actualQuantity}
                              onChange={(value) =>
                                handleActualQuantityChange(item.materialId, value || 0)
                              }
                              style={{ width: '100%' }}
                              addonAfter={material?.unit}
                            />
                          </div>
                          <div
                            className={`${styles.inventoryCell} ${styles.difference} ${diffClass}`}
                            style={{ textAlign: 'center' }}
                          >
                            {item.difference > 0 ? '+' : ''}
                            {formatNumber(item.difference)} {material?.unit}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Summary */}
                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Всего позиций</span>
                    <span className={styles.summaryValue}>{summary.totalItems}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Совпадений</span>
                    <span className={styles.summaryValue} style={{ color: '#10b981' }}>
                      <CheckCircleOutlined style={{ marginRight: 4 }} />
                      {summary.matchingItems}
                    </span>
                  </div>
                  {summary.surplusItems > 0 && (
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Излишков</span>
                      <span className={styles.summaryValue} style={{ color: '#3b82f6' }}>
                        +{summary.surplusItems}
                      </span>
                    </div>
                  )}
                  {summary.shortageItems > 0 && (
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Недостач</span>
                      <span className={styles.summaryValue} style={{ color: '#ef4444' }}>
                        -{summary.shortageItems}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Notes */}
            <Form.Item name="notes">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Примечание</label>
                <Input.TextArea
                  rows={2}
                  className={styles.textarea}
                  placeholder="Комментарии по результатам инвентаризации..."
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
            className={`${styles.button} ${styles.primaryButton} ${styles.primaryInventory} ${loading ? styles.loading : ''}`}
            onClick={handleSubmit}
            disabled={loading || inventoryItems.length === 0}
          >
            <AuditOutlined />
            {loading ? 'Сохранение...' : 'Завершить инвентаризацию'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
