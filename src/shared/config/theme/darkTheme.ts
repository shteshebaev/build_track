import { colors } from './tokens'

export const darkTheme = {
  // Background colors
  colorBgBase: colors.gray[950],
  colorBgLayout: colors.gray[900],
  colorBgContainer: colors.gray[800],
  colorBgElevated: colors.gray[800],
  colorBgSpotlight: colors.gray[700],

  // Surface colors
  colorBgSecondary: colors.gray[800],
  colorBgTertiary: colors.gray[700],

  // Text colors
  colorText: colors.gray[50],
  colorTextSecondary: colors.gray[300],
  colorTextTertiary: colors.gray[400],
  colorTextQuaternary: colors.gray[500],
  colorTextPlaceholder: colors.gray[500],

  // Border colors
  colorBorder: colors.gray[700],
  colorBorderSecondary: colors.gray[800],

  // Primary colors
  colorPrimary: colors.primary[400],
  colorPrimaryHover: colors.primary[300],
  colorPrimaryActive: colors.primary[500],
  colorPrimaryBg: 'rgba(99, 102, 241, 0.15)',
  colorPrimaryBgHover: 'rgba(99, 102, 241, 0.25)',
  colorPrimaryBorder: colors.primary[700],
  colorPrimaryText: colors.primary[400],
  colorPrimaryTextHover: colors.primary[300],
  colorPrimaryTextActive: colors.primary[500],

  // Success colors
  colorSuccess: colors.success.main,
  colorSuccessBg: 'rgba(16, 185, 129, 0.15)',
  colorSuccessBorder: 'rgba(16, 185, 129, 0.3)',
  colorSuccessText: '#34D399',

  // Warning colors
  colorWarning: colors.warning.main,
  colorWarningBg: 'rgba(245, 158, 11, 0.15)',
  colorWarningBorder: 'rgba(245, 158, 11, 0.3)',
  colorWarningText: '#FBBF24',

  // Error colors
  colorError: colors.error.main,
  colorErrorBg: 'rgba(239, 68, 68, 0.15)',
  colorErrorBorder: 'rgba(239, 68, 68, 0.3)',
  colorErrorText: '#F87171',

  // Info colors
  colorInfo: colors.info.main,
  colorInfoBg: 'rgba(59, 130, 246, 0.15)',
  colorInfoBorder: 'rgba(59, 130, 246, 0.3)',
  colorInfoText: '#60A5FA',

  // Sidebar
  sidebarBg: colors.gray[900],
  sidebarItemHover: colors.gray[800],
  sidebarItemActive: 'rgba(99, 102, 241, 0.15)',
  sidebarItemActiveBorder: colors.primary[400],

  // Header
  headerBg: 'rgba(17, 24, 39, 0.8)',
  headerBorder: colors.gray[800],

  // Card
  cardBg: colors.gray[800],
  cardBorder: colors.gray[700],
  cardShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',

  // Table
  tableBg: colors.gray[800],
  tableHeaderBg: colors.gray[900],
  tableRowHover: colors.gray[700],
  tableBorder: colors.gray[700],
} as const

export type DarkTheme = typeof darkTheme
