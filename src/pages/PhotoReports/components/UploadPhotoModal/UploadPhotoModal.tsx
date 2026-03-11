import { useState } from 'react'
import { Modal, Form, Input, Select, Upload, message } from 'antd'
import { CameraOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import { useThemeStore } from '@shared/store'
import { mockProjects } from '@mocks'
import styles from './UploadPhotoModal.module.css'

interface UploadPhotoModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: PhotoFormValues) => void
}

export interface PhotoFormValues {
  projectId: string
  category: string
  description?: string
  photos: UploadFile[]
}

const categories = [
  { value: 'foundation', label: 'Фундамент' },
  { value: 'walls', label: 'Стены и перегородки' },
  { value: 'roof', label: 'Кровля' },
  { value: 'facade', label: 'Фасад' },
  { value: 'interior', label: 'Внутренняя отделка' },
  { value: 'engineering', label: 'Инженерные системы' },
  { value: 'landscape', label: 'Благоустройство' },
  { value: 'other', label: 'Прочее' },
]

export function UploadPhotoModal({ open, onClose, onSubmit }: UploadPhotoModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<PhotoFormValues>()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      if (fileList.length === 0) {
        message.error('Добавьте хотя бы одно фото')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 800))
      onSubmit({ ...values, photos: fileList })
      message.success('Фотоотчёт успешно загружен')
      handleClose()
    } catch {
      message.error('Заполните все обязательные поля')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setFileList([])
    onClose()
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as Blob)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    window.open(file.url || file.preview, '_blank')
  }

  const uploadButton = (
    <div className={styles.uploadButton}>
      <PlusOutlined />
      <div>Загрузить</div>
    </div>
  )

  return (
    <Modal open={open} onCancel={handleClose} footer={null} width={650} centered destroyOnClose
      className={`${styles.modal} ${isDark ? styles.dark : ''}`}
      closeIcon={<span className={styles.closeButton}>✕</span>}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <div className={styles.headerIcon}><CameraOutlined /></div>
          <h2 className={styles.title}>Загрузить фото</h2>
          <p className={styles.subtitle}>Добавление фотоотчёта по проекту</p>
        </div>

        <Form form={form} layout="vertical" requiredMark={false}>
          <div className={styles.formContent}>
            <Form.Item name="projectId" rules={[{ required: true, message: 'Выберите проект' }]}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Проект <span className={styles.required}>*</span></label>
                <Select size="large" className={styles.select} placeholder="Выберите проект"
                  options={mockProjects.map(p => ({ value: p.id, label: p.name }))}
                  showSearch filterOption={(input, option) =>
                    (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())} />
              </div>
            </Form.Item>

            <Form.Item name="category" rules={[{ required: true, message: 'Выберите категорию' }]}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Категория <span className={styles.required}>*</span></label>
                <Select size="large" className={styles.select} placeholder="Выберите категорию"
                  options={categories} />
              </div>
            </Form.Item>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Фотографии <span className={styles.required}>*</span></label>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={({ fileList: newList }) => setFileList(newList)}
                beforeUpload={() => false}
                multiple
                accept="image/*"
                className={styles.upload}
                itemRender={(_originNode, file, _, actions) => (
                  <div className={styles.uploadItem}>
                    <img src={file.thumbUrl || file.url} alt={file.name} className={styles.uploadThumb} />
                    <button type="button" className={styles.removeBtn} onClick={actions.remove}>
                      <DeleteOutlined />
                    </button>
                  </div>
                )}
              >
                {fileList.length >= 10 ? null : uploadButton}
              </Upload>
              <p className={styles.uploadHint}>Максимум 10 фото. Форматы: JPG, PNG, HEIC</p>
            </div>

            <Form.Item name="description">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Описание</label>
                <Input.TextArea rows={3} className={styles.textarea}
                  placeholder="Опишите выполненные работы..." />
              </div>
            </Form.Item>
          </div>
        </Form>

        <div className={styles.footer}>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handleClose}>Отмена</button>
          <button className={`${styles.button} ${styles.primaryButton} ${loading ? styles.loading : ''}`}
            onClick={handleSubmit} disabled={loading}>
            {loading ? 'Загрузка...' : 'Загрузить фото'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
