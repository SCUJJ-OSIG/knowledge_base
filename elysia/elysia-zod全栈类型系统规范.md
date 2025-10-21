1.每一个个table 定义一个文件,table定义之后就是Zod Schema,其中xxxmodel是提供给elysia使用. 之后又是// 3. 类型定义（可选，但推荐）,这个是提供给前端和后端的server使用.


# Drizzle ORM + Zod 模块化架构规范文档
## 概述
本规范定义了基于 Drizzle ORM + Zod 的模块化架构标准，确保前后端类型安全与一致性。每个数据库表对应一个独立文件，包含完整的表定义、Zod Schema、类型定义和关联关系。
`[entity]` 需替换为具体的业务实体名称。




## 文件结构标准
```
src/schema/
├── [entity].ts          # 实体表模块（如：products.ts）
├── [entity].ts          # 实体表模块（如：categories.ts）
├── utils.ts            # 公共工具函数
└── index.ts            # 统一导出
```

## 四层架构规范

### 1. Drizzle 表定义层
```typescript
export const [entity]Table = pgTable("[entity]", {
  id: serial("id").primaryKey(),
  // 字段定义...
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```
- 使用 PostgreSQL 数据类型
- 包含完整的字段注释
- 设置合理的默认值和约束

### 2. Zod Schema 层（运行时校验）
```typescript
// 使用 namespace 组织所有相关的 Zod schemas 和类型定义
export namespace [Entity]Model {
  // === 基础 Zod Schema（基于 Drizzle 表生成） ===
  export const Insert = createInsertSchema([entity]Table);
  export const Update = createUpdateSchema([entity]Table);
  export const Select = createSelectSchema([entity]Table);

  // === 业务 DTO Schemas ===
  // Create 等于创建，Patch 等于更新，Entity 等于查询
  // 创建和更新时，createdAt 和 updatedAt 由后端确定，所以 Create 和 Patch 不能有 id, createdAt, updatedAt
  export const Create = Insert.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).extend({
    // 自定义扩展字段和校验
  });

  export const Patch = Update.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).extend({
    // 自定义扩展字段和校验
  });

  // === 查询 Schemas ===
  export const ListQuery = BaseQueryZod.extend({
    // 查询参数扩展
  });

  // === 操作 Schemas ===
  // 其他操作相关的 schema 定义

  // === TypeScript 类型定义 ===
  export type Entity = z.infer<typeof Select>;
  export type CreateInput = z.infer<typeof Create>;
  export type UpdateInput = z.infer<typeof Patch>;
  export type ListQueryInput = z.infer<typeof ListQuery>;

  // === 前端展示类型（VO - View Object） ===
  export type ViewObject = Entity; // 或扩展格式化字段
}
```

### 4. 关联关系层
```typescript
export const [entity]Relations = relations([entity]Table, ({ one, many }) => ({
  relatedTable: one(relatedTable, {
    fields: [[entity]Table.foreignKey],
    references: [relatedTable.id],
  }),
  // 其他关联...
}));
```

## 最佳实践

### 字段处理规范
- JSON字段明确默认值：`default([])` 或 `default({})`
- 时间字段统一使用 `defaultNow()`

### 命名约定
- **表名**: `[entity]` + "Table" 后缀（如：`usersTable`）
- **Schema**: 使用 namespace 内的标准命名（`Insert`、`Update`、`Select`、`Create`、`Patch`、`ListQuery`）
- **模型**: `[Entity]Model` namespace（如：`UsersModel`、`ProductsModel`）
- **类型**: namespace 内的标准类型命名（`Entity`、`CreateInput`、`UpdateInput`、`ViewObject`）
- **关联**: `[entity]Relations`（如：`usersRelations`）

### 导入导出
- 在模块文件末尾统一导出所有类型和Schema
- 在index.ts中集中导出所有模块

## 示例模块模板（更新为新版写法）

```typescript
import { relations } from "drizzle-orm";
import { boolean, decimal, integer, json, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from "zod/v4";
import { categoriesTable, orderItemsTable, productImagesTable, reviewsTable } from "./schema";
import { stringToNumber, UnoPageQueryZod } from "./utils";

/**
 * 1. Drizzle 表定义
 * 商品表 - 存储商品的基本信息、价格、库存等
 * 包含商品的完整属性，支持SEO优化和商品展示
 */
export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(), // 商品唯一标识
  name: varchar("name", { length: 255 }).notNull(), // 商品名称
  slug: varchar("slug", { length: 255 }).notNull().unique(), // 商品别名，用于URL优化
  description: text("description").default(""), // 商品详细描述
  shortDescription: text("short_description").default(""), // 商品简短描述
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // 商品售价
  comparePrice: decimal("compare_price", { precision: 10, scale: 2 }).notNull(), // 商品原价/对比价格
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(), // 商品成本价
  sku: varchar("sku", { length: 100 }).unique().default(""), // 商品库存单位
  barcode: varchar("barcode", { length: 100 }).default(""), // 商品条形码
  weight: decimal("weight", { precision: 8, scale: 2 }).notNull(), // 商品重量(kg)
  dimensions: json("dimensions").default({}), // 商品尺寸(长宽高)
  videos: json("videos").default([]), // 商品视频列表
  colors: json("colors").default([]), // 商品可选颜色
  sizes: json("sizes").default([]), // 商品可选尺寸
  materials: json("materials").default([]), // 商品材料信息
  careInstructions: text("care_instructions").default(""), // 商品保养说明
  features: json("features").default([]), // 商品特性列表
  specifications: json("specifications").default({}), // 商品规格参数
  categoryId: integer("category_id")
    .references(() => categoriesTable.id)
    .default(-1), // 所属分类ID
  stock: integer("stock").default(0), // 商品库存数量
  minStock: integer("min_stock").default(0), // 最低库存预警值
  isActive: boolean("is_active").default(true), // 是否上架销售
  isFeatured: boolean("is_featured").default(false), // 是否为推荐商品
  metaTitle: varchar("meta_title", { length: 255 }).default(""), // SEO标题
  metaDescription: text("meta_description").default(""), // SEO描述
  metaKeywords: varchar("meta_keywords", { length: 500 }).default(""), // SEO关键词
  createdAt: timestamp("created_at").defaultNow(), // 创建时间
  updatedAt: timestamp("updated_at").defaultNow(), // 更新时间
});

/**
 * 2. 商品关系定义
 */
export const productsRelations = relations(productsTable, ({ one, many }) => ({
  category: one(categoriesTable, {
    fields: [productsTable.categoryId],
    references: [categoriesTable.id],
  }),
  reviews: many(reviewsTable),
  orderItems: many(orderItemsTable),
  productImages: many(productImagesTable),
}));

/**
 * 3. 商品模型 Namespace
 * 使用 namespace 组织所有相关的 Zod schemas 和类型定义
 */
export namespace ProductsModel {
  // === 基础 Zod Schema（基于 Drizzle 表生成） ===
  export const Insert = createInsertSchema(productsTable);
  export const Update = createUpdateSchema(productsTable);
  export const Select = createSelectSchema(productsTable);

  // === 业务 DTO Schemas ===
  export const Create = Insert.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).extend({
    cost: stringToNumber,
    price: stringToNumber,
    comparePrice: stringToNumber,
    weight: stringToNumber,
    image_ids: z.array(z.number()),
  });

  export const Patch = Update.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).extend({
    cost: stringToNumber,
    price: stringToNumber,
    comparePrice: stringToNumber,
    weight: stringToNumber,
    image_ids: z.array(z.number()),
  });

  // === 查询 Schemas ===
  export const ListQuery = UnoPageQueryZod.extend({
    categoryId: z.string().optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  });

  export const SearchQuery = UnoPageQueryZod.extend({
    categoryId: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    colors: z.array(z.string()).optional(),
    sizes: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    brand: z.string().optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  });

  export const FilterOptionsQuery = z.object({
    categoryId: z.string().optional(),
  });

  // === 操作 Schemas ===
  export const UpdateSort = z.object({
    order: z.number()
  });

  // === TypeScript 类型定义 ===
  export type Entity = z.infer<typeof Select>;
  export type CreateInput = z.infer<typeof Create>;
  export type UpdateInput = z.infer<typeof Patch>;
  export type ListQueryInput = z.infer<typeof ListQuery>;
  export type SearchQueryInput = z.infer<typeof SearchQuery>;
  export type FilterOptionsInput = z.infer<typeof FilterOptionsQuery>;

  // === 前端展示类型（VO - View Object） ===
  export type ViewObject = Entity;
  // 如果需要格式化字段，可以这样定义：
  // export type ViewObject = Omit<Entity, "price" | "comparePrice" | "cost"> & {
  //   price: string;
  //   comparePrice: string;
  //   cost: string;
  //   formattedDimensions?: string;
  // };
}
```

