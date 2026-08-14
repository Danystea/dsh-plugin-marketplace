/** Marketplace tab locale keys. */
export type MarketplaceLocaleKey = keyof typeof zh

/** Chinese strings. */
export const zh = {
  tab: '社区插件',
  title: '社区插件市场',
  intro: '浏览 awesome-dsh-plugin.com 收录的社区插件。点击安装按钮复制命令到终端执行。',
  search: '搜索插件...',
  allCategories: '全部',
  count: '{count} 个插件',
  install: '安装',
  copied: '已复制!',
  copyFailed: '复制失败',
  byOwner: '作者：{owner}',
  addedDate: '收录于 {date}',
  noResults: '没有匹配的插件',
  loading: '加载中...',
  error: '加载失败',
  retry: '重试',
} as const

export const en: Record<keyof typeof zh, string> = {
  tab: 'Community Plugins',
  title: 'Community Plugin Marketplace',
  intro: 'Browse community plugins from awesome-dsh-plugin.com. Click install to copy the command to your terminal.',
  search: 'Search plugins...',
  allCategories: 'All',
  count: '{count} plugins',
  install: 'Install',
  copied: 'Copied!',
  copyFailed: 'Copy failed',
  byOwner: 'by {owner}',
  addedDate: 'Added {date}',
  noResults: 'No matching plugins',
  loading: 'Loading...',
  error: 'Failed to load',
  retry: 'Retry',
} as const