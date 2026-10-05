import type { IconProps } from '@deepseek-ai/dsh-client-ui-primitives'

/**
 * Render the Nuro mark: a broken ring, open at the lower right so the gap reads
 * as an aperture rather than a closed badge.
 * @param props.size - square edge in px (default 24).
 * @param props.className - extra class for layout placement.
 * @returns the mark svg (aria-hidden; pair with the wordmark for accessibility).
 */
export function NuroLogo({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.5a9.5 9.5 0 1 1-6.7 2.8"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" />
    </svg>
  )
}
