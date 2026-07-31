---
date created: 2025-10-日 00:45:11
date modified: 2026-07-31
---

# CLAUDE.md

## 项目概述

本仓库干三件事:博客、自用好软件、技术文章。

**核心原则**:
- v2.0 起已彻底扁平化,绝大多数 .md 在 vault 根
- 分类靠 frontmatter(`形态`/`场景`/`published`/`series`),不靠路径
- 配合 `my-blog` Next.js 网站,`published: true` 才发

## 🆕 文档结构(2026-07-31 起)

### vault 根(扁平化主区)
- 教程、工具、博客底稿,直接放根
- 数字前缀已剥掉,命名不强制

### 保留的子目录(系统教程/有图)
- `2-技术文章/02-TypeScript全栈开发/` — TS/JS/CSS/浏览器系统学习树
- `2-技术文章/05-DevOps与基础设施/Linux系统管理/` — 服务器运维教程
- `2-技术文章/05-DevOps与基础设施/{容器化技术,CI-CD流水线}/`
- `2-技术文章/0-vim/`、`1-aiCoding/`、`08-AI编程/ai+自动化/`
- `2-技术文章/组件封装/`、`2-技术文章/Git版本控制/`、`2-技术文章/12-磁盘/`
- `4-全栈/01-elysia/`、`7-信息研究/金钱流动/`
- `<md-name>/` 单文件 + 图的独立子目录(如 `电脑相关权限问题/`)

### 元文件
- `README.md` — 新规则总览
- `知识库管理规则.md` — 宪法(轻易不修改)
- `views.published.base` — 网站发布视图配置
- `CLAUDE.md` — 本文件

## 规则

### 文件命名
- vault 根 .md 直接用标题名
- 同名冲突加源目录前缀(如 `0-blog--未命名.md`)
- 数字前缀不强制

### frontmatter 必填字段
```yaml
---
形态: 教程型          # 参考型 | 教程型
场景: 网络             # 自由场景
tags: [网络, 教程]     # 自由标签
published: true        # 是否发到网站
series: HTTP           # 可选,系列名
---
```

### wikilink
- 默认 `![[]]` 嵌入
- `[[]]` 只用于"参见"跳转
- 优先用文件名,不要写路径

### 图片资源
- 有图的 .md → 独立同名子目录 + `assets/`
- 例:`电脑相关权限问题/电脑相关权限问题.md` + `电脑相关权限问题/assets/`

## 与 my-blog 协作
- `published: true` 是唯一发布开关
- `my-blog` 每天 0 点(UTC)通过 GitHub Action 自动构建
- `views.published.base` 决定网站首页 chip 栏

[[README]] (查看完整规则)
[[知识库管理规则]] (宪法)
