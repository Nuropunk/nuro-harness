import type { SidebarBrandMarkOwnerProps } from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { NuroLogo } from './NuroLogo.tsx'

/**
 * Brand-name artwork height in px, matching the shell's own wordmark sizing so
 * the sidebar row keeps its established geometry.
 */
const NAME_SIZE = 24

/**
 * Render the Nuro mark with the presentation requested by its host surface.
 * @param props - Host-supplied mark presentation.
 * @returns the Nuro mark sized for the sidebar row.
 */
export function NuroBrandMark({ size }: SidebarBrandMarkOwnerProps) {
  return <NuroLogo size={size} />
}

/**
 * Render the Nuro name without its independently slotted mark.
 *
 * The name is drawn as text rather than artwork: the shipped wordmark is an SVG
 * of DeepSeek's lettering with no text alternative, so a deployment cannot
 * reuse it, and this fork owns no matching artwork. The element carries
 * `aria-hidden` for the same reason the shell's wordmark does — the mark
 * beside it is decorative and the surrounding control owns the accessible name.
 * @returns the Nuro name, sized to the shell's wordmark height.
 */
export function NuroBrandName() {
  return (
    <span
      aria-hidden="true"
      style={{
        fontSize: NAME_SIZE * 0.66,
        fontWeight: 600,
        letterSpacing: '0.01em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      Nuro
    </span>
  )
}
