# 草薙宁宁主题 · Nene Theme（DeepSeek Harness 客户端插件）

把 [DeepSeek Harness](https://github.com/deepseek-ai)（DSH）的 Web 界面改成「草薙宁宁」同人美化主题。

> ⚠️ **本主题只用于个人对于 DSH 的相关测试**

> ⚠️ **版权声明（请务必阅读）**
> 本项目为**同人性质的个人界面美化主题**，仅供个人学习与界面美化使用，不涉及任何商业盈利或商业用途。
> 草薙宁宁以及《世界计划》（Project Sekai）相关角色、图像、名称等内容，其著作权均归 **Project Sekai & SEGA 及原权利人** 所有；本主题中的台词为**粉丝向二次创作**，并非官方台词。
> 如权利方认为本主题存在不当使用，请随时联系我们，我们将在**第一时间删除**相关内容。

---

## 功能特性

- **日夜切换背景**：白天默认 `2.webp`、夜间默认 `3.webp`，自动跟随本地时间（6:00–18:00 白天），也可手动切换。
- **背景填充显示**，模糊程度可调（0–40px，默认 0px）。
- **左侧侧边栏淡绿**（宁宁主题色），与对话区**统一不透明度**（0–100%，默认 70%），可在设置中实时调整。
- **右侧可拖动立绘**：默认 `1.webp`，可拖到任意位置，大小 0–300%。
- **状态反应 + 随机台词**：根据 Agent 状态（执行中 / 待机）切换立绘动画与台词气泡；台词**上排日文、下排中文**。
- **设置页**：在「设置 → 宁宁主题」中调整全部选项。

## 目录结构

```
dsh-nene-theme/
├── package.json       # dsh.bundle（profile 层）+ dsh.client（浏览器半）声明
├── cordis.patch.yml   # 插入 { id: nene-theme, name: 'dsh-nene-theme' } 行
├── tsconfig.json
├── src/
│   ├── index.ts       # Node 半（纯客户端包为空 apply）
│   ├── client.tsx     # 浏览器半（主题逻辑）
│   └── assets.d.ts    # 图片 ?inline 导入类型声明
└── assets/
    ├── 1.webp         # 默认立绘
    ├── 2.webp         # 默认白天背景
    └── 3.webp         # 默认夜间背景
```

## 安装

### 方式 A：从 GitHub 安装（无需先发布到 npm）

```bash
# 1. 构建出 lib/（git 安装会走 prepare 脚本，需按提示在 profile 目录的
#    pnpm-workspace.yaml 里 allowBuilds 放行本仓库）
dsh plugin --profile web add github:mizuhara37/dsh-nene-theme

# 2. 若上一步因 allowBuilds 被拦截，先允许构建再重装：
#    在 $DSH_HOME/profiles/web/pnpm-workspace.yaml 中加入
#    allowBuilds: [dsh-nene-theme]
dsh plugin --profile web add github:mizuhara37/dsh-nene-theme
```

### 方式 B：发布到 npm 后安装

```bash
npm run bundle          # 生成 lib/index.js + lib/client.js
npm publish             # 发布（name: dsh-nene-theme）
dsh plugin --profile web add dsh-nene-theme
```

### 方式 C：本地目录安装

```bash
npm install && npm run bundle
dsh plugin --profile web add file:/path/to/dsh-nene-theme
```

安装后重启 `dsh web`（或触发热更新），即可在「设置 → 宁宁主题」中调整。

## 工作原理

`dsh plugin add` 会：用 pnpm 把本包装进 profile 的 `node_modules`，并因本包声明了
`dsh.bundle.patch` 而把它加入 `dsh.profile.bundles` 层；启动时 profile 组合器应用
`cordis.patch.yml`，插入 `{ id: nene-theme, name: 'dsh-nene-theme' }` 行，再由
`clientModules` 扫描本包的 `exports["./client"]`，把浏览器半打包装进 `window.__DSH_BOOT__`。

## 构建说明

- 浏览器半（`src/client.tsx`）经 `tsdown` 打包为 `lib/client.js`（`window.__ModuleLoader__.load` 注册协议）。
- 图片通过 `import x from '../assets/1.webp?inline'` 以 **data URI 内联**进 bundle，因此 bundle 自包含。
  - 若你的打包器不支持 `?inline`，请把三张图转成 base64 字符串直接写进 `src/client.tsx` 的 `DEFAULTS`。
- CSS 注入用 `document.createElement('style')`（`injectCss`）。

## License

代码采用 MIT License；`assets/` 下图片素材版权归原权利人，不在代码授权范围内，仅作同人交流使用，请勿商用。
