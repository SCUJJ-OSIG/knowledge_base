---
date created: 2026-07-30T00:00:00.000Z
date modified: 2026-07-30T00:00:00.000Z
tags:
  - 项目/重构
  - 技能/项目管理
  - 体
  - 技能
形态: 教程型
场景: 网站构建
related:
  - 知识库管理规则
  - views.published.base
status: 待执行
series: 技能
---

# base 文件驱动的查询式博客重构计划

> 目标:把 my-blog 从"固定分类"改为"base 文件驱动",改 base 即改网站。

## 背景

旧方案:代码里写死 `if category === "技术"` 判断,加新分类要改代码。
新方案:网页读 `views.published.base`,从 `properties` 段自动生成筛选维度。**加新列 = 加新 chip,改 base = 改网站,前端零代码改动**。

参考依据:见 `知识库管理规则.md` v1.1(目录扁平化 + frontmatter 分类)。

---

## 第一阶段:base 文件定稿(vault 端)

### 1.1 重命名
- `views.base` → `views.published.base`
- 理由:文件名包含 `published` 是网页构建识别"我该读哪个 base"的约定
- 风险:零

### 1.2 简化内容
新版结构:

```yaml
filters:
  and:
    - 'file.ext == "md"'
    - 'published == true'

properties:
  形态:
    displayName: 形态
  场景:
    displayName: 场景
  tags:
    displayName: tags
  file.mtime:
    displayName: 修改时间

views:
  - type: table
    name: 全部已发布
    order:
      - file.name
      - 形态
      - 场景
      - tags
      - file.mtime
    slug: all
```

**对比现版的改动:**
- `properties` 段加 `tags` 字段
- `views` 段只留"全部已发布"一个总览视图(其他 3 个 view 是把 Obsidian 视图当网页 tab 的错误)
- `published` 字段从 `properties` 移除(只作过滤条件,不是展示列)

### 1.3 验证
在 Obsidian 打开 `views.published.base`,确认:
- 字段正确显示
- "全部已发布"视图列出 5 个 `published: true` 的笔记

**Abort 条件**:Obsidian 打开报错 → 修 YAML 语法。

### 1.4 提交
- `git commit -m "重命名并简化 base 文件,网页只读 properties 段"`

---

## 第二阶段:my-blog 解析器原型(只动一个新文件)

### 2.1 新建 `src/lib/base-parser.ts`
**输入**:`views.published.base` 的 YAML
**输出**:
```typescript
{
  filters: [...],
  dimensions: [
    { name: "形态", values: ["参考型", "教程型"] },
    { name: "场景", values: ["网络", "编程环境", "团队协作"] },
    { name: "tags", values: [...] }
  ],
  columns: ["形态", "场景", "tags"]
}
```

**实现要点**:
- 用 `yaml` npm 包解析 YAML
- 自己实现简化版 filter 求值器(只支持 `==`、`!=`、单层 `and`)
- 不引入 Obsidian 完整依赖,纯 Node 代码

### 2.2 测试脚本 `scripts/test-base.ts`
- 读 `H:\main\knowledge_base\views.published.base`
- 扫 vault 所有 `.md` 文件,读 frontmatter
- 调用 parser 输出 schema
- `console.table` 打印

**预期输出**:5 个 `published: true` 笔记,3 个维度(形态/场景/tags)。

**Abort 条件**:parser 输出和预期对不上 → 修 parser。

### 2.3 跑通命令
```bash
bun x tsx scripts/test-base.ts
# 或 bun run scripts/test-base.ts(看你的 tsconfig)
```

### 2.4 提交
- `git commit -m "新建 base-parser,纯 Node 解析 views.published.base"`

---

## 第三阶段:页面渲染(改 my-blog 的 3 个文件)

### 3.1 新建 `src/lib/views.ts`
- 扫 vault,读每篇 frontmatter
- 过滤 `published === true` 的笔记
- 输出 `BlogPost[]` 列表
- **slug** 用 `file.name` 生成(目录不再参与 URL),重名加 hash

### 3.2 改 `src/lib/posts.ts`
- **删** `getAllCategories()`、`getPostsByCategory()`
- **改** `getAllPosts()` 改读 `views.ts` 输出
- **保留** `getPostBySlug()`、`getPostNavigation()`

### 3.3 删 `src/app/[...category]/page.tsx`
- 旧分类路由作废
- 删整个 `src/app/[...category]/` 目录

### 3.4 改 `src/app/page.tsx`(首页)
**布局**:
```
┌────────────────────────────────────────┐
│ 🔍 搜索(可选,后期加)                    │
├────────────────────────────────────────┤
│ 形态: [参考型] [教程型]                  │
│ 场景: [网络] [编程环境] [团队协作]        │
│ tags: [用/版本控制] [体/工具] ...        │
├────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐              │
│ │ 卡片 │ │ 卡片 │ │ 卡片 │              │
│ └──────┘ └──────┘ └──────┘              │
└────────────────────────────────────────┘
```

**筛选实现(方案二选一)**:

| 方案 | 优点 | 缺点 |
|------|------|------|
| A 纯 URL 路由 | 零 JS、能分享、能前进后退 | 每次点 chip 刷新页面 |
| B URL + JS 增强 | 顺滑 | 多 30 行 JS |

**推荐 A**——纯静态,符合"成本最低+可控"原则。

### 3.5 改 `src/app/posts/[slug]/page.tsx`
- 已有则只改 slug 解析(从 `params.slug` 直接定位 .md,不查 category)
- 没有则新建,沿用现有 MDX 渲染流程

### 3.6 跑通
```bash
bun x next dev
```
浏览器 `http://localhost:3000`,**预期**:
- 顶部 3 行 chip(形态/场景/tags)
- 5 张卡片
- 点击 chip 过滤
- 卡片点击进文章,内容正常

### 3.7 验证"加列"工作流(整套方案核心价值)
- `views.published.base` 的 `properties` 加 `教程: { displayName: 教程 }`
- 1 篇笔记 frontmatter 加 `教程: 协议基础`
- 重启 dev server
- **预期**:首页多一行 "教程" chip,**前端代码零改动**

**Abort 条件**:加列后没反应 → 检查 properties 字段名是否对应 frontmatter。

### 3.8 提交(2-3 个 commit)
- `重构:删 [...category] 路由,改用 base 驱动的 query 筛选`
- `新增 chip 栏筛选器,首页改为卡片墙`
- `验证:加列工作流测试通过`

---

## 第四阶段:静态构建验证

### 4.1 生产构建
```bash
bun run build
```
检查 `out/`:
- `out/index.html` 存在
- `out/posts/<slug>/index.html` 存在
- **无** `out/category/.../index.html`(旧路由作废的证据)

### 4.2 本地起服务
```bash
npx serve@latest out
```
验证 chip 工作、文章可访问、静态资源正常。

### 4.3 提交
- `chore: 验证生产构建产物正确`

---

## 第五阶段:目录扁平化(可选,最后做)

### 5.1 触发条件
前四阶段跑通、读者验证网页 OK 后才考虑。

### 5.2 风险评估
- `![[]]` 嵌入:Obsidian 用文件名定位,**目录无关**
- 跨文件 `[[]]` 链接:同上
- **唯一风险**:文件名冲突

### 5.3 迁移策略
- 写 `scripts/flatten.ts`:
  - 扫所有 `.md` 文件
  - 检测重名
  - 重名文件加 `形态-` 前缀
  - 移动到 vault 根的 `notes/` 子目录
  - 生成迁移报告

### 5.4 提交
- `重构:目录扁平化,使用形态前缀避免重名`

---

## 待确认决策点(执行前需拍板)

| 决策 | 选项 | 推荐 |
|------|------|------|
| 1. base 文件命名 | (a) `views.published.base` / (b) `views.base` 不改名 | (a) |
| 2. 筛选交互 | (a) 纯 URL / (b) URL+JS | (a) |
| 3. 目录扁平化时机 | (a) 跑通后再做 / (b) 跟第一阶段一起 | (a) |

---

## 时间预估

| 阶段 | 工作量 |
|------|--------|
| 1 | 10 分钟 |
| 2 | 1-2 小时 |
| 3 | 2-3 小时 |
| 4 | 半小时 |
| 5 | 1-2 小时(可选) |
| **合计** | **半天到一天** |

---

## 执行检查清单

- [ ] 第 1 阶段:重命名 + 简化 + Obsidian 验证 + 提交
- [ ] 第 2 阶段:base-parser.ts + test-base.ts + 跑通 + 提交
- [ ] 第 3 阶段:views.ts + 改 posts.ts + 删 category 路由 + 改 page.tsx + dev 跑通 + 加列验证 + 提交
- [ ] 第 4 阶段:bun run build + npx serve + 验证产物 + 提交
- [ ] 第 5 阶段(可选):flatten.ts + 迁移 + 提交

---

## 相关文件

- `知识库管理规则.md` v1.1:本方案的规则依据
- `views.published.base`:本方案的 schema 源
- `my-blog/src/lib/posts.ts`:待重构的分类逻辑
- `my-blog/src/app/[...category]/page.tsx`:待删除的旧路由
