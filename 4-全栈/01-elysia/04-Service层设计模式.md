---
tags:
  - 全栈
  - elysia
series: elysia
---
# Service层设计模式规范

## 概述

本文档定义了 Elysia 项目中 Service 层的设计模式和最佳实践。Service 层负责业务逻辑处理、数据操作和业务规则实现，是应用的核心业务层。

## Service层职责

### 核心职责
- **业务逻辑处理**: 实现具体的业务规则和逻辑
- **数据操作**: 使用 Drizzle ORM 进行数据库操作
- **事务管理**: 处理复杂的事务性操作
- **错误处理**: 抛出具体的业务错误
- **数据转换**: 必要时进行数据格式转换

### 设计原则
- **单一职责**: 每个Service专注于一个业务领域
- **依赖注入**: 通过构造函数或装饰器注入依赖
- **错误优先**: 抛出错误而不是返回null
- **类型安全**: 使用TypeScript确保类型安全

## 基础Service结构

### 1. 标准Service类模板

```typescript
// users.service.ts
import { eq, and, or, like, count, getTableColumns } from "drizzle-orm";
import { db } from "@/db/connection";
import { usersTable } from "@/db/schema/users.schema";
import {
  CreateUserDto,
  UpdateUserDto,
  UserListQueryDto,
  UserEntity
} from "./users.model";
import {
  NotFoundError,
  ConflictError,
  DatabaseError
} from "@/utils/errors";

/**
 * 用户服务类
 * 处理用户相关的所有业务逻辑
 */
export class UserService {
  /**
   * 获取表的安全列（排除敏感字段）
   */
  private readonly safeColumns = (() => {
    const { password, resetToken, verificationToken, ...safeColumns } =
      getTableColumns(usersTable);
    return safeColumns;
  })();

  /**
   * 根据ID获取用户
   * @param id 用户ID
   * @returns 用户实体信息
   * @throws {NotFoundError} 当用户不存在时
   */
  async getUserById(id: number): Promise<UserEntity> {
    const [user] = await db
      .select(this.safeColumns)
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return user;
  }

  /**
   * 根据邮箱获取用户
   * @param email 用户邮箱
   * @returns 用户实体信息
   * @throws {NotFoundError} 当用户不存在时
   */
  async getUserByEmail(email: string): Promise<UserEntity> {
    const [user] = await db
      .select(this.safeColumns)
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      throw new NotFoundError(`User with email ${email} not found`);
    }

    return user;
  }

  /**
   * 创建用户
   * @param userData 用户创建数据
   * @returns 创建后的用户实体
   * @throws {ConflictError} 当邮箱或用户名已存在时
   */
  async createUser(userData: CreateUserDto): Promise<UserEntity> {
    try {
      const [user] = await db
        .insert(usersTable)
        .values({
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning(this.safeColumns);

      return user;
    } catch (error: any) {
      if (error.code === '23505') { // PostgreSQL唯一约束冲突
        throw new ConflictError('User with this email or username already exists');
      }
      throw new DatabaseError('Failed to create user');
    }
  }

  /**
   * 更新用户信息
   * @param id 用户ID
   * @param updateData 更新数据
   * @returns 更新后的用户实体
   * @throws {NotFoundError} 当用户不存在时
   */
  async updateUser(id: number, updateData: UpdateUserDto): Promise<UserEntity> {
    // 先检查用户是否存在
    await this.getUserById(id);

    try {
      const [user] = await db
        .update(usersTable)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, id))
        .returning(this.safeColumns);

      return user;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictError('Email or username already exists');
      }
      throw new DatabaseError('Failed to update user');
    }
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @throws {NotFoundError} 当用户不存在时
   */
  async deleteUser(id: number): Promise<void> {
    // 先检查用户是否存在
    await this.getUserById(id);

    try {
      await db.delete(usersTable).where(eq(usersTable.id, id));
    } catch (error: any) {
      throw new DatabaseError('Failed to delete user');
    }
  }

  /**
   * 获取用户列表（分页）
   * @param query 查询参数
   * @returns 分页用户列表
   */
  async getUserList(query: UserListQueryDto): Promise<{
    items: UserEntity[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      sort = 'createdAt',
      order = 'desc'
    } = query;

    const offset = (page - 1) * limit;

    // 构建查询条件
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(usersTable.username, `%${search}%`),
          like(usersTable.email, `%${search}%`),
          like(usersTable.firstName, `%${search}%`),
          like(usersTable.lastName, `%${search}%`)
        )
      );
    }

    if (isActive !== undefined) {
      conditions.push(eq(usersTable.isActive, isActive));
    }

    // 构建查询
    let queryBuilder = db
      .select(this.safeColumns)
      .from(usersTable);

    let totalBuilder = db
      .select({ total: count() })
      .from(usersTable);

    if (conditions.length > 0) {
      const whereCondition = and(...conditions);
      queryBuilder = queryBuilder.where(whereCondition);
      totalBuilder = totalBuilder.where(whereCondition);
    }

    // 添加排序
    const orderByColumn = usersTable[sort as keyof typeof usersTable];
    if (orderByColumn) {
      queryBuilder = queryBuilder.orderBy(
        order === 'asc' ?
          asc(orderByColumn) :
          desc(orderByColumn)
      );
    }

    // 执行查询
    const [users, [{ total }]] = await Promise.all([
      queryBuilder.limit(limit).offset(offset),
      totalBuilder
    ]);

    return {
      items: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * 搜索用户
   * @param searchTerm 搜索关键词
   * @param limit 结果数量限制
   * @returns 匹配的用户列表
   */
  async searchUsers(searchTerm: string, limit: number = 10): Promise<UserEntity[]> {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    const users = await db
      .select(this.safeColumns)
      .from(usersTable)
      .where(
        and(
          or(
            like(usersTable.username, `%${searchTerm}%`),
            like(usersTable.email, `%${searchTerm}%`),
            like(usersTable.firstName, `%${searchTerm}%`),
            like(usersTable.lastName, `%${searchTerm}%`)
          ),
          eq(usersTable.isActive, true)
        )
      )
      .limit(limit);

    return users;
  }

  /**
   * 激活/停用用户
   * @param id 用户ID
   * @param isActive 激活状态
   * @throws {NotFoundError} 当用户不存在时
   */
  async toggleUserStatus(id: number, isActive: boolean): Promise<UserEntity> {
    return this.updateUser(id, { isActive });
  }

  /**
   * 验证用户邮箱
   * @param email 用户邮箱
   * @returns 是否验证通过
   */
  async validateUserEmail(email: string): Promise<boolean> {
    try {
      await this.getUserByEmail(email);
      return true;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return false;
      }
      throw error;
    }
  }
}
```

### 2. 复杂业务Service示例

```typescript
// order.service.ts
import { eq, and, sum, getTableColumns } from "drizzle-orm";
import { db } from "@/db/connection";
import {
  ordersTable,
  orderItemsTable,
  productsTable,
  usersTable
} from "@/db/schema";
import {
  CreateOrderDto,
  OrderDetailDto,
  OrderStatus
} from "./orders.model";
import {
  NotFoundError,
  ValidationError,
  BusinessLogicError
} from "@/utils/errors";

/**
 * 订单服务类
 * 处理订单相关的复杂业务逻辑
 */
export class OrderService {
  /**
   * 创建订单（包含事务处理）
   * @param orderData 订单创建数据
   * @returns 创建后的订单详情
   */
  async createOrder(orderData: CreateOrderDto): Promise<OrderDetailDto> {
    return await db.transaction(async (tx) => {
      // 1. 验证用户存在
      const [user] = await tx
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, orderData.userId))
        .limit(1);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // 2. 验证商品库存并计算总价
      let totalAmount = 0;
      const orderItems: any[] = [];

      for (const item of orderData.items) {
        const [product] = await tx
          .select()
          .from(productsTable)
          .where(eq(productsTable.id, item.productId))
          .limit(1);

        if (!product) {
          throw new NotFoundError(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new ValidationError(
            `Insufficient stock for product ${product.name}. Available: ${product.stock}`
          );
        }

        const itemTotal = Number(product.price) * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: itemTotal.toString()
        });

        // 3. 扣减库存
        await tx
          .update(productsTable)
          .set({
            stock: product.stock - item.quantity,
            updatedAt: new Date()
          })
          .where(eq(productsTable.id, item.productId));
      }

      // 4. 创建订单
      const [order] = await tx
        .insert(ordersTable)
        .values({
          userId: orderData.userId,
          totalAmount: totalAmount.toString(),
          status: OrderStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // 5. 创建订单项
      const itemsWithOrderId = orderItems.map(item => ({
        ...item,
        orderId: order.id,
      }));

      await tx.insert(orderItemsTable).values(itemsWithOrderId);

      // 6. 返回订单详情
      return this.getOrderDetailById(order.id);
    });
  }

  /**
   * 获取订单详情（包含关联数据）
   * @param orderId 订单ID
   * @returns 订单详情
   */
  async getOrderDetailById(orderId: number): Promise<OrderDetailDto> {
    const [order] = await db
      .select({
        ...getTableColumns(ordersTable),
        user: {
          id: usersTable.id,
          username: usersTable.username,
          email: usersTable.email,
        },
        items: sql`json_agg(
          json_build_object(
            'id', ${orderItemsTable.id},
            'productId', ${orderItemsTable.productId},
            'productName', ${productsTable.name},
            'quantity', ${orderItemsTable.quantity},
            'unitPrice', ${orderItemsTable.unitPrice},
            'totalPrice', ${orderItemsTable.totalPrice}
          )
        )`.mapWith(OrderItemsSchema.array()),
      })
      .from(ordersTable)
      .leftJoin(usersTable, eq(ordersTable.userId, usersTable.id))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
      .leftJoin(productsTable, eq(orderItemsTable.productId, productsTable.id))
      .where(eq(ordersTable.id, orderId))
      .groupBy(ordersTable.id, usersTable.id)
      .limit(1);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return order;
  }

  /**
   * 更新订单状态
   * @param orderId 订单ID
   * @param status 新状态
   * @returns 更新后的订单
   */
  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<OrderDetailDto> {
    // 检查订单是否存在
    const existingOrder = await this.getOrderDetailById(orderId);

    // 业务规则验证
    this.validateOrderStatusTransition(existingOrder.status, status);

    try {
      await db
        .update(ordersTable)
        .set({
          status,
          updatedAt: new Date()
        })
        .where(eq(ordersTable.id, orderId));

      return this.getOrderDetailById(orderId);
    } catch (error: any) {
      throw new DatabaseError('Failed to update order status');
    }
  }

  /**
   * 取消订单（包含库存回滚）
   * @param orderId 订单ID
   * @returns 取消后的订单
   */
  async cancelOrder(orderId: number): Promise<OrderDetailDto> {
    return await db.transaction(async (tx) => {
      const order = await this.getOrderDetailById(orderId);

      // 只有待处理的订单可以取消
      if (order.status !== OrderStatus.PENDING) {
        throw new BusinessLogicError('Only pending orders can be cancelled');
      }

      // 回滚库存
      for (const item of order.items) {
        await tx
          .update(productsTable)
          .set({
            stock: sql`${productsTable.stock} + ${item.quantity}`,
            updatedAt: new Date()
          })
          .where(eq(productsTable.id, item.productId));
      }

      // 更新订单状态
      await tx
        .update(ordersTable)
        .set({
          status: OrderStatus.CANCELLED,
          updatedAt: new Date()
        })
        .where(eq(ordersTable.id, orderId));

      return this.getOrderDetailById(orderId);
    });
  }

  /**
   * 验证订单状态转换的合法性
   * @param currentStatus 当前状态
   * @param newStatus 新状态
   */
  private validateOrderStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ): void {
    const validTransitions = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BusinessLogicError(
        `Cannot transition from ${currentStatus} to ${newStatus}`
      );
    }
  }
}
```

## Service层最佳实践

### 1. 错误处理策略

```typescript
// ✅ 正确：使用具体的错误类型
class UserService {
  async getUserById(id: number): Promise<UserEntity> {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!user.length) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return user[0];
  }

  async createUser(userData: CreateUserDto): Promise<UserEntity> {
    try {
      const [user] = await db.insert(usersTable).values(userData).returning();
      return user;
    } catch (error: any) {
      // 处理特定的数据库错误
      switch (error.code) {
        case '23505': // 唯一约束冲突
          throw new ConflictError('User already exists');
        case '23503': // 外键约束冲突
          throw new ValidationError('Invalid reference data');
        case '23502': // 非空约束冲突
          throw new ValidationError('Required field is missing');
        default:
          throw new DatabaseError('Failed to create user');
      }
    }
  }
}

// ❌ 错误：返回null或undefined
async getUserById(id: number): Promise<UserEntity | null> {
  const user = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
  return user[0] || null; // 应该抛出错误
}
```

### 2. 分页查询标准模式

```typescript
// ✅ 正确：标准分页实现
async getList(query: ListQueryDto): Promise<{
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  const { page = 1, limit = 10, search, filters } = query;
  const offset = (page - 1) * limit;

  // 构建查询条件
  const conditions = this.buildQueryConditions(search, filters);

  // 并行执行数据和总数查询
  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(this.table)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(this.table.createdAt)),
    db
      .select({ total: count() })
      .from(this.table)
      .where(and(...conditions))
  ]);

  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

// ✅ 正确：动态条件构建
private buildQueryConditions(search?: string, filters?: any): any[] {
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(this.table.name, `%${search}%`),
        like(this.table.description, `%${search}%`)
      )
    );
  }

  if (filters?.status) {
    conditions.push(eq(this.table.status, filters.status));
  }

  if (filters?.dateFrom) {
    conditions.push(gte(this.table.createdAt, new Date(filters.dateFrom)));
  }

  if (filters?.dateTo) {
    conditions.push(lte(this.table.createdAt, new Date(filters.dateTo)));
  }

  return conditions;
}
```

### 3. 数据验证和转换

```typescript
// ✅ 正确：Service层数据转换
class ProductService {
  async createProduct(productData: CreateProductDto): Promise<ProductEntity> {
    // 业务数据验证
    this.validateProductData(productData);

    // 数据转换
    const transformedData = {
      ...productData,
      price: productData.price.toString(), // Decimal类型转换
      isActive: productData.isActive ?? true, // 默认值设置
      slug: this.generateSlug(productData.name), // 自动生成字段
    };

    try {
      const [product] = await db
        .insert(productsTable)
        .values(transformedData)
        .returning();

      return product;
    } catch (error: any) {
      this.handleDatabaseError(error);
    }
  }

  private validateProductData(data: CreateProductDto): void {
    if (data.price <= 0) {
      throw new ValidationError('Product price must be greater than 0');
    }

    if (data.stock < 0) {
      throw new ValidationError('Product stock cannot be negative');
    }

    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Product name is required');
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private handleDatabaseError(error: any): never {
    switch (error.code) {
      case '23505':
        throw new ConflictError('Product with this name already exists');
      default:
        throw new DatabaseError('Failed to create product');
    }
  }
}
```

### 4. 事务处理模式

```typescript
// ✅ 正确：复杂事务处理
class OrderService {
  async processOrder(orderId: number): Promise<OrderDetailDto> {
    return await db.transaction(async (tx) => {
      // 1. 获取并锁定订单
      const [order] = await tx
        .select()
        .from(ordersTable)
        .where(eq(ordersTable.id, orderId))
        .for('update') // 行级锁
        .limit(1);

      if (!order) {
        throw new NotFoundError('Order not found');
      }

      // 2. 验证订单状态
      if (order.status !== OrderStatus.PENDING) {
        throw new BusinessLogicError('Order cannot be processed');
      }

      // 3. 扣减库存
      await this.deductInventory(tx, order.id);

      // 4. 更新订单状态
      await tx
        .update(ordersTable)
        .set({
          status: OrderStatus.PROCESSING,
          updatedAt: new Date()
        })
        .where(eq(ordersTable.id, orderId));

      // 5. 创建库存变动记录
      await this.createInventoryLog(tx, order.id);

      // 6. 返回更新后的订单
      return this.getOrderDetailById(orderId);
    });
  }

  private async deductInventory(tx: any, orderId: number): Promise<void> {
    const orderItems = await tx
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, orderId));

    for (const item of orderItems) {
      const [product] = await tx
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, item.productId))
        .for('update')
        .limit(1);

      if (product.stock < item.quantity) {
        throw new ValidationError(`Insufficient stock for product ${product.name}`);
      }

      await tx
        .update(productsTable)
        .set({
          stock: product.stock - item.quantity,
          updatedAt: new Date()
        })
        .where(eq(productsTable.id, item.productId));
    }
  }
}
```

## Service层依赖注入

### 1. 基础依赖注入

```typescript
// ✅ 正确：构造函数注入
export class UserService {
  constructor(
    private readonly db: DrizzleDB,
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
    private readonly logger: Logger
  ) {}

  async createUser(userData: CreateUserDto): Promise<UserEntity> {
    try {
      const user = await this.db.insert(usersTable).values(userData).returning();

      // 发送欢迎邮件
      await this.emailService.sendWelcomeEmail(user.email);

      // 清除相关缓存
      await this.cacheService.delete(`users:list`);

      this.logger.info('User created successfully', { userId: user.id });

      return user;
    } catch (error) {
      this.logger.error('Failed to create user', { error, userData });
      throw error;
    }
  }
}

// ✅ 正确：使用装饰器注入（如果支持）
export class ProductService {
  @Inject('database')
  private readonly db: DrizzleDB;

  @Inject('cache')
  private readonly cache: CacheService;

  async getProductById(id: number): Promise<ProductEntity> {
    const cacheKey = `product:${id}`;

    // 尝试从缓存获取
    let product = await this.cache.get(cacheKey);

    if (!product) {
      product = await this.db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, id))
        .limit(1);

      if (product) {
        // 缓存5分钟
        await this.cache.set(cacheKey, product, { ttl: 300 });
      }
    }

    return product;
  }
}
```

### 2. Service工厂模式

```typescript
// services/factory/user-service.factory.ts
export class UserServiceFactory {
  static create(
    db: DrizzleDB,
    config: ServiceConfig
  ): UserService {
    const emailService = new EmailService(config.email);
    const cacheService = new CacheService(config.cache);
    const logger = new Logger('UserService');

    return new UserService(db, emailService, cacheService, logger);
  }
}

// 使用示例
const userService = UserServiceFactory.create(db, appConfig);
```

## 相关文档

- [Elysia架构基础规范](./01-Elysia架构基础规范.md)
- [Drizzle + Zod类型系统设计](./02-Drizzle-Zod类型系统设计.md)
- [Elysia代码编写规范](./03-Elysia代码编写规范.md)
- [Controller层接口设计](./05-Controller层接口设计.md)
