---
tags:
  - 全栈
  - 技术/全栈/elysia
  - 技术/软件架构/规范
title: Elysia 代码编写规范
date created: '2026-07-31'
date modified: '2026-07-31'
---
# Elysia 代码编写规范

## 概述

本文档定义了 Elysia.js 项目的详细代码编写规范，包括命名约定、代码风格、函数规范、错误处理等，确保团队代码风格统一性和质量。

## 命名规范

### 1. 基础命名规则

| 类型 | 命名风格 | 示例 | 说明 |
|------|----------|------|------|
| **变量** | camelCase | `userName`, `productList` | 普通变量和常量 |
| **常量** | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRIES` | 不可变常量 |
| **函数** | camelCase | `getUserData`, `createProduct` | 函数和方法 |
| **类** | PascalCase | `UserService`, `ProductController` | 类和构造函数 |
| **接口** | PascalCase | `UserData`, `ProductConfig` | TypeScript接口 |
| **类型** | PascalCase | `UserDto`, `ProductVo` | TypeScript类型别名 |
| **枚举** | PascalCase | `UserStatus`, `ProductType` | 枚举类型 |
| **文件** | kebab-case | `user-service.ts`, `product.controller.ts` | 文件名 |

### 2. 数据库相关命名

```typescript
// ✅ 正确：数据库表定义
export const usersTable = pgTable('users', { ... });        // 表名 + Table后缀
export const productsTable = pgTable('products', { ... });  // 复数形式

// ✅ 正确：关系定义
export const usersRelations = relations(usersTable, ({ many }) => ({ ... })); // xxxRelations

// ✅ 正确：Schema命名
export const insertUserSchema = createInsertSchema(usersTable);  // insert + Entity + Schema
export const selectUserSchema = createSelectSchema(usersTable);  // select + Entity + Schema
export const updateUserSchema = createUpdateSchema(usersTable);  // update + Entity + Schema

// ✅ 正确：业务模型命名
export const usersModel = {                                  // xxxModel（驼峰）
  insertUserDto: insertUserSchema.omit({ ... }),
  selectUserTable: selectUserSchema,
};

// ✅ 正确：TypeScript类型命名
export type InsertUserDto = z.infer<typeof usersModel.insertUserDto>;  // Dto后缀，大驼峰
export type SelectUserVo = z.infer<typeof usersModel.selectUserTable>;  // Vo后缀，大驼峰
export type UserWithPostsVo = { ... };                                // 复合类型，大驼峰
```

### 3. API和路由命名

```typescript
// ✅ 正确：Controller导出
export const userController = new Elysia({ prefix: '/users' });      // xxxController
export const productController = new Elysia({ prefix: '/products' });  // 复数形式

// ✅ 正确：Service类命名
export class UserService { }     // XxxService
export class ProductService { }  // XxxService

// ✅ 正确：方法命名
class UserService {
  async createUser() { }      // 创建
  async getUserList() { }     // 列表查询
  async getUserById() { }     // 单个查询
  async updateUser() { }      // 更新
  async deleteUser() { }      // 删除
  async searchUsers() { }     // 搜索
}
```

### 4. 错误和枚举命名

```typescript
// ✅ 正确：错误类命名
export class NotFoundError extends Error { }      // 具体错误 + Error
export class ValidationError extends Error { }     // 验证错误
export class DatabaseError extends Error { }       // 数据库错误

// ✅ 正确：枚举命名
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service'
}
```

## 函数规范

### 1. 函数定义风格

```typescript
// ✅ 正确：箭头函数，明确返回值类型
const fetchUser = async (userId: string): Promise<User> => {
  const user = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  return user;
};

// ✅ 正确：类方法，明确参数和返回类型
class UserService {
  async createUser(userData: CreateUserDto): Promise<UserEntity> {
    const [user] = await db.insert(usersTable).values(userData).returning();
    return user;
  }
}

// ❌ 错误：function关键字，无返回值类型
function getUser(id) {  // 缺少类型注解
  // ...
}

// ❌ 错误：参数缺少类型
const fetchUser = async (userId) => {  // 缺少参数类型
  // ...
};
```

### 2. 函数参数规范

```typescript
// ✅ 正确：解构参数，明确类型
const updateUser = async (
  { id, data }: { id: number; data: UpdateUserDto }
): Promise<UserEntity> => {
  const [user] = await db
    .update(usersTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(usersTable.id, id))
    .returning();
  return user;
};

// ✅ 正确：Controller路由处理器
export const userController = new Elysia({ prefix: '/users' })
  .get('/:id', async ({ params: { id }, userService }) => {
    const user = await userService.getUserById(id);
    return commonRes(user);
  });

// ❌ 错误：直接访问参数对象
.get('/:id', async ({ params, userService }) => {
  const user = await userService.getUserById(params.id);  // 应该解构
  return commonRes(user);
});
```

### 3. 函数长度和复杂度

```typescript
// ✅ 正确：函数简洁，职责单一
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const generateUserToken = (user: UserEntity): string => {
  const payload = { userId: user.id, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET!);
};

// ❌ 错误：函数过长，职责混乱
const processUser = async (userData: any) => {
  // 验证数据
  if (!userData.email) throw new Error('Email required');
  if (!userData.username) throw new Error('Username required');

  // 创建用户
  const user = await db.insert(usersTable).values(userData);

  // 发送邮件
  await emailService.sendWelcomeEmail(user.email);

  // 创建日志
  await logService.createUserLog(user.id, 'user_created');

  // 返回结果 - 职责过多，应该拆分
  return user;
};
```

## 错误处理规范

### 1. Service层错误处理

```typescript
// ✅ 正确：Service层抛出具体错误
class UserService {
  async getUserById(id: number): Promise<UserEntity> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);  // ✅ 抛出错误
    }

    return user;  // ✅ 返回具体数据
  }

  async createUser(userData: CreateUserDto): Promise<UserEntity> {
    try {
      const [user] = await db.insert(usersTable).values(userData).returning();
      return user;
    } catch (error) {
      if (error.code === '23505') {  // PostgreSQL唯一约束冲突
        throw new ConflictError('User with this email already exists');
      }
      throw new DatabaseError('Failed to create user');
    }
  }
}

// ❌ 错误：Service层返回null
async getUserById(id: number): Promise<UserEntity | null> {
  const user = await db.select().from(usersTable).where(eq(usersTable.id, id)).get();
  return user || null;  // ❌ 返回 null
}
```

### 2. Controller层错误处理

```typescript
// ✅ 正确：Controller层统一响应格式
export const userController = new Elysia({ prefix: '/users' })
  .get('/:id', async ({ params: { id }, userService }) => {
    try {
      const user = await userService.getUserById(id);
      return commonRes(user);  // ✅ 统一成功响应
    } catch (error) {
      // 全局错误处理器会自动处理
      throw error;
    }
  });

// ✅ 正确：使用全局错误处理
export const errorHandler = new Elysia()
  .error({
    NotFoundError: NotFoundError,
    ValidationError: ValidationError,
    DatabaseError: DatabaseError,
  })
  .onError(({ error, code, set }) => {
    switch (code) {
      case 'NotFoundError':
        set.status = 404;
        return { success: false, error: error.message };
      case 'ValidationError':
        set.status = 400;
        return { success: false, error: error.message };
      case 'DatabaseError':
        set.status = 500;
        return { success: false, error: 'Internal server error' };
      default:
        set.status = 500;
        return { success: false, error: 'Unknown error' };
    }
  });
```

### 3. 自定义错误类

```typescript
// ✅ 正确：自定义错误类层次结构
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
  }
}
```

## API响应规范

### 1. 统一响应格式

```typescript
// ✅ 正确：使用 commonRes 统一响应格式
import { commonRes } from '@/utils/response';

// 成功响应 - 单个数据
return commonRes(user);
// 输出: { success: true, data: user }

// 成功响应 - 分页数据
return commonRes({
  items: users,
  meta: {
    total: 100,
    page: 1,
    limit: 10,
    totalPages: 10
  }
});

// 错误响应（自动处理）
throw new NotFoundError('User not found');
// 输出: { success: false, error: { message: 'User not found' } }
```

### 2. commonRes 工具函数

```typescript
// utils/response.ts
export const commonRes = <T>(data: T, message?: string) => {
  return {
    success: true,
    data,
    message: message || 'Success'
  };
};

export const errorRes = (message: string, statusCode: number = 400) => {
  const error = new Error(message);
  throw error;
};
```

## 代码格式规范

### 1. 导入导出规范

```typescript
// ✅ 正确：导入顺序
// 1. Node.js 内置模块
import { promises as fs } from 'fs';
import path from 'path';

// 2. 第三方库
import { Elysia, t } from 'elysia';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// 3. 项目内部模块（绝对路径）
import { db } from '@/db/connection';
import { usersTable } from '@/db/schema/users.schema';
import { commonRes } from '@/utils/response';

// 4. 相对路径导入
import { UserService } from './user.service';
import { CreateUserSchema } from './user.model';

// ✅ 正确：导出方式
export const userController = new Elysia({ prefix: '/users' });
export class UserService { }
export type CreateUserDto = { /* ... */ };

// 默认导出（仅用于主要功能）
export default userController;
```

### 2. 类型注解规范

```typescript
// ✅ 正确：完整的类型注解
const getUserById = async (id: number): Promise<UserEntity | null> => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  return user || null;
};

const processUsers = (users: UserEntity[]): ProcessedUser[] => {
  return users.map(user => ({
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`,
    isActive: user.isActive
  }));
};

// ✅ 正确：复杂的返回类型可以使用 interface
interface CreateUserResponse {
  user: UserEntity;
  token: string;
  expiresAt: Date;
}

const createUserWithToken = async (userData: CreateUserDto): Promise<CreateUserResponse> => {
  const user = await userService.createUser(userData);
  const token = generateUserToken(user);

  return {
    user,
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24小时后过期
  };
};
```

### 3. 注释规范

```typescript
/**
 * 用户服务类
 * 处理用户相关的所有业务逻辑
 */
export class UserService {
  /**
   * 根据ID获取用户信息
   * @param id 用户ID
   * @returns 用户实体信息
   * @throws {NotFoundError} 当用户不存在时抛出
   *
   * @example
   * ```typescript
   * const user = await userService.getUserById(1);
   * console.log(user.username);
   * ```
   */
  async getUserById(id: number): Promise<UserEntity> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return user;
  }

  /**
   * 创建新用户
   * @param userData 用户创建数据
   * @returns 创建后的用户实体
   */
  async createUser(userData: CreateUserDto): Promise<UserEntity> {
    // TODO: 添加用户创建日志
    const [user] = await db.insert(usersTable).values(userData).returning();
    return user;
  }
}
```

## 安全编码规范

### 1. 输入验证

```typescript
// ✅ 正确：使用Schema验证
export const userController = new Elysia({ prefix: '/users' })
  .post('/', async ({ body, userService }) => {
    const user = await userService.createUser(body);
    return commonRes(user);
  }, {
    body: 'CreateUserDto',  // 使用预定义的类型
    detail: {
      summary: '创建用户',
      tags: ['Users']
    }
  });

// ✅ 正确：参数验证
  .get('/:id', async ({ params: { id }, userService }) => {
    const user = await userService.getUserById(id);
    return commonRes(user);
  }, {
    params: 'IdParam',  // 使用预定义的参数类型
    response: {
      200: 'UserResponse',
      404: 'ErrorResponse'
    }
  });
```

### 2. 敏感信息处理

```typescript
// ✅ 正确：敏感字段处理
export const SafeUserResponse = t.Omit(
  t.Composite([UserResponse]),
  ['password', 'resetToken', 'verificationToken']
);

// ✅ 正确：环境变量使用
const config = {
  jwtSecret: process.env.JWT_SECRET,
  dbUrl: process.env.DATABASE_URL,
  port: parseInt(process.env.PORT || '3000'),
};

// ✅ 正确：密码处理
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

## 性能优化规范

### 1. 数据库查询优化

```typescript
// ✅ 正确：使用 getTableColumns
import { getTableColumns } from "drizzle-orm";
import { usersTable } from "@/db/schema/users.schema";

const { password, resetToken, ...safeColumns } = getTableColumns(usersTable);

const getSafeUser = async (id: number) => {
  const [user] = await db
    .select(safeColumns)
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  return user;
};

// ✅ 正确：分页查询
const getUserList = async (query: UserListQueryDto) => {
  const { page = 1, limit = 10, search } = query;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        like(usersTable.username, `%${search}%`),
        like(usersTable.email, `%${search}%`)
      )
    );
  }

  const [users, [{ total }]] = await Promise.all([
    db.select()
      .from(usersTable)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() })
      .from(usersTable)
      .where(and(...conditions))
  ]);

  return {
    items: users,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};
```

### 2. 异步操作优化

```typescript
// ✅ 正确：并行执行异步操作
const getUserWithOrders = async (userId: number) => {
  const [user, orders, profile] = await Promise.all([
    userService.getUserById(userId),
    orderService.getUserOrders(userId),
    profileService.getUserProfile(userId)
  ]);

  return { user, orders, profile };
};

// ✅ 正确：缓存机制
const getUserByIdWithCache = async (id: number): Promise<UserEntity> => {
  const cacheKey = `user:${id}`;

  // 尝试从缓存获取
  let user = await cache.get(cacheKey);

  if (!user) {
    user = await userService.getUserById(id);
    // 缓存5分钟
    await cache.set(cacheKey, user, { ttl: 300 });
  }

  return user;
};
```

## 相关文档

- [Elysia架构基础规范](./01-Elysia架构基础规范.md)
- [Drizzle + Zod类型系统设计](./02-Drizzle-Zod类型系统设计.md)
- [Service层设计模式](./04-Service层设计模式.md)
- [Controller层接口设计](./05-Controller层接口设计.md)
