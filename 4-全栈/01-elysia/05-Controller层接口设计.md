---
tags:
  - 全栈
  - elysia
---
# Controller层接口设计规范

## 概述

本文档定义了 Elysia 项目中 Controller 层的接口设计规范，包括 RESTful API 设计、路由定义、请求处理、响应格式等。Controller 层负责处理 HTTP 请求、参数验证和响应格式化。

## Controller层职责

### 核心职责
- **HTTP请求处理**: 接收和解析HTTP请求
- **参数验证**: 使用 Elysia 的类型系统验证输入
- **业务逻辑调用**: 调用相应的Service方法
- **响应格式化**: 统一响应格式
- **错误处理**: 将业务错误转换为HTTP错误响应
- **API文档**: 自动生成接口文档

### 设计原则
- **RESTful设计**: 遵循REST架构风格
- **单一职责**: 每个Controller专注一个资源
- **统一响应**: 使用commonRes统一响应格式
- **类型安全**: 完整的TypeScript类型支持

## 基础Controller结构

### 1. 标准Controller模板

```typescript
// users.controller.ts
import { Elysia, t } from "elysia";
import { commonRes } from "@/utils/response";
import { UserService } from "./users.service";
import { UsersModel } from "./users.model";

const userService = new UserService();

/**
 * 用户控制器
 * 处理用户相关的所有HTTP请求
 */
export const userController = new Elysia({ prefix: '/users' })
  // 注册模型
  .model(UsersModel)

  // 获取用户列表
  .get('/', async ({ query, userService }) => {
    const result = await userService.getUserList(query);
    return commonRes(result);
  }, {
    query: 'UserListQuery',
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: t.Object({
          items: t.Array('UserResponse'),
          meta: t.Object({
            total: t.Number(),
            page: t.Number(),
            limit: t.Number(),
            totalPages: t.Number(),
          }),
        }),
      }),
      400: 'ErrorResponse',
      500: 'ErrorResponse',
    },
    detail: {
      summary: '获取用户列表',
      description: '分页获取用户列表，支持搜索和过滤',
      tags: ['Users'],
    },
  })

  // 根据ID获取用户
  .get('/:id', async ({ params: { id }, userService }) => {
    const user = await userService.getUserById(id);
    return commonRes(user);
  }, {
    params: 'IdParam',
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: 'UserResponse',
      }),
      404: 'ErrorResponse',
    },
    detail: {
      summary: '获取用户详情',
      description: '根据用户ID获取详细信息',
      tags: ['Users'],
    },
  })

  // 创建用户
  .post('/', async ({ body, userService }) => {
    const user = await userService.createUser(body);
    return commonRes(user);
  }, {
    body: 'CreateUser',
    response: {
      201: t.Object({
        success: t.Boolean(),
        data: 'UserResponse',
      }),
      400: 'ErrorResponse',
      409: 'ErrorResponse',
    },
    detail: {
      summary: '创建用户',
      description: '创建新用户账户',
      tags: ['Users'],
    },
  })

  // 更新用户信息
  .patch('/:id', async ({ params: { id }, body, userService }) => {
    const user = await userService.updateUser(id, body);
    return commonRes(user);
  }, {
    params: 'IdParam',
    body: 'PatchUser',
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: 'UserResponse',
      }),
      400: 'ErrorResponse',
      404: 'ErrorResponse',
      409: 'ErrorResponse',
    },
    detail: {
      summary: '更新用户信息',
      description: '部分更新用户信息',
      tags: ['Users'],
    },
  })

  // 删除用户
  .delete('/:id', async ({ params: { id }, userService }) => {
    await userService.deleteUser(id);
    return commonRes({ message: 'User deleted successfully' });
  }, {
    params: 'IdParam',
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: t.Object({
          message: t.String(),
        }),
      }),
      404: 'ErrorResponse',
    },
    detail: {
      summary: '删除用户',
      description: '根据ID删除用户',
      tags: ['Users'],
    },
  })

  // 用户登录
  .post('/login', async ({ body, userService }) => {
    const result = await userService.login(body);
    return commonRes(result);
  }, {
    body: 'LoginUser',
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: t.Object({
          user: 'UserResponse',
          token: t.String(),
          refreshToken: t.String(),
        }),
      }),
      401: 'ErrorResponse',
    },
    detail: {
      summary: '用户登录',
      description: '用户邮箱密码登录',
      tags: ['Users', 'Auth'],
    },
  })

  // 用户登出
  .post('/logout', async ({ headers, userService }) => {
    await userService.logout(headers.authorization);
    return commonRes({ message: 'Logged out successfully' });
  }, {
    headers: t.Object({
      authorization: t.String(),
    }),
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: t.Object({
          message: t.String(),
        }),
      }),
      401: 'ErrorResponse',
    },
    detail: {
      summary: '用户登出',
      description: '用户退出登录',
      tags: ['Users', 'Auth'],
    },
  })

  // 搜索用户
  .get('/search', async ({ query, userService }) => {
    const users = await userService.searchUsers(query.q, query.limit);
    return commonRes(users);
  }, {
    query: t.Object({
      q: t.String({ minLength: 2 }),
      limit: t.Optional(t.Number({ minimum: 1, maximum: 50, default: 10 })),
    }),
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: t.Array('SafeUserResponse'),
      }),
    },
    detail: {
      summary: '搜索用户',
      description: '根据关键词搜索用户',
      tags: ['Users'],
    },
  });
```

### 2. 复杂业务Controller示例

```typescript
// orders.controller.ts
import { Elysia, t } from "elysia";
import { commonRes } from "@/utils/response";
import { OrderService } from "./orders.service";
import { OrdersModel } from "./orders.model";
import { authMiddleware } from "@/middleware/auth";
import { adminMiddleware } from "@/middleware/admin";

const orderService = new OrderService();

/**
 * 订单控制器
 * 处理订单相关的所有HTTP请求
 */
export const orderController = new Elysia({ prefix: '/orders' })
  .model(OrdersModel)

  // 应用认证中间件
  .use(authMiddleware)

  // 获取当前用户的订单列表
  .get('/', async ({ query, user, orderService }) => {
    const result = await orderService.getUserOrders(user.id, query);
    return commonRes(result);
  }, {
    query: 'OrderListQuery',
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: t.Object({
          items: t.Array('OrderResponse'),
          meta: t.Object({
            total: t.Number(),
            page: t.Number(),
            limit: t.Number(),
            totalPages: t.Number(),
          }),
        }),
      }),
    },
    detail: {
      summary: '获取用户订单列表',
      tags: ['Orders'],
    },
  })

  // 根据ID获取订单详情
  .get('/:id', async ({ params: { id }, user, orderService }) => {
    const order = await orderService.getOrderByIdAndUserId(id, user.id);
    return commonRes(order);
  }, {
    params: 'IdParam',
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: 'OrderDetailResponse',
      }),
      404: 'ErrorResponse',
    },
    detail: {
      summary: '获取订单详情',
      tags: ['Orders'],
    },
  })

  // 创建订单
  .post('/', async ({ body, user, orderService }) => {
    const order = await orderService.createOrder({
      ...body,
      userId: user.id,
    });
    return commonRes(order, 201);
  }, {
    body: 'CreateOrder',
    response: {
      201: t.Object({
        success: t.Boolean(),
        data: 'OrderDetailResponse',
      }),
      400: 'ErrorResponse',
      409: 'ErrorResponse',
    },
    detail: {
      summary: '创建订单',
      tags: ['Orders'],
    },
  })

  // 取消订单
  .patch('/:id/cancel', async ({ params: { id }, user, orderService }) => {
    const order = await orderService.cancelOrder(id, user.id);
    return commonRes(order);
  }, {
    params: 'IdParam',
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: 'OrderDetailResponse',
      }),
      400: 'ErrorResponse',
      404: 'ErrorResponse',
    },
    detail: {
      summary: '取消订单',
      tags: ['Orders'],
    },
  })

  // 确认收货
  .patch('/:id/confirm', async ({ params: { id }, user, orderService }) => {
    const order = await orderService.confirmDelivery(id, user.id);
    return commonRes(order);
  }, {
    params: 'IdParam',
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: 'OrderDetailResponse',
      }),
      400: 'ErrorResponse',
      404: 'ErrorResponse',
    },
    detail: {
      summary: '确认收货',
      tags: ['Orders'],
    },
  })

  // 管理员路由 - 获取所有订单
  .get('/admin/all', async ({ query, orderService }) => {
    const result = await orderService.getAllOrders(query);
    return commonRes(result);
  }, {
    beforeHandle: [adminMiddleware], // 管理员权限检查
    query: 'AdminOrderListQuery',
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: t.Object({
          items: t.Array('OrderAdminResponse'),
          meta: t.Object({
            total: t.Number(),
            page: t.Number(),
            limit: t.Number(),
            totalPages: t.Number(),
          }),
        }),
      }),
    },
    detail: {
      summary: '获取所有订单（管理员）',
      tags: ['Orders', 'Admin'],
    },
  })

  // 管理员路由 - 更新订单状态
  .patch('/admin/:id/status', async ({ params: { id }, body, orderService }) => {
    const order = await orderService.updateOrderStatus(id, body.status);
    return commonRes(order);
  }, {
    beforeHandle: [adminMiddleware],
    params: 'IdParam',
    body: t.Object({
      status: t.Enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
    }),
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: 'OrderDetailResponse',
      }),
    },
    detail: {
      summary: '更新订单状态（管理员）',
      tags: ['Orders', 'Admin'],
    },
  });
```

## RESTful API设计规范

### 1. URL路径设计

```typescript
// ✅ 正确：RESTful设计
export const productController = new Elysia({ prefix: '/products' })
  .get('/', getProductsList)           // GET /products - 获取商品列表
  .get('/:id', getProductById)         // GET /products/:id - 获取单个商品
  .post('/', createProduct)            // POST /products - 创建商品
  .patch('/:id', updateProduct)        // PATCH /products/:id - 部分更新商品
  .put('/:id', replaceProduct)         // PUT /products/:id - 完整替换商品
  .delete('/:id', deleteProduct)       // DELETE /products/:id - 删除商品

// ✅ 正确：嵌套资源
export const orderController = new Elysia({ prefix: '/orders' })
  .get('/', getUserOrders)             // GET /orders - 获取用户订单
  .post('/', createOrder)              // POST /orders - 创建订单
  .get('/:id', getOrderById)           // GET /orders/:id - 获取订单详情
  .patch('/:id/status', updateOrderStatus) // PATCH /orders/:id/status - 更新订单状态

export const orderItemController = new Elysia({ prefix: '/orders/:orderId/items' })
  .get('/', getOrderItems)             // GET /orders/:orderId/items - 获取订单项
  .post('/', addOrderItem)             // POST /orders/:orderId/items - 添加订单项

// ❌ 错误：非RESTful设计
.get('/products/list', getProductsList)      // 应使用 GET /products
.get('/products/get/:id', getProductById)    // 应使用 GET /products/:id
.post('/products/create', createProduct)     // 应使用 POST /products
.get('/products/search/:query', search)      // 应使用 GET /products?search=query
```

### 2. HTTP方法使用规范

| HTTP方法 | 用途 | 幂等性 | 安全性 | 示例 |
|----------|------|--------|--------|------|
| **GET** | 获取资源 | ✅ | ✅ | `GET /users` |
| **POST** | 创建资源 | ❌ | ❌ | `POST /users` |
| **PUT** | 完整更新资源 | ✅ | ❌ | `PUT /users/:id` |
| **PATCH** | 部分更新资源 | ❌ | ❌ | `PATCH /users/:id` |
| **DELETE** | 删除资源 | ✅ | ❌ | `DELETE /users/:id` |
| **OPTIONS** | 获取支持的方法 | ✅ | ✅ | `OPTIONS /users` |

### 3. 状态码使用规范

```typescript
// ✅ 正确：状态码使用
export const userController = new Elysia({ prefix: '/users' })
  .get('/', async () => {
    return commonRes(users);
  }, {
    response: {
      200: 'SuccessResponse',    // 成功获取数据
    },
  })

  .post('/', async () => {
    const user = await userService.createUser(body);
    return commonRes(user);
  }, {
    response: {
      201: 'SuccessResponse',   // 成功创建资源
      400: 'ErrorResponse',     // 请求参数错误
      409: 'ErrorResponse',     // 资源冲突
    },
  })

  .get('/:id', async () => {
    const user = await userService.getUserById(id);
    return commonRes(user);
  }, {
    response: {
      200: 'SuccessResponse',   // 成功获取数据
      404: 'ErrorResponse',     // 资源不存在
    },
  })

  .patch('/:id', async () => {
    const user = await userService.updateUser(id, body);
    return commonRes(user);
  }, {
    response: {
      200: 'SuccessResponse',   // 成功更新
      400: 'ErrorResponse',     // 请求参数错误
      404: 'ErrorResponse',     // 资源不存在
      409: 'ErrorResponse',     // 资源冲突
    },
  });
```

## 请求验证和类型安全

### 1. 参数验证模式

```typescript
// ✅ 正确：使用预定义的类型
export const userController = new Elysia({ prefix: '/users' })
  .get('/:id', async ({ params: { id } }) => {
    const user = await userService.getUserById(id);
    return commonRes(user);
  }, {
    params: 'IdParam',  // 使用预定义的参数类型
  })

  .post('/', async ({ body }) => {
    const user = await userService.createUser(body);
    return commonRes(user);
  }, {
    body: 'CreateUser', // 使用预定义的请求体类型
  })

  .get('/', async ({ query }) => {
    const result = await userService.getUserList(query);
    return commonRes(result);
  }, {
    query: 'UserListQuery', // 使用预定义的查询类型
  });

// ❌ 错误：内联类型定义
.get('/:id', async ({ params }) => {
  const id = params.id; // 类型不安全
}, {
  params: t.Object({ id: t.Number() }), // 应该复用类型
})
```

### 2. 复杂验证场景

```typescript
// ✅ 正确：自定义验证规则
export const userController = new Elysia({ prefix: '/users' })
  .post('/', async ({ body }) => {
    const user = await userService.createUser(body);
    return commonRes(user);
  }, {
    body: t.Object({
      username: t.String({
        minLength: 3,
        maxLength: 50,
        pattern: '^[a-zA-Z0-9_]+$', // 用户名只能包含字母、数字和下划线
      }),
      email: t.String({
        format: 'email',
      }),
      password: t.String({
        minLength: 8,
        // 自定义验证器
        validator: (value) => {
          if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
          }
          return true;
        },
      }),
      confirmPassword: t.String(),
      firstName: t.Optional(t.String({ maxLength: 50 })),
      lastName: t.Optional(t.String({ maxLength: 50 })),
    }, {
      // 对象级别的验证
      validator: (value) => {
        if (value.password !== value.confirmPassword) {
          return 'Passwords do not match';
        }
        return true;
      },
    }),
  });
```

### 3. 文件上传处理

```typescript
// ✅ 正确：文件上传处理
export const uploadController = new Elysia({ prefix: '/upload' })
  .post('/avatar', async ({ body, user }) => {
    const result = await uploadService.uploadAvatar(body.file, user.id);
    return commonRes(result);
  }, {
    body: t.Object({
      file: t.File({
        type: ['image/jpeg', 'image/png', 'image/webp'],
        maxSize: '5m', // 最大5MB
      }),
    }),
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: t.Object({
          url: t.String(),
          filename: t.String(),
          size: t.Number(),
        }),
      }),
      400: 'ErrorResponse',
      413: 'ErrorResponse', // 文件过大
    },
    detail: {
      summary: '上传头像',
      tags: ['Upload'],
    },
  })

  .post('/batch', async ({ body }) => {
    const results = await uploadService.uploadMultiple(body.files);
    return commonRes(results);
  }, {
    body: t.Object({
      files: t.Files({
        type: ['image/*'],
        maxSize: '10m',
        maxItems: 10, // 最多10个文件
      }),
    }),
  });
```

## 响应格式规范

### 1. 统一响应格式

```typescript
// utils/response.ts
export const commonRes = <T>(data: T, statusCode: number = 200) => {
  return {
    success: true,
    data,
    message: 'Success',
    timestamp: new Date().toISOString(),
  };
};

export const errorRes = (message: string, statusCode: number = 400) => {
  throw new Error(message); // 由全局错误处理器处理
};

// 使用示例
export const userController = new Elysia({ prefix: '/users' })
  .get('/', async ({ query }) => {
    const result = await userService.getUserList(query);
    return commonRes(result); // ✅ 统一成功响应
  })

  .post('/', async ({ body }) => {
    const user = await userService.createUser(body);
    return commonRes(user, 201); // ✅ 创建成功返回201
  });
```

### 2. 分页响应格式

```typescript
// ✅ 正确：标准分页格式
const paginatedResponse = {
  items: [...], // 数据列表
  meta: {
    total: 100,        // 总记录数
    page: 1,           // 当前页码
    limit: 10,         // 每页条数
    totalPages: 10,    // 总页数
  },
};

// Controller中使用
export const userController = new Elysia({ prefix: '/users' })
  .get('/', async ({ query }) => {
    const result = await userService.getUserList(query);
    return commonRes(result);
  }, {
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: t.Object({
          items: t.Array('UserResponse'),
          meta: t.Object({
            total: t.Number(),
            page: t.Number(),
            limit: t.Number(),
            totalPages: t.Number(),
          }),
        }),
      }),
    },
  });
```

### 3. 错误响应格式

```typescript
// 全局错误处理器
export const errorHandler = new Elysia()
  .error({
    ValidationError: ValidationError,
    NotFoundError: NotFoundError,
    ConflictError: ConflictError,
    BusinessLogicError: BusinessLogicError,
  })
  .onError(({ error, code, set }) => {
    const statusCode = error.statusCode || 500;
    set.status = statusCode;

    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || 'INTERNAL_ERROR',
        details: error.details || null,
      },
      timestamp: new Date().toISOString(),
    };
  });

// 错误响应示例
{
  "success": false,
  "error": {
    "message": "User with email already exists",
    "code": "CONFLICT_ERROR",
    "details": null
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 中间件和装饰器

### 1. 认证中间件

```typescript
// middleware/auth.ts
export const authMiddleware = new Elysia()
  .derive(async ({ headers, cookie }) => {
    const token = headers.authorization?.replace('Bearer ', '') || cookie.token;

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      const user = await userService.getUserById(payload.userId);

      if (!user.isActive) {
        throw new UnauthorizedError('User account is inactive');
      }

      return { user };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  });

// Controller中使用
export const userController = new Elysia({ prefix: '/users' })
  .use(authMiddleware) // 应用认证中间件

  .get('/profile', async ({ user }) => {
    return commonRes(user);
  }, {
    detail: {
      summary: '获取当前用户信息',
      tags: ['Users', 'Profile'],
    },
  });
```

### 2. 权限中间件

```typescript
// middleware/admin.ts
export const adminMiddleware = new Elysia()
  .derive(({ user }) => {
    if (!user.roles.includes('admin')) {
      throw new ForbiddenError('Admin access required');
    }
    return { isAdmin: true };
  });

// Controller中使用
export const adminController = new Elysia({ prefix: '/admin' })
  .use(authMiddleware)
  .use(adminMiddleware)

  .get('/users', async ({ query, userService }) => {
    const result = await userService.getAllUsers(query);
    return commonRes(result);
  }, {
    detail: {
      summary: '获取所有用户（管理员）',
      tags: ['Admin', 'Users'],
    },
  });
```

### 3. 日志中间件

```typescript
// middleware/logging.ts
export const loggingMiddleware = new Elysia()
  .onBeforeHandle(({ request, set }) => {
    const start = Date.now();
    set.headers['x-request-id'] = crypto.randomUUID();

    // 记录请求开始
    console.log(`[${set.headers['x-request-id']}] ${request.method} ${request.url}`);
  })

  .onAfterHandle(({ request, set }) => {
    const duration = Date.now() - set.headers['x-start-time'];

    // 记录请求完成
    console.log(`[${set.headers['x-request-id']}] ${request.method} ${request.url} - ${set.status} (${duration}ms)`);
  })

  .onError(({ error, request, set }) => {
    const duration = Date.now() - set.headers['x-start-time'];

    // 记录请求错误
    console.error(`[${set.headers['x-request-id']}] ${request.method} ${request.url} - ${set.status} (${duration}ms) - ${error.message}`);
  });
```

## API文档生成

### 1. Swagger文档配置

```typescript
// app.ts
import { swagger } from '@elysiajs/swagger';

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'Elysia API Documentation',
        version: '1.0.0',
        description: '基于 Elysia + Drizzle + Zod 的全栈API',
        contact: {
          name: 'API Support',
          email: 'support@example.com',
        },
      },
      tags: [
        { name: 'Users', description: '用户管理' },
        { name: 'Products', description: '商品管理' },
        { name: 'Orders', description: '订单管理' },
        { name: 'Auth', description: '认证相关' },
        { name: 'Admin', description: '管理员功能' },
      ],
      servers: [
        { url: 'http://localhost:3000', description: 'Development server' },
        { url: 'https://api.example.com', description: 'Production server' },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    path: '/docs',
  }));

// 访问 http://localhost:3000/docs 查看API文档
```

### 2. 高级文档配置

```typescript
// Controller中的详细文档
export const userController = new Elysia({ prefix: '/users' })
  .post('/register', async ({ body }) => {
    const user = await userService.register(body);
    return commonRes(user, 201);
  }, {
    body: 'RegisterUser',
    response: {
      201: t.Object({
        success: t.Boolean(),
        data: t.Object({
          user: 'UserResponse',
          token: t.String(),
        }),
      }),
      400: 'ErrorResponse',
      409: 'ErrorResponse',
    },
    detail: {
      summary: '用户注册',
      description: `
        用户注册接口，创建新的用户账户。

        **注意事项：**
        - 用户名必须唯一，只能包含字母、数字和下划线
        - 邮箱必须是有效格式，用于账户验证
        - 密码至少8位，必须包含大小写字母和数字

        **流程：**
        1. 验证输入数据
        2. 创建用户账户
        3. 发送验证邮件
        4. 返回用户信息和认证令牌
      `,
      tags: ['Users', 'Auth'],
      examples: {
        'Valid registration': {
          description: '有效的注册请求',
          value: {
            username: 'john_doe',
            email: 'john@example.com',
            password: 'SecurePass123',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    },
  });
```

## 相关文档

- [Elysia架构基础规范](./01-Elysia架构基础规范.md)
- [Drizzle + Zod类型系统设计](./02-Drizzle-Zod类型系统设计.md)
- [Elysia代码编写规范](./03-Elysia代码编写规范.md)
- [Service层设计模式](./04-Service层设计模式.md)
- [项目重构指南](./06-项目重构指南.md)
