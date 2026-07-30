---
tags:
  - 全栈
  - elysia
series: elysia
---
# Elysia + Drizzle + Zod 全栈开发规范

## 📖 文档概述

本规范文档集提供了基于 Elysia + Drizzle + Zod 技术栈的全栈开发完整指南，涵盖从架构设计到具体实现的各个层面。

## 🚀 技术栈

- **后端框架**: [Elysia.js](https://elysiajs.com/) - 现代化的 TypeScript Web 框架
- **数据库ORM**: [Drizzle ORM](https://orm.drizzle.team/) - 类型安全的 SQL 工具包
- **类型校验**: [Zod](https://zod.dev/) - TypeScript 优先的模式验证
- **数据库**: PostgreSQL (生产) / SQLite (开发)
- **包管理器**: pnpm
- **代码格式化**: Biome
- **构建工具**: pkgroll
- **API文档**: Swagger (自动生成)

## 📚 文档结构

### 核心文档

| 文档 | 描述 | 适用场景 |
|------|------|----------|
| [01-Elysia架构基础规范](./01-Elysia架构基础规范.md) | 项目架构概览、技术配置、基础规范 | 项目初始化、团队新人入门 |
| [02-Drizzle-Zod类型系统设计](./02-Drizzle-Zod类型系统设计.md) | 四层类型系统架构、数据库设计、类型安全 | 数据库设计、类型系统搭建 |
| [03-Elysia代码编写规范](./03-Elysia代码编写规范.md) | 命名规范、代码风格、错误处理 | 日常开发、代码审查 |
| [04-Service层设计模式](./04-Service层设计模式.md) | 业务逻辑封装、数据操作、事务处理 | Service层开发、复杂业务实现 |
| [05-Controller层接口设计](./05-Controller层接口设计.md) | RESTful API设计、路由定义、接口文档 | API开发、接口设计 |
| [06-项目重构指南](./06-项目重构指南.md) | 迁移步骤、最佳实践、检查清单 | 项目重构、技术栈迁移 |

## 🏗️ 架构概览

### 四层类型系统架构

```
┌─────────────────────────────────────────┐
│           第4层：TypeScript类型         │  ← 前端/后端业务类型
├─────────────────────────────────────────┤
│           第3层：业务模型层             │  ← 供Elysia使用的Model
├─────────────────────────────────────────┤
│           第2层：Zod Schema层           │  ← 运行时数据校验
├─────────────────────────────────────────┤
│           第1层：Drizzle表定义层        │  ← 数据库表结构
└─────────────────────────────────────────┘
```

### 项目目录结构

```
src/
├── modules/                    # 业务模块
│   ├── users/
│   │   ├── users.controller.ts  # Controller层
│   │   ├── users.service.ts     # Service层
│   │   ├── users.model.ts       # Elysia模型
│   │   ├── users.schema.ts      # 数据库表定义
│   │   └── users.types.ts       # TypeScript类型
│   └── products/
├── db/
│   ├── schema/                  # 数据库Schema
│   ├── connection.ts            # 数据库连接
│   └── database.types.ts        # 类型转换层
├── utils/
│   ├── response.ts              # 响应格式化
│   ├── errors.ts                # 错误处理
│   └── common.ts                # 通用工具
├── middleware/                  # 中间件
└── app.ts                       # 应用入口
```

## 🎯 核心特性

### 1. 类型安全
- **编译时类型检查**: TypeScript 严格模式
- **运行时数据校验**: Zod Schema 验证
- **前后端类型同步**: 共享 TypeScript 类型定义

### 2. 开发效率
- **自动 API 文档**: Swagger 自动生成
- **代码格式统一**: Biome 自动格式化
- **热重载开发**: 快速开发反馈

### 3. 代码质量
- **统一代码规范**: 详细的编码标准
- **完善的错误处理**: 分层错误处理机制
- **全面的测试覆盖**: 单元测试和集成测试

### 4. 架构清晰
- **分层架构**: Controller、Service、Model、Schema
- **职责分离**: 每层专注特定职责
- **依赖注入**: 松耦合的组件设计

## 🚀 快速开始

### 1. 环境要求

```bash
# Node.js 版本
node >= 18.0.0

# 包管理器
pnpm >= 8.0.0

# 数据库
PostgreSQL >= 13.0 (生产环境)
SQLite >= 3.0 (开发环境)
```

### 2. 项目初始化

```bash
# 创建新项目
pnpm create elysia my-app
cd my-app

# 安装依赖
pnpm add elysia @elysiajs/swagger @elysiajs/cors
pnpm add drizzle-orm drizzle-kit postgres
pnpm add zod drizzle-zod

# 安装开发依赖
pnpm add -D @types/node typescript biome pkgroll
```

### 3. 基础配置

```json
// package.json
{
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "pkgroll",
    "start": "node dist/app.js",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "check": "biome check .",
    "format": "biome format --write ."
  }
}
```

```typescript
// src/app.ts
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: "API Documentation",
        version: "1.0.0",
      },
    },
  }))
  .get("/", () => ({ message: "Hello Elysia!" }))
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
```

### 4. 运行项目

```bash
# 启动开发服务器
pnpm dev

# 查看API文档
# 访问 http://localhost:3000/docs

# 运行数据库管理工具
pnpm db:studio
```

## 📋 开发检查清单

### 代码提交前检查

- [ ] 代码通过 Biome 格式检查
- [ ] TypeScript 类型检查通过
- [ ] 所有测试用例通过
- [ ] API 文档更新
- [ ] 错误处理完善
- [ ] 性能测试通过

### 发布前检查

- [ ] 功能完整性测试
- [ ] 安全性检查
- [ ] 性能基准测试
- [ ] 文档完整性验证
- [ ] 部署脚本测试

## 🛠️ 开发工具推荐

### IDE/编辑器
- **VS Code**: 推荐插件
  - TypeScript Importer
  - Prettier
  - ESLint
  - Thunder Client (API测试)

### 数据库工具
- **Drizzle Studio**: 可视化数据库管理
- **pgAdmin**: PostgreSQL 管理工具
- **DBeaver**: 通用数据库客户端

### API测试工具
- **Swagger UI**: 在线API文档和测试
- **Thunder Client**: VS Code API测试插件
- **Postman**: 功能强大的API测试工具

## 🔗 相关资源

### 官方文档
- [Elysia.js 官方文档](https://elysiajs.com/)
- [Drizzle ORM 官方文档](https://orm.drizzle.team/)
- [Zod 官方文档](https://zod.dev/)

### 社区资源
- [Elysia GitHub](https://github.com/elysiajs/elysia)
- [Drizzle GitHub](https://github.com/drizzle-team/drizzle-orm)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)

### 学习资源
- [TypeScript 深入浅出](https://github.com/type-challenges/type-challenges)
- [现代全栈开发](https://roadmap.sh/fullstack)
- [RESTful API 设计指南](https://restfulapi.net/)

## 🤝 贡献指南

### 参与贡献

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 文档改进

如果你发现文档中的错误或有改进建议，欢迎：
- 提交 Issue 报告问题
- 提交 Pull Request 改进文档
- 分享你的使用经验和最佳实践

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**注意**: 本规范基于实际项目经验总结，随着技术发展和团队实践会持续更新完善。如有问题或建议，欢迎提交 Issue 或 Pull Request。
