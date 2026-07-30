---
tags:
  - 技术文章
  - TypeScript全栈开发
  - 工程化与部署
  - 包管理
series: 包管理
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
