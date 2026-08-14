/**
 * Browser half of the dsh-plugin-marketplace plugin.
 * Registers a "Community Plugins" tab in the Plugins settings section.
 */

import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { MarketplaceTab } from './MarketplaceTab.tsx'
import type { MarketplaceLocaleKey } from './locales.ts'
import { en, zh } from './locales.ts'

export type { MarketplaceTabProps } from './types.ts'
export type { MarketplaceLocaleKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'marketplace': MarketplaceLocaleKey
  }
}

const NS = 'marketplace'

export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-plugin-marketplace: dictionaries')

  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'marketplace',
    order: 20,
    label: () => ctx.locale.bind(NS)('tab'),
    locale: NS,
  }, MarketplaceTab))
}