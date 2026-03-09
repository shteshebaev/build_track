import { type ReactNode } from 'react'
import { Layout } from 'antd'
import { Sidebar } from '@widgets/Sidebar'
import { Header } from '@widgets/Header'
import { useAppStore, useThemeStore } from '@shared/store'
import styles from './AppLayout.module.css'

const { Content } = Layout

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarCollapsed } = useAppStore()
  const { isDark } = useThemeStore()

  return (
    <Layout className={`${styles.layout} ${isDark ? styles.dark : styles.light}`}>
      <Sidebar />
      <Layout
        className={styles.mainLayout}
        style={{
          marginLeft: sidebarCollapsed ? 80 : 260,
          transition: 'margin-left 0.2s ease',
        }}
      >
        <Header />
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  )
}
