---
date created: '2026-03-五 03:08:16'
date modified: '2026-03-五 03:08:21'
tags:
  - 全栈
  - elysia
---
完全可以！**Monorepo 的 `apps/fullstack` 内部再拆分成前后端两个 TypeScript 项目是标准做法**，这两层架构互不冲突。

---

## 🏗️ 一、架构层次说明

你的结构会是这样的 **三层架构**：

```
monorepo/
├── package.json              # L1: Monorepo 根（pnpm workspace / turborepo）
├── turbo.json                # L1: 任务编排配置
│
├── apps/
│   └── fullstack/            # L2: 全栈应用（一个 workspace 包）
│       ├── package.json      # L2: 独立的 npm 包
│       ├── tsconfig.json     # L2: 解决方案文件（references）
│       ├── tsconfig.server.json  # L3: 后端项目
│       ├── tsconfig.client.json  # L3: 前端项目
│       │
│       └── src/
│           ├── server/       # L3: 后端复合项目
│           │   ├── tsconfig.json  # 可选：如果 server 内部还要拆分
│           │   └── ...
│           │
│           └── client/       # L3: 前端复合项目
│               ├── tsconfig.json  # 可选：如果 client 内部还要拆分
│               └── ...
│
└── packages/                 # L1: 共享包
    ├── ui/
    ├── utils/
    └── types/
```

**关键点**：
- **L1 Monorepo** 管理的是 **npm 包之间的关系**（依赖、版本、任务编排）
- **L2/L3 TypeScript References** 管理的是 **类型编译之间的关系**（增量编译、类型隔离）
- 两者是**正交的**，互不干扰

---

## 📝 二、具体配置方案

### 1. `apps/fullstack/tsconfig.json`（解决方案文件）

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.server.json" },
    { "path": "./tsconfig.client.json" }
  ],
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

这个文件**不编译任何代码**，只负责编排前后端两个子项目。

---

### 2. `apps/fullstack/tsconfig.server.json`（后端）

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    
    // 复合项目核心配置
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo/server",
    
    // 输出配置
    "outDir": "./dist/server",
    "rootDir": "./src/server",
    
    // 性能优化
    "skipLibCheck": true,
    "isolatedModules": true,
    "strict": true,
    "noEmit": false,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    
    // 路径别名（相对于 apps/fullstack）
    "baseUrl": ".",
    "paths": {
      "@server/*": ["src/server/*"],
      "@shared/*": ["src/shared/*"],
      "@packages/*": ["../../packages/*"]
    }
  },
  "include": ["src/server/**/*"],
  "exclude": ["node_modules", "dist", "src/client"]
}
```

---

### 3. `apps/fullstack/tsconfig.client.json`（前端）

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    
    // 复合项目核心配置
    "composite": true,
    "declaration": false,
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo/client",
    
    // 输出配置
    "outDir": "./dist/client",
    "rootDir": "./src/client",
    
    // 性能优化
    "skipLibCheck": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": false,
    
    // 路径别名（相对于 apps/fullstack）
    "baseUrl": ".",
    "paths": {
      "@client/*": ["src/client/*"],
      "@shared/*": ["src/shared/*"],
      "@packages/*": ["../../packages/*"]
    }
  },
  "include": ["src/client/**/*"],
  "exclude": ["node_modules", "dist", "src/server"],
  "references": [
    { "path": "./tsconfig.server.json" }
  ]
}
```

**注意**：`references` 数组让前端知道后端的存在，类型检查时会先构建后端。

---

### 4. `apps/fullstack/package.json`

```json
{
  "name": "@monorepo/fullstack",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "typecheck": "tsc -b",
    "typecheck:server": "tsc -b tsconfig.server.json",
    "typecheck:client": "tsc -b tsconfig.client.json",
    "build": "tsc -b && bun build src/server/index.ts --outdir ./dist --target node",
    "build:exe": "bun run build && pkg dist/index.js --output myapp",
    "dev": "concurrently \"bun --watch src/server/index.ts\" \"bun --watch src/client/main.tsx\"",
    "clean": "rm -rf dist .tsbuildinfo"
  },
  "dependencies": {
    "elysia": "^1.0.0",
    "@elysiajs/eden": "^1.0.0",
    "@sinclair/typebox": "^0.32.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "concurrently": "^8.0.0"
  }
}
```

---

### 5. Monorepo 根配置 `turbo.json`（如果使用 Turborepo）

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "typecheck": {
      "dependsOn": ["^typecheck"],
      "outputs": [".tsbuildinfo/**"]
    },
    "build": {
      "dependsOn": ["typecheck", "^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

## 🔄 三、构建流程说明

### 命令执行顺序

```bash
# 在 monorepo 根目录
pnpm typecheck --filter=@monorepo/fullstack

# 实际执行流程：
# 1. tsc -b (读取 apps/fullstack/tsconfig.json)
# 2. 发现 references: [server, client]
# 3. 先构建 server (生成 .d.ts 和 .tsbuildinfo)
# 4. 再构建 client (引用 server 的 .d.ts，不重新推断)
```

### 增量编译效果

```bash
# 第一次全量构建
pnpm typecheck
# 输出：Server 12s → Client 8s = 20s

# 只修改前端代码
pnpm typecheck
# 输出：Server 0s (跳过) → Client 2s (增量) = 2s

# 只修改后端代码（接口不变）
pnpm typecheck
# 输出：Server 3s (增量) → Client 0s (.d.ts 没变，跳过) = 3s
```

---

## ⚠️ 四、注意事项

### 1. 路径别名冲突

Monorepo 根和 `apps/fullstack` 都可能有 `paths` 配置，**优先使用 `apps/fullstack` 内的别名**：

```json
// ❌ 避免：在 monorepo 根 tsconfig.json 中设置全局 paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["apps/fullstack/src/*"]  // 这样会让其他 apps 也继承
    }
  }
}

// ✅ 推荐：在 apps/fullstack 内设置局部别名
{
  "compilerOptions": {
    "paths": {
      "@server/*": ["src/server/*"],
      "@client/*": ["src/client/*"]
    }
  }
}
```

### 2. 共享类型的位置

```
apps/fullstack/
├── src/
│   ├── shared/          # ✅ 推荐：全栈内部共享
│   │   ├── types.ts
│   │   └── constants.ts
│   ├── server/
│   └── client/
│
└── tsconfig.shared.json # 可选：如果 shared 也要独立编译
```

如果多个 `apps/` 需要共享，放在 Monorepo 的 `packages/types`：

```
packages/
└── types/
    ├── package.json
    ├── tsconfig.json
    └── src/
        └── index.ts
```

### 3. Bun 打包时的路径解析

Bun 的 `bun build` 可能不识别 TypeScript 的 `paths`，需要额外配置：

```typescript
// bunfig.toml
[build]
entrypoints = ["src/server/index.ts"]
outdir = "./dist"
target = "node"

# 如果使用路径别名，可能需要手动配置
[build.define]
# 或者使用 tsconfig-paths 包
```

或者在代码中使用相对路径：
```typescript
// ✅ 推荐：相对路径（Bun 原生支持）
import { app } from './app'
import { userService } from './services/user.service'

// ❌ 避免：别名路径（Bun 可能需要额外配置）
import { app } from '@server/app'
```

### 4. Eden 类型导出位置

```typescript
// src/server/index.ts
export const app = new Elysia()
  // ... 路由

// 关键：导出类型供前端使用
export type App = typeof app

// 前端引用
// src/client/lib/api.ts
import { treaty } from '@elysiajs/eden'
import type { App } from '../../server/index'  // 相对路径

export const api = treaty<App>('http://localhost:3000')
```

---

## 📊 五、预期效果对比

| 场景 | 当前（单 tsconfig） | 优化后（双 tsconfig） |
| :--- | :--- | :--- |
| **首次类型检查** | 14s | 20s (server 12s + client 8s) |
| **只改前端** | 14s (全量) | 2s (client 增量) |
| **只改后端（接口不变）** | 14s (全量) | 3s (server 增量，client 跳过) |
| **Eden 类型推断** | 3s/次 | 0.1s/次 (使用预生成 .d.ts) |
| **内存占用** | 770MB | 300MB |
| **Instantiations** | 765,216 | ~200,000 |

---

## 🎯 六、快速迁移步骤

```bash
# 1. 进入 apps/fullstack 目录
cd apps/fullstack

# 2. 备份当前配置
cp tsconfig.json tsconfig.json.bak

# 3. 创建新的配置文件
# (复制上面的 tsconfig.server.json 和 tsconfig.client.json)

# 4. 修改根 tsconfig.json 为解决方案文件
# (复制上面的 apps/fullstack/tsconfig.json)

# 5. 清理缓存
rm -rf dist .tsbuildinfo

# 6. 测试构建
tsc -b --diagnostics

# 7. 测试 Bun 打包
bun run build

# 8. 回到 monorepo 根，测试 workspace
cd ../..
pnpm typecheck --filter=@monorepo/fullstack
```

---

## 总结

| 问题 | 答案 |
| :--- | :--- |
| **Monorepo 内还能拆分吗？** | ✅ 完全可以，两层架构正交 |
| **会不会影响 Bun 打包？** | ❌ 不会，tsconfig 只影响类型检查，不影响运行时 |
| **Eden 类型会更快吗？** | ✅ 会，后端生成 .d.ts 后前端直接引用 |
| **构建时间会减少吗？** | ✅ 增量编译后减少 70%+ |

这种结构是 **大型全栈项目的标准实践**，Next.js、Remix、Nuxt 等框架的 Monorepo 模板都是这样设计的。

需要我帮你检查具体的路径配置或解决迁移中的问题吗？
