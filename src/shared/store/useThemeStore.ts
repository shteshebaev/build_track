import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  isDark: boolean
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const getSystemPreference = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

const calculateIsDark = (mode: ThemeMode): boolean => {
  if (mode === 'system') {
    return getSystemPreference()
  }
  return mode === 'dark'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      isDark: false,

      setMode: (mode: ThemeMode) => {
        set({
          mode,
          isDark: calculateIsDark(mode),
        })
      },

      toggleTheme: () => {
        const currentMode = get().mode
        const newMode = currentMode === 'dark' ? 'light' : 'dark'
        set({
          mode: newMode,
          isDark: newMode === 'dark',
        })
      },
    }),
    {
      name: 'buildtrack-theme',
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isDark = calculateIsDark(state.mode)
        }
      },
    }
  )
)
