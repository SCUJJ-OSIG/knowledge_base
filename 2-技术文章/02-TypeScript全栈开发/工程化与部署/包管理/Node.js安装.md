---
tags:
  - 技术/工具/node
  - 技术/包管理/安装
  - 技术/工具/volta
title: Node.js 安装指南
date created: '2026-07-31'
date modified: '2026-07-31'
---

### 使用 Volta 安装 Node.js

```bash
# 安装最新LTS版本
volta install node@lts

# 安装指定版本
volta install node@18.17.0

# 安装最新版本
volta install node

# 查看已安装版本
volta list node

# 切换版本
volta pin node@18.17.0
```

### 验证安装

```bash
node --version
npm --version
```
