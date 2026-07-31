---
date created: 2025-11-26T16:06:52.000Z
date modified: '2026-07-31'
tags:
  - 技术/数据库/drizzle
  - 技术/orm/使用指南
title: Drizzle ORM 使用指南
---

# 📊 Drizzle ORM 使用指南

## 📋 概述

Drizzle ORM 是一个 TypeScript 优先的 SQL 工具包，提供了类型安全的数据库操作。本文档介绍在 Elysia 项目中 Drizzle ORM 的最佳实践和使用方法。

## 🚀 核心特性

- **类型安全**：完全的 TypeScript 支持
- **SQL-like 语法**：直观的查询 API
- **性能优化**：支持预编译语句和连接池
- **数据库无关**：支持 PostgreSQL、MySQL、SQLite

## 🔧 查询方法对比

### 1. 静态查询 (findMany)
适用于简单查询，编译时确定查询逻辑。

```typescript
// ✅ 简单查询使用静态方法
const users = await db.select().from(usersTable).limit(10)

// 带条件的简单查询
const activeUsers = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.status, 'active'))
```

### 2. 动态查询 ($dynamic)
适用于复杂查询，运行时构建查询条件。

```typescript
// ✅ 复杂查询使用动态方法
async getList(params: SiteConfigModel["ListQuery"]) {
  const { page = 1, limit = 10, sort = "createdAt", sortOrder = "desc", search, category, key } = params

  // 构建查询条件
  const conditions = []

  // 处理搜索条件
  if (search) {
    conditions.push(
      or(
        like(siteConfigTable.key, `%${search}%`),
        like(siteConfigTable.description, `%${search}%`)
      )
    )
  }

  // 处理分类过滤
  if (category) {
    conditions.push(eq(siteConfigTable.category, category))
  }

  // 处理键名过滤
  if (key) {
    conditions.push(like(siteConfigTable.key, `%${key}%`))
  }

  // 安全地处理排序字段（防止注入或无效字段）
  const validSortKeys = ["id", "key", "category", "createdAt", "updatedAt"] as const
  type SortKey = (typeof validSortKeys)[number]

  const safeSort = (
    validSortKeys.includes(sort as any) ? sort : "createdAt"
  ) as SortKey

  // 构建动态查询
  let query = db
    .select()
    .from(siteConfigTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .$dynamic()

  // 应用分页和排序
  query = withPagination(query, page, limit)
  query = withSorting(query, siteConfigTable[safeSort], sortOrder)

  // 执行查询
  const [data, totalResult] = await Promise.all([
    query,
    db
      .select({ count: count() })
      .from(siteConfigTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined),
  ])

  const total = totalResult[0]?.count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    items: data,
    meta: { page, limit, total, totalPages },
  }
}
```

## 🛠️ 辅助函数封装

### 分页函数

```typescript
// src/utils/pagination.ts
export function withPagination<T>(query: T, page: number, limit: number) {
  const offset = (page - 1) * limit
  return query.limit(limit).offset(offset) as T
}
```

### 排序函数

```typescript
// src/utils/sorting.ts
export function withSorting<T>(query: T, column: any, order: 'asc' | 'desc') {
  return order === 'desc'
    ? query.orderBy(desc(column)) as T
    : query.orderBy(asc(column)) as T
}
```

### 条件构建器

```typescript
// src/utils/conditions.ts
export function buildConditions(conditions: any[]) {
  return conditions.length > 0 ? and(...conditions) : undefined
}

export function addSearchCondition(conditions: any[], fields: any[], search: string) {
  if (search && fields.length > 0) {
    const searchConditions = fields.map(field => like(field, `%${search}%`))
    conditions.push(or(...searchConditions))
  }
}
```

## 📝 最佳实践

### 1. 查询优化

```typescript
// ✅ 使用 select 指定字段，减少数据传输
const users = await db
  .select({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
  })
  .from(usersTable)

// ✅ 使用关系查询代替多次查询
const userWithPosts = await db.query.usersTable.findFirst({
  where: eq(usersTable.id, userId),
  with: {
    posts: {
      where: eq(postsTable.published, true),
      orderBy: desc(postsTable.createdAt),
      limit: 10,
    },
  },
})
```

### 2. 事务处理

```typescript
// ✅ 使用事务确保数据一致性
async function createUserWithProfile(userData: UserCreate, profileData: ProfileCreate) {
  return await db.transaction(async (tx) => {
    const user = await tx.insert(usersTable).values(userData).returning()
    const profile = await tx.insert(profilesTable).values({
      ...profileData,
      userId: user[0].id,
    }).returning()

    return { user: user[0], profile: profile[0] }
  })
}
```

### 3. 批量操作

```typescript
// ✅ 批量插入优化
async function createMultipleUsers(users: UserCreate[]) {
  return await db.insert(usersTable).values(users).returning()
}

// ✅ 批量更新
async function updateMultipleUsers(updates: { id: number; data: UserUpdate }[]) {
  const results = await Promise.all(
    updates.map(({ id, data }) =>
      db.update(usersTable).set(data).where(eq(usersTable.id, id)).returning()
    )
  )
  return results.flat()
}

// ✅ 批量删除（接受数组参数）
async function deleteMultipleUsers(ids: number[]) {
  if (ids.length === 0) return { deletedCount: 0 }

  const result = await db
    .delete(usersTable)
    .where(inArray(usersTable.id, ids))

  return { deletedCount: ids.length }
}
```

## 🔍 类型安全的查询构建

### 使用 Drizzle Zod 集成

```typescript
import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

// 创建 Zod Schema
const UserInsertSchema = createInsertSchema(usersTable)
const UserSelectSchema = createSelectSchema(usersTable)

// 类型推断
type UserInsert = z.infer<typeof UserInsertSchema>
type UserSelect = z.infer<typeof UserSelectSchema>

// 在 Elysia 中使用
app.post('/users', ({ body }) => {
  const userData = UserInsertSchema.parse(body)
  return createUser(userData)
}, {
  body: UserInsertSchema,
  response: {
    200: UserSelectSchema,
  }
})
```

## 📊 性能监控

### 查询性能分析

```typescript
// 添加查询日志
import { logger } from './utils/logger'

export function withQueryLogging<T>(query: T, operation: string): T {
  const start = performance.now()

  // 添加查询钩子（如果 Drizzle 支持）
  return query
}

// 执行后记录
const result = await query
const duration = performance.now() - start
logger.info(`${operation} executed in ${duration.toFixed(2)}ms`)
```

## 🚨 常见陷阱

### 1. N+1 查询问题

```typescript
// ❌ 错误：会导致 N+1 查询
const users = await db.select().from(usersTable)
for (const user of users) {
  const posts = await db.select().from(postsTable).where(eq(postsTable.userId, user.id))
  user.posts = posts
}

// ✅ 正确：使用关系查询
const usersWithPosts = await db.query.usersTable.findMany({
  with: {
    posts: true,
  },
})
```

### 2. 忘记处理空值

```typescript
// ❌ 可能导致运行时错误
const userName = user.name.toUpperCase()

// ✅ 安全处理
const userName = user.name?.toUpperCase() ?? ''
```

### 3. 排序字段注入

```typescript
// ❌ 危险：可能被注入
const query = db.select().from(usersTable).orderBy(raw(`${sort} ${sortOrder}`))

// ✅ 安全：使用白名单
const validSorts = { name: usersTable.name, email: usersTable.email }
const sortColumn = validSorts[sort] || usersTable.createdAt
const query = db.select().from(usersTable).orderBy(
  sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn)
)
```

## 📚 进阶用法

### 1. 自定义 SQL 函数

```typescript
// 创建自定义 SQL 函数
const fullTextSearch = pgFunction('full_text_search', {
  returns: tsvector,
  args: [text],
})

// 使用自定义函数
const results = await db
  .select()
  .from(postsTable)
  .where(
    fullTextSearch(postsTable.content).matches(searchQuery)
  )
```

### 2. 窗口函数

```typescript
// 使用窗口函数进行分页查询优化
const rankedResults = await db
  .select({
    id: postsTable.id,
    title: postsTable.title,
    rank: sql<number>`row_number() over (order by ${postsTable.createdAt} desc)`.as('rank'),
  })
  .from(postsTable)
  .where(
    sql`row_number() over (order by ${postsTable.createdAt} desc) between ${offset} and ${offset + limit}`
  )
```

### 3. CTE (Common Table Expressions)

```typescript
// 使用 CTE 进行复杂查询
const recursiveCategories = await db
  .withRecursive(
    'category_tree',
    db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        parentId: categoriesTable.parentId,
        level: sql<number>`1`.as('level'),
      })
      .from(categoriesTable)
      .where(eq(categoriesTable.parentId, null)),
    db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        parentId: categoriesTable.parentId,
        level: sql<number>`category_tree.level + 1`.as('level'),
      })
      .from(categoriesTable)
      .innerJoin(category_tree, eq(categoriesTable.parentId, category_tree.id))
  )
  .select()
  .from(category_tree)
  .orderBy(category_tree.level)
```

## 📖 相关文档

- [Drizzle ORM 官方文档](https://orm.drizzle.team/)
- [Drizzle 类型系统](https://orm.drizzle.team/docs/goodies#drizzle-zod)
- [Elysia 集成指南](../01-Elysia架构基础规范.md)

## 💡 总结

- 静态查询适用于简单场景，动态查询适用于复杂条件
- 始终使用类型安全的查询构建方式
- 合理使用关系查询避免 N+1 问题
- 批量操作要接受数组参数
- 事务处理确保数据一致性
