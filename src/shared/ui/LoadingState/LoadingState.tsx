import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import styles from './LoadingState.module.css'

interface LoadingStateProps {
  text?: string
  fullScreen?: boolean
}

export function LoadingState({ text = 'Загрузка...', fullScreen = false }: LoadingStateProps) {
  const content = (
    <div className={styles.container}>
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
        size="large"
      />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  )

  if (fullScreen) {
    return <div className={styles.fullScreen}>{content}</div>
  }

  return content
}
