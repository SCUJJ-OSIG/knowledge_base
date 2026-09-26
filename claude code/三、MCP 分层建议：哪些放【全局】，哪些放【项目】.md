---
date created: 2026-08-Sa 11:48:13
date modified: 2026-08-Sa 11:49:18
---


## ✅ 推荐放入 全局 `.claude.json`（所有项目通用）

1. everything-search：本机文件检索，所有开发场景通用
    
2. fetch：通用网页抓取，替代内置 WebFetch
    
3. tavily（主力搜索）：全网技术资料检索
    
4. ultracite（可选）：通用代码知识库
    

> 共性：不绑定单一仓库，打开任何项目都需要

## ✅ 推荐放入 项目 `.mcp.json`（仅 TradeFlow 这类特定仓库）

1. codegraph：代码 AST 索引，**每个仓库独立分析**
    
2. context7：虽然通用，但如果你只在 TS / 全栈项目使用，也可放项目；
    
3. 数据库 MCP、Drizzle 工具、项目脚本 MCP、业务相关工具
    

## ❌ 绝对不要全局放置

任何和项目目录、数据库连接串、仓库路径绑定的 MCP。

