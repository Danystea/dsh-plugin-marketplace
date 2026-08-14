# DSH Cordis 插件开发指南

基于 `dsh-plugin-marketplace` 实战开发经验总结，说明如何创建一个可独立部署的 DSH Cordis 插件。

---

## 1. 核心原则

### 1.1 独立仓库，不修改 DSH 源码

插件应当是**独立的 GitHub 仓库**，通过 `dsh plugin add` 安装到 profile 中，**完全不触碰 DSH 安装目录**。这样 DSH 官方更新时不会产生任何冲突。

```
DSH 安装目录 (官方维护)         你的插件 (独立仓库)
├── packages/                   ├── package.json
├── apps/                       ├── cordis.patch.yml
└── ...              ← 不碰     └── src/...
```

### 1.2 安装方式

```bash
dsh plugin --profile web add github:<用户名>/<仓库名>
```

插件通过 pnpm 安装到 `$DSH_HOME/profiles/web/node_modules/`，自动加入 `dsh.profile.bundles` 列表。

---

## 2. 必需文件

最小插件目录结构：

```
my-dsh-plugin/
├── package.json          ← 声明 dsh.bundle + dsh.client
├── cordis.patch.yml      ← 插入 Cordis 插件行
├── tsconfig.json
├── tsdown.config.ts
├── .gitignore
├── lib/                  ← 预编译产物（提交到 Git）
│   ├── index.js
│   ├── client.js
│   └── ...
└── src/
    ├── index.ts          ← Host 端入口
    └── client/
        ├── index.ts      ← Client 端入口
        └── ...
```

---

## 3. package.json 关键字段

### 3.1 完整模板

```json
{
  "name": "my-dsh-plugin",
  "version": "0.1.0",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-slots"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=0.1.0-rc.0",
    "@deepseek-ai/dsh-client-locale": ">=0.1.0-rc.0",
    "@deepseek-ai/dsh-client-runtime": ">=0.1.0-rc.0",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.1.0-rc.0",
    "@deepseek-ai/dsh-client-ui-settings": ">=0.1.0-rc.0",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.1.0-rc.0",
    "react": "^18.2.0"
  },
  "keywords": ["dsh", "dsh-plugin", "deepseek-harness"]
}
```

### 3.2 关键字段说明

| 字段 | 必须 | 说明 |
|------|------|------|
| `dsh.bundle.patch` | ✅ 是 | 指向 `cordis.patch.yml`，使插件可被 profile 加载 |
| `dsh.client` | 有 UI 时需要 | 声明浏览器端代码，`platform` 固定为 `"web"` |
| `dsh.client.inject` | 按需 | 列出客户端需要的 DSH 服务包，通常包含 `dsh-client-runtime`、`dsh-client-locale`、`dsh-client-ui-settings`、`dsh-client-ui-slots` |
| `peerDependencies` | 推荐 | 使用 `>=0.1.0-rc.0` 版本范围，安装时从 profile 的 `node_modules` 解析 |
| **不要**写 `files` 字段 | — | 不写 `files` 则 pnpm 从 git 安装时包含所有文件（`.gitignore` 除外） |

### 3.3 不要写 `prepare` 脚本

```json
// ❌ 错误
"scripts": {
  "prepare": "tsdown"
}

// ✅ 正确
"scripts": {
  "build": "tsdown"
}
```

`prepare` 脚本在 `pnpm install` 时自动执行，需要 `tsdown` 和 `typescript`，但这些是 `devDependencies`，在 profile 安装时不会被安装，会导致构建失败。

**替代方案**：在本机（DSH monorepo 环境下）手动编译，将 `lib/` 目录提交到 Git。

---

## 4. cordis.patch.yml

```yaml
# 插入插件到 Cordis loader 配置中
- insert:
    - id: my-plugin-id          # 唯一 ID，建议用包名去掉前缀
      name: my-dsh-plugin       # 必须是 package.json 的 name 字段
```

- `id`：Cordis 插件行唯一标识，用于后续 patch 层覆盖
- `name`：npm 包名，必须与 `package.json` 的 `name` 完全一致

---

## 5. ⚠️ Host 端入口（最容易踩坑）

```typescript
// src/index.ts

// ❌ 错误——Cordis loader 加载失败，整个 DSH 前端崩溃
export {}

// ✅ 正确——必须导出默认的 apply 函数
export default function apply() {}
```

**即使插件没有 Host 端逻辑，也必须导出一个空的 `apply` 函数**。Cordis loader 要求每个插件入口都导出 `apply`，空文件会导致加载失败，整个 DSH 前端白屏。

---

## 6. Client 端入口（注册 UI）

### 6.1 注册 Settings Tab

```typescript
// src/client/index.ts

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { MyTab } from './MyTab.tsx'
import { en, zh } from './locales.ts'

const NS = 'myPlugin'

// 声明 locale 命名空间
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'myPlugin': MyLocaleKey
  }
}

// Cordis 服务依赖
export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext): void {
  // 注册 locale 字典
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'my-plugin: dictionaries')

  // 注册 settings.plugins.tab slot
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'myTab',
    order: 20,
    label: () => ctx.locale.bind(NS)('tab'),
    locale: NS,
  }, MyTab))
}
```

### 6.2 Slot 注册要点

- **`name`**：必须是 `'settings.plugins.tab'`（在 Plugins 设置页中新增 Tab）
- **`id`**：Tab 唯一 ID
- **`order`**：Tab 排序（0=配置插件，10=插件清单，20=我们的 tab）
- **`label`**：返回 locale 字符串
- **`locale`**：locale 命名空间
- **第三个参数**：React 组件

### 6.3 React 组件 Props 类型

```typescript
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'

export type MyTabProps =
  PropsRuntime<'settings.plugins.tab'>
  & PropsLocale<'myPlugin'>
```

组件接收 `{ t }` —— `t` 是 locale 翻译函数。

---

## 7. Locale（国际化）

```typescript
// src/client/locales.ts

export type MyLocaleKey = keyof typeof zh

export const zh = {
  tab: '我的插件',
  title: '我的插件标题',
} as const

export const en: Record<keyof typeof zh, string> = {
  tab: 'My Plugin',
  title: 'My Plugin Title',
} as const
```

**关键约束**：`en` 的 key 必须与 `zh` 完全一致，使用 `Record<keyof typeof zh, string>` 类型检查。

---

## 8. 构建配置

### 8.1 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "rootDir": "src",
    "outDir": "lib/types"
  },
  "include": ["src"]
}
```

### 8.2 tsdown.config.ts

```typescript
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    client: 'src/client/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'lib',
  platform: 'browser',
  deps: {
    neverBundle: [
      '@deepseek-ai/cordis',
      '@deepseek-ai/dsh-client-locale',
      '@deepseek-ai/dsh-client-runtime',
      '@deepseek-ai/dsh-client-ui-primitives',
      '@deepseek-ai/dsh-client-ui-settings',
      '@deepseek-ai/dsh-client-ui-slots',
      'react',
      'react/jsx-runtime',
    ],
  },
})
```

**注意**：使用 `deps.neverBundle` 而非已废弃的 `external`。

### 8.3 CSS 支持

如果使用 CSS Modules（`.module.css`），需要安装 `@tsdown/css`：

```bash
pnpm add -D @tsdown/css
```

### 8.4 构建流程

```bash
# 在本机（DSH monorepo 环境下）构建
cd my-dsh-plugin
$env:NODE_PATH = "$env:USERPROFILE\.dsh\profiles\web\node_modules"
npx tsdown
```

需要设置 `NODE_PATH` 指向 profile 的 `node_modules`，以便解析 DSH 包的类型。

---

## 9. .gitignore

```gitignore
node_modules/
*.tsbuildinfo
```

**不要 gitignore `lib/`**——预编译产物必须提交到 Git。

---

## 10. pnpm 安装注意事项

安装 git 依赖时，pnpm 可能阻止构建脚本。如果遇到 `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` 错误：

1. 确保插件没有 `prepare` 脚本（`lib/` 已预编译提交）
2. 在 profile 的 `pnpm-workspace.yaml` 中添加：

```yaml
allowBuilds:
  'my-dsh-plugin@git+https://github.com/<user>/<repo>.git#<commit-hash>': true
```

---

## 11. 开发工作流

```
1. 在本地（DSH monorepo 环境下）开发 src/ 代码
2. 运行 npx tsdown 编译
3. 提交 lib/ + src/ 到 Git
4. git push
5. dsh plugin --profile web add github:<user>/<repo>
6. 重启 DSH Web
7. 如需更新：改代码 → 编译 → git push → dsh plugin update <pkg>
```

---

## 12. 常见错误速查

| 症状 | 原因 | 修复 |
|------|------|------|
| DSH 前端白屏/崩溃 | Host 端 `index.ts` 没有导出 `apply` 函数 | 改为 `export default function apply() {}` |
| 插件 Tab 不显示 | `cordis.patch.yml` 的 `name` 与 `package.json` 的 `name` 不一致 | 确保一致 |
| 安装时报 `prepare` 错误 | `prepare` 脚本需要 `tsdown` 但未安装 | 删除 `prepare` 脚本，改为预编译提交 `lib/` |
| 类型报错 `PropsLocale` | 未声明 locale 命名空间 | 添加 `declare module '@deepseek-ai/dsh-client-ui-slots' { interface LocaleNamespaceMap { ... } }` |
| CSS 构建失败 | 未安装 `@tsdown/css` | `pnpm add -D @tsdown/css` |
| 构建时 `external` 警告 | tsdown 新版废弃了 `external` | 改用 `deps.neverBundle` |
| `files` 字段导致源码缺失 | 只列出了 `lib/` 文件 | 删除 `files` 字段，或确保包含所有需要的文件 |

---

## 13. 参考示例

完整可运行的插件示例：

- **dsh-plugin-marketplace**：https://github.com/Danystea/dsh-plugin-marketplace
  - 在 Settings 中注册 Tools 插件 Tab
  - 内置 JSON 数据源
  - 中英文 locale
  - 分类筛选 + 搜索 + 复制安装命令

- **awesome-dsh-plugin**：https://github.com/awesome-dsh-plugin/awesome-dsh-plugin
  - 社区插件收录列表（contributing.md 中有插件规范说明）