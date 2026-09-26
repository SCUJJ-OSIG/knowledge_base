---
date created: 2026-08-Sa 11:44:35
date modified: 2026-08-Sa 11:47:31
---

## 1. 内置工具禁令（直接写入全局 settings.permissions）

```json
//~.claude\settings.json
"permissions": {
  "deny": ["WebSearch"],
  "allow": ["WebFetch","Bash"]
}
```

配套 AI 强制指令：

> **禁止调用内置 WebSearch**。全网检索统一使用 Tavily MCP；已知 URL 页面读取使用独立 `fetch` MCP，兜底使用 Bash+curl。

### 网关补充说明

- 所有模型流量走火山方舟（全局 settings `ANTHROPIC_BASE_URL`）；
    
- **MCP 本地进程不走模型网关**：MCP 是本地独立子进程，API 请求由进程自身网络发出（Tavily、Brave、Ultracite 网络独立，不受模型中转影响）。
    

> 重点区分： 模型对话流量 → 经过方舟网关 MCP 工具自身网络请求 → 直连外网，需要自行处理网络连通