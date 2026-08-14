import { ClientContext } from "@deepseek-ai/dsh-client-runtime/client";
import { PropsLocale, PropsRuntime } from "@deepseek-ai/dsh-client-ui-slots";

//#region src/client/locales.d.ts
/** Marketplace tab locale keys. */
type MarketplaceLocaleKey = keyof typeof zh;
/** Chinese strings. */
declare const zh: {
  readonly tab: "社区插件";
  readonly title: "社区插件市场";
  readonly intro: "浏览 awesome-dsh-plugin.com 收录的社区插件。点击安装按钮复制命令到终端执行。";
  readonly search: "搜索插件...";
  readonly allCategories: "全部";
  readonly count: "{count} 个插件";
  readonly install: "安装";
  readonly copied: "已复制!";
  readonly copyFailed: "复制失败";
  readonly byOwner: "作者：{owner}";
  readonly addedDate: "收录于 {date}";
  readonly noResults: "没有匹配的插件";
  readonly loading: "加载中...";
  readonly error: "加载失败";
  readonly retry: "重试";
};
//#endregion
//#region src/client/types.d.ts
/** Full component props assembled by the Settings slot renderer. */
type MarketplaceTabProps = PropsRuntime<'settings.plugins.tab'> & PropsLocale<'marketplace'>;
//#endregion
//#region src/client/index.d.ts
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'marketplace': MarketplaceLocaleKey;
  }
}
declare const inject: string[];
declare function apply(ctx: ClientContext): void;
//#endregion
export { type MarketplaceLocaleKey, type MarketplaceTabProps, apply, inject };
//# sourceMappingURL=client.d.ts.map