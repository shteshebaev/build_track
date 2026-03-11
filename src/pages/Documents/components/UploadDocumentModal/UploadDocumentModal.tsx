import { useState } from 'react'
import { Modal, Form, Input, Select, Upload, message } from 'antd'
import { FileAddOutlined, InboxOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import { useThemeStore } from '@shared/store'
import { mockProjects } from '@mocks'
import styles from './UploadDocumentModal.module.css'

const { Dragger } = Upload

interface UploadDocumentModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: DocumentFormValues) => void
}

export interface DocumentFormValues {
  name: string
  projectId?: string
  category: string
  description?: string
  files: UploadFile[]
}

const categories = [
  { value: 'contract', label: 'Договоры' },
  { value: 'permit', label: 'Разрешения' },
  { value: 'drawing', label: 'Чертежи' },
  { value: 'estimate', label: 'Сметы' },
  { value: 'act', label: 'Акты' },
  { value: 'specification', label: 'Спецификации' },
  { value: 'report', label: 'Отчёты' },
  { value: 'other', label: 'Прочее' },
]

export function UploadDocumentModal({ open, onClose, onSubmit }: UploadDocumentModalProps) {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm<DocumentFormValues>()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      if (fileList.length === 0) {
        message.error('Добавьте хотя бы один файл')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 800))
      onSubmit({ ...values, files: fileList })
      message.success('Документ успешно загружен')
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

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['pdf'].includes(ext || '')) return '📄'
    if (['doc', 'docx'].includes(ext || '')) return '📝'
    if (['xls', 'xlsx'].includes(ext || '')) return '📊'
    if (['dwg', 'dxf'].includes(ext || '')) return '📐'
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return '🖼️'
    return '📎'
  }

  return (
    <Modal open={open} onCancel={handleClose} footer={null} width={600} centered destroyOnClose
      className={`${styles.modal} ${isDark ? styles.dark : ''}`}
      closeIcon={<span className={styles.closeButton}>✕</span>}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <div className={styles.headerIcon}><FileAddOutlined /></div>
          <h2 className={styles.title}>Загрузить документ</h2>
          <p className={styles.subtitle}>Добавление документа в систему</p>
        </div>

        <Form form={form} layout="vertical" requiredMark={false}>
          <div className={styles.formContent}>
            <Form.Item name="name" rules={[{ required: true, message: 'Введите название' }]}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Название документа <span className={styles.required}>*</span></label>
                <Input size="large" className={styles.input} placeholder="Введите название документа" />
              </div>
            </Form.Item>

            <Form.Item name="category" rules={[{ required: true, message: 'Выберите категорию' }]}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Категория <span className={styles.required}>*</span></label>
                <Select size="large" className={styles.select} placeholder="Выберите категорию"
                  options={categories} />
              </div>
            </Form.Item>

            <Form.Item name="projectId">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Проект</label>
                <Select size="large" className={styles.select} placeholder="Выберите проект (опционально)"
                  options={mockProjects.map(p => ({ value: p.id, label: p.name }))} allowClear
                  showSearch filterOption={(input, option) =>
                    (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())} />
              </div>
            </Form.Item>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Файлы <span className={styles.required}>*</span></label>
              <Dragger
                fileList={fileList}
                onChange={({ fileList: newList }) => setFileList(newList)}
                beforeUpload={() => false}
                multiple
                className={styles.dragger}
              >
                <p className={styles.draggerIcon}><InboxOutlined /></p>
                <p className={styles.draggerText}>Перетащите файлы сюда</p>
                <p className={styles.draggerHint}>или нажмите для выбора</p>
              </Dragger>

              {fileList.length > 0 && (
                <div className={styles.fileList}>
                  {fileList.map(file => (
                    <div key={file.uid} className={styles.fileItem}>
                      <span className={styles.fileIcon}>{getFileIcon(file.name)}</span>
                      <span className={styles.fileName}>{file.name}</span>
                      <button type="button" className={styles.fileRemove}
                        onClick={() => setFileList(fileList.filter(f => f.uid !== file.uid))}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Form.Item name="description">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Описание</label>
                <Input.TextArea rows={2} className={styles.textarea}
                  placeholder="Дополнительная информация о документе..." />
              </div>
            </Form.Item>
          </div>
        </Form>

        <div className={styles.footer}>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handleClose}>Отмена</button>
          <button className={`${styles.button} ${styles.primaryButton} ${loading ? styles.loading : ''}`}
            onClick={handleSubmit} disabled={loading}>
            {loading ? 'Загрузка...' : 'Загрузить'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
