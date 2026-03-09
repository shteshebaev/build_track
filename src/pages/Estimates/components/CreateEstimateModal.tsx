import { useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
} from 'antd'
import {
  FileTextOutlined,
  ProjectOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { useThemeStore } from '@shared/store'
import { mockProjects } from '@mocks'
import styles from './CreateEstimateModal.module.css'

interface CreateEstimateModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: EstimateFormValues) => void
}

export interface EstimateFormValues {
  name: string
  description?: string
  projectId: string
  totalBudget: number
  status: 'draft' | 'active'
}

export function CreateEstimateModal({ open, onClose, onSubmit }: CreateEstimateModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<EstimateFormValues>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      onSubmit(values)
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
      width={520}
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
          <p className={styles.subtitle}>Создайте смету для проекта</p>
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
            <Form.Item
              name="projectId"
              rules={[{ required: true, message: 'Выберите проект' }]}
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
              name="name"
              rules={[{ required: true, message: 'Введите название сметы' }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Название сметы</label>
                <Input
                  size="large"
                  placeholder="например, Смета на общестроительные работы"
                  className={styles.input}
                  prefix={<FileTextOutlined className={styles.inputIcon} />}
                />
              </div>
            </Form.Item>

            <Form.Item name="description">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Описание</label>
                <Input.TextArea
                  placeholder="Краткое описание сметы..."
                  rows={3}
                  className={styles.textarea}
                />
              </div>
            </Form.Item>

            <Form.Item
              name="totalBudget"
              rules={[{ required: true, message: 'Введите бюджет' }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Бюджет сметы</label>
                <InputNumber
                  size="large"
                  className={styles.inputNumber}
                  placeholder="0"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  parser={(value) => value!.replace(/\s/g, '') as unknown as number}
                  addonAfter="сум"
                  prefix={<DollarOutlined className={styles.inputIcon} />}
                  style={{ width: '100%' }}
                />
              </div>
            </Form.Item>

            <Form.Item
              name="status"
              rules={[{ required: true }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Статус</label>
                <Select
                  size="large"
                  className={styles.select}
                  options={[
                    { value: 'draft', label: '📝 Черновик' },
                    { value: 'active', label: '✅ Активная' },
                  ]}
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
            {loading ? 'Создание...' : 'Создать смету'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
