import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CurrencyUnit = 'sum' | 'thousand' | 'million' | 'billion' | 'trillion' | 'auto'

interface CurrencyUnitOption {
  value: CurrencyUnit
  label: string
  shortLabel: string
  divisor: number
  suffix: string
}

export const currencyUnitOptions: CurrencyUnitOption[] = [
  { value: 'auto', label: 'Авто', shortLabel: 'Авто', divisor: 1, suffix: '' },
  { value: 'sum', label: 'Сум', shortLabel: 'сум', divisor: 1, suffix: ' сум' },
  { value: 'thousand', label: 'Тыс. сум', shortLabel: 'тыс', divisor: 1000, suffix: ' тыс' },
  { value: 'million', label: 'Млн сум', shortLabel: 'млн', divisor: 1_000_000, suffix: ' млн' },
  { value: 'billion', label: 'Млрд сум', shortLabel: 'млрд', divisor: 1_000_000_000, suffix: ' млрд' },
  { value: 'trillion', label: 'Трлн сум', shortLabel: 'трлн', divisor: 1_000_000_000_000, suffix: ' трлн' },
]

interface CurrencyState {
  unit: CurrencyUnit
  setUnit: (unit: CurrencyUnit) => void
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      unit: 'auto',
      setUnit: (unit: CurrencyUnit) => set({ unit }),
    }),
    {
      name: 'buildtrack-currency',
    }
  )
)

/**
 * Get the appropriate unit option based on value (for auto mode)
 */
export function getAutoUnit(value: number): CurrencyUnitOption {
  const absValue = Math.abs(value)

  if (absValue >= 1_000_000_000_000) {
    return currencyUnitOptions.find(o => o.value === 'trillion')!
  }
  if (absValue >= 1_000_000_000) {
    return currencyUnitOptions.find(o => o.value === 'billion')!
  }
  if (absValue >= 1_000_000) {
    return currencyUnitOptions.find(o => o.value === 'million')!
  }
  if (absValue >= 1_000) {
    return currencyUnitOptions.find(o => o.value === 'thousand')!
  }

  return currencyUnitOptions.find(o => o.value === 'sum')!
}

/**
 * Format currency with the given unit
 */
export function formatCurrencyCompact(
  value: number,
  unit: CurrencyUnit = 'auto'
): { formatted: string; suffix: string; fullValue: string } {
  let unitOption: CurrencyUnitOption

  if (unit === 'auto') {
    unitOption = getAutoUnit(value)
  } else {
    unitOption = currencyUnitOptions.find(o => o.value === unit)!
  }

  const dividedValue = value / unitOption.divisor

  // Format number with appropriate decimal places
  let formatted: string
  if (unitOption.value === 'sum') {
    formatted = new Intl.NumberFormat('ru-RU').format(Math.round(dividedValue))
  } else {
    // For larger units, show 1-2 decimal places
    const decimals = Math.abs(dividedValue) >= 100 ? 1 : 2
    formatted = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    }).format(dividedValue)
  }

  // Full formatted value for tooltip
  const fullValue = new Intl.NumberFormat('ru-RU').format(value) + ' сум'

  return {
    formatted,
    suffix: unitOption.suffix,
    fullValue,
  }
}
