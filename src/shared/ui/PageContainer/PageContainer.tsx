import { type ReactNode } from 'react'
import styles from './PageContainer.module.css'

type ContainerVariant = 'default' | 'full' | 'centered' | 'narrow' | 'medium'

interface PageContainerProps {
  children: ReactNode
  className?: string
  /**
   * Container width variant:
   * - 'default': Full width, max-width only on 2560px+ screens (Stripe/Linear style)
   * - 'full': Always full width, no max-width
   * - 'centered': Centered with max-width 1600px (traditional layout)
   * - 'narrow': Centered with max-width 960px (forms, settings)
   * - 'medium': Centered with max-width 1280px (detail pages)
   */
  variant?: ContainerVariant
}

const variantStyles: Record<ContainerVariant, string> = {
  default: styles.container,
  full: styles.containerFull,
  centered: styles.containerCentered,
  narrow: styles.containerNarrow,
  medium: styles.containerMedium,
}

export function PageContainer({
  children,
  className = '',
  variant = 'default',
}: PageContainerProps) {
  const containerClass = variantStyles[variant] || styles.container

  return (
    <div className={`${containerClass} ${className}`}>
      {children}
    </div>
  )
}
