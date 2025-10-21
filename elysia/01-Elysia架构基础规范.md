# Elysia 全栈架构基础规范

## 概述

本文档定义了基于 Elysia + Drizzle + Zod 的全栈开发架构基础规范，为开发者提供清晰的项目结构和核心技术配置指导。

## 核心技术栈

### 技术组件
- **后端框架**: Elysia.js
- **数据库ORM**: Drizzle ORM
- **类型校验**: Zod
- **数据库**: PostgreSQL (生产) / SQLite (开发)
- **包管理器**: pnpm
- **代码格式化**: Biome
- **构建工具**: pkgroll

### 架构特点
- 类型安全的全栈开发
- 运行时数据校验
- 自动API文档生成
- 前后端类型同步

## 项目结构标准

### Monorepo 结构
```
project/
├── apps/
│   ├── backend/                 # 后端应用
│   └── frontend/               # 前端应用
├── packages/
│   ├── shared/                 # 共享类型
│   └── utils/                  # 工具库
├── docker/                     # Docker配置
├── docs/                       # 项目文档
├── package.json                # 根package.json
├── turbo.json                  # Turbo配置
└── biome.json                  # 代码格式化配置
```

### 后端目录结构
```
src/
├── modules/                    # 业务模块
│   ├── users/
│   │   ├── users.controller.ts  # 控制器层
│   │   └── users.service.ts     # 服务层  
│   └── products/
├── db/
│   ├── models/                  # 数据库Schema
│   │   ├── index.ts            # 统一导出
│   │   ├── users.schema.ts     # 用户表定义  # 类型模型
│   │   └── products.schema.ts  # 商品表定义 
│   ├── connection.ts           # 数据库连接
│   └── database.types.ts       # 类型转换层
├── utils/
│   ├── response.ts             # 响应格式化
│   ├── errors.ts               # 错误处理
│   └── common.ts               # 通用工具
├── middleware/                 # 中间件
├── types/                      # 全局类型定义
└── app.ts                      # 应用入口
```

## 核心配置文件

### 1. package.json 脚本配置
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "clean": "rimraf dist node_modules",
    "check": "biome check .",
    "format": "biome format --write .",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:generate": "drizzle-kit generate"
  }
}
```

### 2. turbo.json 配置
```json
{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": {
      "outputs": ["dist/**"],
      "dependsOn": ["^build"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    },
    "check": {
      "dependsOn": ["^check"]
    }
  }
}
```

### 3. biome.json 代码格式化
```json
{
  "formatter": {
    "enabled": true,
    "lineWidth": 80,
    "indentStyle": "space",
    "indentSize": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

## 数据库配置

### 环境变量配置
```env
# 数据库连接
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT配置
JWT_SECRET="your-jwt-secret"

# 服务配置
PORT=3000
NODE_ENV="development"
```

### 数据库连接 (db/connection.ts)
```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

## 应用入口配置

### 基础应用设置 (src/app.ts)
```typescript
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { errorHandler } from "./middleware/error";

const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "基于 Elysia 的全栈API"
      }
    }
  }))
  .use(errorHandler)
  .get("/", () => ({ message: "API Server Running" }))
  .listen(3000);

console.log(`🦊 Elysia server running at ${app.server?.hostname}:${app.server?.port}`);
```

## 核心原则

### 1. 分层架构
- **Controller层**: 处理HTTP请求，参数验证，响应格式化
- **Service层**: 业务逻辑处理，数据库操作
- **Model层**: 类型定义，数据验证
- **Schema层**: 数据库表结构定义

### 2. 类型安全
- 所有API接口必须有明确的类型定义
- 使用Zod进行运行时数据校验
- 前后端共享TypeScript类型

### 3. 错误处理
- Service层抛出具体错误
- Controller层统一错误响应格式
- 使用自定义错误类替代通用Error

### 4. 代码规范
- 使用Biome统一代码格式
- 遵循TypeScript严格模式
- 所有函数必须有明确的返回类型

## 开发工作流

### 1. 项目初始化
```bash
# 创建项目
pnpm create elysia my-app
cd my-app

# 安装依赖
pnpm add drizzle-orm drizzle-kit postgres
pnpm add -D @types/node

# 初始化数据库
pnpm drizzle-kit generate
pnpm drizzle-kit push
```

### 2. 开发流程
1. 定义数据库Schema
2. 生成Zod校验规则
3. 实现Service业务逻辑
4. 创建Controller路由
5. 编写测试用例

### 3. 代码提交前检查
```bash
# 代码格式检查
pnpm biome check .

# 类型检查
pnpm tsc --noEmit

# 运行测试
pnpm test
```

## 最佳实践

### 1. 模块化设计
- 每个业务实体独立成模块
- 统一的文件命名和结构
- 清晰的依赖关系

### 2. 类型复用
- 基于数据库Schema生成类型
- 避免重复定义类型
- 使用namespace组织相关类型

### 3. 性能优化
- 数据库查询使用索引
- 实现分页和缓存
- 避免N+1查询问题

### 4. 安全考虑
- 输入数据验证
- SQL注入防护
- 敏感信息加密

## 相关文档

- [Drizzle + Zod类型系统设计](./02-Drizzle-Zod类型系统设计.md)
- [Service层设计模式](./04-Service层设计模式.md)
- [Controller层接口设计](./05-Controller层接口设计.md)
- [Elysia代码编写规范](./03-Elysia代码编写规范.md)