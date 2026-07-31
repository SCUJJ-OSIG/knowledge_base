---
tags:
  - 全栈
  - 技术/全栈/elysia
  - 技术/全栈/nextjs
  - 技术/全栈/eden
title: Next 与 Eden 集成
date created: '2026-07-31'
date modified: '2026-07-31'
---


### 1️⃣ 是 **SSR 还是 CSR**？

| 场景 | 说明 |
|------|------|
| **Eden Treaty / Eden Fetch** 作为 **Typed client** | 只负责 **发送 HTTP 请求**（`fetch`‑style）。它本身不做渲染。渲染由 **Next** 决定。 |
| **在 Next.js 的 API Route / App Router** 中挂载 **Elysia**（`app.fetch`） | 这相当于把 Elysia 当成 **后端 API**。当页面在 **服务器端**（`getServerSideProps`、`app/router` 的 Server Component）调用 Eden 时，**请求在服务器上执行** → **SSR**。<br>如果在浏览器的 React 组件里直接调用 Eden，则是 **CSR**。 |
| **组合使用** | 你可以在同一个项目里两种方式并存：<br>• 在 `getServerSideProps`（或 Server Component）里用 Eden → **SSR**。<br>• 在普通 React 客户端组件里用 Eden → **CSR**。 |

> **简言之**：Eden 本身既不是 SSR 也不是 CSR，渲染方式取决于你 **在哪里调用它**。在 Next 的服务器端代码里调用就会产生 SSR；在浏览器里调用就是 CSR。

### 2️⃣ 如何在 Next 中挂载 Elysia 并使用 Eden

```ts
// app/api/[[...slugs]]/route.ts   (Next App Router)
import { Elysia, t } from 'elysia';
import { treaty } from '@elysiajs/eden';

// ---- Elysia server ----
const api = new Elysia({ prefix: '/api' })
  .get('/greet', ({ query }) => `Hi ${query.name}`, {
    query: t.Object({ name: t.String() })
  })
  .post('/user', ({ body }) => body, {
    body: t.Object({ id: t.Number(), name: t.String() })
  });

// Export fetch handlers for each HTTP method
export const GET  = api.fetch;
export const POST = api.fetch;

// ---- Eden client (optional, for reuse in your UI) ----
export const client = treaty<typeof api>('http://localhost:3000/api');
```

- `api.fetch` 把 Elysia 变成普通的 **Next API route**，Next 负责部署与 SSR/CSR。
- `treaty` 生成 **Typed client**，在前端或 `getServerSideProps` 中直接使用。

### 3️⃣ 在 Next 中使用 **query**（URL 参数）

#### a. 在 Elysia 端定义 schema

```ts
// query schema must be an object schema
.query(t.Object({
  page: t.Number(),      // 自动把 "?page=2" 转成 number
  tags: t.Array(t.String()) // 支持 "?tags=a,b,c"（comma‑delimited）或 "?tags=a&tags=b"
}))
.get('/search', ({ query }) => {
  // query: { page: number, tags: string[] }
  return { page: query.page, tags: query.tags };
});
```

#### b. 在前端（Next）调用 Eden

```tsx
// pages/search.tsx  (client component)
import { client } from '@/app/api/[[...slugs]]/route';

export default function Search() {
  const handle = async () => {
    const { data } = await client.search.get({
      // query params go under `query`
      query: { page: 1, tags: ['ts', 'elysia'] }
    });
    console.log(data);
  };

  return <button onClick={handle}>Search</button>;
}
```

#### c. 在 **SSR**（`getServerSideProps`）中调用 Eden

```ts
// pages/search.tsx
import { client } from '@/app/api/[[...slugs]]/route';
import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await client.search.get({
    query: { page: 1, tags: ['ssr', 'next'] }
  });
  return { props: { result: data } };
};

export default function Search({ result }: { result: any }) {
  return <pre>{JSON.stringify(result, null, 2)}</pre>;
}
```

- **关键点**：在 Eden 调用对象里，用 `query: { … }` 传递查询字符串。Elysia 会把它映射到路由处理函数的 `query` 参数，并依据你提供的 `t.Object` schema 自动转换类型。

### 4️⃣ 小结

1. **渲染方式**取决于调用 Eden 的位置：服务器端 → SSR，浏览器端 → CSR。  
2. 在 Next 的 **API Route / App Router** 中导出 `app.fetch`，即可把 Elysia 当作后端 API 使用。  
3. 使用 **Eden Treaty**（typed client）时，`query` 参数通过 `query: { … }` 传递，Elysia 会根据 `t.Object` schema 自动校验并转型。  
4. 同一个项目里可以混合 SSR 与 CSR，享受全栈类型安全与 **Elysia + Eden** 的便利。

> 试试看把上面的代码粘进你的 Next 项目，打开页面就能看到 **SSR** 与 **CSR** 两种调用方式的区别啦！ 🎉

---  
**References**  

- [Integration with Next.js](https://elysiajs.com/integrations/nextjs#integration-with-nextjs)  
- [Eden Treaty – Typed client](https://elysiajs.com/eden/treaty/parameters#fetch-parameters)  
- [Query validation](https://elysiajs.com/essential/validation#query)  

- [When should I use Eden Fetch over Eden Treaty](https://elysiajs.com/eden/fetch#when-should-i-use-eden-fetch-over-eden-treaty)
- [Eden Fetch](https://elysiajs.com/eden/overview#eden-fetch)
- [Fetch parameters](https://elysiajs.com/eden/treaty/parameters#fetch-parameters)
- [Integration with Meta Framework](https://elysiajs.com/tutorial/whats-next#integration-with-meta-framework)
- [Query](https://elysiajs.com/essential/validation#query)
- [Integration with Meta Framework](https://elysiajs.com/table-of-content#integration-with-meta-framework)
- [Integration with Next.js](https://elysiajs.com/integrations/nextjs#integration-with-nextjs)
