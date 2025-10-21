# Drizzle + Zod 类型系统设计规范

## 概述

本文档详细说明了基于 Drizzle ORM + Zod 的四层类型系统架构，确保前后端类型安全与一致性。这是 Elysia 全栈开发的核心基础设施。

## 四层架构概览

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

## 第1层：Drizzle 表定义层

### 文件结构
```
src/db/schema/
├── index.ts             # 统一导出
├── users.schema.ts      # 用户表定义
├── products.schema.ts   # 商品表定义
└── utils.schema.ts      # 公共工具Schema
```

### 表定义标准模板

#### users.schema.ts
```typescript
import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  text,
  integer
} from "drizzle-orm/pg-core";

/**
 * 用户表 - 存储用户基本信息
 * 包含用户认证、个人资料等核心字段
 */
export const usersTable = pgTable("users", {
  // 主键
  id: serial("id").primaryKey(),

  // 基本信息
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),

  // 个人资料
  firstName: varchar("first_name", { length: 50 }).default(""),
  lastName: varchar("last_name", { length: 50 }).default(""),
  avatar: varchar("avatar", { length: 500 }).default(""),
  bio: text("bio").default(""),

  // 状态字段
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),

  // 时间戳
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * 用户关系定义
 */
export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
  comments: many(commentsTable),
  orders: many(ordersTable),
}));
```

#### 表定义规范

1. **字段命名**: 使用 snake_case (如 `first_name`)
2. **表命名**: 使用复数形式 (如 `users`)
3. **主键**: 统一使用自增 `id`
4. **时间戳**: 必须包含 `createdAt` 和 `updatedAt`
5. **外键**: 明确定义引用关系
6. **注释**: 每个表和重要字段都要有注释

## 第2层：Zod Schema 层

### 基础Schema生成

#### users.zod.ts
```typescript
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from "zod";
import { usersTable } from "./users.schema";
import { BaseQueryZod } from "./utils.schema";

// === 基础 Zod Schema（基于 Drizzle 表生成） ===
export const InsertUserSchema = createInsertSchema(usersTable, {
  email: z.string().email("请输入有效的邮箱地址"),
  username: z.string()
    .min(2, "用户名至少2个字符")
    .max(50, "用户名最多50个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
  password: z.string()
    .min(8, "密码至少8个字符")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "密码必须包含大小写字母和数字"),
});

export const SelectUserSchema = createSelectSchema(usersTable);
export const UpdateUserSchema = createUpdateSchema(usersTable);

// === 业务 DTO Schemas ===

// 创建用户Schema（排除系统生成的字段）
export const CreateUserSchema = InsertUserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isVerified: true, // 创建时不设置验证状态
});

// 更新用户Schema（部分更新，排除只读字段）
export const PatchUserSchema = UpdateUserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

// 用户登录Schema
export const LoginUserSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "密码不能为空"),
});

// 修改密码Schema
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "当前密码不能为空"),
  newPassword: z.string()
    .min(8, "新密码至少8个字符")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "新密码必须包含大小写字母和数字"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

// === 查询 Schemas ===
export const UserListQuerySchema = BaseQueryZod.extend({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

// === TypeScript 类型定义 ===
export type InsertUserInput = z.infer<typeof InsertUserSchema>;
export type SelectUserInput = z.infer<typeof SelectUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type PatchUserInput = z.infer<typeof PatchUserSchema>;
export type LoginUserInput = z.infer<typeof LoginUserSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type UserListQueryInput = z.infer<typeof UserListQuerySchema>;
```

### 工具Schema定义

#### utils.schema.ts
```typescript
import { z } from "zod";

// 基础分页查询参数
export const BaseQueryZod = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

// 排序参数
export const SortQueryZod = z.object({
  sort: z.string(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

// ID参数
export const IdParamZod = z.object({
  id: z.number().positive("ID必须是正数"),
});

// 搜索参数
export const SearchQueryZod = z.object({
  search: z.string().optional(),
});

// 批量操作参数
export const BatchOperationZod = z.object({
  ids: z.array(z.number().positive()).min(1, "至少选择一个项目"),
});

// 分页响应格式
export const PaginationResponseZod = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    meta: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
  });
```

## 第3层：业务模型层

### Elysia模型定义

#### users.model.ts
```typescript
import { t } from "elysia";
import { z } from "zod";
import {
  CreateUserSchema,
  PatchUserSchema,
  LoginUserSchema,
  ChangePasswordSchema,
  UserListQuerySchema,
  SelectUserSchema
} from "./users.zod";
import { BaseQueryZod, IdParamZod } from "./utils.schema";

/**
 * 用户模型 - 供Elysia使用的类型定义
 * 统一管理所有用户相关的API类型
 */
export const UsersModel = {
  // === 请求模型 ===
  CreateUser: t.Object({
    username: t.String({ minLength: 2, maxLength: 50 }),
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 8 }),
    firstName: t.Optional(t.String({ maxLength: 50 })),
    lastName: t.Optional(t.String({ maxLength: 50 })),
  }),

  PatchUser: t.Partial(t.Object({
    username: t.String({ minLength: 2, maxLength: 50 }),
    email: t.String({ format: "email" }),
    firstName: t.String({ maxLength: 50 }),
    lastName: t.String({ maxLength: 50 }),
    bio: t.String(),
    isActive: t.Boolean(),
  })),

  LoginUser: t.Object({
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 1 }),
  }),

  ChangePassword: t.Object({
    currentPassword: t.String({ minLength: 1 }),
    newPassword: t.String({ minLength: 8 }),
    confirmPassword: t.String({ minLength: 8 }),
  }),

  // === 查询模型 ===
  UserListQuery: t.Object({
    page: t.Optional(t.Number({ minimum: 1, default: 1 })),
    limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 10 })),
    search: t.Optional(t.String()),
    isActive: t.Optional(t.Boolean()),
    isVerified: t.Optional(t.Boolean()),
    sort: t.Optional(t.String({ default: "createdAt" })),
    order: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")], { default: "desc" })),
  }),

  // === 响应模型 ===
  UserResponse: t.Object({
    id: t.Number(),
    username: t.String(),
    email: t.String(),
    firstName: t.String(),
    lastName: t.String(),
    avatar: t.String(),
    bio: t.String(),
    isActive: t.Boolean(),
    isVerified: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  }),

  // 安全响应（排除敏感信息）
  SafeUserResponse: t.Omit(
    t.Composite([
      t.Object({
        id: t.Number(),
        username: t.String(),
        email: t.String(),
        firstName: t.String(),
        lastName: t.String(),
        avatar: t.String(),
        bio: t.String(),
        isActive: t.Boolean(),
        isVerified: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      })
    ]),
    ["password"]
  ),

  // 参数模型
  IdParam: t.Object({ id: t.Number() }),
};

// === TypeScript 类型导出 ===
export type CreateUserDto = typeof UsersModel.CreateUser.static;
export type PatchUserDto = typeof UsersModel.PatchUser.static;
export type LoginUserDto = typeof UsersModel.LoginUser.static;
export type ChangePasswordDto = typeof UsersModel.ChangePasswordDto;
export type UserListQueryDto = typeof UsersModel.UserListQuery.static;
export type UserResponseDto = typeof UsersModel.UserResponse.static;
export type SafeUserResponseDto = typeof UsersModel.SafeUserResponse.static;
export type IdParamDto = typeof UsersModel.IdParam.static;
```

## 第4层：TypeScript 类型层

### 前端类型定义

#### users.types.ts
```typescript
import { z } from "zod";
import {
  CreateUserSchema,
  PatchUserSchema,
  UserListQuerySchema,
  SelectUserSchema
} from "./users.zod";

// === 业务类型定义 ===

// 创建用户输入类型
export type CreateUserData = z.infer<typeof CreateUserSchema>;

// 更新用户输入类型
export type UpdateUserData = z.infer<typeof PatchUserSchema>;

// 用户查询参数类型
export type UserQueryParams = z.infer<typeof UserListQuerySchema>;

// 数据库实体类型
export type UserEntity = z.infer<typeof SelectUserSchema>;

// === 前端展示类型（VO - View Object） ===

// 用户列表展示类型
export interface UserListItemVo {
  id: number;
  username: string;
  email: string;
  fullName: string; // 组合字段
  avatar: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string; // 格式化时间
}

// 用户详情展示类型
export interface UserDetailVo extends UserListItemVo {
  bio: string;
  lastLoginAt?: string;
  roles: UserRoleVo[];
}

// 用户角色信息
export interface UserRoleVo {
  id: number;
  name: string;
  permissions: string[];
}

// === 表单类型 ===

// 用户注册表单
export interface UserRegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  agreeToTerms: boolean;
}

// 用户编辑表单
export interface UserEditForm {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: File;
}

// === 状态管理类型 ===

// 用户状态
export interface UserState {
  currentUser: UserDetailVo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 用户列表状态
export interface UserListState {
  users: UserListItemVo[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: UserQueryParams;
  isLoading: boolean;
  error: string | null;
}

// === API 响应类型 ===

// 用户API响应
export interface UserApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// 用户列表API响应
export interface UserListApiResponse {
  success: boolean;
  data: {
    items: UserListItemVo[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
```

## 统一类型转换层

### database.types.ts
```typescript
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import * as schema from './schema';

// === 第一步：分别定义所有基础 schemas ===
const userInsertSchema = createInsertSchema(schema.usersTable);
const productInsertSchema = createInsertSchema(schema.productsTable);
const orderInsertSchema = createInsertSchema(schema.ordersTable);

const userSelectSchema = createSelectSchema(schema.usersTable);
const productSelectSchema = createSelectSchema(schema.productsTable);
const orderSelectSchema = createSelectSchema(schema.ordersTable);

// === 第二步：分别定义所有 select schemas ===
const insertSchemas = {
  usersTable: userInsertSchema,
  productsTable: productInsertSchema,
  ordersTable: orderInsertSchema,
};

const selectSchemas = {
  usersTable: userSelectSchema,
  productsTable: productSelectSchema,
  ordersTable: orderSelectSchema,
};

// === 第三步：创建最终的 DbType 对象 ===
export const DbType = {
  typebox: {
    insert: insertSchemas,
    select: selectSchemas,
  },
  // 可选：添加其他转换逻辑
  zod: {
    insert: insertSchemas,
    select: selectSchemas,
  }
} as const;

// === 导出类型 ===
export type DbType = typeof DbType;
```

## 命名规范总结

| 层级 | 用途 | 命名格式 | 示例 |
|------|------|----------|------|
| **表定义** | Drizzle表 | `xxxTable` | `usersTable` |
| **Zod Schema** | 基础校验 | `XxxSchema` | `InsertUserSchema` |
| **业务Schema** | 业务校验 | `XxxSchema` | `CreateUserSchema` |
| **Elysia模型** | API类型 | `XxxModel` | `UsersModel` |
| **DTO类型** | 数据传输 | `XxxDto` | `CreateUserDto` |
| **VO类型** | 展示对象 | `XxxVo` | `UserListItemVo` |
| **实体类型** | 数据实体 | `XxxEntity` | `UserEntity` |

## 最佳实践

### 1. 类型复用原则
```typescript
// ✅ 正确：基于Drizzle Schema复用
export const CreateUserSchema = InsertUserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ❌ 错误：重复定义类型
export const CreateUserSchema = z.object({
  username: z.string(), // 重复定义
  email: z.string().email(), // 重复定义
});
```

### 2. 渐进式类型定义
```typescript
// 1. 基础Schema（自动生成）
const InsertUserSchema = createInsertSchema(usersTable);

// 2. 业务Schema（基于基础Schema）
const CreateUserSchema = InsertUserSchema.omit({...});

// 3. Elysia模型（基于业务Schema）
export const UsersModel = {
  CreateUser: t.Object({
    username: t.String({ minLength: 2 }),
    email: t.String({ format: "email" }),
    // ...
  }),
};

// 4. TypeScript类型（基于模型）
export type CreateUserDto = typeof UsersModel.CreateUser.static;
```

### 3. 安全性考虑
```typescript
// 敏感字段处理
export const SafeUserResponse = t.Omit(UserResponse, ["password"]);

// 输入验证增强
export const CreateUserSchema = InsertUserSchema.omit({...}).extend({
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "密码强度不够"),
});
```

### 4. 前端适配
```typescript
// 前端友好的类型定义
export interface UserListItemVo {
  id: number;
  username: string;
  fullName: string; // 组合字段
  avatar: string;
  createdAt: string; // 格式化为字符串
  isActive: boolean;
}

// 数据转换函数
export function transformUserEntityToVo(entity: UserEntity): UserListItemVo {
  return {
    ...entity,
    fullName: `${entity.firstName} ${entity.lastName}`.trim(),
    createdAt: entity.createdAt.toISOString(),
  };
}
```

## 相关文档

- [Elysia架构基础规范](./01-Elysia架构基础规范.md)
- [Service层设计模式](./04-Service层设计模式.md)
- [Controller层接口设计](./05-Controller层接口设计.md)