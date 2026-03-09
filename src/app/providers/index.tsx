import { type ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './ThemeProvider'
import { I18nProvider } from './I18nProvider'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </I18nProvider>
  )
}

export { ThemeProvider } from './ThemeProvider'
export { I18nProvider } from './I18nProvider'
