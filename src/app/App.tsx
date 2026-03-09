import { AppProviders } from './providers'
import { AppRouter } from './router/routes'

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
