---
date created: 2025-10-日 00:45:11
date modified: 2025-11-四 18:03:46
---
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个知识库项目，由锦江学子协同编写，旨在帮助新生入门计算机科学。项目采用中文文档编写，按照现代技术栈和学习路径重新组织，以**TypeScript全栈开发**为核心，同时包含Java企业级开发、移动开发、DevOps等多个技术领域。

## 🆕 新的文档结构

项目按照学习路径和技术领域进行重新组织：

### 核心技术栈
- `01-编程基础/` - 计算机基础、数据结构、设计模式、网络协议
- `02-TypeScript全栈开发/` - **核心目录**：TS基础、前端框架、后端运行时、全栈框架
- `03-Java企业级开发/` - Java语言、Spring框架、微服务架构

### 专业方向
- `04-移动与跨平台开发/` - Android、iOS、跨平台方案
- `05-DevOps与基础设施/` - Linux、容器化、CI/CD、云服务
- `06-测试与质量保证/` - 自动化测试、性能测试、质量保证

### 工具效率
- `07-开发工具与效率/` - Git、IDE、Python工具集、自动化脚本
- `08-项目实战与职业发展/` - 项目模板、面试经验、学习资源

## 🎯 技术偏好设置

根据用户的全局配置，本项目遵循以下技术偏好：

### 包管理器
- **Node.js项目**: 优先使用 `pnpm`
- **现代项目**: 使用 `bun` 运行时
- **Monorepo**: 使用 `pnpm` workspace

### 代码工具
- **代码格式化**: 使用 `Biome` 统一代码风格
- **库打包**: 使用 `pkgroll` 进行打包
- **类型系统**: 前后端统一 TypeScript 类型定义

### 类型共享策略
```typescript
// 建议的项目结构
project/
├── shared/          # 共享类型定义
│   └── types.ts
├── frontend/        # 前端项目
├── backend/         # 后端项目
└── package.json
```

## 文档编写规范

1. **语言要求**：所有文档和回复均使用中文
2. **文档格式**：主要使用Markdown格式，支持Jupyter Notebook文件
3. **内容组织**：按照学习路径递进，从基础到进阶
4. **代码示例**：优先使用TypeScript语法，遵循现代ES标准

## 常见操作

### 查看文档结构
```bash
ls -la                    # 查看根目录
tree -L 2                # 查看两级目录结构
find . -name "*.md"      # 查找所有markdown文件
```

### 文档搜索
使用适当的工具查找特定技术内容：
- 使用 Glob 工具按文件名模式搜索
- 使用 Grep 工具搜索文件内容
- 优先搜索 `02-TypeScript全栈开发/` 目录

### TypeScript项目初始化
```bash
# 创建新项目
pnpm create vite my-app --template vue-ts

# 安装开发依赖
pnpm add -D @biomejs/biome typescript

# 代码格式化
pnpm biome format --write .
```

## 技术栈说明

### 核心技术
- **TypeScript全栈**: 前后端统一类型系统，现代Web开发
- **前端框架**: Vue3、React、鸿蒙开发(ArkTS)
- **后端运行时**: Node.js、Bun、Deno
- **全栈框架**: Next.js、Nuxt.js、SvelteKit

### 企业级技术
- **Java开发**: Spring Boot、Spring Cloud、微服务
- **数据库**: SQL(MySQL/PostgreSQL)、NoSQL(MongoDB/Redis)
- **DevOps**: Docker、Kubernetes、CI/CD

### 开发工具
- **版本控制**: Git协同开发最佳实践
- **开发环境**: VS Code、IntelliJ IDEA配置
- **自动化**: Python脚本、Shell脚本

## 学习路径指导

### 新手入门 (0-6个月)
1. 先学习 `01-编程基础/` 建立基础概念
2. 重点学习 `02-TypeScript全栈开发/TS基础与类型系统/`
3. 选择一个前端框架深入学习 (Vue3或React)
4. 掌握 `07-开发工具与效率/Git版本控制/`

### 进阶开发 (6-18个月)
1. 学习后端开发：Node.js或Bun运行时
2. 掌握数据库操作和API设计
3. 学习全栈框架：Next.js或Nuxt.js
4. 了解基础的DevOps知识

### 专业方向 (18个月+)
1. **企业级开发**: 深入Java + Spring生态
2. **DevOps专家**: 容器化、云原生、CI/CD
3. **全栈架构**: 大型项目架构设计

## 协作规范

1. 文档编辑时保持中文书写
2. 新增内容请按照现有目录结构归类
3. TypeScript代码示例要遵循配置的技术偏好
4. 确保技术文档的准确性和实用性
5. 项目目标：帮助新生入门计算机科学，培养全栈开发能力