# 服务器配置与运维指南

> 📚 这是一个完整的Ubuntu服务器配置和运维知识库，从购买服务器到部署项目的全流程指南。

## 📁 文档结构

```
ubuntu/
├── README.md                      # 本文件 - 总索引
├── 01-服务器运维/                  # 服务器基础运维
│   ├── 1.第一台服务器.md           # 购买服务器后的第一步
│   ├── 安装docker.md               # Docker安装指南
│   └── docker使用.md               # Docker使用指南
├── 02-SSH配置/                     # SSH相关配置
│   └── SSH完整配置指南.md           # SSH免密登录+Root登录+GitHub Actions
├── 03-开发环境/                    # 开发环境搭建
│   └── Node.js开发环境搭建.md      # Node.js/Bun/Volta完整指南
└── 04-数据库配置/                  # 数据库配置
    └── sql.md                      # MySQL/PostgreSQL等数据库指南
```

## 🚀 快速开始

### 新手入门路线图

```mermaid
flowchart TD
    A[购买服务器] --> B[[01-服务器运维/1.第一台服务器|服务器配置第一步]]
    B --> C[[02-SSH配置/SSH完整配置指南|SSH配置]]
    C --> D[[01-服务器运维/安装docker|Docker安装]]
    D --> E[[03-开发环境/Node.js开发环境搭建|开发环境]]
    E --> F[[04-数据库配置/sql|数据库配置]]
    F --> G[部署项目]
```

### 按需查看

| 需求 | 推荐文档 |
|------|---------|
| 🔐 SSH免密登录 | [[02-SSH配置/SSH完整配置指南|SSH完整配置指南]] |
| 🐳 Docker安装使用 | [[01-服务器运维/安装docker|Docker安装]] + [[01-服务器运维/docker使用|Docker使用]] |
| 💻 Node.js开发环境 | [[03-开发环境/Node.js开发环境搭建|Node.js开发环境搭建]] |
| 🗄️ 数据库配置 | [[04-数据库配置/sql|数据库配置]] |
| 🚀 CI/CD部署 | [[02-SSH配置/SSH完整配置指南#ssh密钥用于github-actions|SSH密钥用于GitHub Actions]] |

## 📖 详细文档

### 01-服务器运维
- [[01-服务器运维/1.第一台服务器|服务器购买后的第一步]] - 服务器购买后的完整配置流程
- [[01-服务器运维/安装docker|Docker安装配置]] - Docker CE安装和配置
- [[01-服务器运维/docker使用|Docker使用指南]] - Docker日常操作和最佳实践

### 02-SSH配置
- [[02-SSH配置/SSH完整配置指南|SSH完整配置指南]] - SSH免密登录、Root用户登录、GitHub Actions集成

### 03-开发环境
- [[03-开发环境/Node.js开发环境搭建|Node.js开发环境搭建]] - Volta、Node.js、Bun完整安装配置指南

### 04-数据库配置
- [[04-数据库配置/sql|数据库配置指南]] - MySQL、PostgreSQL等数据库安装配置

## 🛠️ 推荐工具

| 类别 | 工具 | 推荐理由 |
|------|------|---------|
| 终端管理 | XTerminal | 多服务器管理，支持SSH免密 |
| 包管理器 | Volta | Node.js版本管理，项目级版本控制 |
| JavaScript运行时 | Bun | 极快的安装和运行速度 |
| 换源工具 | chsrc | 一键切换各种包管理器源 |
| 容器化 | Docker | 应用部署和环境隔离 |

## 🔗 常用命令速查

### SSH连接
```bash
# 免密登录
ssh server-name

# 传文件
scp -i ~/.ssh/key file.txt user@host:/path/
```

### 系统更新
```bash
sudo apt update && sudo apt upgrade -y
```

### 服务管理
```bash
# 查看服务状态
sudo systemctl status service-name

# 重启服务
sudo systemctl restart service-name
```

## 📝 更新日志

- **2024-10-12**: 重构文档结构，合并重复内容，优化文件组织
- 添加完整的SSH配置指南
- 统一Node.js开发环境搭建流程
- 增加快速开始路线图

## 🤝 贡献

如果你有补充或改进建议，欢迎提交issue或PR！

---

**⭐ 如果这个知识库对你有帮助，请给个Star支持一下！**