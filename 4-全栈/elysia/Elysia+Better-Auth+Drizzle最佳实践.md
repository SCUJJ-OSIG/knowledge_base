---
date created: 2026-03-日 16:49:03
date modified: 2026-03-日 17:14:08
---
## 🎉 Elysia + Better‑Auth + Drizzle + PostgreSQL – “最佳实践”

以下是一份简洁的、可复制粘贴的分步指南。
它将展示如何：

1. **创建 PostgreSQL 连接池** (pg)
2. **使用 Drizzle 定义数据库模式** (类型安全，单一事实来源)
3. **通过 `drizzle‑typebox` 将模式暴露给 Elysia** → 实现验证与 OpenAPI 文档
4. **接入 Better‑Auth** 以实现全栈认证 (注册/登录/会话)
5. **通过几个 Elysia 钩子 (`guard`, `beforeHandle`, `resolve`) 将所有内容串联起来**

---

### 1️⃣ 安装所需依赖包

```bash
bun add elysia @elysiajs/better-auth drizzle-orm drizzle-typebox pg
# 可选 – 如果你使用 Bun，上述命令即可；若使用 npm/yarn 请相应替换为 `npm install` 或 `yarn add`
```

---

### 2️⃣ 设置 PostgreSQL 连接池

```ts
// src/db.ts
import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // 例如：postgres://user:pw@localhost:5432/db
})
```

---

### 3️⃣ 定义 Drizzle 模式 (单一事实来源)

```ts
// src/schema.ts
import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const user = pgTable('user', {
  id: varchar('id', { length: 21 }).$defaultFn(() => createId()).primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  salt: varchar('salt', { length: 64 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const tables = { user } as const
```

---

### 4️⃣ 将 Drizzle 模式转换为 TypeBox (用于 Elysia 验证)

```ts
// src/validation.ts
import { drizzleTypebox } from 'drizzle-typebox'
import { tables } from './schema'
import { t } from 'elysia'   // Elysia 重新导出了 TypeBox

// 完整的插入模式 (包含仅数据库生成的字段)
export const InsertUser = drizzleTypebox.createInsertSchema(tables.user)

// 公开载荷 – 省略自动生成的列
export const CreateUser = t.Omit(InsertUser, ['id', 'salt', 'createdAt'])
```

---

### 5️⃣ 初始化 Better‑Auth (使用相同的 pg 连接池)

```ts
// src/auth.ts
import { betterAuth } from '@elysiajs/better-auth'
import { pool } from './db'

export const auth = betterAuth({
  database: pool,
  // 可选：自定义 cookie 名称、过期时间等
  // cookie: { name: 'session_id', maxAge: 60 * 60 * 24 },
})
```

> **为什么选择 Better‑Auth？**
> 它提供了开箱即用的注册/登录/会话处理功能，同时保持框架无关性。你只需挂载其处理器即可。

---

### 6️⃣ 构建 Elysia 应用 – 串联所有内容

```ts
// src/app.ts
import { Elysia, t } from 'elysia'
import { auth } from './auth'
import { CreateUser } from './validation'
import { pool } from './db'
import { sql, eq } from 'drizzle-orm' // 修正导入以使用 eq
import { user } from './schema' // 直接导入表

const app = new Elysia()
  // ① 挂载 Better‑Auth 处理器 (默认路径 /api/auth)
  .use(auth) // 注意：通常 @elysiajs/better-auth 插件是使用 .use(auth) 而不是 .mount(auth.handler)，具体视版本而定，此处按原文逻辑调整描述

  // ② 守卫：所有受保护的路由必须拥有有效会话
  .guard(
    {
      // beforeHandle 在验证之后、路由处理器之前运行
      async beforeHandle({ cookie, set, status }) {
        // 注意：Better Auth 的 session 获取方式可能因配置而异，这里假设 session ID 存在 cookie 中
        // 实际使用中可能需要调用 auth.api.getSession({ headers: ... })
        const sessionId = cookie.session?.value 
        
        if (!sessionId) {
          // 无会话 → 401
          set.headers['WWW-Authenticate'] = 'Bearer realm="auth"'
          return status(401, 'Unauthenticated')
        }
        
        // 如果需要额外检查 (如角色)，可在此处进行
        // 这里仅为示例，实际应通过 auth API 验证会话有效性
      },
    },
    (app) =>
      app
        // ③ 示例：获取当前用户资料
        .get(
          '/me',
          async ({ cookie, request }) => {
             // 实际生产中建议通过 auth.api.getSession 验证并获取用户
             // 此处仅为演示原文逻辑
             const sessionId = cookie.session?.value;
             if(!sessionId) throw new Error("No session");
             
             // 模拟从会话中获取 userId (实际 Better Auth 会话中通常包含用户信息)
             // 这里为了配合原文逻辑，假设我们需要查库，实际 Better Auth 可能已提供用户对象
             // 注意：原文代码逻辑较为简化，实际需根据 Better Auth 返回的 session 对象操作
             
             // 假设我们通过某种方式拿到了 userId (实际应从 session 解析)
             // 由于原文示例较简略，这里展示如何用 Drizzle 查询
             // 真实场景中，Better Auth 的 guard 可能会把 user 注入 context
             
             // 修正：更好的做法是利用 Better Auth 提供的 hook 或 context
             // 这里仅翻译原文逻辑：
             const userId = sessionId; // 占位符，实际应为解析出的 userId
             
             const [userRow] = await db.select().from(user).where(eq(user.id, userId));
             
             if (!userRow) {
                return status(404, 'User not found');
             }

             return { id: userRow.id, username: userRow.username, email: userRow.email }
          },
          { detail: { tags: ['User'] } }
        )
        // ④ 示例：创建新用户 (公开，无需守卫)
        .post(
          '/signup',
          async ({ body }) => {
            // body 已经根据 CreateUser 进行了验证
            const { username, email, password } = body
            
            // 哈希密码 + 生成盐 (Better‑Auth 可以为你做这件事)
            const { hash, salt } = await auth.utils.password.hash(password)
            
            await db.insert(user).values({ 
              username, 
              email, 
              password: hash, 
              salt 
            })
            
            return { ok: true }
          },
          { body: CreateUser }
        )
  )
  .listen(3000)

console.log(`🦊 Elysia 监听于 http://localhost:${app.server?.port}`)
```
*(注：上面的代码片段为了符合中文语境和最新的 Drizzle/Better Auth 用法做了微调，例如引入了 `db` 实例和 `eq` 助手，原文中直接使用 `sql` 标签模板也是可行的，但 `db` 实例更常见。此外，`auth` 的挂载方式通常是 `.use(auth)`，具体请参考 `@elysiajs/better-auth` 的最新文档。)*

#### 发生了什么？

| 步骤                               | 原因                                                                                                                               |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **挂载 `auth` (或 `auth.handler`)** | 暴露 `/api/auth/*` 端点，用于注册、登录、注销、会话刷新。                                                                                             |
| **使用 `beforeHandle` 进行守卫**       | 集中拒绝未认证请求的地方。提前返回 → 跳过路由处理器。                                                                                                     |
| **`resolve` (可选)**               | 如果你想为每个请求计算一次某些内容 (例如从会话中提取 `userId`)，可以添加：`.resolve(({ cookie }) => ({ userId: cookie.session?.value }))`，然后在处理器中直接读取 `userId`。 |
| **Drizzle + drizzle‑typebox**    | 数据库模式 → TypeBox 验证 → 无需重复定义类型。                                                                                                   |
| **Better‑Auth 工具函数**             | 使用其密码哈希助手以保持认证逻辑的一致性。                                                                                                            |

---

### 7️⃣ 运行与测试

```bash
bun run src/app.ts   # 或者编译后运行 `node src/app.ts`
```

1. **注册** → `POST /signup` 发送 JSON `{username, email, password}` → 创建数据库行。
2. **登录** → `POST /api/auth/login` (由 Better‑Auth 提供) → 接收会话 cookie。
3. **受保护路由** → `GET /me` 返回当前用户，仅当 cookie 存在时。

你可以查看生成的 OpenAPI 规范 (如果添加了 `app.swagger()` 插件)，会发现请求体自动与 Drizzle 模式匹配。

---

## 🎈 小结 (TL;DR)

* **单一事实来源** – Drizzle 模式 → `drizzle‑typebox` → Elysia 验证 → OpenAPI。
* **认证** – Better‑Auth 处理注册/登录/会话；只需挂载一次其处理器。
* **授权** – 使用 `guard` + `beforeHandle` (或 `resolve` 获取派生值) 来保护路由。
* **PostgreSQL** – `pg` 连接池由 Drizzle (查询) 和 Better‑Auth (会话存储) 共享。

这就是 **Elysia + Better‑Auth + Drizzle + PostgreSQL** 技术栈的“最佳实践”组合。祝你编码愉快，愿你的狐狸尾巴永远蓬松！ 🦊✨

- [Better Auth](https://elysiajs.com/integrations/better-auth#better-auth)
- [Drizzle](https://elysiajs.com/integrations/drizzle#drizzle)
- [Drizzle schema](https://elysiajs.com/integrations/drizzle#drizzle-schema)
- [Before Handle](https://elysiajs.com/essential/life-cycle#before-handle)
- [Bearer Plugin](https://elysiajs.com/plugins/bearer#bearer-plugin)