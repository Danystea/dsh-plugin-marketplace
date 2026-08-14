import { useCallback, useMemo, useState } from "react";
import { IconSearchOutline16, Pill, writeClipboard } from "@deepseek-ai/dsh-client-ui-primitives";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/client/types.ts
/** The 10 categories from awesome-dsh-plugin. */
const CATEGORIES = [
	{
		key: "ui",
		emoji: "🎨",
		label: {
			en: "UI",
			zh: "UI 增强"
		}
	},
	{
		key: "theme",
		emoji: "🎭",
		label: {
			en: "Theme",
			zh: "主题与外观"
		}
	},
	{
		key: "session",
		emoji: "💬",
		label: {
			en: "Session",
			zh: "会话与消息"
		}
	},
	{
		key: "memory",
		emoji: "🧠",
		label: {
			en: "Memory",
			zh: "记忆"
		}
	},
	{
		key: "tools",
		emoji: "🛠️",
		label: {
			en: "Tools",
			zh: "工具与能力"
		}
	},
	{
		key: "workflow",
		emoji: "🔁",
		label: {
			en: "Workflow",
			zh: "工作流与自动化"
		}
	},
	{
		key: "notify",
		emoji: "🔔",
		label: {
			en: "Notify",
			zh: "通知与集成"
		}
	},
	{
		key: "model",
		emoji: "🔌",
		label: {
			en: "Model",
			zh: "模型与账号接入"
		}
	},
	{
		key: "dev",
		emoji: "🧑‍💻",
		label: {
			en: "Dev",
			zh: "开发与运行时"
		}
	},
	{
		key: "fun",
		emoji: "🎮",
		label: {
			en: "Fun",
			zh: "娱乐"
		}
	}
];
//#endregion
//#region src/client/data/plugins.json
var plugins$1 = [
	{
		"description": {
			"zh": "DeepSeek Harness 的终端 UI（TUI）。",
			"en": "A terminal UI (TUI) for DeepSeek Harness."
		},
		"owner": "huiliyi37",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/huiliyi37/dsh-tianshu-tui",
		"name": "dsh-tianshu-tui",
		"install": "dsh plugin --profile web add github:huiliyi37/dsh-tianshu-tui"
	},
	{
		"description": {
			"zh": "Rust/ratatui 终端客户端，直接使用 DSH SDK JSON-RPC 协议，支持独立运行或作为 profile bundle 加载。",
			"en": "A Rust/ratatui terminal client that speaks the DSH SDK JSON-RPC protocol directly and runs standalone or as a profile bundle."
		},
		"owner": "openma-ai",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/openma-ai/deepseek-harness-tui",
		"name": "deepseek-harness-tui",
		"install": "dsh plugin --profile web add github:openma-ai/deepseek-harness-tui"
	},
	{
		"description": {
			"zh": "Codex 风格的 `@file` 文件引用，输入框里直接搜索并引用工作区文件。",
			"en": "Codex-style `@file` mentions: search workspace files in the composer and attach their contents to prompts."
		},
		"owner": "omdsh-dev",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-at-file",
		"name": "dsh-at-file",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-at-file"
	},
	{
		"description": {
			"zh": "把鲸鱼娘思考时的 \"deep diving\" 状态文案自定义成任意你想要的样子。",
			"en": "Customize the \"deep diving\" thinking status label to anything you like."
		},
		"owner": "alingalingling",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/alingalingling/ui-status-label",
		"name": "ui-status-label",
		"install": "dsh plugin --profile web add github:alingalingling/ui-status-label"
	},
	{
		"description": {
			"zh": "OpenPencil 设计预览与编辑插件。",
			"en": "OpenPencil design preview and editing plugin."
		},
		"owner": "ZSeven-W",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/ZSeven-W/dsh-openpencil",
		"name": "dsh-openpencil",
		"install": "dsh plugin --profile web add github:ZSeven-W/dsh-openpencil"
	},
	{
		"description": {
			"zh": "对话内生成式 UI：模型把交互式 HTML 卡片直接画进会话流，带流式预览与沙箱渲染。",
			"en": "In-conversation generative UI: the model renders interactive HTML cards into the chat stream, with streaming preview and sandboxed rendering."
		},
		"owner": "Nagi-ovo",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/Nagi-ovo/dsh-visualize",
		"name": "dsh-visualize",
		"install": "dsh plugin --profile web add github:Nagi-ovo/dsh-visualize"
	},
	{
		"description": {
			"zh": "侧边栏集成文件浏览器、终端和 Git 审查，方便预览文件。",
			"en": "Side panel with file browser, terminal, and Git review for quick file previews."
		},
		"owner": "ccq1",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/ccq1/dsh-side-panel",
		"name": "dsh-side-panel",
		"install": "dsh plugin --profile web add github:ccq1/dsh-side-panel"
	},
	{
		"description": {
			"zh": "「聚焦会话」精简视图，只关注最终产出结果。",
			"en": "A \"focus chat\" minimal view that shows only final outputs."
		},
		"owner": "dingyi222666",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/dingyi222666/dsh-focus-chat",
		"name": "dsh-focus-chat",
		"install": "dsh plugin --profile web add github:dingyi222666/dsh-focus-chat"
	},
	{
		"description": {
			"zh": "助手回复内渲染交互式 UI 组件：布局、图表、表单、测验、mermaid、3D 场景与回传事件循环。",
			"en": "Interactive UI components rendered inline in replies: layout, charts, forms, quizzes, mermaid, 3D scenes, and an action event loop back to the model."
		},
		"owner": "omdsh-dev",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-genui",
		"name": "dsh-genui",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-genui"
	},
	{
		"description": {
			"zh": "选中文字→批注→随消息发送，回复按批注逐条对照。",
			"en": "Select text → annotate → send with your message; replies map back to each annotation."
		},
		"owner": "omdsh-dev",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-annotation",
		"name": "dsh-annotation",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-annotation"
	},
	{
		"description": {
			"zh": "对话节点导航条，右缘节点串快速跳转 user 消息。",
			"en": "Conversation node navigation bar for quick jumps between user messages."
		},
		"owner": "vlln",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/vlln/dsh-navbar",
		"name": "dsh-navbar",
		"install": "dsh plugin --profile web add github:vlln/dsh-navbar"
	},
	{
		"description": {
			"zh": "后台任务状态条：对话页任务进度 + 实时输出 tail。",
			"en": "Background task status bar: progress plus live output tail on the chat page."
		},
		"owner": "vlln",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/vlln/dsh-task-status",
		"name": "dsh-task-status",
		"install": "dsh plugin --profile web add github:vlln/dsh-task-status"
	},
	{
		"description": {
			"zh": "折叠对话中的 Think、Bash 等「无用消息」。",
			"en": "Collapse noisy messages (Think, Bash, etc.) in conversations."
		},
		"owner": "renat3u",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/renat3u/dsh-web-archive",
		"name": "dsh-web-archive",
		"install": "dsh plugin --profile web add github:renat3u/dsh-web-archive"
	},
	{
		"description": {
			"zh": "键盘优先的命令面板（command palette）。",
			"en": "Keyboard-first command palette for the DSH Web UI."
		},
		"owner": "0xsline",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/0xsline/dsh-spotlight",
		"name": "dsh-spotlight",
		"install": "dsh plugin --profile web add github:0xsline/dsh-spotlight"
	},
	{
		"description": {
			"zh": "DSH 文档阅读模式。",
			"en": "Document reading mode for DSH."
		},
		"owner": "bill9109",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/bill9109/dsh-101",
		"name": "dsh-101",
		"install": "dsh plugin --profile web add github:bill9109/dsh-101"
	},
	{
		"description": {
			"zh": "跨平台文件拖拽与原始路径插入，无需复制文件。",
			"en": "Cross-platform file drag-and-drop with raw path insertion, no file copying."
		},
		"owner": "bill9109",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/bill9109/dsh-drag-and-drop",
		"name": "dsh-drag-and-drop",
		"install": "dsh plugin --profile web add github:bill9109/dsh-drag-and-drop"
	},
	{
		"description": {
			"zh": "从 Web 输入框上传任意本地文件，以待发送卡片展示，并在设置中管理已存文件。",
			"en": "Upload arbitrary local files from the Web composer, show pending cards, and manage stored files in Settings."
		},
		"owner": "l541402398",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/l541402398/dsh-file-uploads",
		"name": "dsh-file-uploads",
		"install": "dsh plugin --profile web add github:l541402398/dsh-file-uploads"
	},
	{
		"description": {
			"zh": "`?session=` / `?workspace=` 深链直达指定项目对话。",
			"en": "Deep links: open a specific session or workspace via `?session=` / `?workspace=`."
		},
		"owner": "qyw233",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/qyw233/dsh-deeplink",
		"name": "dsh-deeplink",
		"install": "dsh plugin --profile web add github:qyw233/dsh-deeplink"
	},
	{
		"description": {
			"zh": "PiUI 风格 diff 查看器，替换 write/edit 工具调用的默认 DiffBlock。",
			"en": "PiUI-style diff viewer replacing the stock DiffBlock for write/edit tool calls."
		},
		"owner": "lehhair",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/lehhair/dsh-diff-viewer",
		"name": "dsh-diff-viewer",
		"install": "dsh plugin --profile web add github:lehhair/dsh-diff-viewer"
	},
	{
		"description": {
			"zh": "DSH 的设置扩展。",
			"en": "Settings extensions for DSH."
		},
		"owner": "omdsh-dev",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/ex-setting",
		"name": "ex-setting",
		"install": "dsh plugin --profile web add github:omdsh-dev/ex-setting"
	},
	{
		"description": {
			"zh": "Web Components 支持。",
			"en": "Web Components support."
		},
		"owner": "omdsh-dev",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/web-components",
		"name": "web-components",
		"install": "dsh plugin --profile web add github:omdsh-dev/web-components"
	},
	{
		"description": {
			"zh": "对话轮次导航。",
			"en": "Turn navigation for the DSH Web UI."
		},
		"owner": "vibeinging",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/vibeinging/dsh-turn-navigator",
		"name": "dsh-turn-navigator",
		"install": "dsh plugin --profile web add github:vibeinging/dsh-turn-navigator"
	},
	{
		"description": {
			"zh": "右侧圆点时间轴导航条，点击跳转到任意用户消息。",
			"en": "Right-side dot-timeline rail: jump between user messages."
		},
		"owner": "SnowCrescenter-tech",
		"category": "ui",
		"added": "2026-08-13",
		"url": "https://github.com/SnowCrescenter-tech/dsh-milestone",
		"name": "dsh-milestone",
		"install": "dsh plugin --profile web add github:SnowCrescenter-tech/dsh-milestone"
	},
	{
		"description": {
			"zh": "输入框 dock 显示 DeepSeek 账户余额与会话花费，自动拉取官方定价，支持高峰/低谷计价。",
			"en": "DeepSeek account balance and session cost in the composer dock, with auto-fetched official pricing and peak/off-peak support."
		},
		"owner": "Ghost011118",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/Ghost011118/dsh-balance-meter",
		"name": "dsh-balance-meter",
		"install": "dsh plugin --profile web add github:Ghost011118/dsh-balance-meter"
	},
	{
		"description": {
			"zh": "会话与当日 API 费用统计、预算图框（已用%）、官方余额、历史看板，支持峰谷计价与官方价格一键同步。",
			"en": "Per-session and daily API cost, budget with usage %, official balance, history dashboard, and one-click official price sync with peak/off-peak pricing."
		},
		"owner": "Han-1413141",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/Han-1413141/dsh-cost-meter",
		"name": "dsh-cost-meter",
		"install": "dsh plugin --profile web add github:Han-1413141/dsh-cost-meter"
	},
	{
		"description": {
			"zh": "在 DSH Web 设置中展示 DeepSeek API 余额、余额趋势与每日用量图表。",
			"en": "DeepSeek API balance, balance trend, and daily usage charts in DSH Web settings."
		},
		"owner": "fishxcode",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/fishxcode/dsh-plugin-deepseek-balance",
		"name": "dsh-plugin-deepseek-balance",
		"install": "dsh plugin --profile web add github:fishxcode/dsh-plugin-deepseek-balance"
	},
	{
		"description": {
			"zh": "在设置页展示 DeepSeek API 余额与最近 24 小时用量，包括估算消费、Token、请求次数和按小时时间线。",
			"en": "DeepSeek API balance and 24-hour usage dashboard in Settings, with estimated spend, token counts, request counts, and an hourly timeline."
		},
		"owner": "Sev7een",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/Sev7een/ds-api-usage",
		"name": "ds-api-usage",
		"install": "dsh plugin --profile web add github:Sev7een/ds-api-usage"
	},
	{
		"description": {
			"zh": "DSH Web 用量与费用统计插件：右下角悬浮窗，按模型/按天/按会话多维聚合与预计花费。",
			"en": "Token usage and estimated spend for the dsh web UI: floating panel with per-model, per-day, and per-session stats."
		},
		"owner": "nonewind",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/nonewind/dsh-spend",
		"name": "dsh-spend",
		"install": "dsh plugin --profile web add github:nonewind/dsh-spend"
	},
	{
		"description": {
			"zh": "Claude Code 风格全屏终端 UI：像素鲸鱼顶栏、实时工作状态行、思考流式展开。",
			"en": "Claude Code-style full-screen terminal UI: pixel-whale header, live status line, and streaming thought expansion."
		},
		"owner": "ccch1mneyyy",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/ccch1mneyyy/dsh-TUI",
		"name": "dsh-TUI",
		"install": "dsh plugin --profile web add github:ccch1mneyyy/dsh-TUI"
	},
	{
		"description": {
			"zh": "侧边栏完整工作台：内置文件渲染编辑、终端、Git 与子代理，支持三方插件注册新 Tab。",
			"en": "Full sidebar workbench with file rendering and editing, terminal, Git, and subagents; third-party plugins can register new tabs."
		},
		"owner": "omdsh-dev",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/omdsh-dev/DSH-better-sidebar",
		"name": "DSH-better-sidebar",
		"install": "dsh plugin --profile web add github:omdsh-dev/DSH-better-sidebar"
	},
	{
		"description": {
			"zh": "一键收起会话中所有展开的区块（Think、工具卡等），常驻计数按钮 + 自定义快捷键。",
			"en": "One-click collapse of every expanded section (Think rows, tool cards) with a live-count pill and a customizable hotkey."
		},
		"owner": "Han-1413141",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/Han-1413141/dsh-sticky-disclosure",
		"name": "dsh-sticky-disclosure",
		"install": "dsh plugin --profile web add github:Han-1413141/dsh-sticky-disclosure"
	},
	{
		"description": {
			"zh": "编辑框工具栏便签，随手记点子和 TODO，自动保存为 Markdown，一键发送到对话。",
			"en": "Quick sticky notes on the composer toolbar: jot ideas or TODOs, auto-saved as Markdown, one click to send into the chat."
		},
		"owner": "Meredith2328",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/Meredith2328/dsh-sticky-note",
		"name": "dsh-sticky-note",
		"install": "dsh plugin --profile web add github:Meredith2328/dsh-sticky-note"
	},
	{
		"description": {
			"zh": "会话需要你时三处同时亮起：角标、标签页标题计数、按状态换色的鲸鱼 favicon。",
			"en": "Attention reminders: frame badge, tab-title count, and a status-colored whale favicon for sessions waiting for input or finished unopened."
		},
		"owner": "Luaphes",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/Luaphes/dsh-web-attention-badge",
		"name": "dsh-web-attention-badge",
		"install": "dsh plugin --profile web add github:Luaphes/dsh-web-attention-badge"
	},
	{
		"description": {
			"zh": "DSH Web UI 插件与皮肤合集：任务看板、git 图、右侧面板、远程移动端 UI、桌宠、实时 token 统计与皮肤中心。",
			"en": "Plugin and skin collection for the DSH Web UI: task board, Git graph, right-side panel, remote mobile UI, pet, live token stats, and a skin center."
		},
		"owner": "zhu1090093659",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/zhu1090093659/dsh-web-ui",
		"name": "dsh-web-ui",
		"install": "dsh plugin --profile web add github:zhu1090093659/dsh-web-ui"
	},
	{
		"description": {
			"zh": "为 DSH Web 添加官方内置插件目录、搜索与状态说明，并提供经过审核的安全 UI 插件开关。",
			"en": "Adds a built-in plugin catalog to DSH Web with search, status explanations, and safe toggles for audited UI plugins."
		},
		"owner": "Starfie1d1272",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/Starfie1d1272/dsh-builtin-toggles",
		"name": "dsh-builtin-toggles",
		"install": "dsh plugin --profile web add github:Starfie1d1272/dsh-builtin-toggles"
	},
	{
		"description": {
			"zh": "Solarized 浅色主题、紧凑布局、思考/工具链折叠胶囊，以及余额、本轮成本与用量看板的 DSH Web 界面增强插件。",
			"en": "Solarized light theme, compact layout, think/tool-chain collapse capsules, and balance, session cost, and usage dashboards for the DSH web UI."
		},
		"owner": "jiangnanquan",
		"category": "ui",
		"added": "2026-08-14",
		"url": "https://github.com/jiangnanquan/dsh-ux",
		"name": "dsh-enhance",
		"install": "dsh plugin --profile web add github:jiangnanquan/dsh-ux"
	},
	{
		"description": {
			"zh": "Codex 风格皮肤切换器 + 自定义壁纸层，可调透明度与模糊。",
			"en": "Codex-style skin switcher plus a custom wallpaper layer with opacity and blur controls."
		},
		"owner": "KinGao294",
		"category": "theme",
		"added": "2026-08-14",
		"url": "https://github.com/KinGao294/dsh-skin",
		"name": "dsh-skin",
		"install": "dsh plugin --profile web add github:KinGao294/dsh-skin"
	},
	{
		"description": {
			"zh": "DSH Web 鲸鱼娘皮肤系列（深海女仆工坊 maid-atelier）。",
			"en": "Whale-girl skin series for the DSH Web UI (maid-atelier)."
		},
		"owner": "Small-tailqwq",
		"category": "theme",
		"added": "2026-08-14",
		"url": "https://github.com/Small-tailqwq/dsh-deep-whale",
		"name": "dsh-deep-whale",
		"install": "dsh plugin --profile web add github:Small-tailqwq/dsh-deep-whale"
	},
	{
		"description": {
			"zh": "对话回退：基于持久 Change Ledger 回滚会话与工作区状态。",
			"en": "Rewind conversation and workspace state, powered by a persistent Change Ledger."
		},
		"owner": "Anionex",
		"category": "session",
		"added": "2026-08-13",
		"url": "https://github.com/Anionex/dsh-turn-rewind",
		"name": "dsh-turn-rewind",
		"install": "dsh plugin --profile web add github:Anionex/dsh-turn-rewind"
	},
	{
		"description": {
			"zh": "跨会话消息：本机任意会话都可像 Claude Code 一样列出并互发消息，基于本地心跳注册表与收件箱。",
			"en": "Cross-session messaging for DSH: any session on the machine can list and message any other, Claude Code-style, via a local heartbeat registry and inbox."
		},
		"owner": "Jesse-njx",
		"category": "session",
		"added": "2026-08-14",
		"url": "https://github.com/Jesse-njx/dsh-crosstalk",
		"name": "dsh-crosstalk",
		"install": "dsh plugin --profile web add github:Jesse-njx/dsh-crosstalk"
	},
	{
		"description": {
			"zh": "一键分享你的对话。",
			"en": "Share your conversations with one click."
		},
		"owner": "hellodigua",
		"category": "session",
		"added": "2026-08-13",
		"url": "https://github.com/hellodigua/dsh-share",
		"name": "dsh-share",
		"install": "dsh plugin --profile web add github:hellodigua/dsh-share"
	},
	{
		"description": {
			"zh": "基于分支的消息编辑、reroll、重试与版本时间线。",
			"en": "Branch-based message editing, reroll, retry, and a version timeline."
		},
		"owner": "Moeblack",
		"category": "session",
		"added": "2026-08-13",
		"url": "https://github.com/Moeblack/dsh-message-edit",
		"name": "dsh-message-edit",
		"install": "dsh plugin --profile web add github:Moeblack/dsh-message-edit"
	},
	{
		"description": {
			"zh": "`/side` 持续性侧会话与 `/btw` 一次性侧问，在临时 fork 中运行、不写入主会话历史。",
			"en": "`/side` persistent side sessions and `/btw` one-shot side questions, run in a temporary fork without touching main history."
		},
		"owner": "Buyi-wsgzg",
		"category": "session",
		"added": "2026-08-13",
		"url": "https://github.com/Buyi-wsgzg/dsh-sidechain",
		"name": "dsh-sidechain",
		"install": "dsh plugin --profile web add github:Buyi-wsgzg/dsh-sidechain"
	},
	{
		"description": {
			"zh": "分享任意段落的对话。",
			"en": "Share any excerpt of a conversation."
		},
		"owner": "bill9109",
		"category": "session",
		"added": "2026-08-13",
		"url": "https://github.com/bill9109/dsh-conversation-share",
		"name": "dsh-conversation-share",
		"install": "dsh plugin --profile web add github:bill9109/dsh-conversation-share"
	},
	{
		"description": {
			"zh": "本地优先学习模式：跨会话全局学习线程、按来源讲解。",
			"en": "Local-first learning mode: cross-session learning threads with per-source explanations."
		},
		"owner": "yuezengwu",
		"category": "session",
		"added": "2026-08-13",
		"url": "https://github.com/yuezengwu/dsh-explain",
		"name": "dsh-explain",
		"install": "dsh plugin --profile web add github:yuezengwu/dsh-explain"
	},
	{
		"description": {
			"zh": "带实时预览的用户/内置 system prompt 分节编辑器。",
			"en": "Edit user and built-in system-prompt sections with live preview."
		},
		"owner": "Moeblack",
		"category": "session",
		"added": "2026-08-13",
		"url": "https://github.com/Moeblack/dsh-prompt-studio",
		"name": "dsh-prompt-studio",
		"install": "dsh plugin --profile web add github:Moeblack/dsh-prompt-studio"
	},
	{
		"description": {
			"zh": "让 dsh 和 Claude Code 会话直接互发消息，附带可点击的会话列表卡片（搜索/刷新/弹窗发送）。",
			"en": "Let dsh and Claude Code sessions message each other directly; comes with a clickable peer list card (sort/search/send/refresh)."
		},
		"owner": "czm15053",
		"category": "session",
		"added": "2026-08-14",
		"url": "https://github.com/czm15053/dsh-peer-link",
		"name": "dsh-peer-link",
		"install": "dsh plugin --profile web add github:czm15053/dsh-peer-link"
	},
	{
		"description": {
			"zh": "把 Claude Code / Codex / ChatGPT / Cursor / Gemini / Reasonix / opencode 的聊天记录全保真导入为可续聊的 DSH 会话。",
			"en": "Import Claude Code / Codex / ChatGPT / Cursor / Gemini / Reasonix / opencode chat histories as resumable DeepSeek Harness sessions."
		},
		"owner": "Nwflower",
		"category": "session",
		"added": "2026-08-13",
		"url": "https://github.com/Nwflower/dsh-chat-import",
		"name": "dsh-chat-import",
		"install": "dsh plugin --profile web add github:Nwflower/dsh-chat-import"
	},
	{
		"description": {
			"zh": "同一工作区并行多会话的文件认领与写入保护（claim/release、心跳 stale 接管、pending 三路合并）。",
			"en": "File claim/release protection for parallel DSH sessions on the same workspace (heartbeat stale takeover, pending 3-way merge area)."
		},
		"owner": "Nwflower",
		"category": "session",
		"added": "2026-08-14",
		"url": "https://github.com/Nwflower/dsh-file-claim",
		"name": "dsh-file-claim",
		"install": "dsh plugin --profile web add github:Nwflower/dsh-file-claim"
	},
	{
		"description": {
			"zh": "跨实例互联：经 interconnect 服务在多个 DSH 实例间转发消息与事件。",
			"en": "Cross-instance message and event handoff between DSH instances via an interconnect server."
		},
		"owner": "Chinesezjc",
		"category": "session",
		"added": "2026-08-14",
		"url": "https://github.com/Chinesezjc/dsh-interconnect",
		"name": "dsh-interconnect",
		"install": "dsh plugin --profile web add github:Chinesezjc/dsh-interconnect"
	},
	{
		"description": {
			"zh": "自动对话蒸馏：后台 subagent 反省 + 技能 create/update。",
			"en": "Automatic conversation distillation: background subagent reflection + skill create/update."
		},
		"owner": "LoserFox",
		"category": "memory",
		"added": "2026-08-13",
		"url": "https://github.com/LoserFox/distill",
		"name": "distill",
		"install": "dsh plugin --profile web add github:LoserFox/distill"
	},
	{
		"description": {
			"zh": "Mnemon 深度集成：本地三层记忆（Runtime Memory、可检索 Documents、受监督 Memory Spaces）。",
			"en": "Deep Mnemon integration: local three-tier memory (Runtime Memory, retrievable Documents, supervised Memory Spaces)."
		},
		"owner": "omdsh-dev",
		"category": "memory",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-mnemon",
		"name": "dsh-mnemon",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-mnemon"
	},
	{
		"description": {
			"zh": "跨会话记忆：SQLite + 可人工编辑的 Markdown 镜像，后台自动巩固（去重/合并/冲突裁决），提供 6 个记忆工具。",
			"en": "Cross-session memory: SQLite with a human-editable Markdown mirror, background consolidation (dedup, merge, conflict resolution), and six memory tools."
		},
		"owner": "modusensus",
		"category": "memory",
		"added": "2026-08-14",
		"url": "https://github.com/modusensus/dsh-mneme",
		"name": "dsh-mneme",
		"install": "dsh plugin --profile web add github:modusensus/dsh-mneme"
	},
	{
		"description": {
			"zh": "给所有 AI 工具和 Agent 共用的一层记忆：注入 Context Bundle、提示时检索、MCP 工具与回合结束 DSH 线程捕获。",
			"en": "One memory layer for every AI tool and agent: Context Bundle injection, prompt-time recall, MCP tools, and turn-end DSH thread capture."
		},
		"owner": "nowledge-co",
		"category": "memory",
		"added": "2026-08-14",
		"url": "https://github.com/nowledge-co/nowledge-mem-deepseek-harness",
		"name": "nowledge-mem-deepseek-harness",
		"install": "dsh plugin --profile web add github:nowledge-co/nowledge-mem-deepseek-harness"
	},
	{
		"description": {
			"zh": "基于 DSH 无损会话日志的引用式记忆：蒸馏出的事实带 `(sessionId, eventRange)` 引用，可随时展开回原始日志片段。",
			"en": "Cited memory over DSH's lossless session log: distilled facts carry `(sessionId, eventRange)` citations that expand back to the exact original log excerpt."
		},
		"owner": "Jesse-njx",
		"category": "memory",
		"added": "2026-08-14",
		"url": "https://github.com/Jesse-njx/dsh-memory",
		"name": "dsh-memory",
		"install": "dsh plugin --profile web add github:Jesse-njx/dsh-memory"
	},
	{
		"description": {
			"zh": "跨会话记忆库：remember / recall / forget 工具、每轮提示注入与设置页条目浏览。",
			"en": "Cross-session memory vault: remember / recall / forget tools, per-turn prompt injection, and a settings-page entry browser."
		},
		"owner": "flymysql",
		"category": "memory",
		"added": "2026-08-14",
		"url": "https://github.com/flymysql/dsh-memory",
		"name": "dsh-memory-vault",
		"install": "dsh plugin --profile web add github:flymysql/dsh-memory"
	},
	{
		"description": {
			"zh": "动作-状态时序记忆：记录类型化的状态与动作，做趋势、异常与因果关联分析。",
			"en": "Action-state time memory: record typed states and actions, then analyze trends, anomalies, and causality."
		},
		"owner": "Xplore-LAB",
		"category": "memory",
		"added": "2026-08-14",
		"url": "https://github.com/Xplore-LAB/dsh-plugin-asmemory",
		"name": "dsh-plugin-asmemory",
		"install": "dsh plugin --profile web add github:Xplore-LAB/dsh-plugin-asmemory"
	},
	{
		"description": {
			"zh": "有界、分层、带审批门、可审计的跨会话记忆：`ctx.memory` 服务 + 零依赖 SQLite 存储 + `memory` 工具与冻结快照注入；写入必过审批门，模型可见内容可自会话日志重建。",
			"en": "Bounded, layered, approval-gated, auditable cross-session memory: a typed `ctx.memory` seam with a zero-dependency SQLite provider, a `memory` tool, and frozen snapshot injection; every write passes the approval gate and stays reconstructable from the session log."
		},
		"owner": "PerryLink",
		"category": "memory",
		"added": "2026-08-14",
		"url": "https://github.com/PerryLink/dsh-memento",
		"name": "dsh-memento",
		"install": "dsh plugin --profile web add github:PerryLink/dsh-memento"
	},
	{
		"description": {
			"zh": "文件型工作记忆：memorize/recall 把关键前提逐字保存在会话笔记文件，无损挺过上下文压缩。",
			"en": "File-backed working memory: memorize/recall key premises verbatim in a session notes file so they survive context compaction losslessly."
		},
		"owner": "ICCuse",
		"category": "memory",
		"added": "2026-08-14",
		"url": "https://github.com/ICCuse/dsh-file-memory",
		"name": "dsh-file-memory",
		"install": "dsh plugin --profile web add github:ICCuse/dsh-file-memory"
	},
	{
		"description": {
			"zh": "全局知识库桥：kb_add/kb_search/kb_show/kb_timeline 读写与 Codex 共享的 D:\\knowledge（格式逐字节兼容）。",
			"en": "Bridge into a global Markdown knowledge base shared with the Codex kb.cmd CLI: kb_add/kb_search/kb_show/kb_timeline tools with byte-compatible frontmatter."
		},
		"owner": "ICCuse",
		"category": "memory",
		"added": "2026-08-14",
		"url": "https://github.com/ICCuse/dsh-knowledge",
		"name": "dsh-knowledge",
		"install": "dsh plugin --profile web add github:ICCuse/dsh-knowledge"
	},
	{
		"description": {
			"zh": "压缩后前提漂移守卫：摘要丢失关键字面锚点时注入一次性提醒。",
			"en": "Post-compaction premise-drift guard: injects a one-shot notice when a compaction summary drops a critical literal anchor."
		},
		"owner": "ICCuse",
		"category": "memory",
		"added": "2026-08-14",
		"url": "https://github.com/ICCuse/dsh-premise-guard",
		"name": "dsh-premise-guard",
		"install": "dsh plugin --profile web add github:ICCuse/dsh-premise-guard"
	},
	{
		"description": {
			"zh": "DSH 撤销/回退系统：配置变更自动存档，一键撤销/恢复/回退到任意版本，支持 WebUI 与离线 CLI/GUI 工具（DSH 启动失败也能救）。",
			"en": "Undo/redo & rollback system for DSH: every config change is auto-snapshotted; undo/redo/restore to any version from the WebUI or the offline CLI/GUI tools (works even when DSH fails to boot)."
		},
		"owner": "lire1131",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/lire1131/dsh-undo-plugin",
		"name": "dsh-undo-plugin",
		"install": "dsh plugin --profile web add github:lire1131/dsh-undo-plugin"
	},
	{
		"description": {
			"zh": "一个 shell 工具：Windows 上统一执行 PowerShell / Git Bash / WSL，外加交互式 PTY 终端，默认终端由用户在设置中选择。",
			"en": "One shell tool for PowerShell / Git Bash / WSL on Windows plus an interactive PTY terminal; the default terminal is chosen by the user in DSH settings."
		},
		"owner": "MAXeaglet",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/MAXeaglet/dsh-bash-terminal",
		"name": "dsh-bash-terminal",
		"install": "dsh plugin --profile web add github:MAXeaglet/dsh-bash-terminal"
	},
	{
		"description": {
			"zh": "让纯文本模型更好地做视觉任务：带意图的图片问答、长截图 OCR、UI 还原等。",
			"en": "Vision tasks for text-only models: intent-aware image Q&A, long-screenshot OCR, UI reproduction, grounding, and pixel diff."
		},
		"owner": "Anionex",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/Anionex/dsh-vision-toolkit",
		"name": "dsh-vision-toolkit",
		"install": "dsh plugin --profile web add github:Anionex/dsh-vision-toolkit"
	},
	{
		"description": {
			"zh": "用 Monaco 编辑器创建和管理沙箱化的自定义 JavaScript 工具。",
			"en": "Create and manage sandboxed JavaScript tools with a Monaco editor and model-driven tool lifecycle."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-custom-tool",
		"name": "dsh-custom-tool",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-custom-tool"
	},
	{
		"description": {
			"zh": "macOS 电脑控制：Accessibility 观测、过期状态拒绝、作用域权限与安全输入。",
			"en": "Accessibility-first macOS computer use: fresh observations, stale-state rejection, scoped permissions, and safe input."
		},
		"owner": "Anionex",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/Anionex/dsh-computer-use",
		"name": "dsh-computer-use",
		"install": "dsh plugin --profile web add github:Anionex/dsh-computer-use"
	},
	{
		"description": {
			"zh": "让 AI 帮你连数据库、写 SQL。",
			"en": "Let the AI connect to databases and write SQL for you."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-data-agent",
		"name": "dsh-data-agent",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-data-agent"
	},
	{
		"description": {
			"zh": "零依赖工具包：time / encoding / json / calculator / csv / regex / markdown / diff / stat / schema 十件套一键安装。",
			"en": "Zero-dependency toolkit: time / encoding / json / calculator / csv / regex / markdown / diff / stat / schema — ten deterministic tools in one install."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-toolkit",
		"name": "dsh-toolkit",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-toolkit"
	},
	{
		"description": {
			"zh": "CSV 解析/查询/统计/转换（RFC 4180），零依赖状态机解析器。",
			"en": "Parse/query/aggregate/convert CSV (RFC 4180) with a zero-dependency state-machine parser."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-tool-csv",
		"name": "dsh-tool-csv",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-tool-csv"
	},
	{
		"description": {
			"zh": "安全的数学表达式求值器，零依赖递归下降解析器。",
			"en": "Safe math expression evaluator, zero-dependency recursive-descent parser."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-tool-calculator",
		"name": "dsh-tool-calculator",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-tool-calculator"
	},
	{
		"description": {
			"zh": "文本/JSON/CSV/Markdown 结构化比较与 unified diff。",
			"en": "Structured comparison and unified diffs for text/JSON/CSV/Markdown."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-tool-diff",
		"name": "dsh-tool-diff",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-tool-diff"
	},
	{
		"description": {
			"zh": "base64/url/hex 编解码、常用哈希、UUID 生成。",
			"en": "base64/url/hex encoding, common hashes, and UUID generation."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-tool-encoding",
		"name": "dsh-tool-encoding",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-tool-encoding"
	},
	{
		"description": {
			"zh": "JMESPath 子集 JSON 查询。",
			"en": "JSON queries with a JMESPath subset."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-tool-json",
		"name": "dsh-tool-json",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-tool-json"
	},
	{
		"description": {
			"zh": "HTML↔Markdown 转换、GFM 表格规范化、目录生成。",
			"en": "HTML↔Markdown conversion, GFM table normalization, and TOC generation."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-tool-markdown",
		"name": "dsh-tool-markdown",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-tool-markdown"
	},
	{
		"description": {
			"zh": "正则测试/提取/安全替换/静态解释（不执行代码）。",
			"en": "Test/extract/safe-replace/statically explain regexes without executing code."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-tool-regex",
		"name": "dsh-tool-regex",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-tool-regex"
	},
	{
		"description": {
			"zh": "JSON Schema 验证：validate/paths/explain/normalize。",
			"en": "JSON Schema validation: validate/paths/explain/normalize."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-tool-schema",
		"name": "dsh-tool-schema",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-tool-schema"
	},
	{
		"description": {
			"zh": "描述统计/百分位数/频数分布/相关性。",
			"en": "Descriptive statistics, percentiles, frequency distributions, and correlation."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-tool-stat",
		"name": "dsh-tool-stat",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-tool-stat"
	},
	{
		"description": {
			"zh": "严格 ISO 8601 解析、IANA 时区转换、UTC 日历运算。",
			"en": "Strict ISO 8601 parsing, IANA timezone conversion, and UTC calendar arithmetic."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-tool-time",
		"name": "dsh-tool-time",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-tool-time"
	},
	{
		"description": {
			"zh": "从 md/txt/docx/pdf 构建可审计知识库包（SQLite FTS5），确定性检索与原文阅读。",
			"en": "Build auditable KB packs (SQLite FTS5) from md/txt/docx/pdf with deterministic retrieval and original-text reading."
		},
		"owner": "omdsh-dev",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-kb-sieve",
		"name": "dsh-kb-sieve",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-kb-sieve"
	},
	{
		"description": {
			"zh": "向模型暴露 MineRU 文档解析工具。",
			"en": "Expose MineRU document parsing tools to the model."
		},
		"owner": "HuanLinOTO",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/HuanLinOTO/dsh-plugin-mineru",
		"name": "dsh-plugin-mineru",
		"install": "dsh plugin --profile web add github:HuanLinOTO/dsh-plugin-mineru"
	},
	{
		"description": {
			"zh": "doc_read/doc_write：以有界、单元格寻址的方式读写 xlsx / pdf / docx / pptx / ipynb，另附 MCP 服务器与 CLI。",
			"en": "Bounded, cell-addressed `doc_read`/`doc_write` for xlsx / pdf / docx / pptx / ipynb, plus an MCP server and CLI."
		},
		"owner": "Jesse-njx",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/Jesse-njx/dsh-cowork",
		"name": "dsh-cowork",
		"install": "dsh plugin --profile web add github:Jesse-njx/dsh-cowork"
	},
	{
		"description": {
			"zh": "把已有的 Agent Skills（SKILL.md）技能库带进 DSH：扫描 Claude/Codex/Cursor/Gemini 技能目录、注入渐进式索引，按需加载技能正文。",
			"en": "Bring your existing Agent Skills (SKILL.md) library to DSH: discover skills across Claude/Codex/Cursor/Gemini paths, inject a progressive-disclosure index, and load bodies on demand."
		},
		"owner": "Jesse-njx",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/Jesse-njx/dsh-skillport",
		"name": "dsh-skillport",
		"install": "dsh plugin --profile web add github:Jesse-njx/dsh-skillport"
	},
	{
		"description": {
			"zh": "按 agent 的按需工具发现与渐进式 schema 披露。",
			"en": "Per-agent on-demand tool discovery and progressive schema disclosure."
		},
		"owner": "vibeinging",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/vibeinging/dsh-tool-search",
		"name": "dsh-tool-search",
		"install": "dsh plugin --profile web add github:vibeinging/dsh-tool-search"
	},
	{
		"description": {
			"zh": "OpenMAIC 教学：课堂、幻灯片、交互组件与苏格拉底式教学。",
			"en": "OpenMAIC: classrooms, slides, interactive widgets, and Socratic teaching."
		},
		"owner": "THU-MAIC",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/THU-MAIC/dsh-openmaic",
		"name": "dsh-openmaic",
		"install": "dsh plugin --profile web add github:THU-MAIC/dsh-openmaic"
	},
	{
		"description": {
			"zh": "学术助手插件。",
			"en": "Academic assistant plugin."
		},
		"owner": "lzszq",
		"category": "tools",
		"added": "2026-08-13",
		"url": "https://github.com/lzszq/dsh-scholar",
		"name": "dsh-scholar",
		"install": "dsh plugin --profile web add github:lzszq/dsh-scholar"
	},
	{
		"description": {
			"zh": "文本卫生 dsh 插件：净化不可信文本、扫描隐形字符、清洗 LLM 格式、转义 CSV 公式注入。",
			"en": "Text hygiene as a dsh plugin: sanitize untrusted text, scan invisible characters, clean LLM formatting, and escape CSV formula injection."
		},
		"owner": "ylwl1997",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/ylwl1997/noatmark-dsh-plugin",
		"name": "noatmark-dsh-plugin",
		"install": "dsh plugin --profile web add github:ylwl1997/noatmark-dsh-plugin"
	},
	{
		"description": {
			"zh": "DSH 的 Xcode AI 集成：26 个 Xcode MCP 工具（mcpbridge）+ Apple 平台技能 + Xcode Intelligence 风格 persona（agent preset 或全局 bundle）。",
			"en": "Xcode AI integration for DSH: 26 Xcode MCP tools (mcpbridge) + Apple platform skills + Xcode Intelligence-style persona (agent preset or global bundle)."
		},
		"owner": "jihongboo",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/jihongboo/dsh-apple-mode",
		"name": "dsh-apple-mode",
		"install": "dsh plugin --profile web add github:jihongboo/dsh-apple-mode"
	},
	{
		"description": {
			"zh": "持续自进化：从会话轨迹沉淀版本化、可审计、可回滚的 harness 状态（提示词/记忆/技能/子代理规格），带审查门禁与技能热加载。",
			"en": "Continual self-evolution: versioned, auditable, rollback-safe harness state (prompts, memory, skills, subagent specs) refined from session trajectories, with review gates and hot-reloaded skills."
		},
		"owner": "ZK-Andy",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/ZK-Andy/dsh-continual-evolve",
		"name": "dsh-continual-evolve",
		"install": "dsh plugin --profile web add github:ZK-Andy/dsh-continual-evolve"
	},
	{
		"description": {
			"zh": "DSH 插件透明排行与推荐：每日自动抓取 `dsh-plugin` 话题生态，公开评分模型，提供 rank/search/recommend 工具与设置页榜单。",
			"en": "Transparent rankings and recommendations for the DSH plugin ecosystem: daily auto-fetched topic data, an open scoring model, and rank/search/recommend tools with a settings-page leaderboard."
		},
		"owner": "zp-home",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/zp-home/dsh-recommend",
		"name": "dsh-recommend",
		"install": "dsh plugin --profile web add github:zp-home/dsh-recommend"
	},
	{
		"description": {
			"zh": "为纯文本模型架起视觉桥梁：粘贴图片，输出结构化 JSON 证据（OCR、版面、语义）。",
			"en": "Vision bridge for text-only models: paste an image, get structured JSON evidence (OCR, layout, semantics)."
		},
		"owner": "liustack",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/liustack/modlens",
		"name": "modlens",
		"install": "dsh plugin --profile web add github:liustack/modlens"
	},
	{
		"description": {
			"zh": "装在 DSH 里的插件市场：设置页内逛/搜全部社区插件，按分类筛选，确认后一键安装，已装插件一目了然。",
			"en": "The plugin market inside DSH: a Settings page to browse and search the full community catalog by category, with confirmed one-click installs and an installed-plugins view."
		},
		"owner": "dsh-market",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/dsh-market/dsh-market",
		"name": "dsh-market",
		"install": "dsh plugin --profile web add github:dsh-market/dsh-market"
	},
	{
		"description": {
			"zh": "会话内直接找插件：按关键词/分类搜索本精选 registry，返回描述与可直接执行的安装命令。",
			"en": "Find plugins without leaving the agent: search this curated registry by keyword or category, with ready-to-run install commands."
		},
		"owner": "awesome-dsh-plugin",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/awesome-dsh-plugin/dsh-find-plugin",
		"name": "dsh-find-plugin",
		"install": "dsh plugin --profile web add github:awesome-dsh-plugin/dsh-find-plugin"
	},
	{
		"description": {
			"zh": "用 Tree-sitter 建立工作区符号索引，提供词法或可选 embedding 辅助的代码检索。",
			"en": "Indexes workspace symbols with Tree-sitter and provides lexical or optional embedding-assisted code search."
		},
		"owner": "lonelymoon87",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/lonelymoon87/dsh-code-intel",
		"name": "dsh-code-intel",
		"install": "dsh plugin --profile web add github:lonelymoon87/dsh-code-intel"
	},
	{
		"description": {
			"zh": "子代理委派的按调用覆盖：model/provider/persona/toolFilter、@preset: 引用与 provider/model 组合 id。",
			"en": "Per-call model, provider, persona, and toolFilter overrides for subagent delegation, with @preset: references and provider/model composite ids."
		},
		"owner": "lynx-gt",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/lynx-gt/dsh-subagent-tools",
		"name": "dsh-subagent-tools",
		"install": "dsh plugin --profile web add github:lynx-gt/dsh-subagent-tools"
	},
	{
		"description": {
			"zh": "在 dsh-subagent-tools 基础上增加子代理按调用 cwd，附带所需的两个 in-process provider 补丁。",
			"en": "Extends dsh-subagent-tools with a per-call cwd for subagents, shipped with the two in-process provider patches it requires."
		},
		"owner": "lynx-gt",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/lynx-gt/dsh-subagent-cwd",
		"name": "dsh-subagent-cwd",
		"install": "dsh plugin --profile web add github:lynx-gt/dsh-subagent-cwd"
	},
	{
		"description": {
			"zh": "语音输入、语音输出：把口述音频转写为用户消息（transcribe），让 agent 朗读回复（speak），本地优先，音频存于 ~/.dsh/voice。",
			"en": "Voice notes in, spoken answers out: dictate audio that becomes user messages (transcribe), have the agent read replies aloud (speak), local-first under ~/.dsh/voice."
		},
		"owner": "Jesse-njx",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/Jesse-njx/dsh-voice",
		"name": "dsh-voice",
		"install": "dsh plugin --profile web add github:Jesse-njx/dsh-voice"
	},
	{
		"description": {
			"zh": "类型安全、带护栏的容器控制：ps/logs/inspect/exec/start/stop 与 compose up/down，JSON 输出、项目感知定位、破坏性操作需审批。",
			"en": "Typed, guarded container control: ps/logs/inspect/exec/start/stop and compose up/down with JSON output, project-aware targeting, and approval-gated destructive ops."
		},
		"owner": "Jesse-njx",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/Jesse-njx/dsh-docker",
		"name": "dsh-docker",
		"install": "dsh plugin --profile web add github:Jesse-njx/dsh-docker"
	},
	{
		"description": {
			"zh": "在 DeepSeek Harness 里对话完成 Excel 工作：建表、编辑、修复公式、图表校验，每次编辑后自动体检公式。",
			"en": "Talk to Excel in DeepSeek Harness: create, edit, repair, and verify spreadsheets by conversation, with automatic formula health checks after every edit."
		},
		"owner": "hccccc01333",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/hccccc01333/dsh-excel-chat",
		"name": "dsh-excel-chat",
		"install": "dsh plugin --profile web add github:hccccc01333/dsh-excel-chat"
	},
	{
		"description": {
			"zh": "按需取回薄层：context_query / context_slice / context_grep 三个工具读取已持久化的历史，引用可回放。",
			"en": "Thin on-demand context retrieval: context_query / context_slice / context_grep tools that read already-persisted history back with replay-safe citations."
		},
		"owner": "EvilIrving",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/EvilIrving/dsh-context-proxy",
		"name": "dsh-context-proxy",
		"install": "dsh plugin --profile web add github:EvilIrving/dsh-context-proxy"
	},
	{
		"description": {
			"zh": "将 DSH 对话导出为锤子便签风格 PNG，或在配置的账号工作区中新建和更新 Markdown 便签。",
			"en": "Export DSH conversations as Smartisan Notes-style PNGs, or create and update Markdown notes in a configured account-scoped workspace."
		},
		"owner": "zhaoolee",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/zhaoolee/notes",
		"name": "@zhaoolee/dsh-notes",
		"install": "dsh plugin --profile web add github:zhaoolee/notes"
	},
	{
		"description": {
			"zh": "将 SVG 路径与关键帧参数编译成自包含的 Lottie JSON 动画文件。",
			"en": "Compile SVG paths and keyframe specs into self-contained Lottie JSON animation files."
		},
		"owner": "zimai233",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/zimai233/dsh-figma-to-lottie",
		"name": "dsh-figma-to-lottie",
		"install": "dsh plugin --profile web add github:zimai233/dsh-figma-to-lottie"
	},
	{
		"description": {
			"zh": "查询 64 场中国考试（高考/考研/四六级/CPA/法考…）的规则日期（第二个周六、第一个周日）与倒计时。",
			"en": "Query 64 Chinese exams (高考/考研/四六级/CPA/法考…) with rule-aware date math (2nd-Saturday, 1st-Sunday) and countdowns."
		},
		"owner": "zimai233",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/zimai233/dsh-exam-countdown",
		"name": "dsh-exam-countdown",
		"install": "dsh plugin --profile web add github:zimai233/dsh-exam-countdown"
	},
	{
		"description": {
			"zh": "基于纯日期数学的周期习惯排程：下次发生日、区间排程与逾期提醒。",
			"en": "Recurring-habit scheduling from pure date math: next occurrence, range schedules, and overdue advice."
		},
		"owner": "zimai233",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/zimai233/dsh-wash-calendar",
		"name": "dsh-wash-calendar",
		"install": "dsh plugin --profile web add github:zimai233/dsh-wash-calendar"
	},
	{
		"description": {
			"zh": "ADHD 行为辅导技能：任务拆解、事项过载管理、启动仪式与失败重启。",
			"en": "ADHD behavioral coaching skill: task breakdown, overwhelm management, launch rituals, and failure recovery."
		},
		"owner": "zimai233",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/zimai233/dsh-adhd-copilot",
		"name": "dsh-adhd-copilot",
		"install": "dsh plugin --profile web add github:zimai233/dsh-adhd-copilot"
	},
	{
		"description": {
			"zh": "多引擎反向识图聚合：Google Lens、百度、Yandex、TinEye、SauceNAO、IQDB、Ascii2d。",
			"en": "Multi-engine reverse image search aggregator: Google Lens, Baidu, Yandex, TinEye, SauceNAO, IQDB, Ascii2d."
		},
		"owner": "zimai233",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/zimai233/dsh-image-search",
		"name": "dsh-image-search",
		"install": "dsh plugin --profile web add github:zimai233/dsh-image-search"
	},
	{
		"description": {
			"zh": "检测并下载 B站/YouTube/抖音/小红书视频媒体，带清晰度与格式分析。",
			"en": "Detect and download media from Bilibili/YouTube/Douyin/Xiaohongshu with quality and format analysis."
		},
		"owner": "zimai233",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/zimai233/dsh-video-downloader",
		"name": "dsh-video-downloader",
		"install": "dsh plugin --profile web add github:zimai233/dsh-video-downloader"
	},
	{
		"description": {
			"zh": "基于代码库知识图谱的 read_graph 工具（CONTAINS / EXPORTS / IMPORTS / IMPORTS_SYMBOL 关系）。",
			"en": "A read_graph tool backed by a codebase knowledge graph (CONTAINS / EXPORTS / IMPORTS / IMPORTS_SYMBOL relations)."
		},
		"owner": "Luke-Yong",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/Luke-Yong/dsh-plugin-knowledge-graph",
		"name": "dsh-plugin-knowledge-graph",
		"install": "dsh plugin --profile web add github:Luke-Yong/dsh-plugin-knowledge-graph"
	},
	{
		"description": {
			"zh": "纯文本 agent 的联网搜索桥：搜索网页与 X，返回结构化 JSON 证据（search/fetch/引用）。",
			"en": "Web search bridge for text-only agents: ask the web or X, get structured JSON evidence (search, fetch, citations)."
		},
		"owner": "liustack",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/liustack/modsearch",
		"name": "modsearch",
		"install": "dsh plugin --profile web add github:liustack/modsearch"
	},
	{
		"description": {
			"zh": "专为 agent 打造的搜索工具：多语言，覆盖中文/英文/学术/代码/购物/金融/新闻/百科。",
			"en": "Search built for agents: multilingual coverage across web, academic, code, shopping, finance, news, and encyclopedias."
		},
		"owner": "taxueseek",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/taxueseek/argo",
		"name": "argo",
		"install": "dsh plugin --profile web add github:taxueseek/argo"
	},
	{
		"description": {
			"zh": "Chrome 侧边栏扩展，让 DSH 直接操控你的浏览器，无需视觉能力。",
			"en": "Chrome sidebar extension that lets DSH operate your browser directly, no vision capabilities required."
		},
		"owner": "Lum1104",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/Lum1104/dsh-browser",
		"name": "dsh-browser",
		"install": "dsh plugin --profile web add github:Lum1104/dsh-browser"
	},
	{
		"description": {
			"zh": "dsh Web GUI 内的社区插件市场：浏览 awesome-dsh-plugin.com 目录，从 设置 → 插件 → 插件市场 安装/卸载插件到 profile。",
			"en": "In-harness plugin market for the dsh web GUI: browse the awesome-dsh-plugin.com catalog and install/uninstall plugins into a profile from Settings → Plugins → Plugin Market."
		},
		"owner": "Sanqi-normal",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/Sanqi-normal/dsh-webui-market-plugin",
		"name": "dsh-webui-market-plugin",
		"install": "dsh plugin --profile web add github:Sanqi-normal/dsh-webui-market-plugin"
	},
	{
		"description": {
			"zh": "浏览器自动化（Playwright，带实时画面）+ MCP Server（把 DSH agent 暴露给任何 MCP 客户端）+ GitHub issue/PR/webhook 评审工具。",
			"en": "Browser automation (Playwright) with a live view, an MCP server exposing DSH agents to any MCP client, and GitHub issue/PR/webhook review tools."
		},
		"owner": "huey1in",
		"category": "tools",
		"added": "2026-08-14",
		"url": "https://github.com/huey1in/trio",
		"name": "dsh-trio",
		"install": "dsh plugin --profile web add github:huey1in/trio"
	},
	{
		"description": {
			"zh": "把 UltraCode 式多 Agent 调度带给 DSH：可生成、可保存、可治理、可观察、可恢复的 Workflow 层。",
			"en": "UltraCode-style multi-agent orchestration: a generatable, savable, governable, observable, resumable workflow layer."
		},
		"owner": "icetomoyo",
		"category": "workflow",
		"added": "2026-08-13",
		"url": "https://github.com/icetomoyo/dsh_workflow",
		"name": "dsh_workflow",
		"install": "dsh plugin --profile web add github:icetomoyo/dsh_workflow"
	},
	{
		"description": {
			"zh": "AgentTeams 多智能体团队。",
			"en": "AgentTeams multi-agent teams."
		},
		"owner": "NanmiCoder",
		"category": "workflow",
		"added": "2026-08-13",
		"url": "https://github.com/NanmiCoder/dsh-agent-teams",
		"name": "dsh-agent-teams",
		"install": "dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams"
	},
	{
		"description": {
			"zh": "定时任务：让 Coding 任务按计划在全新 Agent Session 中运行，保留可审计历史。",
			"en": "Scheduled coding runs in fresh agent sessions with auditable history."
		},
		"owner": "titanwings",
		"category": "workflow",
		"added": "2026-08-13",
		"url": "https://github.com/titanwings/dsh-automation",
		"name": "dsh-automation",
		"install": "dsh plugin --profile web add github:titanwings/dsh-automation"
	},
	{
		"description": {
			"zh": "设置页定时任务：支持准点或 DeepSeek 谷时段执行、单次/每日重复，并持久化任务状态。",
			"en": "Settings-based scheduled tasks that run on time or during DeepSeek off-peak hours, with one-time and daily schedules backed by durable task state."
		},
		"owner": "Sev7een",
		"category": "workflow",
		"added": "2026-08-14",
		"url": "https://github.com/Sev7een/dsh-plugin-automations",
		"name": "dsh-plugin-automations",
		"install": "dsh plugin --profile web add github:Sev7een/dsh-plugin-automations"
	},
	{
		"description": {
			"zh": "定时 Agent：按 cron 计划运行 prompt，把摘要送到你已有的地方，内置重叠/漏跑/超时安全策略。",
			"en": "Scheduled agents on a cron: run a prompt on a schedule and get the digest where you already are, with overlap/missed-run/timeout safety defaults."
		},
		"owner": "Jesse-njx",
		"category": "workflow",
		"added": "2026-08-14",
		"url": "https://github.com/Jesse-njx/dsh-routines",
		"name": "dsh-routines",
		"install": "dsh plugin --profile web add github:Jesse-njx/dsh-routines"
	},
	{
		"description": {
			"zh": "计划批注：选中计划原文逐条批注，结构化反馈送回 Agent。",
			"en": "Plan review with anchored annotations and structured feedback back to the agent."
		},
		"owner": "titanwings",
		"category": "workflow",
		"added": "2026-08-13",
		"url": "https://github.com/titanwings/dsh-plannotator",
		"name": "dsh-plannotator",
		"install": "dsh plugin --profile web add github:titanwings/dsh-plannotator"
	},
	{
		"description": {
			"zh": "定时循环：`/loop` 命令 + loop 工具 + 活动状态条。",
			"en": "Recurring loops: `/loop` command + loop tool + activity status bar."
		},
		"owner": "vlln",
		"category": "workflow",
		"added": "2026-08-13",
		"url": "https://github.com/vlln/dsh-loop",
		"name": "dsh-loop",
		"install": "dsh plugin --profile web add github:vlln/dsh-loop"
	},
	{
		"description": {
			"zh": "条件驱动唤醒：file/command/http/process/webhook 持久监视，触发即唤醒 agent。",
			"en": "Condition-driven wakeup: durable file/command/http/process/webhook watches that wake the agent."
		},
		"owner": "fuhefei",
		"category": "workflow",
		"added": "2026-08-13",
		"url": "https://github.com/fuhefei/dsh-sentinel",
		"name": "dsh-sentinel",
		"install": "dsh plugin --profile web add github:fuhefei/dsh-sentinel"
	},
	{
		"description": {
			"zh": "自适应深度研究编排器（基于官方 workflow 引擎）。",
			"en": "Adaptive deep-research orchestrator built on the official workflow engine."
		},
		"owner": "omdsh-dev",
		"category": "workflow",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-deep-research",
		"name": "dsh-deep-research",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-deep-research"
	},
	{
		"description": {
			"zh": "发现问题→修复交付→质量复查的对抗式闭环工具集。",
			"en": "Adversarial checkup → fix → review loop toolset."
		},
		"owner": "omdsh-dev",
		"category": "workflow",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-inspect",
		"name": "dsh-inspect",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-inspect"
	},
	{
		"description": {
			"zh": "嵌入式任务管理引擎：决策点协议、念头捕获墙、Linear 形 issue 存储。",
			"en": "Embedded task management engine: decision-point protocol, idea capture wall, Linear-style issue store."
		},
		"owner": "fakechris",
		"category": "workflow",
		"added": "2026-08-13",
		"url": "https://github.com/fakechris/dsh-track",
		"name": "dsh-track",
		"install": "dsh plugin --profile web add github:fakechris/dsh-track"
	},
	{
		"description": {
			"zh": "搭配一个副模型，每轮被动审查并注入见解。",
			"en": "Pair a second model that passively reviews each turn and injects notes."
		},
		"owner": "btspoony",
		"category": "workflow",
		"added": "2026-08-13",
		"url": "https://github.com/btspoony/dsh-advisor",
		"name": "dsh-advisor",
		"install": "dsh plugin --profile web add github:btspoony/dsh-advisor"
	},
	{
		"description": {
			"zh": "增加规格工件、技能、命令、由 goal 驱动的实施流程和任务进度上下文。",
			"en": "Adds specification artifacts, skills, commands, goal-backed implementation, and task-progress context."
		},
		"owner": "lonelymoon87",
		"category": "workflow",
		"added": "2026-08-14",
		"url": "https://github.com/lonelymoon87/dsh-specflow",
		"name": "dsh-specflow",
		"install": "dsh plugin --profile web add github:lonelymoon87/dsh-specflow"
	},
	{
		"description": {
			"zh": "面向 DSH 的 Claude Science 式科研工作台：ReAct 研究循环引擎（research_* 工具）、带溯源的版本化工件（artifact_* 工具）与面向基因组/病原体/生物信息的 10 个科研技能。",
			"en": "Claude Science-style research workbench: ReAct research-loop engine (research_* tools), versioned artifacts with provenance (artifact_* tools), and 10 science skills for genomics/pathogens/bioinformatics."
		},
		"owner": "biociao",
		"category": "workflow",
		"added": "2026-08-14",
		"url": "https://github.com/biociao/dsh-science",
		"name": "dsh-science",
		"install": "dsh plugin --profile web add github:biociao/dsh-science"
	},
	{
		"description": {
			"zh": "独立只读验收层：顶层 turn 收尾前 spawn 只读 verifier，未通过时把缺口注回主 agent。",
			"en": "Independent read-only acceptance layer: spawns a read-only verifier before each top-level turn closes and steers non-pass gaps back into the agent."
		},
		"owner": "EvilIrving",
		"category": "workflow",
		"added": "2026-08-14",
		"url": "https://github.com/EvilIrving/dsh-proof",
		"name": "dsh-proof",
		"install": "dsh plugin --profile web add github:EvilIrving/dsh-proof"
	},
	{
		"description": {
			"zh": "工程纪律守门：动笔前审讯需求，红绿测试证据门，交付后对抗评审（grill-requirements 技能 + 工具策略门）。",
			"en": "Engineering-discipline guard: grill the requirements before the first edit, enforce red/green test evidence gates, and audit the delivery with a forked adversary (grill-requirements skill + tool-policy gates)."
		},
		"owner": "PerryLink",
		"category": "workflow",
		"added": "2026-08-14",
		"url": "https://github.com/PerryLink/dsh-doublecheck",
		"name": "dsh-doublecheck",
		"install": "dsh plugin --profile web add github:PerryLink/dsh-doublecheck"
	},
	{
		"description": {
			"zh": "技能驱动的 harness/loop 工程化工作流插件。",
			"en": "Skill-driven harness/loop engineering workflow agent plugin."
		},
		"owner": "btspoony",
		"category": "workflow",
		"added": "2026-08-14",
		"url": "https://github.com/btspoony/mstar-harness",
		"name": "mstar-harness",
		"install": "dsh plugin --profile web add github:btspoony/mstar-harness"
	},
	{
		"description": {
			"zh": "从 Web GUI 一键在 VS Code 中打开工作区目录。",
			"en": "Open DSH workspace directories in VS Code directly from the web GUI."
		},
		"owner": "omdsh-dev",
		"category": "notify",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-open-in-vscode",
		"name": "dsh-open-in-vscode",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-open-in-vscode"
	},
	{
		"description": {
			"zh": "回合完成桌面通知，按结果分控 + 关键词过滤。",
			"en": "Desktop notifications for turn completions, with per-outcome controls and keyword rules."
		},
		"owner": "omdsh-dev",
		"category": "notify",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-notification",
		"name": "dsh-notification",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-notification"
	},
	{
		"description": {
			"zh": "BitFun 与 DSH 的 ACP 交互对接。",
			"en": "ACP bridge between BitFun and DSH."
		},
		"owner": "bobleer",
		"category": "notify",
		"added": "2026-08-13",
		"url": "https://github.com/bobleer/dsh-acp-for-bitfun",
		"name": "dsh-acp-for-bitfun",
		"install": "dsh plugin --profile web add github:bobleer/dsh-acp-for-bitfun"
	},
	{
		"description": {
			"zh": "ACP profile 插件与独立 stdio server，可从 Zed 等 ACP 客户端使用完整 DSH agent，并共享 DSH 凭据与会话。",
			"en": "ACP profile plugin and standalone stdio server for using the full DSH agent from Zed and other ACP clients while sharing DSH credentials and sessions."
		},
		"owner": "openma-ai",
		"category": "notify",
		"added": "2026-08-14",
		"url": "https://github.com/openma-ai/deepseek-harness-acp",
		"name": "deepseek-harness-acp",
		"install": "dsh plugin --profile web add github:openma-ai/deepseek-harness-acp"
	},
	{
		"description": {
			"zh": "Telegram Bot API 桥接：长轮询、per-chat 会话、HTML 格式化。",
			"en": "Bridge to the Telegram Bot API: long polling, per-chat sessions, HTML formatting."
		},
		"owner": "LoserFox",
		"category": "notify",
		"added": "2026-08-13",
		"url": "https://github.com/LoserFox/telegram",
		"name": "telegram",
		"install": "dsh plugin --profile web add github:LoserFox/telegram"
	},
	{
		"description": {
			"zh": "通过 iLink 网关在微信里与 DSH agent 聊天、监控与审批：双向文本、会话切换、进度摘要与编号审批提示。",
			"en": "Chat with, monitor, and approve your DSH agents from WeChat via the iLink gateway: text both ways, session targeting, digest heartbeats, and numbered approval prompts."
		},
		"owner": "Jesse-njx",
		"category": "notify",
		"added": "2026-08-14",
		"url": "https://github.com/Jesse-njx/dsh-chatnode-wechat",
		"name": "dsh-chatnode-wechat",
		"install": "dsh plugin --profile web add github:Jesse-njx/dsh-chatnode-wechat"
	},
	{
		"description": {
			"zh": "会话完成等四种状态的通知响应，支持浏览器提示。",
			"en": "Notifications for four session states, with browser alerts and prompts."
		},
		"owner": "dingyi222666",
		"category": "notify",
		"added": "2026-08-13",
		"url": "https://github.com/dingyi222666/dsh-session-notification",
		"name": "dsh-session-notification",
		"install": "dsh plugin --profile web add github:dingyi222666/dsh-session-notification"
	},
	{
		"description": {
			"zh": "桌面通知提醒。",
			"en": "Desktop notification reminders."
		},
		"owner": "bill9109",
		"category": "notify",
		"added": "2026-08-13",
		"url": "https://github.com/bill9109/dsh-web-ui-notify",
		"name": "dsh-web-ui-notify",
		"install": "dsh plugin --profile web add github:bill9109/dsh-web-ui-notify"
	},
	{
		"description": {
			"zh": "DSH 结合 Kimi WebBridge。",
			"en": "DSH meets Kimi WebBridge."
		},
		"owner": "bill9109",
		"category": "notify",
		"added": "2026-08-13",
		"url": "https://github.com/bill9109/dsh-webbridge",
		"name": "dsh-webbridge",
		"install": "dsh plugin --profile web add github:bill9109/dsh-webbridge"
	},
	{
		"description": {
			"zh": "微信（iLink）双向桥：turn 完成/批准请求推送、聊天内批准与消息注入、持久去重与长回复收敛分段；通道层为多 IM 预留。",
			"en": "Two-way WeChat (iLink) bridge: turn-end and approval-request push, in-chat approve/reject and message injection, persistent dedup and convergent long-reply chunking; channel layer extensible to other IMs."
		},
		"owner": "BiBoyang",
		"category": "notify",
		"added": "2026-08-14",
		"url": "https://github.com/BiBoyang/dsh-im-bridge",
		"name": "dsh-im-bridge",
		"install": "dsh plugin --profile web add github:BiBoyang/dsh-im-bridge"
	},
	{
		"description": {
			"zh": "基于角色的模型重试与备用策略。",
			"en": "Role-based LLM retry & fallback strategies."
		},
		"owner": "btspoony",
		"category": "model",
		"added": "2026-08-13",
		"url": "https://github.com/btspoony/dsh-llm-fallbacks",
		"name": "dsh-llm-fallbacks",
		"install": "dsh plugin --profile web add github:btspoony/dsh-llm-fallbacks"
	},
	{
		"description": {
			"zh": "通过 ChatGPT OAuth 将 OpenAI Codex 模型接入 DeepSeek Harness，并提供可选的搜索与图片工具。",
			"en": "Connect ChatGPT OAuth and OpenAI Codex models to DeepSeek Harness, with opt-in search and image tools."
		},
		"owner": "franksong2702",
		"category": "model",
		"added": "2026-08-14",
		"url": "https://github.com/franksong2702/dsh-codex-connect",
		"name": "dsh-codex-connect",
		"install": "dsh plugin --profile web add github:franksong2702/dsh-codex-connect"
	},
	{
		"description": {
			"zh": "把本机 Codex / Grok / Claude / OpenCode / CC Switch 登录态导入 DSH，在设置里自选来源并启用模型。",
			"en": "Import local Codex, Grok, Claude, OpenCode, and CC Switch logins into DSH; pick sources and enable models in Settings."
		},
		"owner": "kam74515-boop",
		"category": "model",
		"added": "2026-08-14",
		"url": "https://github.com/kam74515-boop/dsh-everything-oauth",
		"name": "dsh-everything-oauth",
		"install": "dsh plugin --profile web add github:kam74515-boop/dsh-everything-oauth"
	},
	{
		"description": {
			"zh": "Qwen 多模态插件支持。",
			"en": "Qwen multi-modal plugin support."
		},
		"owner": "omdsh-dev",
		"category": "model",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/Qwen-MM-Plugins",
		"name": "Qwen-MM-Plugins",
		"install": "dsh plugin --profile web add github:omdsh-dev/Qwen-MM-Plugins"
	},
	{
		"description": {
			"zh": "复用 Codex CLI 的 ChatGPT 登录态注册 `openai-codex` LLM 路由，并在 DSH Web 设置中提供 GPT Auth 控件。",
			"en": "Reuses the Codex CLI ChatGPT login as an `openai-codex` LLM route and adds GPT Auth controls to DSH Web settings."
		},
		"owner": "suntianc",
		"category": "model",
		"added": "2026-08-14",
		"url": "https://github.com/suntianc/dsh-codex-auth",
		"name": "dsh-codex-auth",
		"install": "dsh plugin --profile web add github:suntianc/dsh-codex-auth"
	},
	{
		"description": {
			"zh": "类似 MC Fabric 的 hook 处理器。",
			"en": "An MC-Fabric-style hook processor."
		},
		"owner": "omdsh-dev",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/fabric",
		"name": "fabric",
		"install": "dsh plugin --profile web add github:omdsh-dev/fabric"
	},
	{
		"description": {
			"zh": "git 提交固定使用环境自身作者身份，环境变量注入压过一切 `git config` 设置。",
			"en": "Pin Git commits to the environment's own author identity; env-var injection overrides all `git config` settings."
		},
		"owner": "LoserFox",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/LoserFox/dsh-git-identity",
		"name": "dsh-git-identity",
		"install": "dsh plugin --profile web add github:LoserFox/dsh-git-identity"
	},
	{
		"description": {
			"zh": "上下文注入审计：统计指令链/技能目录/工具 schema 的 token 成本，检测重复与冲突。",
			"en": "Context injection audit: token costs of instruction chains / skill catalogs / tool schemas, duplicate and conflict detection."
		},
		"owner": "Zhenyu98",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/Zhenyu98/dsh-context-doctor",
		"name": "dsh-context-doctor",
		"install": "dsh plugin --profile web add github:Zhenyu98/dsh-context-doctor"
	},
	{
		"description": {
			"zh": "强制痛点检查：同一问题连续 2 个实验未收敛后注入三问、拦截非调查类工具调用直到答出、阻止同方向重试。",
			"en": "Enforced pain-point gate: after two non-converged experiments it injects the three questions, denies non-investigative tool calls until answered, and blocks same-direction retries."
		},
		"owner": "ICCuse",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/ICCuse/dsh-pain-point-check",
		"name": "dsh-pain-point-check",
		"install": "dsh plugin --profile web add github:ICCuse/dsh-pain-point-check"
	},
	{
		"description": {
			"zh": "插件健康检查：扫描清单协议/patch 格式/构建陷阱，零依赖只读。",
			"en": "Plugin health checks: manifest protocol / patch format / build traps, zero-dependency and read-only."
		},
		"owner": "omdsh-dev",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-plugin-check",
		"name": "dsh-plugin-check",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-plugin-check"
	},
	{
		"description": {
			"zh": "本机安全审计：配置/插件来源/会话/网络暴露面，只读脱敏风险报告。",
			"en": "Local security audit: config, plugin origins, sessions, network exposure — read-only redacted risk report."
		},
		"owner": "omdsh-dev",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-security-audit",
		"name": "dsh-security-audit",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-security-audit"
	},
	{
		"description": {
			"zh": "会话文件帧级扫描诊断（torn/损坏/空会话检测）。",
			"en": "Frame-level scan diagnostics for session files (torn/corrupt/empty detection)."
		},
		"owner": "omdsh-dev",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-session-health",
		"name": "dsh-session-health",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-session-health"
	},
	{
		"description": {
			"zh": "自进化：agent 在会话内给自己热挂载/卸载持久化插件。",
			"en": "Self-evolution: the agent hot-mounts/removes persistent plugins on itself mid-session."
		},
		"owner": "william-jin-cmu",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/william-jin-cmu/dsh-evolve",
		"name": "dsh-evolve",
		"install": "dsh plugin --profile web add github:william-jin-cmu/dsh-evolve"
	},
	{
		"description": {
			"zh": "遥测后端：把 turns、model steps、tool calls 导出到 yiTrace。",
			"en": "Telemetry backend exporting turns, model steps, and tool calls to yiTrace."
		},
		"owner": "vibeinging",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/vibeinging/dsh-trace",
		"name": "dsh-trace",
		"install": "dsh plugin --profile web add github:vibeinging/dsh-trace"
	},
	{
		"description": {
			"zh": "microsandbox 沙箱支持。",
			"en": "Support for the microsandbox backend."
		},
		"owner": "omdsh-dev",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/sandbox-micro",
		"name": "sandbox-micro",
		"install": "dsh plugin --profile web add github:omdsh-dev/sandbox-micro"
	},
	{
		"description": {
			"zh": "微软跨平台沙盒支持。",
			"en": "Microsoft cross-platform sandbox support."
		},
		"owner": "omdsh-dev",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/sandbox-mxc",
		"name": "sandbox-mxc",
		"install": "dsh plugin --profile web add github:omdsh-dev/sandbox-mxc"
	},
	{
		"description": {
			"zh": "nono 沙盒支持。",
			"en": "Support for the nono sandbox backend."
		},
		"owner": "omdsh-dev",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/sandbox-nono",
		"name": "sandbox-nono",
		"install": "dsh plugin --profile web add github:omdsh-dev/sandbox-nono"
	},
	{
		"description": {
			"zh": "agent 树 token 预算管理。",
			"en": "Agent-tree token budget management."
		},
		"owner": "vibeinging",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/vibeinging/dsh-agent-budget",
		"name": "dsh-agent-budget",
		"install": "dsh plugin --profile web add github:vibeinging/dsh-agent-budget"
	},
	{
		"description": {
			"zh": "DSH 的模型切换器：指向任意 OpenAI 兼容端点，内置精选免费/低价 DeepSeek 服务商预设，免费额度限流时自动回退。",
			"en": "The model switch for DSH: point it at any OpenAI-compatible endpoint, with curated free/cheap DeepSeek provider presets and automatic fallback when a free tier rate-limits you."
		},
		"owner": "Jesse-njx",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/Jesse-njx/dsh-polyglot",
		"name": "dsh-polyglot",
		"install": "dsh plugin --profile web add github:Jesse-njx/dsh-polyglot"
	},
	{
		"description": {
			"zh": "手动审批模式（Manual/Ask Mode）。",
			"en": "Manual approval mode (\"Manual Mode\" / \"Ask Mode\")."
		},
		"owner": "ilharp",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/ilharp/dsh-tool-approval",
		"name": "dsh-tool-approval",
		"install": "dsh plugin --profile web add github:ilharp/dsh-tool-approval"
	},
	{
		"description": {
			"zh": "DSH「允许本次任务」临时授权：仅在当前任务内自动放行同类 `danger-full-access` 请求，任务结束自动失效。",
			"en": "Turn-scoped “Allow for this task” approvals: automatically allow matching `danger-full-access` escalations only for the current task, then expire."
		},
		"owner": "arrow949",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/arrow949/dsh-turn-approval",
		"name": "dsh-turn-approval",
		"install": "dsh plugin --profile web add github:arrow949/dsh-turn-approval"
	},
	{
		"description": {
			"zh": "插件模板仓库（基于 turtle-ui 官方仓库）。",
			"en": "Plugin template repo (based on the official turtle-ui repo)."
		},
		"owner": "omdsh-dev",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/plugin-template",
		"name": "plugin-template",
		"install": "dsh plugin --profile web add github:omdsh-dev/plugin-template"
	},
	{
		"description": {
			"zh": "TPS 指标插件。",
			"en": "A TPS metrics plugin."
		},
		"owner": "Small-tailqwq",
		"category": "dev",
		"added": "2026-08-13",
		"url": "https://github.com/Small-tailqwq/dsh-tps",
		"name": "dsh-tps",
		"install": "dsh plugin --profile web add github:Small-tailqwq/dsh-tps"
	},
	{
		"description": {
			"zh": "全模式调用工具失败自动实录：把原生工具 / PTC run_code / 代码内嵌工具调用的失败错因去重计数后写入 skill，越用越少错。",
			"en": "Auto-log failed tool calls across native tools, PTC run_code, and inline invocations: dedup and count root causes into a skill so repeated mistakes fade."
		},
		"owner": "Areium",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/Areium/dsh-fail-logger",
		"name": "dsh-fail-logger",
		"install": "dsh plugin --profile web add github:Areium/dsh-fail-logger"
	},
	{
		"description": {
			"zh": "DSH 插件评测框架：YAML 用例驱动真实 headless agent，断言工具调用/参数/返回与 token 用量，baseline 门禁做 CI 回归。",
			"en": "Evaluation harness for DSH plugins: YAML cases drive real headless agent runs, assert on tool calls, args, results and token usage, with a baseline gate for CI regression."
		},
		"owner": "BiBoyang",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/BiBoyang/dsh-eval-harness",
		"name": "dsh-eval-harness",
		"install": "dsh plugin --profile web add github:BiBoyang/dsh-eval-harness"
	},
	{
		"description": {
			"zh": "社区发行版：TUI、桌面端与 Web UI 统一体验，分层安装、一步到位。",
			"en": "Community distribution: TUI, desktop, and Web UI as one bundle with layered installation."
		},
		"owner": "hust-open-atom-club",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/hust-open-atom-club/oh-dsh",
		"name": "oh-dsh",
		"install": "dsh plugin --profile web add github:hust-open-atom-club/oh-dsh"
	},
	{
		"description": {
			"zh": "面向 Vibe Coding 的浏览器元素标注插件：直接选取页面元素，并将结构化视觉反馈发送给 DeepSeek Harness Agent。",
			"en": "Select browser elements directly during Vibe Coding and send structured visual feedback to the DeepSeek Harness Agent."
		},
		"owner": "BrambleXu",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/BrambleXu/dsh-annotate",
		"name": "dsh-annotate",
		"install": "dsh plugin --profile web add github:BrambleXu/dsh-annotate"
	},
	{
		"description": {
			"zh": "DeepSeek Harness 可复用 Markdown Prompt Profile，支持单轮模型选择、参数替换和状态恢复。",
			"en": "Reusable Markdown prompt profiles for DeepSeek Harness with per-turn model selection, argument substitution, and state restoration."
		},
		"owner": "BrambleXu",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/BrambleXu/dsh-prompt-profile",
		"name": "dsh-prompt-profile",
		"install": "dsh plugin --profile web add github:BrambleXu/dsh-prompt-profile"
	},
	{
		"description": {
			"zh": "DeepSeek Harness 原生交互式 Git diff 审查，支持结构化批注并回传当前 Agent 会话。",
			"en": "Native interactive Git diff review for DeepSeek Harness with structured annotations sent back to the current Agent session."
		},
		"owner": "BrambleXu",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/BrambleXu/dsh-revdiff",
		"name": "dsh-revdiff",
		"install": "dsh plugin --profile web add github:BrambleXu/dsh-revdiff"
	},
	{
		"description": {
			"zh": "增加需要审批的 Git 状态、diff、日志、提交、分支和可选检查点工具。",
			"en": "Adds approval-gated Git status, diff, log, commit, branch, and optional checkpoint tools."
		},
		"owner": "lonelymoon87",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/lonelymoon87/dsh-gitflow",
		"name": "dsh-gitflow",
		"install": "dsh plugin --profile web add github:lonelymoon87/dsh-gitflow"
	},
	{
		"description": {
			"zh": "增加危险操作策略检查、输出脱敏和安全审查工作流。",
			"en": "Adds dangerous-operation policy checks, output redaction, and a security-review workflow."
		},
		"owner": "lonelymoon87",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/lonelymoon87/dsh-guardian",
		"name": "dsh-guardian",
		"install": "dsh plugin --profile web add github:lonelymoon87/dsh-guardian"
	},
	{
		"description": {
			"zh": "`dsh pm` 插件管理器：多源搜索（awesome 列表 + GitHub + npm）、按 profile 安装/移除/更新，以及 doctor 审计（清单、bundle patch、版本漂移）。",
			"en": "The `dsh pm` plugin manager: multi-source search (awesome list + GitHub + npm), install/remove/update per profile, and a doctor audit of manifests, bundle patches, and version drift."
		},
		"owner": "Jesse-njx",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/Jesse-njx/dsh-plugin-manager",
		"name": "dsh-plugin-manager",
		"install": "dsh plugin --profile web add github:Jesse-njx/dsh-plugin-manager"
	},
	{
		"description": {
			"zh": "掌控你的 tmux 面板：list/send-keys/capture、在面板中运行长任务并 watch，破坏性命令需审批。",
			"en": "Take control of your tmux panes: list/send-keys/capture, run long jobs in a pane with watch mode, and approval-gated destructive commands."
		},
		"owner": "Jesse-njx",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/Jesse-njx/dsh-tmuxctl",
		"name": "dsh-tmuxctl",
		"install": "dsh plugin --profile web add github:Jesse-njx/dsh-tmuxctl"
	},
	{
		"description": {
			"zh": "设置页中的 DSH 自助更新器：一键检查/拉取（git pull --ff-only）、自动后台检查、版本对比与更新说明预览，带红点提醒。",
			"en": "DSH self-updater in the settings page: one-click check/pull (`git pull --ff-only`), auto background checks, version diff and changelog preview with a red-dot reminder."
		},
		"owner": "xingyingyuzhui",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/xingyingyuzhui/dsh-updater-ui",
		"name": "dsh-updater-ui",
		"install": "dsh plugin --profile web add github:xingyingyuzhui/dsh-updater-ui"
	},
	{
		"description": {
			"zh": "/repro 导出最小可复现问题包：去 secret 的会话日志、失败命令与 git diff。",
			"en": "/repro exports a minimal, secret-scrubbed, replayable problem bundle: the session log, failed commands, and Git diff."
		},
		"owner": "EvilIrving",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/EvilIrving/dsh-repro",
		"name": "dsh-repro",
		"install": "dsh plugin --profile web add github:EvilIrving/dsh-repro"
	},
	{
		"description": {
			"zh": "官方 MCP 客户端（dsh-mcp-client）的只读运行时管理面板：/mcp 命令与设置页 MCP 页签展示连接状态、已注册工具、错误与重连计数，脱敏展示并提供启停 patch 建议。",
			"en": "Read-only runtime management panel for the official DSH MCP client: connection status, registered tools, errors, and reconnect counts through the /mcp command and a Settings tab, with sanitized display and enable/disable patch suggestions."
		},
		"owner": "PerryLink",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/PerryLink/dsh-mcp-panel",
		"name": "dsh-mcp-panel",
		"install": "dsh plugin --profile web add github:PerryLink/dsh-mcp-panel"
	},
	{
		"description": {
			"zh": "同一任务并行试跑多个技能，对比结果选出最优。",
			"en": "Compare multiple skills on the same task and pick the winner."
		},
		"owner": "Jayden-X-L",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/Jayden-X-L/forkprobe",
		"name": "forkprobe",
		"install": "dsh plugin --profile web add github:Jayden-X-L/forkprobe"
	},
	{
		"description": {
			"zh": "插件生态基建：浏览器面板管理官方 repository 插件（0 patch）+ make-dsh-plugin 插件开发引导技能。",
			"en": "Ecosystem infrastructure: a thin browser console for managing official repository plugins (zero patches) plus a make-dsh-plugin skill for guided plugin development."
		},
		"owner": "vlln",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/vlln/plugin-registry",
		"name": "plugin-registry",
		"install": "dsh plugin --profile web add github:vlln/plugin-registry"
	},
	{
		"description": {
			"zh": "让 dsh 运行时跑在 Multica 上。",
			"en": "Run the dsh runtime on Multica."
		},
		"owner": "forrestchang",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/forrestchang/dsh-multica-runtime",
		"name": "dsh-multica-runtime",
		"install": "dsh plugin --profile web add github:forrestchang/dsh-multica-runtime"
	},
	{
		"description": {
			"zh": "帮你发现项目中可能存在的用户体验问题：自动走查 React/TypeScript 源码，定位问题并给出具体优化建议。",
			"en": "Finds potential UX issues in your project: automatically reviews React/TypeScript code, pinpoints each problem, and gives concrete suggestions."
		},
		"owner": "DietCokewithSugar",
		"category": "dev",
		"added": "2026-08-14",
		"url": "https://github.com/DietCokewithSugar/dsh-user-experience",
		"name": "dsh-user-experience",
		"install": "dsh plugin --profile web add github:DietCokewithSugar/dsh-user-experience"
	},
	{
		"description": {
			"zh": "2005 年中文站点风格的整活广告插件：侧栏广告/信息流/角落弹窗 + 假关闭叉，素材全虚构。",
			"en": "Parody ads in 2005-Chinese-web style: sidebar banners, in-chat feeds, corner popups, and a close button whose hit area is smaller than it looks. All fictional."
		},
		"owner": "Nagi-ovo",
		"category": "fun",
		"added": "2026-08-13",
		"url": "https://github.com/Nagi-ovo/dsh-ads",
		"name": "dsh-ads",
		"install": "dsh plugin --profile web add github:Nagi-ovo/dsh-ads"
	},
	{
		"description": {
			"zh": "与 AI 下五子棋，也可让 AI 对局比棋力。",
			"en": "Play Gomoku against the AI, or let two AIs battle it out."
		},
		"owner": "omdsh-dev",
		"category": "fun",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-gomoku",
		"name": "dsh-gomoku",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-gomoku"
	},
	{
		"description": {
			"zh": "有效解决了写代码的时候账户不能同时亏钱的 BUG。",
			"en": "Fixes the bug where your account can't lose money while you code."
		},
		"owner": "AnacondaKC",
		"category": "fun",
		"added": "2026-08-13",
		"url": "https://github.com/AnacondaKC/dsh-stock-market",
		"name": "dsh-stock-market",
		"install": "dsh plugin --profile web add github:AnacondaKC/dsh-stock-market"
	},
	{
		"description": {
			"zh": "为 AI 回复自动添加表情。",
			"en": "Automatically add emojis to AI replies."
		},
		"owner": "hellodigua",
		"category": "fun",
		"added": "2026-08-13",
		"url": "https://github.com/hellodigua/dsh-emoji",
		"name": "dsh-emoji",
		"install": "dsh plugin --profile web add github:hellodigua/dsh-emoji"
	},
	{
		"description": {
			"zh": "右侧小游戏面板：18 款离线小游戏，等模型回复时的摸鱼神器。",
			"en": "Side-panel arcade: 18 offline mini-games to play while the model thinks."
		},
		"owner": "lhh010",
		"category": "fun",
		"added": "2026-08-13",
		"url": "https://github.com/lhh010/dsh-minigames",
		"name": "dsh-minigames",
		"install": "dsh plugin --profile web add github:lhh010/dsh-minigames"
	},
	{
		"description": {
			"zh": "用户与 agent 双向表情贴纸互动。",
			"en": "Bidirectional sticker reactions between user and agent."
		},
		"owner": "william-jin-cmu",
		"category": "fun",
		"added": "2026-08-13",
		"url": "https://github.com/william-jin-cmu/dsh-stickers",
		"name": "dsh-stickers",
		"install": "dsh plugin --profile web add github:william-jin-cmu/dsh-stickers"
	},
	{
		"description": {
			"zh": "桌面宠物（QQ 宠物形态）：右下角悬浮、可拖拽/投喂/玩耍。",
			"en": "Desktop pet (QQ-pet style): floats in the corner, draggable, feedable, playable."
		},
		"owner": "vlln",
		"category": "fun",
		"added": "2026-08-13",
		"url": "https://github.com/vlln/whale-girl",
		"name": "whale-girl",
		"install": "dsh plugin --profile web add github:vlln/whale-girl"
	},
	{
		"description": {
			"zh": "给每次消息后注入感谢语，做个有礼貌的人。",
			"en": "Append a thank-you note after every message. Mind your manners."
		},
		"owner": "Moeblack",
		"category": "fun",
		"added": "2026-08-13",
		"url": "https://github.com/Moeblack/deepseek-manners",
		"name": "deepseek-manners",
		"install": "dsh plugin --profile web add github:Moeblack/deepseek-manners"
	},
	{
		"description": {
			"zh": "模型生成时弹出小游戏菜单（wordle/消消乐，可扩展）。",
			"en": "Pops up a mini-game menu (wordle, match-3, extensible) while the model generates."
		},
		"owner": "HuanLinOTO",
		"category": "fun",
		"added": "2026-08-13",
		"url": "https://github.com/HuanLinOTO/dsh-plugin-d399",
		"name": "dsh-plugin-d399",
		"install": "dsh plugin --profile web add github:HuanLinOTO/dsh-plugin-d399"
	},
	{
		"description": {
			"zh": "自走棋：人机对战或双 AI 对弈。",
			"en": "Auto chess: human vs AI, or AI vs AI."
		},
		"owner": "omdsh-dev",
		"category": "fun",
		"added": "2026-08-13",
		"url": "https://github.com/omdsh-dev/dsh-auto-chess",
		"name": "dsh-auto-chess",
		"install": "dsh plugin --profile web add github:omdsh-dev/dsh-auto-chess"
	},
	{
		"description": {
			"zh": "侧栏短视频：原生播放器、系列导航、精确历史回放。",
			"en": "Short-video sidebar: native player, series navigation, precise history replay."
		},
		"owner": "AnacondaKC",
		"category": "fun",
		"added": "2026-08-13",
		"url": "https://github.com/AnacondaKC/dsh-douyin",
		"name": "dsh-douyin",
		"install": "dsh plugin --profile web add github:AnacondaKC/dsh-douyin"
	}
];
//#endregion
//#region src/client/MarketplaceTab.module.css
var MarketplaceTab_module_default = {
	"card": "KwMa_G_card",
	"cardFooter": "KwMa_G_cardFooter",
	"cardHeader": "KwMa_G_cardHeader",
	"cards": "KwMa_G_cards",
	"categories": "KwMa_G_categories",
	"categoryTag": "KwMa_G_categoryTag",
	"count": "KwMa_G_count",
	"description": "KwMa_G_description",
	"dot": "KwMa_G_dot",
	"empty": "KwMa_G_empty",
	"installButton": "KwMa_G_installButton",
	"intro": "KwMa_G_intro",
	"meta": "KwMa_G_meta",
	"pluginName": "KwMa_G_pluginName",
	"search": "KwMa_G_search",
	"section": "KwMa_G_section",
	"title": "KwMa_G_title",
	"visuallyHidden": "KwMa_G_visuallyHidden"
};
//#endregion
//#region src/client/MarketplaceTab.tsx
const plugins = plugins$1;
function categoryMeta(key) {
	return CATEGORIES.find((c) => c.key === key) ?? {
		key,
		emoji: "📦",
		label: {
			en: key,
			zh: key
		}
	};
}
function categoryLabel(cat, locale) {
	const label = cat.label;
	return `${cat.emoji} ${label[locale] ?? label.en}`;
}
function shortDate(iso) {
	return iso;
}
function detectLocale() {
	if (typeof navigator === "undefined") return "en";
	return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}
/**
* Render the community plugin marketplace tab.
* Lists all plugins from awesome-dsh-plugin with category filter, search,
* and copy-to-clipboard install buttons.
*/
function MarketplaceTab({ t }) {
	const [query, setQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState(null);
	const [copiedId, setCopiedId] = useState(null);
	const locale = detectLocale();
	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return plugins.filter((p) => {
			if (activeCategory !== null && p.category !== activeCategory) return false;
			if (q.length === 0) return true;
			return p.name.toLowerCase().includes(q) || p.description.zh.includes(q) || p.description.en.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q);
		});
	}, [query, activeCategory]);
	const handleCopy = useCallback(async (plugin) => {
		if (await writeClipboard(plugin.install)) {
			setCopiedId(plugin.name);
			window.setTimeout(() => {
				setCopiedId(null);
			}, 1500);
		}
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: MarketplaceTab_module_default.section,
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: MarketplaceTab_module_default.title,
				children: t("title")
			}),
			/* @__PURE__ */ jsx("p", {
				className: MarketplaceTab_module_default.intro,
				children: t("intro")
			}),
			/* @__PURE__ */ jsxs("div", {
				className: MarketplaceTab_module_default.categories,
				role: "group",
				"aria-label": t("allCategories"),
				children: [/* @__PURE__ */ jsx(Pill, {
					active: activeCategory === null,
					onClick: () => {
						setActiveCategory(null);
					},
					children: t("allCategories")
				}), CATEGORIES.map((cat) => /* @__PURE__ */ jsx(Pill, {
					active: activeCategory === cat.key,
					onClick: () => {
						setActiveCategory(cat.key);
					},
					children: categoryLabel(cat, locale)
				}, cat.key))]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: MarketplaceTab_module_default.search,
				children: [
					/* @__PURE__ */ jsx(IconSearchOutline16, { "aria-hidden": "true" }),
					/* @__PURE__ */ jsx("span", {
						className: MarketplaceTab_module_default.visuallyHidden,
						children: t("search")
					}),
					/* @__PURE__ */ jsx("input", {
						type: "search",
						value: query,
						placeholder: t("search"),
						"aria-label": t("search"),
						onChange: (event) => {
							setQuery(event.currentTarget.value);
						}
					})
				]
			}),
			/* @__PURE__ */ jsx("p", {
				className: MarketplaceTab_module_default.count,
				children: t("count").replace("{count}", String(filtered.length))
			}),
			filtered.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: MarketplaceTab_module_default.empty,
				children: t("noResults")
			}) : /* @__PURE__ */ jsx("ul", {
				className: MarketplaceTab_module_default.cards,
				children: filtered.map((plugin) => {
					const cat = categoryMeta(plugin.category);
					const isCopied = copiedId === plugin.name;
					return /* @__PURE__ */ jsxs("li", {
						className: MarketplaceTab_module_default.card,
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: MarketplaceTab_module_default.cardHeader,
								children: [/* @__PURE__ */ jsx("a", {
									href: plugin.url,
									target: "_blank",
									rel: "noopener noreferrer",
									className: MarketplaceTab_module_default.pluginName,
									children: plugin.name
								}), /* @__PURE__ */ jsx("span", {
									className: MarketplaceTab_module_default.categoryTag,
									children: categoryLabel(cat, locale)
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: MarketplaceTab_module_default.description,
								children: locale === "zh" ? plugin.description.zh : plugin.description.en
							}),
							/* @__PURE__ */ jsxs("div", {
								className: MarketplaceTab_module_default.cardFooter,
								children: [/* @__PURE__ */ jsxs("span", {
									className: MarketplaceTab_module_default.meta,
									children: [
										/* @__PURE__ */ jsx("span", { children: t("byOwner").replace("{owner}", plugin.owner) }),
										/* @__PURE__ */ jsx("span", {
											className: MarketplaceTab_module_default.dot,
											children: "·"
										}),
										/* @__PURE__ */ jsx("span", { children: t("addedDate").replace("{date}", shortDate(plugin.added)) })
									]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: MarketplaceTab_module_default.installButton,
									"data-copied": isCopied ? "true" : void 0,
									onClick: () => {
										handleCopy(plugin);
									},
									children: isCopied ? t("copied") : t("install")
								})]
							})
						]
					}, plugin.name);
				})
			})
		]
	});
}
//#endregion
//#region src/client/locales.ts
/** Chinese strings. */
const zh = {
	tab: "社区插件",
	title: "社区插件市场",
	intro: "浏览 awesome-dsh-plugin.com 收录的社区插件。点击安装按钮复制命令到终端执行。",
	search: "搜索插件...",
	allCategories: "全部",
	count: "{count} 个插件",
	install: "安装",
	copied: "已复制!",
	copyFailed: "复制失败",
	byOwner: "作者：{owner}",
	addedDate: "收录于 {date}",
	noResults: "没有匹配的插件",
	loading: "加载中...",
	error: "加载失败",
	retry: "重试"
};
const en = {
	tab: "Community Plugins",
	title: "Community Plugin Marketplace",
	intro: "Browse community plugins from awesome-dsh-plugin.com. Click install to copy the command to your terminal.",
	search: "Search plugins...",
	allCategories: "All",
	count: "{count} plugins",
	install: "Install",
	copied: "Copied!",
	copyFailed: "Copy failed",
	byOwner: "by {owner}",
	addedDate: "Added {date}",
	noResults: "No matching plugins",
	loading: "Loading...",
	error: "Failed to load",
	retry: "Retry"
};
//#endregion
//#region src/client/index.ts
const NS = "marketplace";
const inject = ["slots", "locale"];
function apply(ctx) {
	ctx.effect(() => ctx.locale.register(NS, {
		zh,
		en
	}), "dsh-plugin-marketplace: dictionaries");
	ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
		name: "settings.plugins.tab",
		id: "marketplace",
		order: 20,
		label: () => ctx.locale.bind(NS)("tab"),
		locale: NS
	}, MarketplaceTab));
}
//#endregion
export { apply, inject };

//# sourceMappingURL=client.js.map