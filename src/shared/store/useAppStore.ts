import { create } from 'zustand'

interface AppState {
  sidebarCollapsed: boolean
  globalSearchOpen: boolean
  notificationsOpen: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setGlobalSearchOpen: (open: boolean) => void
  setNotificationsOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  globalSearchOpen: false,
  notificationsOpen: false,

  setSidebarCollapsed: (collapsed: boolean) => {
    set({ sidebarCollapsed: collapsed })
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
  },

  setGlobalSearchOpen: (open: boolean) => {
    set({ globalSearchOpen: open })
  },

  setNotificationsOpen: (open: boolean) => {
    set({ notificationsOpen: open })
  },
}))
