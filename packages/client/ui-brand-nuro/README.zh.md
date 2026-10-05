---
description: "侧边栏的 Nuro 品牌占位，除 official 构建外的所有构建均启用；面向替换品牌呈现的用户与维护者。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-brand-nuro

[English](README.md) | 中文

## 概述

本包让非 `official` 的客户端构建在侧边栏显示 Nuro 标志与名称。official 构建配置保留 DeepSeek 自身的呈现，因此在任何构建中两个品牌包只有一个会注册。它用于以自有名称发布的发行版；本包不持有运行时状态，也不影响模型请求。

## 目录

- [使用本包](#use-this-package)
- [理解实现](#understand-the-implementation)
- [进一步探索](#further-exploration)
- [模型体验](#model-experience)
- [已知限制与延期工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用本包

在身份并非 DeepSeek 自身的部署中，把此插件挂载到浏览器 roster，并把 `official` 配置留给确实属于 DeepSeek 的构建。

### 选择 profile

`DSH_CLIENT_BUILD_PROFILE` 决定渲染哪个品牌。除 `official` 之外的任何取值都会注册 Nuro 占位；`official` 则不注册它们，由 `dsh-client-ui-brand-official` 提供 DeepSeek 的标志与名称。两种情况下对话 hero 都保留其自身声明包的兜底，因为本包不占用该 slot。插件在任何配置下都会加载并校验；只有注册受配置门控。

### 替换品牌

身份不同的部署可以不使用本包，改为在同一批侧边栏 slot 上组合自己的包。占用 slot 是唯一的组合途径；此处没有品牌配置面。

-----

<a id="understand-the-implementation"></a>
## 理解实现

<details>
<summary>Implementation internals — click to expand</summary>

两个占位作为一个声明感知的注册集安装：嵌套的 `ctx.slots.inject()` 调用会等待侧边栏声明，因此无论本行在声明者之前还是之后激活都能工作，在声明塌缩时同时撤回两个占位，并在 HMR 期间不留下混杂的品牌。浏览器侧为 [`src/client/index.ts`](src/client/index.ts)；Node 侧是一个空的 Loader 席位。

名称以文本而非图形渲染。随包提供的 wordmark 是 DeepSeek 字形的 SVG，且没有文本替代，因此无法复用于另一个名称，而本包也不自带匹配的字形。浏览器标题属于构建环境范畴（`DSH_CLIENT_TITLE`），位于 slot 系统之外。

</details>

-----

<a id="further-exploration"></a>
## 进一步探索

当品牌呈现面不足以说明问题时，请阅读以下页面。它们从本包占用的 slot 延伸到渲染这些 slot 的外壳。

- [ui-sidebar](../ui-sidebar/README.zh.md) — 声明 `sidebar.brand.mark` 与 `sidebar.brand.name` 并渲染其兜底。
- [ui-brand-official](../ui-brand-official/README.zh.md) — 在 official 构建之外被本包取代的 DeepSeek 占位。
- [Web client architecture](../../../docs/subsystems/web-client.zh.md) — 浏览器插件行如何加载并注册 slot。

-----

<a id="model-experience"></a>
## 模型体验

无：本包只贡献浏览器呈现，任何内容都不会进入模型请求。

#### KV Cache effect

无；本包既不组装也不发送提供方请求。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>


这些限制界定了品牌呈现的提供方式。它们是当前的包约束，而不是品牌设计比较或任务清单。

- **只有一组占位** — 其他呈现方式应由另一个占用相同 slot 的 Cordis 包提供。
- **没有 Nuro 字形** — 名称以文本设置，因为不存在对应图形；提供图形意味着扩展本包。
- **浏览器标题相互独立** — `DSH_CLIENT_TITLE` 在构建时选择标题文本，而不经过 UI slot。
- **客户端 onboarding 文案不在覆盖范围** — onboarding 中的产品名来自 locale 字典，因此在 Nuro 构建中它仍显示 DeepSeek Harness。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
