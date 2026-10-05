/**
 * Nuro occupants for the generic browser-brand slots.
 *
 * The shipped `ui-brand-official` plugin fills these slots only in an `official`
 * client build. Every other build therefore falls back to the shell's own mark,
 * which is DeepSeek's. This plugin fills them instead whenever the build is not
 * official, so a local or distribution build presents Nuro and an official
 * build still presents DeepSeek.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { NuroBrandMark, NuroBrandName } from './Brand.tsx'

/** Required service: the UI slot registry. */
export const inject = ['slots']

/**
 * Fill the sidebar brand slots as one declaration-aware registration set.
 * @param ctx - Client root context.
 */
export function apply(ctx: ClientContext): void {
  if (process.env.DSH_CLIENT_BUILD_PROFILE === 'official') return
  ctx.slots.inject('sidebar.brand.mark', () =>
    ctx.slots.inject('sidebar.brand.name', function* () {
      yield ctx.slots.register({ name: 'sidebar.brand.mark' }, NuroBrandMark)
      yield ctx.slots.register({ name: 'sidebar.brand.name' }, NuroBrandName)
    }))
}
