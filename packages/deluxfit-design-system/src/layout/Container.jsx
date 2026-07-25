import { forwardRef } from 'react'
import { cn } from '../lib/cn'

const WIDTH = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
}

/**
 * @param {object} props
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.size='lg']
 */
export const Container = forwardRef(function Container(
  { className, size = 'lg', as: Component = 'div', ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={cn('mx-auto w-full px-5 sm:px-6 lg:px-8', WIDTH[size] ?? WIDTH.lg, className)}
      {...props}
    />
  )
})
