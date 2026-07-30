---
date created: '2026-03-日 16:44:28'
date modified: '2026-03-日 16:44:38'
tags:
  - 全栈
  - elysia
---
## 

下面是一套最小可运行的示例，帮助你在 **Next.js**（App Router 或 Pages Router 都可以）里把 **Better‑Auth** 挂载到 **Elysia** 实例上，然后让 Next 只负责渲染页面，后端全部交给 Elysia。

---

### 1️⃣ 安装依赖

```bash
npm i elysia better-auth pg   # pg 仅示例，换成你自己的 DB 驱动
```

> `better-auth` 是 **framework‑agnostic**，只要把它的 handler 挂到 Elysia 上就能工作。

---

### 2️⃣ 创建 `auth.ts` – 初始化 Better‑Auth

```ts
// src/auth.ts
import { betterAuth } from 'better-auth'
import { Pool } from 'pg'          // 这里用 PostgreSQL，按需替换

export const auth = betterAuth({
  // 必要的数据库连接
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  // 可选：自定义 API 前缀，默认是 "/api/auth"
  basePath: '/api/auth',
})
```

> `basePath` 决定 **Better‑Auth** 自己生成的路由（如 `/api/auth/login`、`/api/auth/register`）。  
> 只要在后面 **mount** 时再加一个前缀，就可以把路径整合进 Next 的 API 路由。

---

### 3️⃣ 创建 Elysia 实例并挂载 auth handler

```ts
// src/server.ts
import { Elysia } from 'elysia'
import { auth } from './auth'

export const app = new Elysia()
  // 把 Better‑Auth 的 handler 挂到根路径或自定义前缀
  .mount('/auth', auth.handler)   // 最终 URL: /auth/api/auth/…
  .listen(3000)                   // 只在本地开发时需要
```

> - `mount('/auth', auth.handler)` **不会** 再在 URL 前面加 `/api`，因为 `basePath` 已经包含了 `/api/auth`。  
> - 你可以改成 `.mount(auth.handler)`（直接挂根）或任意其他前缀，只要记得 **前缀 + basePath** 共同决定最终路径。

---

### 4️⃣ 在 Next.js 中创建 API 路由，转发请求到 Elysia

#### 4.1 Pages Router（`pages/api/…`）

```ts
// pages/api/auth/[...slug].ts
import { app } from '../../../src/server'   // 引入同一个 Elysia 实例

export default async function handler(req, res) {
  // 让 Elysia 完全接管请求
  await app.handle(req, res)
}
```

> `[...]slug` 捕获所有子路径，例如 `/api/auth/login`、`/api/auth/me` 等，全部交给 Elysia 处理。

#### 4.2 App Router（`app/api/…/route.ts`）

```ts
// app/api/auth/[...slug]/route.ts
import { app } from '@/src/server'

export async function GET(request: Request) {
  return app.handle(request)
}
export async function POST(request: Request) {
  return app.handle(request)
}
```

> 同理，`GET/POST/PUT/DELETE` 都可以直接转发。

---

### 5️⃣ 前端调用示例（Next 页面或组件）

```tsx
// pages/login.tsx
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    console.log(data)
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  )
}
```

> 请求会被 Next 的 API 路由捕获，然后交给 Elysia → Better‑Auth 处理，返回 JSON。

---

### 6️⃣ 常见坑 & 小技巧

| 场景 | 解决办法 |
|------|----------|
| **路径冲突**：`/api/auth` 已被 Next 使用 | 给 Elysia 挂载一个独立前缀（如 `/auth`），或把 Better‑Auth `basePath` 改成 `/auth/api`。 |
| **SSR 中获取会话** | 在 `getServerSideProps`/`getInitialProps` 中直接 `fetch('/api/auth/me')`，或在 `app/router` 中使用 `await app.handle(request)` 获取 `request.user`. |
| **部署时端口** | 本地 `listen(3000)` 只在开发时需要；部署到 Vercel 时直接导出 `handler`，Vercel 会自行监听。 |
| **自定义中间件（如日志）** | 在 `new Elysia()` 前 `.use(logMiddleware)`，或在 `guard` 中加入 `beforeHandle` 检查 token。 |

---

### 7️⃣ 完整项目结构（示例）

```
my-next-app/
│
├─ src/
│   ├─ auth.ts          ← Better‑Auth 初始化
│   └─ server.ts        ← Elysia 实例 + mount
│
├─ pages/
│   ├─ api/
│   │   └─ auth/
│   │       └─ [...slug].ts   ← 转发到 Elysia
│   └─ login.tsx
│
└─ next.config.js
```

---

## 小结

1. **初始化 Better‑Auth**（`betterAuth({...})`）并导出 `auth.handler`。  
2. **在 Elysia** 上 `mount` 这个 handler，决定最终 URL 前缀。  
3. **在 Next** 的 API 路由里把请求 **转发** 给同一个 Elysia 实例。  
4. 前端像普通 REST 调用一样使用 `/api/auth/*`，全部由 Better‑Auth 完成身份验证、授权、会话管理。

这样，你就拥有了 **Next.js** + **Elysia** + **Better‑Auth** 的完整全栈方案啦 🎉✨  
有什么细节想进一步了解，随时告诉我！

- [Better Auth](https://elysiajs.com/integrations/better-auth#better-auth)
- [Before Handle](https://elysiajs.com/essential/life-cycle#before-handle)
