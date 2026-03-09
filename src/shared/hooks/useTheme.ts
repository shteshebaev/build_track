import { useThemeStore } from '@shared/store'
import { lightTheme } from '@shared/config/theme/lightTheme'
import { darkTheme } from '@shared/config/theme/darkTheme'

export const useTheme = () => {
  const { mode, isDark, setMode, toggleTheme } = useThemeStore()

  const theme = isDark ? darkTheme : lightTheme

  return {
    mode,
    isDark,
    theme,
    setMode,
    toggleTheme,
  }
}
