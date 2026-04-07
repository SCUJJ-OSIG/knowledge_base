---
date created: 2025-10-二 18:09:20
date modified: 2025-11-三 16:16:20
---
  1.1 基础 Schema 结构

       所有文件都遵循相同的基础 Schema 模式：

       // === 基础 Schema ===
       const Insert = createInsertSchema(table);
       const UpdateBase/Update = createUpdateSchema(table); // 有差异
       const Select = createSelectSchema(table);

       关键差异点：
       - category, product, ads, site-config, media: 使用 UpdateBase
       - auth: 直接使用 Update

       1.2 业务 Schema 结构模式

       标准模式（最完整）：

       const Create = Insert.omit({
         id: true,
         createdAt: true,
         updatedAt: true,
       });

       const Update = UpdateBase.omit({
         id: true,
         createdAt: true,
         updatedAt: true,
       });

       const Patch = UpdateBase.omit({
         id: true,
         createdAt: true,
         updatedAt: true,
       }).partial();

       查询 Schema 模式：

       const BusinessQuery = z.object({
         // 业务特定的查询字段
       });

       const ListQuery = BusinessQuery.extend(PaginationParams.shape).extend(SortParams.shape);

       1.3 特殊 Schema 命名规则

       各文件中的特殊 Schema：

       | 文件          | 特殊 Schema                                                            | 用途
         |
       |-------------|----------------------------------------------------------------------|-------------------|
       | category    | FormUpsert, TreeQuery, Entityone                                     |
       表单upsert、树形查询、单实体 |
       | product     | ProductTemplateModel, ProductImagesModel                             | 子模型扩展
        |
       | auth        | Login, ChangePassword                                                | 认证相关操作
         |
       | media       | UploadFileDto, UploadFilesDto, BatchUpload, BatchDelete, BatchUpdate | 文件上传和批量操作
            |
       | ads         | BatchStatusUpdate                                                    | 批量状态更新
         |
       | site-config | CategoryQuery, KeysQuery, BatchUpdate                                | 配置特定查询和批量更新
              |

       2. Update 和 UpdateBase 的区别分析

       2.1 使用 UpdateBase 的文件（推荐模式）：

       - category, product, ads, site-config, media

       const UpdateBase = createUpdateSchema(table);
       const Update = UpdateBase.omit({
         id: true,
         createdAt: true,
         updatedAt: true,
       });

       2.2 直接使用 Update 的文件：

       - auth

       const Update = createUpdateSchema(usersTable);
       // 没有 UpdateBase，直接在 Patch 中使用

       分析结论： UpdateBase 模式更规范，提供了更好的中间层抽象。

       3. Create 和 Insert 的区别

       所有文件都遵循相同的模式：
       const Create = Insert.omit({
         id: true,
         createdAt: true,
         updatedAt: true,
       });

       部分文件有额外扩展：
       - product: 扩展了关联字段（templateId, categoryIds, imageIds）
       - media: 扩展了可选字段（url, key, fileSize等）

       4. Patch 的定义方式

       4.1 标准模式（推荐）：

       const Patch = UpdateBase.omit({
         id: true,
         createdAt: true,
         updatedAt: true,
       }).partial();

       4.2 特殊处理：

       - auth: 额外排除了 password 字段
       - product: 使用了复杂的链式操作

       5. 值聚合和类型聚合的导出结构

       5.1 标准导出模式：

       // === 1. 运行时 Schema 集合（值）===
       export const ModelName = {
         Insert,
         Update,
         Select,
         Create,
         Patch,
         ListQuery,
         Entity,
         // ... 其他特殊 Schema
       } as const;

       // === 2. 编译时类型集合（类型）===
       export type ModelName = {
         Insert: z.infer<typeof Insert>;
         Update: z.infer<typeof Update>;
         Select: z.infer<typeof Select>;
         Create: z.infer<typeof Create>;
         Patch: z.infer<typeof Patch>;
         ListQuery: z.infer<typeof ListQuery>;
         Entity: z.infer<typeof Entity>;
         // ... 其他类型
       };

       6. 最规范和完整的文件推荐

       综合评分最高的文件：

       🥇 第一名：media.model.ts

       优点：
       - 结构最完整，包含所有标准 Schema
       - 枚举定义清晰（FileType, StorageProvider）
       - 批量操作 Schema 齐全（BatchUpload, BatchDelete, BatchUpdate）
       - 上传相关 Schema 专门定义（UploadFileDto, UploadFilesDto）
       - Entity 扩展合理（确保返回完整 URL）
       - 注释详细，代码可读性高

       🥈 第二名：site-config.model.ts

       优点：
       - 严格遵循 UpdateBase 模式
       - 业务验证规则完善
       - 特殊查询 Schema 定义合理（CategoryQuery, KeysQuery）
       - 结构清晰简洁

       🥉 第三名：category.model.ts

       优点：
       - 基础结构完整
       - 特殊 Schema 有明确的业务用途
       - 使用了 UpdateBase 模式

       7. 标准化建议

       7.1 推荐的标准模板：

       /**
        * [模块名称]模型定义
        * [模块描述]
        */

       import {
         createInsertSchema,
         createSelectSchema,
         createUpdateSchema,
       } from "drizzle-zod";
       import { z } from "zod";
       import { PaginationParams, SortParams } from "../helper/query-types";
       import { [tableName] } from "./[module].schema";

       // === 枚举定义（如果需要）===
       export const [EnumName] = z.enum([...]);
       export type [EnumName] = z.infer<typeof [EnumName]>;

       // === 基础 Schema ===
       const Insert = createInsertSchema([tableName], {
         // 字段验证规则（可选）
       });

       const UpdateBase = createUpdateSchema([tableName], {
         // 字段验证规则（可选）
       });

       const Select = createSelectSchema([tableName]);

       // === 业务 Schema ===
       const Create = Insert.omit({
         id: true,
         createdAt: true,
         updatedAt: true,
       }).extend({
         // 扩展字段（可选）
       });

       const Update = UpdateBase.omit({
         id: true,
         createdAt: true,
         updatedAt: true,
       }).extend({
         // 扩展字段（可选）
       });

       const Patch = UpdateBase.omit({
         id: true,
         createdAt: true,
         updatedAt: true,
       }).partial();

       const BusinessQuery = z.object({
         // 业务查询字段
       });

       const ListQuery = BusinessQuery.extend(PaginationParams.shape).extend(
         SortParams.shape
       );

       const Entity = Select.extend({
         // 实体扩展字段（可选）
       });

       // === 特殊业务 Schema（根据需要）===
       const [SpecialSchema] = z.object({
         // 特殊业务逻辑
       });

       // === 值聚合导出 ===
       export const [ModelName] = {
         // 基础 Schema
         Insert,
         Update,
         Select,
         // 业务 Schema
         Create,
         Patch,
         ListQuery,
         Entity,
         BusinessQuery,
         // 枚举（如果有）
         [EnumName],
         // 特殊 Schema（如果有）
         [SpecialSchema],
       } as const;

       // === 类型聚合导出 ===
       export type [ModelName] = {
         Insert: z.infer<typeof Insert>;
         Update: z.infer<typeof Update>;
         Select: z.infer<typeof Select>;
         Create: z.infer<typeof Create>;
         Patch: z.infer<typeof Patch>;
         ListQuery: z.infer<typeof ListQuery>;
         Entity: z.infer<typeof Entity>;
         BusinessQuery: z.infer<typeof BusinessQuery>;
         // 枚举类型（如果有）
         [EnumName]: z.infer<typeof [EnumName]>;
         // 特殊类型（如果有）
         [SpecialSchema]: z.infer<typeof [SpecialSchema]>;
       };

       7.2 关键规范建议：

       8. 始终使用 UpdateBase 模式
       9. 保持 Create/Update/Patch 的一致性
       10. 为复杂业务场景定义专门的 Schema
       11. Entity 应该包含前端展示需要的所有字段
       12. 批量操作使用标准的命名模式（BatchXxx）
       13. 添加必要的注释和类型文档

       这个分析为项目的类型系统标准化提供了明确的指导方向，建议以 media.model.ts 作为主要参考模板