import type { ThemeConfig } from 'antd'
import { colors, radius, typography } from './tokens'

export const getAntdTheme = (isDark: boolean): ThemeConfig => ({
  token: {
    // Colors
    colorPrimary: isDark ? colors.primary[400] : colors.primary[600],
    colorSuccess: colors.success.main,
    colorWarning: colors.warning.main,
    colorError: colors.error.main,
    colorInfo: colors.info.main,

    // Background
    colorBgBase: isDark ? colors.gray[950] : '#FFFFFF',
    colorBgContainer: isDark ? colors.gray[800] : '#FFFFFF',
    colorBgElevated: isDark ? colors.gray[800] : '#FFFFFF',
    colorBgLayout: isDark ? colors.gray[900] : colors.gray[50],
    colorBgSpotlight: isDark ? colors.gray[700] : colors.gray[100],

    // Text
    colorText: isDark ? colors.gray[50] : colors.gray[900],
    colorTextSecondary: isDark ? colors.gray[300] : colors.gray[600],
    colorTextTertiary: isDark ? colors.gray[400] : colors.gray[500],
    colorTextQuaternary: isDark ? colors.gray[500] : colors.gray[400],

    // Border
    colorBorder: isDark ? colors.gray[700] : colors.gray[200],
    colorBorderSecondary: isDark ? colors.gray[800] : colors.gray[100],

    // Typography
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    fontSizeHeading1: typography.fontSize['4xl'],
    fontSizeHeading2: typography.fontSize['3xl'],
    fontSizeHeading3: typography.fontSize['2xl'],
    fontSizeHeading4: typography.fontSize.xl,
    fontSizeHeading5: typography.fontSize.lg,

    // Sizing
    borderRadius: radius.lg,
    borderRadiusLG: radius.xl,
    borderRadiusSM: radius.md,
    borderRadiusXS: radius.sm,

    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,

    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,

    // Control
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,

    // Motion
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',

    // Line
    lineWidth: 1,
    lineWidthFocus: 2,
  },

  components: {
    Button: {
      borderRadius: radius.lg,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingContentHorizontal: 20,
      fontWeight: typography.fontWeight.medium,
    },

    Input: {
      borderRadius: radius.lg,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 14,
    },

    Select: {
      borderRadius: radius.lg,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },

    Card: {
      borderRadiusLG: radius['2xl'],
      paddingLG: 24,
      boxShadowTertiary: isDark
        ? '0 1px 3px rgba(0, 0, 0, 0.3)'
        : '0 1px 3px rgba(0, 0, 0, 0.08)',
    },

    Table: {
      borderRadius: radius.xl,
      headerBg: isDark ? colors.gray[900] : colors.gray[50],
      rowHoverBg: isDark ? colors.gray[700] : colors.gray[50],
      headerSortActiveBg: isDark ? colors.gray[800] : colors.gray[100],
      headerSortHoverBg: isDark ? colors.gray[800] : colors.gray[100],
      bodySortBg: isDark ? colors.gray[800] : colors.gray[50],
      headerSplitColor: 'transparent',
      cellPaddingBlock: 16,
      cellPaddingInline: 16,
    },

    Menu: {
      itemBg: 'transparent',
      itemHoverBg: isDark ? colors.gray[800] : colors.gray[50],
      itemSelectedBg: isDark ? 'rgba(99, 102, 241, 0.15)' : colors.primary[50],
      itemSelectedColor: isDark ? colors.primary[400] : colors.primary[600],
      itemColor: isDark ? colors.gray[300] : colors.gray[700],
      itemHoverColor: isDark ? colors.gray[100] : colors.gray[900],
      iconSize: 18,
      itemMarginInline: 8,
      itemPaddingInline: 12,
      itemBorderRadius: radius.lg,
      itemHeight: 44,
    },

    Modal: {
      borderRadiusLG: radius['2xl'],
      paddingLG: 24,
      paddingContentHorizontalLG: 24,
    },

    Tabs: {
      cardBg: isDark ? colors.gray[800] : colors.gray[50],
      itemSelectedColor: isDark ? colors.primary[400] : colors.primary[600],
      itemHoverColor: isDark ? colors.gray[100] : colors.gray[900],
      inkBarColor: isDark ? colors.primary[400] : colors.primary[600],
    },

    Tag: {
      borderRadiusSM: radius.md,
    },

    Badge: {
      dotSize: 8,
    },

    Breadcrumb: {
      itemColor: isDark ? colors.gray[400] : colors.gray[500],
      lastItemColor: isDark ? colors.gray[100] : colors.gray[900],
      linkColor: isDark ? colors.gray[300] : colors.gray[600],
      linkHoverColor: isDark ? colors.primary[400] : colors.primary[600],
      separatorColor: isDark ? colors.gray[600] : colors.gray[400],
    },

    Dropdown: {
      borderRadiusLG: radius.xl,
      paddingBlock: 8,
      controlPaddingHorizontal: 12,
    },

    Notification: {
      borderRadiusLG: radius['2xl'],
    },

    Message: {
      borderRadiusLG: radius.xl,
    },

    Tooltip: {
      borderRadius: radius.lg,
    },

    Statistic: {
      contentFontSize: typography.fontSize['3xl'],
      titleFontSize: typography.fontSize.sm,
    },

    Progress: {
      circleTextFontSize: '1em',
    },

    Pagination: {
      itemBg: 'transparent',
      itemActiveBg: isDark ? colors.primary[400] : colors.primary[600],
      borderRadius: radius.lg,
    },
  },
})
