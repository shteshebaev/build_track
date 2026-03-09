import { Segmented } from 'antd'
import { useCurrencyStore, currencyUnitOptions, type CurrencyUnit } from '@shared/store'
import { useThemeStore } from '@shared/store'
import styles from './CurrencyUnitSwitcher.module.css'

interface CurrencyUnitSwitcherProps {
  size?: 'small' | 'middle' | 'large'
  className?: string
}

export function CurrencyUnitSwitcher({ size = 'small', className = '' }: CurrencyUnitSwitcherProps) {
  const { unit, setUnit } = useCurrencyStore()
  const { isDark } = useThemeStore()

  const options = currencyUnitOptions.map((opt) => ({
    label: opt.shortLabel,
    value: opt.value,
  }))

  return (
    <div className={`${styles.wrapper} ${isDark ? styles.dark : ''} ${className}`}>
      <Segmented
        size={size}
        options={options}
        value={unit}
        onChange={(value) => setUnit(value as CurrencyUnit)}
      />
    </div>
  )
}
