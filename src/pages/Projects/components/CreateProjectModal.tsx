import { useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  message,
  Steps,
} from 'antd'
import {
  ProjectOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  PictureOutlined,
  PlusOutlined,
  HomeOutlined,
  BuildOutlined,
} from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import dayjs from 'dayjs'
import { useThemeStore } from '@shared/store'
import type { ProjectStatus } from '@shared/types'
import styles from './CreateProjectModal.module.css'

interface CreateProjectModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: ProjectFormValues) => void
}

export interface ProjectFormValues {
  name: string
  description: string
  location: string
  address: string
  startDate: dayjs.Dayjs
  endDate: dayjs.Dayjs
  budget: number
  status: ProjectStatus
  totalArea?: number
  floors?: number
  apartments?: number
  imageUrl?: string
}

const projectTypes = [
  { value: 'residential', label: 'Жилой комплекс', icon: <HomeOutlined /> },
  { value: 'commercial', label: 'Бизнес центр', icon: <BuildOutlined /> },
  { value: 'industrial', label: 'Промышленный', icon: <BuildOutlined /> },
  { value: 'infrastructure', label: 'Инфраструктура', icon: <BuildOutlined /> },
]

export function CreateProjectModal({ open, onClose, onSubmit }: CreateProjectModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<ProjectFormValues>()
  const [currentStep, setCurrentStep] = useState(0)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)
  const [projectType, setProjectType] = useState<string>('residential')

  const steps = [
    { title: 'Основное', icon: <ProjectOutlined /> },
    { title: 'Локация', icon: <EnvironmentOutlined /> },
    { title: 'Детали', icon: <BuildOutlined /> },
  ]

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['name', 'description', 'status'])
      } else if (currentStep === 1) {
        await form.validateFields(['location', 'address'])
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

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      onSubmit(values)
      message.success('Проект успешно создан')
      handleClose()
    } catch {
      message.error('Пожалуйста, заполните все обязательные поля')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setCurrentStep(0)
    setFileList([])
    setProjectType('residential')
    onClose()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={styles.stepContent}>
            {/* Project Type Selection */}
            <div className={styles.typeSelector}>
              <label className={styles.inputLabel}>Тип проекта</label>
              <div className={styles.typeGrid}>
                {projectTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`${styles.typeCard} ${projectType === type.value ? styles.selected : ''}`}
                    onClick={() => setProjectType(type.value)}
                  >
                    <div className={styles.typeIcon}>{type.icon}</div>
                    <span className={styles.typeLabel}>{type.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Введите название проекта' }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Название проекта</label>
                <Input
                  placeholder="например, ЖК «Солнечный»"
                  size="large"
                  className={styles.input}
                  prefix={<ProjectOutlined className={styles.inputIcon} />}
                />
              </div>
            </Form.Item>

            <Form.Item
              name="description"
              rules={[{ required: true, message: 'Введите описание' }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Описание</label>
                <Input.TextArea
                  placeholder="Краткое описание проекта..."
                  rows={3}
                  className={styles.textarea}
                />
              </div>
            </Form.Item>

            <Form.Item
              name="status"
              initialValue="planning"
              rules={[{ required: true }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Статус</label>
                <Select
                  size="large"
                  className={styles.select}
                  options={[
                    { value: 'planning', label: '📋 Планирование' },
                    { value: 'in_progress', label: '🚧 В процессе' },
                    { value: 'on_hold', label: '⏸️ Приостановлен' },
                  ]}
                />
              </div>
            </Form.Item>
          </div>
        )

      case 1:
        return (
          <div className={styles.stepContent}>
            <Form.Item
              name="location"
              rules={[{ required: true, message: 'Введите город/район' }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Город / Район</label>
                <Input
                  placeholder="например, Ташкент, Чиланзарский район"
                  size="large"
                  className={styles.input}
                  prefix={<EnvironmentOutlined className={styles.inputIcon} />}
                />
              </div>
            </Form.Item>

            <Form.Item
              name="address"
              rules={[{ required: true, message: 'Введите адрес' }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Полный адрес</label>
                <Input.TextArea
                  placeholder="Улица, номер дома, ориентир..."
                  rows={2}
                  className={styles.textarea}
                />
              </div>
            </Form.Item>

            {/* Map placeholder */}
            <div className={styles.mapPlaceholder}>
              <EnvironmentOutlined className={styles.mapIcon} />
              <span>Нажмите чтобы выбрать на карте</span>
            </div>

            <div className={styles.row}>
              <Form.Item
                name="startDate"
                rules={[{ required: true, message: 'Выберите дату' }]}
                className={styles.halfWidth}
              >
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Дата начала</label>
                  <DatePicker
                    size="large"
                    className={styles.datePicker}
                    placeholder="Выберите дату"
                    format="DD.MM.YYYY"
                    suffixIcon={<CalendarOutlined />}
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="endDate"
                rules={[{ required: true, message: 'Выберите дату' }]}
                className={styles.halfWidth}
              >
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Дата завершения</label>
                  <DatePicker
                    size="large"
                    className={styles.datePicker}
                    placeholder="Выберите дату"
                    format="DD.MM.YYYY"
                    suffixIcon={<CalendarOutlined />}
                  />
                </div>
              </Form.Item>
            </div>
          </div>
        )

      case 2:
        return (
          <div className={styles.stepContent}>
            <Form.Item
              name="budget"
              rules={[{ required: true, message: 'Введите бюджет' }]}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Бюджет проекта</label>
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

            {projectType === 'residential' && (
              <>
                <div className={styles.row}>
                  <Form.Item name="floors" className={styles.halfWidth}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Этажность</label>
                      <InputNumber
                        size="large"
                        className={styles.inputNumber}
                        placeholder="0"
                        min={1}
                        max={100}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </Form.Item>

                  <Form.Item name="apartments" className={styles.halfWidth}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Количество квартир</label>
                      <InputNumber
                        size="large"
                        className={styles.inputNumber}
                        placeholder="0"
                        min={1}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </Form.Item>
                </div>
              </>
            )}

            <Form.Item name="totalArea">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Общая площадь</label>
                <InputNumber
                  size="large"
                  className={styles.inputNumber}
                  placeholder="0"
                  addonAfter="м²"
                  style={{ width: '100%' }}
                />
              </div>
            </Form.Item>

            {/* Image Upload */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Изображение проекта</label>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
                className={styles.upload}
              >
                {fileList.length === 0 && (
                  <div className={styles.uploadButton}>
                    <PlusOutlined />
                    <div>Загрузить</div>
                  </div>
                )}
              </Upload>
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
      width={560}
      centered
      destroyOnClose
      className={`${styles.modal} ${isDark ? styles.dark : ''}`}
      closeIcon={<span className={styles.closeButton}>✕</span>}
    >
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <PictureOutlined />
          </div>
          <h2 className={styles.title}>Новый проект</h2>
          <p className={styles.subtitle}>Заполните информацию о проекте</p>
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
          className={styles.form}
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
              {loading ? 'Создание...' : 'Создать проект'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
