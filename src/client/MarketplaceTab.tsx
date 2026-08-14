import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { IconSearchOutline16, Pill, writeClipboard } from '@deepseek-ai/dsh-client-ui-primitives'
import { CATEGORIES, type MarketplaceTabProps, type PluginEntry } from './types.ts'
import pluginsData from './data/plugins.json' with { type: 'json' }
import css from './MarketplaceTab.module.css'

interface PluginsJson {
  name: string
  url: string
  source: string
  updated: string
  count: number
  categories: Array<{ key: string; name: { en: string; zh: string }; count: number }>
  plugins: PluginEntry[]
}

const registry = pluginsData as unknown as PluginsJson
const plugins: readonly PluginEntry[] = registry.plugins

function categoryMeta(key: string) {
  return CATEGORIES.find(c => c.key === key) ?? { key, emoji: '📦', label: { en: key, zh: key } }
}

function categoryLabel(cat: typeof CATEGORIES[number], locale: string): string {
  const label = cat.label as Record<string, string>
  return `${cat.emoji} ${label[locale] ?? label.en}`
}

function shortDate(iso: string): string {
  return iso
}

function detectLocale(): string {
  if (typeof navigator === 'undefined') return 'en'
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

/**
 * Render the community plugin marketplace tab.
 * Lists all plugins from awesome-dsh-plugin with category filter, search,
 * and copy-to-clipboard install buttons.
 */
export function MarketplaceTab({ t }: MarketplaceTabProps): ReactNode {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const locale = detectLocale()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return plugins.filter(p => {
      if (activeCategory !== null && p.category !== activeCategory) return false
      if (q.length === 0) return true
      return (
        p.name.toLowerCase().includes(q)
        || p.description.zh.includes(q)
        || p.description.en.toLowerCase().includes(q)
        || p.owner.toLowerCase().includes(q)
      )
    })
  }, [query, activeCategory])

  const handleCopy = useCallback(async (plugin: PluginEntry) => {
    const ok = await writeClipboard(plugin.install)
    if (ok) {
      setCopiedId(plugin.name)
      window.setTimeout(() => { setCopiedId(null) }, 1500)
    }
  }, [])

  return (
    <div className={css.section}>
      <h2 className={css.title}>{t('title')}</h2>
      <p className={css.intro}>{t('intro')}</p>

      <div className={css.categories} role="group" aria-label={t('allCategories')}>
        <Pill active={activeCategory === null} onClick={() => { setActiveCategory(null) }}>
          {t('allCategories')}
        </Pill>
        {CATEGORIES.map(cat => (
          <Pill key={cat.key} active={activeCategory === cat.key} onClick={() => { setActiveCategory(cat.key) }}>
            {categoryLabel(cat, locale)}
          </Pill>
        ))}
      </div>

      <label className={css.search}>
        <IconSearchOutline16 aria-hidden="true" />
        <span className={css.visuallyHidden}>{t('search')}</span>
        <input
          type="search"
          value={query}
          placeholder={t('search')}
          aria-label={t('search')}
          onChange={(event) => { setQuery(event.currentTarget.value) }}
        />
      </label>

      <p className={css.count}>{t('count').replace('{count}', String(filtered.length))}</p>

      {filtered.length === 0 ? (
        <p className={css.empty}>{t('noResults')}</p>
      ) : (
        <ul className={css.cards}>
          {filtered.map(plugin => {
            const cat = categoryMeta(plugin.category)
            const isCopied = copiedId === plugin.name
            return (
              <li key={plugin.name} className={css.card}>
                <div className={css.cardHeader}>
                  <a href={plugin.url} target="_blank" rel="noopener noreferrer" className={css.pluginName}>
                    {plugin.name}
                  </a>
                  <span className={css.categoryTag}>{categoryLabel(cat, locale)}</span>
                </div>
                <p className={css.description}>
                  {locale === 'zh' ? plugin.description.zh : plugin.description.en}
                </p>
                <div className={css.cardFooter}>
                  <span className={css.meta}>
                    <span>{t('byOwner').replace('{owner}', plugin.owner)}</span>
                    <span className={css.dot}>·</span>
                    <span>{t('addedDate').replace('{date}', shortDate(plugin.added))}</span>
                  </span>
                  <button
                    type="button"
                    className={css.installButton}
                    data-copied={isCopied ? 'true' : undefined}
                    onClick={() => { void handleCopy(plugin) }}
                  >
                    {isCopied ? t('copied') : t('install')}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}