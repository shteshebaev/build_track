import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Input,
  Badge,
  Dropdown,
  Avatar,
  Switch,
  Button,
  Space,
  Breadcrumb,
} from 'antd'
import {
  SearchOutlined,
  BellOutlined,
  GlobalOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useThemeStore, useAppStore } from '@shared/store'
import type { MenuProps } from 'antd'
import styles from './Header.module.css'

interface HeaderProps {
  sidebarWidth: number
}

export function Header({ sidebarWidth }: HeaderProps) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { isDark, toggleTheme } = useThemeStore()
  const { sidebarCollapsed, setGlobalSearchOpen } = useAppStore()
  const [searchValue, setSearchValue] = useState('')

  const breadcrumbItems = location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => ({
      title:
        index === arr.length - 1 ? (
          <span style={{ textTransform: 'capitalize' }}>
            {segment.replace(/-/g, ' ')}
          </span>
        ) : (
          <a href={`/${arr.slice(0, index + 1).join('/')}`} style={{ textTransform: 'capitalize' }}>
            {segment.replace(/-/g, ' ')}
          </a>
        ),
    }))

  const languageItems: MenuProps['items'] = [
    {
      key: 'ru',
      label: 'Русский',
      onClick: () => {
        i18n.changeLanguage('ru')
        localStorage.setItem('buildtrack-language', 'ru')
      },
    },
    {
      key: 'en',
      label: 'English',
      onClick: () => {
        i18n.changeLanguage('en')
        localStorage.setItem('buildtrack-language', 'en')
      },
    },
  ]

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('auth.profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('settings.title'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('auth.logout'),
      danger: true,
    },
  ]

  const notificationItems: MenuProps['items'] = [
    {
      key: 'header',
      label: (
        <div className={styles.notificationHeader}>
          <span>{t('navigation.notifications')}</span>
          <Button type="link" size="small">
            {t('common.all')}
          </Button>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '1',
      label: (
        <div className={styles.notificationItem}>
          <div className={styles.notificationDot} style={{ background: '#10b981' }} />
          <div className={styles.notificationContent}>
            <div className={styles.notificationTitle}>Заявка #1234 одобрена</div>
            <div className={styles.notificationTime}>5 минут назад</div>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div className={styles.notificationItem}>
          <div className={styles.notificationDot} style={{ background: '#f59e0b' }} />
          <div className={styles.notificationContent}>
            <div className={styles.notificationTitle}>Низкий остаток: Цемент М400</div>
            <div className={styles.notificationTime}>1 час назад</div>
          </div>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div className={styles.notificationItem}>
          <div className={styles.notificationDot} style={{ background: '#3b82f6' }} />
          <div className={styles.notificationContent}>
            <div className={styles.notificationTitle}>Новый проект создан</div>
            <div className={styles.notificationTime}>2 часа назад</div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <header
      className={`${styles.header} ${isDark ? styles.dark : styles.light}`}
      style={{ left: sidebarWidth }}
    >
      <div className={styles.left}>
        <Breadcrumb
          items={[
            { title: <a href="/">{t('navigation.dashboard')}</a> },
            ...breadcrumbItems,
          ]}
          className={styles.breadcrumb}
        />
      </div>

      <div className={styles.center}>
        <Input
          placeholder={`${t('common.search')}... (⌘K)`}
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setGlobalSearchOpen(true)}
          className={styles.searchInput}
          style={{ width: sidebarCollapsed ? 300 : 400 }}
        />
      </div>

      <div className={styles.right}>
        <Space size={8}>
          <Dropdown
            menu={{ items: notificationItems }}
            placement="bottomRight"
            trigger={['click']}
            overlayClassName={styles.notificationDropdown}
          >
            <Button
              type="text"
              icon={
                <Badge count={3} size="small" offset={[-2, 2]}>
                  <BellOutlined style={{ fontSize: 18 }} />
                </Badge>
              }
              className={styles.iconButton}
            />
          </Dropdown>

          <Dropdown
            menu={{ items: languageItems, selectedKeys: [i18n.language] }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              type="text"
              icon={<GlobalOutlined style={{ fontSize: 18 }} />}
              className={styles.iconButton}
            />
          </Dropdown>

          <div className={styles.themeToggle}>
            <SunOutlined className={!isDark ? styles.activeIcon : ''} />
            <Switch
              size="small"
              checked={isDark}
              onChange={toggleTheme}
              className={styles.themeSwitch}
            />
            <MoonOutlined className={isDark ? styles.activeIcon : ''} />
          </div>

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div className={styles.userButton}>
              <Avatar
                size={36}
                style={{ backgroundColor: '#4f46e5' }}
                icon={<UserOutlined />}
              />
              <div className={styles.userInfo}>
                <div className={styles.userName}>Иван Петров</div>
                <div className={styles.userRole}>Администратор</div>
              </div>
            </div>
          </Dropdown>
        </Space>
      </div>
    </header>
  )
}
