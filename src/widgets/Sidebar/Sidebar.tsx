import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  ProjectOutlined,
  CalculatorOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  BarChartOutlined,
  DollarOutlined,
  FileSearchOutlined,
  UserOutlined,
  SettingOutlined,
  EnvironmentOutlined,
  VideoCameraOutlined,
  CameraOutlined,
  FolderOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAppStore, useThemeStore } from '@shared/store'
import type { MenuProps } from 'antd'
import styles from './Sidebar.module.css'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

export function Sidebar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const { isDark } = useThemeStore()

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: t('navigation.dashboard'),
      },
      {
        key: '/projects',
        icon: <ProjectOutlined />,
        label: t('navigation.projects'),
      },
      {
        key: '/estimates',
        icon: <CalculatorOutlined />,
        label: t('navigation.estimates'),
      },
      {
        key: '/materials',
        icon: <AppstoreOutlined />,
        label: t('navigation.materials'),
      },
      {
        key: '/warehouse',
        icon: <DatabaseOutlined />,
        label: t('navigation.warehouse'),
      },
      {
        key: '/requests',
        icon: <FileTextOutlined />,
        label: t('navigation.requests'),
      },
      {
        key: '/procurement',
        icon: <ShoppingCartOutlined />,
        label: t('navigation.procurement'),
      },
      {
        key: '/suppliers',
        icon: <TeamOutlined />,
        label: t('navigation.suppliers'),
      },
      {
        key: '/construction-progress',
        icon: <BarChartOutlined />,
        label: t('navigation.constructionProgress'),
      },
      {
        key: '/sales',
        icon: <DollarOutlined />,
        label: t('navigation.sales'),
      },
      {
        key: '/reports',
        icon: <FileSearchOutlined />,
        label: t('navigation.reports'),
      },
      {
        key: 'divider-1',
        type: 'divider',
      },
      {
        key: '/map',
        icon: <EnvironmentOutlined />,
        label: t('navigation.mapView'),
      },
      {
        key: '/cameras',
        icon: <VideoCameraOutlined />,
        label: t('navigation.cameras'),
      },
      {
        key: '/photo-reports',
        icon: <CameraOutlined />,
        label: t('navigation.photoReports'),
      },
      {
        key: '/documents',
        icon: <FolderOutlined />,
        label: t('navigation.documents'),
      },
      {
        key: 'divider-2',
        type: 'divider',
      },
      {
        key: '/users',
        icon: <UserOutlined />,
        label: t('navigation.users'),
      },
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: t('navigation.settings'),
      },
    ],
    [t]
  )

  const selectedKey = useMemo(() => {
    const path = location.pathname
    if (path === '/') return '/'
    const matchingItem = menuItems.find(
      (item) => item && 'key' in item && typeof item.key === 'string' && path.startsWith(item.key) && item.key !== '/'
    )
    return matchingItem?.key?.toString() || '/'
  }, [location.pathname, menuItems])

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  return (
    <Sider
      collapsible
      collapsed={sidebarCollapsed}
      onCollapse={setSidebarCollapsed}
      width={260}
      collapsedWidth={80}
      className={`${styles.sidebar} ${isDark ? styles.dark : styles.light}`}
      trigger={null}
    >
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="currentColor" />
            <path
              d="M8 24V12L16 6L24 12V24H18V18H14V24H8Z"
              fill={isDark ? '#1F2937' : '#FFFFFF'}
            />
          </svg>
        </div>
        {!sidebarCollapsed && <span className={styles.logoText}>BuildTrack</span>}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
        className={styles.menu}
      />

      <div className={styles.collapseButton} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={sidebarCollapsed ? styles.collapsed : ''}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </div>
    </Sider>
  )
}
