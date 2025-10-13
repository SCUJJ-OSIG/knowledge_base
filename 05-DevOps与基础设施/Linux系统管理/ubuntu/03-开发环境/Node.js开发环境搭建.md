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

环境变量会自动添加到 `~/.bashrc`。 一般不需要下面的配置环境变量

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

### 验证安装

```bash
bun --version
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