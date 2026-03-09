import { colors } from './tokens'

export const lightTheme = {
  // Background colors
  colorBgBase: '#FFFFFF',
  colorBgLayout: colors.gray[50],
  colorBgContainer: '#FFFFFF',
  colorBgElevated: '#FFFFFF',
  colorBgSpotlight: colors.gray[100],

  // Surface colors
  colorBgSecondary: colors.gray[50],
  colorBgTertiary: colors.gray[100],

  // Text colors
  colorText: colors.gray[900],
  colorTextSecondary: colors.gray[600],
  colorTextTertiary: colors.gray[500],
  colorTextQuaternary: colors.gray[400],
  colorTextPlaceholder: colors.gray[400],

  // Border colors
  colorBorder: colors.gray[200],
  colorBorderSecondary: colors.gray[100],

  // Primary colors
  colorPrimary: colors.primary[600],
  colorPrimaryHover: colors.primary[700],
  colorPrimaryActive: colors.primary[800],
  colorPrimaryBg: colors.primary[50],
  colorPrimaryBgHover: colors.primary[100],
  colorPrimaryBorder: colors.primary[200],
  colorPrimaryText: colors.primary[600],
  colorPrimaryTextHover: colors.primary[700],
  colorPrimaryTextActive: colors.primary[800],

  // Success colors
  colorSuccess: colors.success.main,
  colorSuccessBg: colors.success.light,
  colorSuccessBorder: '#A7F3D0',
  colorSuccessText: colors.success.dark,

  // Warning colors
  colorWarning: colors.warning.main,
  colorWarningBg: colors.warning.light,
  colorWarningBorder: '#FDE68A',
  colorWarningText: colors.warning.dark,

  // Error colors
  colorError: colors.error.main,
  colorErrorBg: colors.error.light,
  colorErrorBorder: '#FECACA',
  colorErrorText: colors.error.dark,

  // Info colors
  colorInfo: colors.info.main,
  colorInfoBg: colors.info.light,
  colorInfoBorder: '#BFDBFE',
  colorInfoText: colors.info.dark,

  // Sidebar
  sidebarBg: '#FFFFFF',
  sidebarItemHover: colors.gray[50],
  sidebarItemActive: colors.primary[50],
  sidebarItemActiveBorder: colors.primary[600],

  // Header
  headerBg: 'rgba(255, 255, 255, 0.8)',
  headerBorder: colors.gray[200],

  // Card
  cardBg: '#FFFFFF',
  cardBorder: colors.gray[200],
  cardShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',

  // Table
  tableBg: '#FFFFFF',
  tableHeaderBg: colors.gray[50],
  tableRowHover: colors.gray[50],
  tableBorder: colors.gray[200],
} as const

export type LightTheme = typeof lightTheme
