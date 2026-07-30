---
date created: '2026-04-三 13:04:52'
date modified: 2026-04-22T00:00:00.000Z
tags:
  - 用/编程环境
  - 自用软件
related:
  - Mise
  - 部署服务器场景
series: 自用软件
---

# 我的编程环境配置

> 每次部署都是用 mise chsrc 去安装服务器环境

## 核心工具

使用 [[Mise]] 作为统一环境管理器。

**为什么选择 Mise**：
- 比 asdf 快 10 倍
- 支持 600+ 工具
- 全平台支持（Windows/macOS/Linux）
- 配置文件可提交 Git，团队环境一致

## 我的安装步骤

### Windows

```powershell
winget install jdx.mise
```

### Shell 激活

```bash
# ~/.bashrc 或 ~/.zshrc
eval "$(~/.local/bin/mise activate bash)"
```

## 我的配置

### 全局默认工具

```bash
# Node.js LTS
mise use --global node@lts

# Python 最新版
mise use --global python@latest
```

### 项目配置示例

```toml
# mise.toml
[tools]
node = "22"
python = "3.12"

[env]
NODE_ENV = "development"
PATH = "./node_modules/.bin:$PATH"

[tasks]
dev = { cmd = "npm run dev", env = { DEBUG = "1" } }
```

## 常用命令

```bash
# 项目本地安装
mise use python@3.12

# 查看当前激活版本
mise current

# 安装所有项目依赖
mise install

# 运行任务
mise run dev
```

## 相关场景

- 部署服务器 → [[部署服务器场景]]
- 团队协作 → [[团队协作场景]]

---

## 参考

- [[Mise]] - 工具详细说明
