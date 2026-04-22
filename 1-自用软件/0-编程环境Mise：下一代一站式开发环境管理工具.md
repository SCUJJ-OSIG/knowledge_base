---
date created: 2026-04-三 13:04:52
date modified: 2026-04-三 13:11:32
---

> 每次部署都是用mise chsrc 去安装服务器环境

**mise**（发音 /miːz/，前身为 `rtx`）是一款由 **Rust** 编写的**一站式开发环境管理工具**，旨在统一管理多语言运行时、环境变量与项目任务，彻底解决开发环境碎片化的痛点。


## 一、核心定位与优势

- **三合一工具**：**版本管理器 (asdf) + 环境变量 (direnv) + 任务运行器 (make)**
    
- **极速性能**：Rust 构建，直接修改 `PATH`，无 Shim 开销，切换速度远超 nvm/pyenv
    
- **全平台**：原生支持 **macOS/Linux/Windows**（无需 WSL）
    
- **超全生态**：内置支持 **600+ 工具**（Node, Python, Go, Java, Ruby, PHP, Rust, Terraform 等）
    
- **项目隔离**：进入目录**自动切换**版本与环境变量，离开自动恢复
    
- **团队友好**：配置文件可提交 Git，确保全员环境一致
    

## 二、三大核心功能

### 1. 多工具版本管理

- 统一指令管理所有语言版本，告别多工具记忆负担
    
- 全局 / 项目级版本独立控制
    
- 兼容 `.nvmrc`, `.node-version`, `.tool-versions` 等旧配置
    

### 2. 目录级环境变量

- 在项目根目录 `mise.toml` 中定义 `[env]`
    
- **cd 进目录自动加载，离开自动卸载**
    
- 支持变量引用、路径追加、机密管理
    

### 3. 内置任务运行器

- 替代 Make/script，在 `mise.toml` 定义 `[tasks]`
    
- 支持依赖、环境变量、文件监听（watch）
    
- 跨平台一致运行
    

## 三、快速安装

Linux

```bash
curl https://mise.run | sh
```

### Windows

```powershell
winget install jdx.mise
# 或 Scoop
scoop install mise
```

### Shell 激活（必须）

```bash
# ~/.bashrc 或 ~/.zshrc
eval "$(~/.local/bin/mise activate bash)"
```

## 四、常用命令速查

```bash
# 查看版本
mise --version

# 安装并全局使用 Node.js LTS
mise use --global node@lts

# 项目本地安装 Python 3.12（生成 mise.toml）
cd my-project
mise use python@3.12

# 查看已安装工具
mise list

# 查看当前激活版本
mise current

# 安装所有项目依赖（根据 mise.toml）
mise install

# 运行任务（定义在 [tasks]）
mise run build

# 升级 mise
mise self-update
```

## 五、配置文件示例：mise.toml

```toml
[tools]
node = "22"
python = "3.12"
go = "1.22"

[env]
NODE_ENV = "development"
API_URL = "https://api.example.com"
PATH = "./node_modules/.bin:$PATH"

[tasks]
# 简单任务
build = "npm run build"
# 带依赖与环境变量
dev = {
  cmd = "npm run dev",
  env = { DEBUG = "1" },
}
```
