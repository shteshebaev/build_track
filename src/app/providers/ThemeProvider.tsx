import { useEffect, type ReactNode } from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { useThemeStore } from '@shared/store'
import { getAntdTheme } from '@shared/config/theme'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { isDark } = useThemeStore()

  useEffect(() => {
    // Update document class for CSS variables
    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <ConfigProvider
      theme={{
        ...getAntdTheme(isDark),
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  )
}
