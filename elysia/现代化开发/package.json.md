---
date created: 2025-12-一 12:08:18
date modified: 2025-12-一 12:08:31
---

```json
{
  // --- 基础元数据 (通用) ---
  "name": "my-esm-learning-project",
  "version": "1.0.0",
  "description": "一个纯 ESM 项目的示例配置",

  // --- 🔥 ESM 核心开关 (关键) ---
  // 将此字段设置为 "module" 是告诉 Node.js：
  // "项目中所有的 .js 文件默认都当作 ESM 处理 (使用 import/export)，而不是 CommonJS。"
  "type": "module",

  // --- 🚪 入口文件配置 (现代 vs 传统) ---

  // [现代 ESM 推荐] Exports 字段 (Node.js 12.7+)
  // 它提供了“条件导出”和“路径封装”，是 ESM 时代的“看门人”。
  "exports": {
    // "." 代表 `import 'pkg'` 时引用的文件
    ".": {
      // 这里的顺序很重要！
      "types": "./dist/index.d.ts",   // TypeScript 类型定义
      "import": "./dist/index.js",    // ESM 环境 (如 import) 只有这里生效
      "require": "./dist/index.cjs"   // (可选) 兼容 CommonJS 环境 (如 require)
    },
    // 允许外部通过 `import 'pkg/utils'` 访问特定文件
    "./utils": "./dist/utils.js"
    // 如果不在这里列出，外部即使知道路径也无法 import 项目内部的其他文件 (封装性)
  },

  // [传统/过时] Main 字段
  // 在没有 "exports" 的旧版 Node.js 或工具中，这是默认入口。
  // 在纯 ESM 项目中，它主要用于向后兼容，或者指向一个 CJS 文件。
  "main": "./dist/index.cjs",

  // [TypeScript] 类型定义入口
  // 为了兼容某些旧版 TS 解析策略，通常指向主声明文件。
  "types": "./dist/index.d.ts",

  // [浏览器/构建工具] (非标准，但常用)
  // 某些打包工具 (如 Webpack, Rollup) 会优先查找此字段作为 ESM 入口。
  // 随着 "exports" 的普及，这个字段的重要性正在降低。
  "module": "./dist/index.js",

  // --- 🛠️ 脚本与依赖 (通用) ---
  "scripts": {
    // 注意：在 ESM 中运行脚本，Node.js 可能会强制要求文件扩展名 (.js)
    "start": "node src/index.js",
    "build": "tsc"
  },

  // --- ⚡ 引擎限制 (建议) ---
  "engines": {
    // 明确要求 Node.js 版本，因为旧版本对 ESM 支持不完善
    "node": ">=14.17.0"
  },

  // --- 🗑️ 其他常见但可能“过时”或 CJS 特有的字段 ---
  
  // "browser": 这是一个旧的规范，用于指定在浏览器环境下的入口文件。
  // 现在通常通过 "exports" 中的 "browser" 条件来替代。
  // "browser": "./dist/browser.js",

  // "directories":用于指定库结构的旧字段 (如 lib, bin, man)，现代工具很少依赖它。
  // "directories": { "lib": "lib" },

  "dependencies": {
    // 生产环境依赖
  },
  "devDependencies": {
    // 开发环境依赖 (如 TypeScript, ESLint)
  }
}
```