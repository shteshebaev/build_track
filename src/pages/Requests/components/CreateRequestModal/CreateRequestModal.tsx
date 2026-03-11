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
  Steps,
} from 'antd'
import {
  FileTextOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  ProjectOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useThemeStore } from '@shared/store'
import { mockMaterials, mockProjects } from '@mocks'
import { formatCurrency } from '@shared/lib'
import styles from './CreateRequestModal.module.css'

interface CreateRequestModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: RequestFormValues) => void
}

export interface RequestItem {
  materialId: string
  quantity: number
  notes?: string
}

export interface RequestFormValues {
  projectId: string
  requiredDate: dayjs.Dayjs
  priority: 'low' | 'normal' | 'high' | 'urgent'
  items: RequestItem[]
  notes?: string
}

const priorities = [
  { value: 'low', label: 'Низкий', color: '#6B7280' },
  { value: 'normal', label: 'Обычный', color: '#3B82F6' },
  { value: 'high', label: 'Высокий', color: '#F59E0B' },
  { value: 'urgent', label: 'Срочный', color: '#EF4444' },
]

export function CreateRequestModal({ open, onClose, onSubmit }: CreateRequestModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<RequestFormValues>()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [items, setItems] = useState<RequestItem[]>([
    { materialId: '', quantity: 1 },
  ])

  const steps = [
    { title: 'Основное', icon: <ProjectOutlined /> },
    { title: 'Материалы', icon: <ShoppingCartOutlined /> },
    { title: 'Проверка', icon: <CheckCircleOutlined /> },
  ]

  const handleAddItem = () => {
    setItems([...items, { materialId: '', quantity: 1 }])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleItemChange = (index: number, field: keyof RequestItem, value: unknown) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const getMaterialInfo = (materialId: string) => {
    return mockMaterials.find(m => m.id === materialId)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const material = getMaterialInfo(item.materialId)
      return sum + (item.quantity * (material?.price || 0))
    }, 0)
  }

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['projectId', 'requiredDate', 'priority'])
      } else if (currentStep === 1) {
        const validItems = items.filter(item => item.materialId && item.quantity > 0)
        if (validItems.length === 0) {
          message.error('Добавьте хотя бы один материал')
          return
        }
      }
      setCurrentStep(currentStep + 1)
    } catch {
      // Validation failed
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const validItems = items.filter(item => item.materialId && item.quantity > 0)

      await new Promise(resolve => setTimeout(resolve, 800))

      onSubmit({ ...values, items: validItems })
      message.success('Заявка успешно создана')
      handleClose()
    } catch {
      message.error('Пожалуйста, заполните все обязательные поля')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setItems([{ materialId: '', quantity: 1 }])
    setCurrentStep(0)
    onClose()
  }

  const getProjectName = (projectId: string) => {
    return mockProjects.find(p => p.id === projectId)?.name || ''
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={styles.stepContent}>
            {/* Project Selection */}
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
                    label: (
                      <div className={styles.projectOption}>
                        <span className={styles.projectName}>{p.name}</span>
                        <span className={styles.projectLocation}>{p.location}</span>
                      </div>
                    ),
                  }))}
                  showSearch
                  filterOption={(input, option) => {
                    const project = mockProjects.find(p => p.id === option?.value)
                    return project?.name.toLowerCase().includes(input.toLowerCase()) || false
                  }}
                />
              </div>
            </Form.Item>

            {/* Required Date */}
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="requiredDate"
                  rules={[{ required: true, message: 'Выберите дату' }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Требуется к <span className={styles.required}>*</span>
                    </label>
                    <DatePicker
                      size="large"
                      className={styles.datePicker}
                      format="DD.MM.YYYY"
                      placeholder="Выберите дату"
                      disabledDate={(current) => current && current < dayjs().startOf('day')}
                      suffixIcon={<CalendarOutlined />}
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="priority"
                  initialValue="normal"
                  rules={[{ required: true }]}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Приоритет <span className={styles.required}>*</span>
                    </label>
                    <Select
                      size="large"
                      className={styles.select}
                      options={priorities.map(p => ({
                        value: p.value,
                        label: (
                          <div className={styles.priorityOption}>
                            <span className={styles.priorityDot} style={{ background: p.color }} />
                            {p.label}
                          </div>
                        ),
                      }))}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            {/* Notes */}
            <Form.Item name="notes">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Примечание к заявке</label>
                <Input.TextArea
                  rows={3}
                  className={styles.textarea}
                  placeholder="Дополнительная информация..."
                />
              </div>
            </Form.Item>
          </div>
        )

      case 1:
        return (
          <div className={styles.stepContent}>
            {/* Items Header */}
            <div className={styles.itemsHeader}>
              <div>
                <h3 className={styles.itemsTitle}>Список материалов</h3>
                <p className={styles.itemsSubtitle}>Добавьте необходимые материалы</p>
              </div>
              <button
                type="button"
                className={styles.addItemBtn}
                onClick={handleAddItem}
              >
                <PlusOutlined /> Добавить
              </button>
            </div>

            {/* Items List */}
            <div className={styles.itemsList}>
              {items.map((item, index) => {
                const material = getMaterialInfo(item.materialId)
                return (
                  <div key={index} className={styles.itemCard}>
                    <div className={styles.itemNumber}>{index + 1}</div>
                    <div className={styles.itemContent}>
                      <div className={styles.itemRow}>
                        <Select
                          size="large"
                          className={`${styles.select} ${styles.materialSelect}`}
                          placeholder="Выберите материал"
                          value={item.materialId || undefined}
                          onChange={(value) => handleItemChange(index, 'materialId', value)}
                          options={mockMaterials.map(m => ({
                            value: m.id,
                            label: `${m.name} (${m.unit})`,
                          }))}
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                          }
                        />
                        <InputNumber
                          size="large"
                          className={styles.quantityInput}
                          placeholder="Кол-во"
                          min={1}
                          value={item.quantity || undefined}
                          onChange={(value) => handleItemChange(index, 'quantity', value || 1)}
                          addonAfter={material?.unit || 'шт'}
                        />
                      </div>
                      {material && (
                        <div className={styles.itemInfo}>
                          <span className={styles.itemPrice}>
                            {formatCurrency(material.price)} / {material.unit}
                          </span>
                          <span className={styles.itemTotal}>
                            = {formatCurrency(material.price * item.quantity)}
                          </span>
                        </div>
                      )}
                      <Input
                        className={styles.itemNotes}
                        placeholder="Примечание к позиции..."
                        value={item.notes || ''}
                        onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
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
                <span className={styles.summaryLabel}>Ориентировочная сумма</span>
                <span className={`${styles.summaryValue} ${styles.summaryTotal}`}>
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          </div>
        )

      case 2:
        const projectId = form.getFieldValue('projectId')
        const requiredDate = form.getFieldValue('requiredDate')
        const priority = form.getFieldValue('priority')
        const notes = form.getFieldValue('notes')
        const validItems = items.filter(i => i.materialId && i.quantity > 0)
        const priorityConfig = priorities.find(p => p.value === priority)

        return (
          <div className={styles.stepContent}>
            <div className={styles.reviewSection}>
              <h4 className={styles.reviewTitle}>Информация о заявке</h4>
              <div className={styles.reviewCard}>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Проект</span>
                  <span className={styles.reviewValue}>{getProjectName(projectId)}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Требуется к</span>
                  <span className={styles.reviewValue}>
                    {requiredDate ? dayjs(requiredDate).format('DD.MM.YYYY') : '-'}
                  </span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Приоритет</span>
                  <span className={styles.reviewValue}>
                    <span
                      className={styles.priorityBadge}
                      style={{ background: priorityConfig?.color }}
                    >
                      {priorityConfig?.label}
                    </span>
                  </span>
                </div>
                {notes && (
                  <div className={styles.reviewRow}>
                    <span className={styles.reviewLabel}>Примечание</span>
                    <span className={styles.reviewValue}>{notes}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.reviewSection}>
              <h4 className={styles.reviewTitle}>Материалы ({validItems.length})</h4>
              <div className={styles.reviewItems}>
                {validItems.map((item, index) => {
                  const material = getMaterialInfo(item.materialId)
                  return (
                    <div key={index} className={styles.reviewItem}>
                      <div className={styles.reviewItemInfo}>
                        <span className={styles.reviewItemName}>{material?.name}</span>
                        <span className={styles.reviewItemSku}>{material?.sku}</span>
                      </div>
                      <div className={styles.reviewItemQty}>
                        {item.quantity} {material?.unit}
                      </div>
                      <div className={styles.reviewItemPrice}>
                        {formatCurrency((material?.price || 0) * item.quantity)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={styles.totalCard}>
              <span className={styles.totalLabel}>Итого</span>
              <span className={styles.totalValue}>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={680}
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
          <h2 className={styles.title}>Новая заявка</h2>
          <p className={styles.subtitle}>Заявка на материалы</p>
        </div>

        {/* Steps */}
        <div className={styles.stepsContainer}>
          <Steps
            current={currentStep}
            items={steps.map((step, index) => ({
              title: step.title,
              icon: (
                <div className={`${styles.stepIcon} ${currentStep >= index ? styles.active : ''}`}>
                  {step.icon}
                </div>
              ),
            }))}
            className={styles.steps}
          />
        </div>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          {renderStepContent()}
        </Form>

        {/* Footer */}
        <div className={styles.footer}>
          {currentStep > 0 && (
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={handleBack}
            >
              Назад
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={handleNext}
            >
              Далее
            </button>
          ) : (
            <button
              className={`${styles.button} ${styles.primaryButton} ${loading ? styles.loading : ''}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              <FileTextOutlined />
              {loading ? 'Создание...' : 'Создать заявку'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
