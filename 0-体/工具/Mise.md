---
date created: 2026-04-22
tags: [体/工具, 场景/编程环境]
aliases: [rtx, 环境管理器]
related: [asdf, direnv, make]
形态: 参考型
场景: 编程环境
published: true
---

# Mise

> 一句话定义：一站式开发环境管理工具，统一管理多语言运行时、环境变量与项目任务

## 本质定位

**Mise = 版本管理器 (asdf) + 环境变量 (direnv) + 任务运行器 (make)**

- 前身：rtx
- 语言：Rust
- 发音：/miːz/

## 核心原理

### 架构设计

Mise 直接修改 `PATH` 环境变量，无 Shim 开销，切换速度远超 nvm/pyenv/asdf。

### 工作机制

1. **Shell 激活**：通过 `eval "$(mise activate bash)"` 注入 hook
2. **目录检测**：进入目录时自动读取 `mise.toml` 或 `.tool-versions`
3. **环境变量注入**：加载 `[env]` 节定义的环境变量
4. **PATH 调整**：将对应工具版本加入 PATH 前端
5. **离开恢复**：离开目录时自动恢复之前的环境

## 主要功能

### 1. 多工具版本管理

- 统一指令管理所有语言版本
- 全局 / 项目级版本独立控制
- 兼容 `.nvmrc`, `.node-version`, `.tool-versions`

### 2. 目录级环境变量

- 在 `mise.toml` 中定义 `[env]`
- **cd 进目录自动加载，离开自动卸载**
- 支持变量引用、路径追加、机密管理

### 3. 内置任务运行器

- 在 `mise.toml` 定义 `[tasks]`
- 支持依赖、环境变量、文件监听（watch）
- 跨平台一致运行

## 与其他工具的关系

| 工具 | 关系 | 说明 |
|------|------|------|
| [[asdf]] | 替代 | Mise 兼容 asdf 插件生态 |
| [[direnv]] | 整合 | 环境变量功能内置 |
| [[make]] | 替代 | 任务运行器更现代化 |
| [[nvm]] | 替代 | Node 版本管理 |
| [[pyenv]] | 替代 | Python 版本管理 |

## 典型应用场景

- 部署服务器：参考 [[部署服务器场景]]
- 团队协作：参考 [[团队协作场景]]
- 多项目管理：参考 [[多项目管理场景]]

---

## 参考链接

- [官方文档](https://mise.jdx.dev/)
- [GitHub](https://github.com/jdx/mise)
