---
date created: 2025-11-26T15:58:31.000Z
date modified: 2025-11-26T16:20:00.000Z
tags:
  - 全栈
  - elysia
---

# 🏗️ 现代化 Monorepo 项目架构

## 📋 概述

本文档描述了基于 Elysia + Drizzle + Zod 技术栈的现代化 Monorepo 项目架构设计，实现前后端类型共享和开发效率最大化。

## 🏛️ 项目顶层结构

```txt
📁 monorepo-project/
├── 📂 apps/                    # 🚀 应用层
│   ├── 📂 backend/            # Elysia 后端服务
│   └── 📂 frontend/           # Vue3 前端应用
├── 📂 packages/               # 📦 共享包层
│   ├── 📂 contract/           # 🔄 契约层（类型和Schema定义）
│   └── 📂 tsconfig/           # ⚙️ TypeScript 配置包
├── 📄 CLAUDE.md               # 🗺️ 项目导航文档
├── 📄 package.json            # 📋 依赖管理
├── 📄 pnpm-workspace.yaml     # 🔧 PNPM 工作空间配置
└── 📄 turbo.json              # ⚡ Turbo 构建配置
```

### 📂 目录说明

| 目录 | 用途 | 说明 |
|------|------|------|
| `apps/` | 应用代码 | 存放前后端应用实现 |
| `packages/` | 共享代码 | 存放通用库、类型定义等 |
| `contract/` | 契约层 | 前后端共享的类型和Schema |

## 🔄 契约层设计

### 核心理念
- **单一数据源**：所有类型定义集中在 `packages/contract`
- **双入口导出**：分别提供给前端和后端使用
- **类型安全**：确保前后端类型一致性

### 导出策略

```typescript
// packages/contract/src/index.ts - 前后端共享入口
export * from './modules'
export * from './types'

// packages/contract/src/db.ts - 后端专用入口
export * from './modules/**/*.schema'
```

## 📦 模块化结构

### 后端模块标准

```txt
📁 apps/backend/src/modules/
└── 📂 module-name/             # 🏷️ 单数命名（如：category、user）
    ├── 📄 module_name.ts       # 🎮 控制器（REST API）
    ├── 📄 module_name.service.ts # 💼 业务逻辑层
    └── 📄 index.ts             # 📤 模块导出
```

### 契约层模块标准

```txt
📁 packages/contract/src/modules/
└── 📂 module-name/
    ├── 📄 module_name.schema.ts  # 🗄️ 数据库 Schema（后端引用）
    ├── 📄 module_name.model.ts   # 🎯 完整的 Schema 和类型定义
    ├── 📄 module_name.schema.md  # 📖 数据库表文档
    └── 📄 module_name.model.md   # 📚 模块设计文档
```

## 🛠️ 技术栈依赖

### 核心技术
- **后端框架**: Elysia + TypeScript
- **数据库ORM**: Drizzle ORM
- **类型验证**: Zod
- **前端框架**: Vue3 + TypeScript

### 类型系统
- **共享类型**: 使用 Zod 生成的 JSON Schema
- **类型同步**: 前后端引用相同的类型定义
- **运行时验证**: Zod Schema 验证

## 🔒 类型安全保障

### 返回值类型约束

```typescript
// 后端 API 返回类型必须严格匹配契约定义
async getList(params: ListQuery): Promise<ContractModel['ListResponse']> {
  const data = await db.select().from(table)

  // ✅ 正确：强制指定返回类型
  return data as ContractModel['ListResponse']

  // ❌ 错误：直接返回可能不符合契约
  // return data
}
```

### 关键原则
1. **禁止隐式返回**：所有 API 返回必须显式指定类型
2. **契约优先**：先定义契约，再实现功能
3. **类型同步**：前后端使用相同的类型定义

## 🚀 快速开始

### 1. 初始化项目

```bash
# 创建 Monorepo
pnpm create monorepo my-project
cd my-project

# 安装核心依赖
pnpm add elysia drizzle-orm zod
pnpm add -D @types/node typescript
```

### 2. 配置工作空间

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 3. 设置 TypeScript

```json
// packages/tsconfig/base.json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@contract/*": ["../../contract/src/*"]
    }
  }
}
```

## 📚 相关文档

- [Drizzle ORM 使用指南](./dirzzle%20的使用方法：.md)
- [Elysia 开发规范](../01-Elysia架构基础规范.md)
- [类型系统设计](../02-Drizzle-Zod类型系统设计.md)

## 💡 最佳实践

### 开发流程
1. **先定义契约**：在 `packages/contract` 中定义类型
2. **后端实现**：引用契约类型实现 API
3. **前端集成**：引用契约类型调用 API
4. **类型检查**：确保前后端类型一致

### 注意事项
- 🔄 保持契约更新的及时性
- 📝 编写清晰的类型文档
- 🧪 编写类型测试用例
- 🔍 使用 TypeScript 严格模式
