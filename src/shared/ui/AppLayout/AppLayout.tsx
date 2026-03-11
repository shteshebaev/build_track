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
  const sidebarWidth = sidebarCollapsed ? 80 : 260

  return (
    <Layout className={`${styles.layout} ${isDark ? styles.dark : styles.light}`}>
      <Sidebar />
      <Layout className={styles.mainLayout} style={{ marginLeft: sidebarWidth }}>
        <Header sidebarWidth={sidebarWidth} />
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  )
}
