import { useEffect, useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  message,
  Tabs,
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
  InfoCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import dayjs from 'dayjs'
import { useThemeStore } from '@shared/store'
import type { Project, ProjectStatus } from '@shared/types'
import styles from './EditProjectModal.module.css'

interface EditProjectModalProps {
  open: boolean
  project: Project | null
  onClose: () => void
  onSubmit: (values: EditProjectFormValues) => void
}

export interface EditProjectFormValues {
  name: string
  description: string
  location: string
  address: string
  startDate: dayjs.Dayjs
  endDate: dayjs.Dayjs
  budget: number
  status: ProjectStatus
  progress: number
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

export function EditProjectModal({ open, project, onClose, onSubmit }: EditProjectModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<EditProjectFormValues>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)
  const [projectType, setProjectType] = useState<string>('residential')
  const [activeTab, setActiveTab] = useState('basic')

  // Populate form when project changes
  useEffect(() => {
    if (project && open) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
        location: project.location,
        address: project.address,
        startDate: dayjs(project.startDate),
        endDate: dayjs(project.endDate),
        budget: project.budget,
        status: project.status,
        progress: project.progress,
        totalArea: project.totalArea,
        floors: project.floors,
        apartments: project.apartments,
      })

      if (project.imageUrl) {
        setFileList([{
          uid: '-1',
          name: 'project-image',
          status: 'done',
          url: project.imageUrl,
        }])
      }
    }
  }, [project, open, form])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      onSubmit(values)
      message.success('Проект успешно обновлен')
      handleClose()
    } catch {
      message.error('Пожалуйста, заполните все обязательные поля')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setFileList([])
    setActiveTab('basic')
    onClose()
  }

  const tabItems = [
    {
      key: 'basic',
      label: (
        <span className={styles.tabLabel}>
          <InfoCircleOutlined />
          Основное
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
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

          <div className={styles.row}>
            <Form.Item
              name="status"
              rules={[{ required: true }]}
              className={styles.halfWidth}
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
                    { value: 'completed', label: '✅ Завершен' },
                    { value: 'cancelled', label: '❌ Отменен' },
                  ]}
                />
              </div>
            </Form.Item>

            <Form.Item
              name="progress"
              rules={[{ required: true, message: 'Введите прогресс' }]}
              className={styles.halfWidth}
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Прогресс (%)</label>
                <InputNumber
                  size="large"
                  className={styles.inputNumber}
                  placeholder="0"
                  min={0}
                  max={100}
                  style={{ width: '100%' }}
                />
              </div>
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: (
        <span className={styles.tabLabel}>
          <EnvironmentOutlined />
          Локация
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
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
      ),
    },
    {
      key: 'details',
      label: (
        <span className={styles.tabLabel}>
          <SettingOutlined />
          Детали
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
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
      ),
    },
  ]

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
            <PictureOutlined />
          </div>
          <h2 className={styles.title}>Редактировать проект</h2>
          <p className={styles.subtitle}>{project?.name}</p>
        </div>

        {/* Form with Tabs */}
        <Form
          form={form}
          layout="vertical"
          className={styles.form}
          requiredMark={false}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className={styles.tabs}
          />
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
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
