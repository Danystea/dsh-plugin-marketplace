/// <reference types="react" />

import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { MarketplaceLocaleKey } from './locales.ts'

/** One plugin entry from the awesome-dsh-plugin registry. */
export interface PluginEntry {
  name: string
  owner: string
  url: string
  category: string
  description: { en: string; zh: string }
  install: string
  added: string
}

/** Category display metadata. */
export interface CategoryMeta {
  key: string
  emoji: string
  label: { en: string; zh: string }
}

/** The 10 categories from awesome-dsh-plugin. */
export const CATEGORIES: readonly CategoryMeta[] = [
  { key: 'ui', emoji: '🎨', label: { en: 'UI', zh: 'UI 增强' } },
  { key: 'theme', emoji: '🎭', label: { en: 'Theme', zh: '主题与外观' } },
  { key: 'session', emoji: '💬', label: { en: 'Session', zh: '会话与消息' } },
  { key: 'memory', emoji: '🧠', label: { en: 'Memory', zh: '记忆' } },
  { key: 'tools', emoji: '🛠️', label: { en: 'Tools', zh: '工具与能力' } },
  { key: 'workflow', emoji: '🔁', label: { en: 'Workflow', zh: '工作流与自动化' } },
  { key: 'notify', emoji: '🔔', label: { en: 'Notify', zh: '通知与集成' } },
  { key: 'model', emoji: '🔌', label: { en: 'Model', zh: '模型与账号接入' } },
  { key: 'dev', emoji: '🧑‍💻', label: { en: 'Dev', zh: '开发与运行时' } },
  { key: 'fun', emoji: '🎮', label: { en: 'Fun', zh: '娱乐' } },
] as const

/** Full component props assembled by the Settings slot renderer. */
export type MarketplaceTabProps =
  PropsRuntime<'settings.plugins.tab'>
  & PropsLocale<'marketplace'>