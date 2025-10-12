# Node.js 开发环境搭建指南

## 📋 目录
1. [换源工具安装](#换源工具安装)
2. [Volta安装](#volta安装)
3. [Node.js安装](#nodejs安装)
4. [Bun安装](#bun安装)

---

## 换源工具安装

### 安装 chsrc

使用 chsrc 换源工具可以加速各种包管理器的下载：

```bash
# x64 架构
curl -LO https://gitee.com/RubyMetric/chsrc/releases/download/pre/chsrc_latest-1_amd64.deb
sudo apt install ./chsrc_latest-1_amd64.deb

# 或者使用 wget
wget https://gitee.com/RubyMetric/chsrc/releases/download/pre/chsrc_latest-1_amd64.deb
sudo dpkg -i chsrc_latest-1_amd64.deb
```

### 使用换源

```bash
# 检测当前源速度
chsrc test

# 换源
chsrc set npm
chsrc set yarn
chsrc set pnpm
```

---

## Volta安装

Volta 是一个优秀的 JavaScript 工具管理器，可以轻松管理 Node.js 版本。

### Unix/Linux 安装

```bash
curl https://get.volta.sh | bash
```

环境变量会自动添加到 `~/.bashrc`。

### 手动配置环境变量（如果需要）

```bash
nano ~/.bashrc
```

添加以下内容：

```bash
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
```

然后执行：

```bash
source ~/.bashrc
```

---

## Node.js安装

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

---

## Bun安装

Bun 是一个快速的 JavaScript 运行时和包管理器。

### 使用 Volta 安装 Bun

```bash
volta install bun
```

### 直接安装 Bun

```bash
# 安装最新版本
curl -fsSL https://bun.sh/install | bash

# 添加到环境变量
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 验证安装

```bash
bun --version
```

### 使用 Bun 管理项目

```bash
# 创建新项目
bun create vite my-app

# 安装依赖
bun install

# 运行开发服务器
bun dev

# 构建项目
bun build

# 运行脚本
bun run start
```

---

## 包管理器使用对比

### 安装依赖

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install

# bun
bun install
```

### 添加包

```bash
# npm
npm install package-name

# yarn
yarn add package-name

# pnpm
pnpm add package-name

# bun
bun add package-name
```

### 运行脚本

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev

# bun
bun run dev
```

---

## 开发工具推荐

### 全局安装常用工具

```bash
# TypeScript
npm install -g typescript

# ESLint
npm install -g eslint

# Prettier
npm install -g prettier

# nodemon (开发时自动重启)
npm install -g nodemon

# pm2 (进程管理)
npm install -g pm2
```

### 使用 Volta 管理全局包

```bash
# 安装全局包
volta install nodemon

# 卸载全局包
volta uninstall nodemon
```

---

## 项目配置示例

### package.json 推荐配置

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js",
    "build": "tsc",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 使用 Bun 的项目配置

```json
{
  "name": "my-bun-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts",
    "build": "bun build src/index.ts --outdir ./dist"
  }
}
```

---

## 性能优化建议

### 1. 使用 pnpm 或 Bun

```bash
# pnpm 节省磁盘空间
pnpm install

# Bun 速度最快
bun install
```

### 2. 配置 npm 镜像

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com/

# 验证配置
npm config get registry
```

### 3. 使用 .npmrc 文件

在项目根目录创建 `.npmrc` 文件：

```ini
registry=https://registry.npmmirror.com/
save-exact=true
```

---

## 相关链接

- [[../02-SSH配置/SSH完整配置指南|SSH完整配置指南]]
- [[../01-服务器运维/安装docker|Docker安装配置]]
- [[../04-数据库配置/sql|数据库配置指南]]
- [Volta 官方文档](https://volta.sh/)
- [Bun 官方文档](https://bun.sh/)
- [Node.js 官方文档](https://nodejs.org/)