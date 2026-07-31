---
date created: '2025-11-三 16:31:03'
date modified: '2026-07-31'
tags:
  - 技术/数据库/schema
  - 技术/数据库/设计规范
title: Schema 定义标准文档
---
# Schema 定义标准文档

  

本文档定义了项目中所有模块 Schema 的标准格式和规范。所有新建模块都必须遵循此标准。

  

## 概述

  

Schema 文件使用 Drizzle ORM 定义数据库表结构、关系和约束。Schema 是项目的数据层基础，与 Model 文件配合，实现全栈的类型安全。

  

## 核心原则

  

1. **统一使用 schemaHelper**：所有表都必须导入和使用 schemaHelper 中的通用字段

2. **命名规范一致**：表名、字段名、关系名遵循统一的命名规则

3. **外键约束明确**：所有外键关系都要明确定义，包含适当的级联操作

4. **关系定义完整**：每张表的关系都要完整定义，支持双向导航

  

## 标准模板结构

  

```typescript

// 模块名称 - 表的功能描述

// 包含的主要功能和特性说明

  

// 1. 导入依赖

import { relations } from "drizzle-orm";

import {

  boolean,

  foreignKey,

  integer,

  pgEnum,

  pgTable,

  text,

  varchar,

  jsonb,

  timestamp,

  decimal,

} from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "../helper/schemaHelper.schema";

// 导入关联表的 schema

import { relatedTable } from "../related-module/related.schema";

  

// 2. 枚举定义（如需要）

const StatusEnum = pgEnum("status", ["active", "inactive", "pending"]);

  

// 3. 主表定义

export const moduleNameTable = pgTable(

  "table_name",  // 使用下划线命名，通常为复数

  {

    // === 基础字段（必须）===

    id,                    // 主键，来自 schemaHelper

    createdAt,             // 创建时间，来自 schemaHelper

    updatedAt,             // 更新时间，来自 schemaHelper

  

    // === 业务字段（按重要性排序）===

    name: varchar("name", { length: 255 }).notNull(),

    slug: varchar("slug", { length: 100 }).unique().notNull(),

    description: text("description"),

  

    // === 状态和配置字段 ===

    status: StatusEnum.notNull().default("active"),

    sortOrder: integer("sort_order").default(0),

    isVisible: boolean("is_visible").default(true),

  

    // === 外键字段 ===

    parentId: integer("parent_id"),  // 自引用外键

    categoryId: integer("category_id")

      .notNull()

      .references(() => categoriesTable.id, {

        onDelete: "cascade",

        onUpdate: "cascade"

      }),

  

    // === 多语言字段（如需要）===

    title: jsonb("title").$type<{

      "zh-CN": string;

      "en-US": string;

    }>(),

  

    // === 其他业务字段 ===

    metadata: jsonb("metadata").$type<Record<string, any>>(),

  },

  // 4. 外键约束定义（复杂约束使用）

  (table) => [

    foreignKey({

      columns: [table.parentId],

      foreignColumns: [table.id],

      name: "fk_module_parent",  // 命名: fk_表名_字段名

      onDelete: "set null",

    }),

  ]

);

  

// 5. 关系定义

export const moduleNameRelations = relations(

  moduleNameTable,

  ({ one, many }) => ({

    // === 自引用关系（树形结构） ===

    parent: one(moduleNameTable, {

      fields: [moduleNameTable.parentId],

      references: [moduleNameTable.id],

      relationName: "moduleParent",  // 关系名：模块名+Parent

    }),

    children: many(moduleNameTable, {

      relationName: "moduleParent",

    }),

  

    // === 一对多关系 ===

    items: many(itemTable),

  

    // === 多对一关系 ===

    category: one(categoriesTable, {

      fields: [moduleNameTable.categoryId],

      references: [categoriesTable.id],

    }),

  })

);

```

  

## 命名规范

  

### 表命名

- **变量名**：`模块名 + Table`（单数形式）

  - 例：`categoriesTable`, `productTable`, `userTable`

- **数据库表名**：使用下划线分隔，通常为复数形式

  - 例：`"categories"`, `"products_table"`, `"advertisements"`

  

### 字段命名

- **变量名**：使用 camelCase

  - 例：`parentId`, `createdAt`, `sortOrder`

- **数据库字段名**：使用 snake_case

  - 例：`"parent_id"`, `"created_at"`, `"sort_order"`

  

### 外键字段

- **命名格式**：`关联表名 + Id`

  - 例：`categoryId`, `userId`, `productId`

  

### 枚举命名

- **变量名**：`名称 + Enum`

  - 例：`StatusEnum`, `TypeEnum`, `RoleEnum`

- **数据库枚举名**：使用小写下划线

  - 例：`"user_role"`, `"product_status"`

  

### 关系名

- **自引用**：`模块名 + Parent/Children`

  - 例：`"categoryParent"`

- **多对多**：`主模块名 + Tags` 或 `主模块名 + + 副模块名`

  - 例：`"productTags"`, `"userRoles"`

  

## SchemaHelper 使用规范

  

### 基础字段导入

```typescript

// 必须导入 schemaHelper 中的基础字段

import { createdAt, id, updatedAt } from "../helper/schemaHelper.schema";

```

  

### 字段类型选择

```typescript

// 数字 ID 主键（默认）

id,  // serial 类型，自增主键

  

// 字符串 ID 主键（用于认证等场景）

import { idStr } from "../helper/schemaHelper.schema";

id: idStr,  // text 类型，UUID 或其他字符串 ID

  

// 时间字段

createdAt,   // 创建时间，自动设置默认值

updatedAt,   // 更新时间，自动更新

```

  

## 外键约束规范

  

### 内联定义（推荐）

```typescript

categoryId: integer("category_id")

  .notNull()

  .references(() => categoriesTable.id, {

    onDelete: "cascade",    // cascade | set null | restrict

    onUpdate: "cascade"

  }),

```

  

### 外键函数定义（复杂约束）

```typescript

// 在表的第三个参数中定义

export const tableName = pgTable(

  "table_name",

  { /* 字段定义 */ },

  (table) => [

    foreignKey({

      columns: [table.parentId],

      foreignColumns: [table.id],

      name: "fk_table_parent",

      onDelete: "set null",

    }),

  ]

);

```

  

### 级联操作选择

- **cascade**：级联删除/更新（子记录同步删除/更新）

- **set null**：设置为 null（子记录的外键设为 null）

- **restrict**：限制删除（有子记录时禁止删除）

  

## 关系定义规范

  

### 自引用关系（树形结构）

```typescript

export const categoriesRelations = relations(categoriesTable, ({ one, many }) => ({

  parent: one(categoriesTable, {

    fields: [categoriesTable.parentId],

    references: [categoriesTable.id],

    relationName: "categoryParent",

  }),

  children: many(categoriesTable, {

    relationName: "categoryParent",

  }),

}));

```

  

### 一对多关系

```typescript

// 一的一方

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({

  products: many(productsTable),

}));

  

// 多的一方

export const productsRelations = relations(productsTable, ({ one }) => ({

  category: one(categoriesTable, {

    fields: [productsTable.categoryId],

    references: [categoriesTable.id],

  }),

}));

```

  

### 多对多关系

```typescript

// 1. 定义中间表

export const productTagsTable = pgTable("product_tags", {

  id,

  createdAt,

  productId: integer("product_id")

    .notNull()

    .references(() => productsTable.id, { onDelete: "cascade" }),

  tagId: integer("tag_id")

    .notNull()

    .references(() => tagsTable.id, { onDelete: "cascade" }),

});

  

// 2. 定义关系

// Product 表

export const productsRelations = relations(productsTable, ({ many }) => ({

  tags: many(tagsTable, { relationName: "productTags" }),

}));

  

// Tag 表

export const tagsRelations = relations(tagsTable, ({ many }) => ({

  products: many(productsTable, { relationName: "productTags" }),

}));

```

  

## 字段定义顺序规范

  

1. **基础字段**（必须）

   - id, createdAt, updatedAt

  

2. **业务核心字段**

   - 名称、标识符、描述等

  

3. **状态和配置字段**

   - status, isActive, sortOrder 等

  

4. **外键字段**

   - 各种关联 ID

  

5. **特殊业务字段**

   - JSON、多语言、金额等

  

## 常见模式

  

### 树形结构

```typescript

// 自引用外键

parentId: integer("parent_id"),

  

// 关系定义

parent: one(moduleTable, {

  fields: [moduleTable.parentId],

  references: [moduleTable.id],

  relationName: "moduleParent",

}),

children: many(moduleTable, {

  relationName: "moduleParent",

}),

```

  

### 软删除

```typescript

isDeleted: boolean("is_deleted").default(false),

deletedAt: timestamp("deleted_at", { withTimezone: true }),

```

  

### 多语言支持

```typescript

title: jsonb("title").$type<{

  "zh-CN": string;

  "en-US": string;

}>(),

```

  

### 审计字段

```typescript

createdBy: integer("created_by").references(() => usersTable.id),

updatedBy: integer("updated_by").references(() => usersTable.id),

version: integer("version").default(1),

```

  

## 最佳实践

  

1. **保持一致性**：命名、字段顺序、关系定义都要保持项目内一致

2. **明确约束**：外键关系要明确定义，指定合适的级联操作

3. **完整的关系**：支持双向导航，便于查询和数据操作

4. **合理使用索引**：外键和唯一字段自动创建索引，其他查询字段按需添加

5. **注释清晰**：复杂业务逻辑要有清晰的注释说明

  

## 注意事项

  

1. **不要重复定义基础字段**：始终从 schemaHelper 导入

2. **关系名要唯一**：避免不同关系使用相同的 relationName

3. **外键约束命名规范**：使用 `fk_表名_字段名` 格式

4. **考虑性能影响**：复杂的外键约束和关系可能影响性能

5. **向后兼容**：修改 schema 时考虑现有数据和代码的兼容性

  

## 示例参考

  

可以参考项目中的以下规范实现：

- `category.schema.ts` - 树形结构标准实现

- `product.schema.ts` - 复杂业务关系设计

- `media.schema.ts` - 文件管理表设计

- `auth.schema.ts` - 认证相关表设计

  

这些文件都严格遵循本规范，可作为新建模块的参考模板。
