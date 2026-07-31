---
tags:
  - 技术/devops/docker
  - 技术/部署/流程
  - 技术/部署/自动化
title: Docker 自动化部署流程实践笔记
date created: '2026-07-31'
date modified: '2026-07-31'
---
# Docker 自动化部署流程实践笔记

本文档记录了基于 GitHub Actions + 阿里云 ACR + 服务器部署的完整自动化部署流程实践。

## 📋 目录

- [架构概览](#架构概览)
- [前置准备](#前置准备)
- [GitHub Actions 工作流配置](#github-actions-工作流配置)
- [Docker 镜像构建](#docker-镜像构建)
- [阿里云容器镜像服务配置](#阿里云容器镜像服务配置)
- [服务器部署配置](#服务器部署配置)
- [部署流程详解](#部署流程详解)
- [监控与维护](#监控与维护)
- [故障排除](#故障排除)

## 🏗️ 架构概览

```mermaid
graph LR
    A[开发者推送代码] --> B[创建 Release]
    B --> C[GitHub Actions 触发]
    C --> D[构建 Docker 镜像]
    D --> E[推送到阿里云 ACR]
    E --> F[传输配置文件到服务器]
    F --> G[服务器拉取镜像]
    G --> H[启动容器服务]
    H --> I[部署完成]
```

### 技术栈

- **CI/CD**: GitHub Actions
- **容器化**: Docker + Docker Compose
- **镜像仓库**: 阿里云容器镜像服务 (ACR)
- **反向代理**: Caddy
- **服务器**: Linux (支持 Docker)
- **项目构建**: Bun + Node.js

## 🔧 前置准备

### 1. GitHub Secrets 配置

在 GitHub 仓库的 `Settings > Secrets and variables > Actions` 中配置以下密钥：

#### 阿里云容器镜像服务
```
ALIYUN_REGISTRY_USERNAME = 你的阿里云账号
ALIYUN_REGISTRY_PASSWORD = 你的阿里云密码
```

#### 服务器访问配置
```
SERVER_HOST = 服务器IP地址
SERVER_USER = 服务器用户名
SERVER_KEY = SSH私钥内容
```

### 2. 服务器环境准备

#### 安装 Docker 和 Docker Compose
```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh
sudo systemctl start docker
sudo systemctl enable docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 创建项目目录
```bash
sudo mkdir -p /1/MechanicEndWorld2
sudo chown $USER:$USER /1/MechanicEndWorld2
```

#### 创建 Caddy 数据目录
```bash
mkdir -p /1/MechanicEndWorld2/caddy_data
mkdir -p /1/MechanicEndWorld2/caddy_config
```

## 🚀 GitHub Actions 工作流配置

项目包含四个主要的工作流文件：

### 1. build-image.yml - 镜像构建

**触发条件**:
- 手动触发 (`workflow_dispatch`)
- 被其他工作流调用 (`workflow_call`)

**主要步骤**:
1. 检出代码
2. 登录阿里云 ACR
3. 生成 Docker 标签
4. 构建并推送镜像
5. 提取版本标签

**关键配置**:
```yaml
env:
  REGISTRY: registry.cn-chengdu.aliyuncs.com
  IMAGE_NAME: docker-tzd/mechanicendworld
```

### 2. transfer-files.yml - 文件传输

**功能**: 将部署配置文件传输到服务器

**传输的文件**:
- `.container/prod/*` - 生产环境配置
- `.env` - 环境变量文件

**验证机制**:
- 检查必要文件是否存在
- 验证服务器端文件结构

### 3. deploy-service.yml - 服务部署

**支持的操作**:
- `deploy`: 部署新版本
- `restart`: 重启服务
- `stop`: 停止服务
- `status`: 查看状态

**部署流程**:
1. 停止现有服务
2. 拉取最新镜像
3. 启动新容器
4. 健康检查
5. 清理旧镜像

### 4. deploy-pipeline.yml - 完整管道

**触发条件**:
- 手动触发（支持参数配置）
- 创建 Release 时自动触发

**流程阶段**:
1. 构建镜像 (可跳过)
2. 传输文件
3. 部署服务 (可跳过)
4. 生成摘要报告

## 🐳 Docker 镜像构建

### Dockerfile 结构

```dockerfile
# 多阶段构建
FROM oven/bun:1.2.20-alpine AS build
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build:exe:prod

# 运行时镜像
FROM oven/bun:1.2.20-alpine
WORKDIR /app
COPY --from=build /app/dist.exe ./dist.exe
COPY --from=build /app/.container/prod/* ./.container/prod/
COPY --from=build /app/.env* ./
COPY --from=build /app/public ./public

ENV NODE_ENV=production
CMD ["./dist.exe"]
EXPOSE $APP_PORT
```

### 构建特性

- **多阶段构建**: 减少最终镜像大小
- **预编译二进制**: 使用 `dist.exe` 提高启动速度
- **环境隔离**: 分离构建和运行环境
- **健康检查**: 内置服务健康监控

### 镜像标签策略

- `latest`: 最新版本
- `v1.0.0`: 基于版本号的语义化标签
- `main`: 基于分支名
- `pr-2`: 基于拉取请求

## ☁️ 阿里云容器镜像服务配置

### 镜像仓库地址

```
registry.cn-chengdu.aliyuncs.com/docker-tzd/mechanicendworld
```

### 登录命令

```bash
docker login registry.cn-chengdu.aliyuncs.com \
  --username=你的阿里云账号 \
  --password=你的阿里云密码
```

### 镜像拉取

```bash
docker pull registry.cn-chengdu.aliyuncs.com/docker-tzd/mechanicendworld:latest
```

## 🖥️ 服务器部署配置

### docker-compose.prod.yml 配置

#### 应用服务配置
```yaml
services:
  app:
    image: registry.cn-chengdu.aliyuncs.com/docker-tzd/mechanicendworld:${IMAGE_TAG:-latest}
    container_name: MechanicEndWorld-end
    pull_policy: always  # 强制拉取最新镜像
    ports:
      - "${APP_PORT}:${APP_PORT}"
    env_file:
      - .env.production
      - ../../.env
    healthcheck:
      test: ["CMD-SHELL", "wget -q --spider http://localhost:${APP_PORT} || exit 1"]
      interval: 10s
      timeout: 3s
      retries: 3
    restart: unless-stopped
```

#### Caddy 反向代理配置
```yaml
  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
      - "9010:9010"  # 前端静态资源
      - "9011:9011"  # 远程资源
    volumes:
      - ../../front:/1/MechanicEndWorld2/front
      - ../../remote:/1/MechanicEndWorld2/remote
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
```

### Caddy 配置文件

#### 主域名反向代理
```caddy
wx.cykycyky.top {
    reverse_proxy app:{env.APP_PORT} {
        health_uri /
        health_interval 30s
    }

    header {
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
    }
}
```

#### 静态资源服务
```caddy
:9010 {
    root * /1/MechanicEndWorld2/front
    header /assets/* {
        Cache-Control "public, max-age=31536000, immutable"
    }
    encode {
        gzip
        zstd
    }
    file_server
    try_files {path} /index.html
}
```

## 🔄 部署流程详解

### 自动部署流程

1. **触发阶段**
   - 创建 GitHub Release
   - 或手动触发工作流

2. **构建阶段**
   ```bash
   # GitHub Actions 执行
   - 检出代码
   - 登录阿里云 ACR
   - 构建 Docker 镜像
   - 推送镜像到仓库
   ```

3. **传输阶段**
   ```bash
   # 传输配置文件
   scp .container/prod/* server:/1/MechanicEndWorld2/
   scp .env server:/1/MechanicEndWorld2/
   ```

4. **部署阶段**
   ```bash
   # 服务器执行
   cd /1/MechanicEndWorld2/.container/prod
   docker-compose -f docker-compose.prod.yml down
   docker-compose -f docker-compose.prod.yml pull
   docker-compose -f docker-compose.prod.yml up -d
   docker image prune -f
   ```

### 手动部署命令

```bash
# 完整部署
cd /1/MechanicEndWorld2/.container/prod
docker-compose -f docker-compose.prod.yml up -d

# 重启服务
docker-compose -f docker-compose.prod.yml restart

# 查看状态
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs --tail 20
```

## 📊 监控与维护

### 健康检查

应用服务内置健康检查：
```bash
wget -q --spider http://localhost:${APP_PORT} || exit 1
```

### 日志查看

```bash
# 查看容器日志
docker-compose -f docker-compose.prod.yml logs --tail 100

# 实时日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.prod.yml logs app
docker-compose -f docker-compose.prod.yml logs caddy
```

### 性能监控

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
docker system df

# 清理未使用资源
docker system prune -f
```

## 🔧 故障排除

### 常见问题

#### 1. 镜像拉取失败
```bash
# 检查网络连接
ping registry.cn-chengdu.aliyuncs.com

# 重新登录 Docker
docker login registry.cn-chengdu.aliyuncs.com

# 检查镜像标签
docker pull registry.cn-chengdu.aliyuncs.com/docker-tzd/mechanicendworld:latest
```

#### 2. 容器启动失败
```bash
# 查看容器状态
docker ps -a

# 查看容器日志
docker logs 容器ID

# 检查配置文件
cat .container/prod/.env.production
cat .env
```

#### 3. 网络连接问题
```bash
# 检查端口占用
netstat -tlnp | grep :9003

# 检查防火墙
sudo ufw status
sudo iptables -L

# 检查 Docker 网络
docker network ls
docker network inspect 1panel-network
```

#### 4. 权限问题
```bash
# 检查文件权限
ls -la /1/MechanicEndWorld2/

# 修复权限
sudo chown -R $USER:$USER /1/MechanicEndWorld2/
```

### 调试步骤

1. **检查 GitHub Actions 日志**
   - 访问 GitHub 仓库的 Actions 页面
   - 查看具体工作流的执行日志
   - 定位失败步骤

2. **验证服务器配置**
   ```bash
   # 检查 Docker 服务
   sudo systemctl status docker

   # 检查 Docker Compose 版本
   docker-compose version

   # 检查磁盘空间
   df -h
   ```

3. **网络连通性测试**
   ```bash
   # 测试阿里云 ACR 连接
   curl -I https://registry.cn-chengdu.aliyuncs.com/v2/

   # 测试应用健康检查
   curl -I http://localhost:9003
   ```

4. **回滚操作**
   ```bash
   # 使用上一版本镜像
   export IMAGE_TAG=上一版本标签
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 📝 最佳实践

### 1. 安全配置
- 使用 SSH 密钥而非密码认证
- 定期轮换访问密钥
- 限制网络访问权限

### 2. 版本管理
- 使用语义化版本号
- 保留关键版本的镜像标签
- 定期清理旧版本镜像

### 3. 监控告警
- 设置容器健康检查
- 配置日志收集
- 建立告警机制

### 4. 备份策略
- 定期备份数据卷
- 备份配置文件
- 建立灾难恢复计划

## 🎚️ 环境变量配置

### .env.production 示例
```env
NODE_ENV=production
APP_PORT=9003
# 数据库配置
DATABASE_URL=postgresql://user:password@host:port/database
# 其他应用配置
```

### .env 示例
```env
# 共享环境变量
COMPOSE_PROJECT_NAME=mechanicendworld
```

## 📚 参考资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [阿里云容器镜像服务文档](https://help.aliyun.com/zh/acr/)
- [Caddy 服务器文档](https://caddyserver.com/docs/)

---

**维护者**: [@your-username]
**更新时间**: 2025-01-14
**版本**: v1.0




```yml
#docker-compose.local.yml
services:

  app:

    image: mechanicendworld:latest  # 使用本地构建的镜像

    container_name: MechanicEndWorld-local

    ports:

      - "9003:9003"  # 直接映射端口

    env_file:

      - .container/prod/.env.production

      - .env

    environment:

      - NODE_ENV=production

      - APP_PORT=9003

    healthcheck:

      test: [ "CMD-SHELL", "wget -q --spider http://localhost:9003 || exit 1" ]

      interval: 10s

      timeout: 3s

      retries: 3

    command: [ "./dist.exe" ]  # 启动编译后的 dist.exe 文件

    restart: unless-stopped

    networks:

      - local-network

  

  # 可选：如果需要数据库，可以添加 PostgreSQL 服务

  # postgres:

  #   image: postgres:15-alpine

  #   container_name: postgres-local

  #   environment:

  #     POSTGRES_DB: MechanicEndWorld

  #     POSTGRES_USER: app_user

  #     POSTGRES_PASSWORD: app_pass

  #   ports:

  #     - "5432:5432"

  #   volumes:

  #     - postgres_data:/var/lib/postgresql/data

  #   networks:

  #     - local-network

  

networks:

  local-network:

    driver: bridge

  

# volumes:

#   postgres_data:

#     driver: local
```


