---
date created: 2026-08-Sa 11:42:33
date modified: 2026-08-Sa 11:50:24
---

## 前置定义（二维坐标轴）

维度 1：**文件类型**

- `settings.json`：策略控制（权限、环境变量、模型参数、网络开关、插件）
    
- `.claude.json / .mcp.json`：MCP 服务清单
    

维度 2：**生效范围（全局 vs 项目）**

1. **全局（用户级别，所有仓库共享）**
    
    1. 策略文件：`%USERPROFILE%.claude\settings.json`
        
    2. MCP 文件：`%USERPROFILE%.claude.json`
        
2. **项目（当前仓库隔离）**
    
    1. 共享策略：`./.claude/settings.json`（可 git 提交）
        
    2. 私有本地策略：`./.claude/settings.local.json`（gitignore）
        
    3. 项目专属 MCP：`./.mcp.json`（可 git 提交，仓库独有工具）
        

---

## 一、配置文件二维对照表（精简版笔记）

### 1）settings 系列（策略、权限、环境、网络，**不放 MCP**）

|                                      |      |                                                   |
| ------------------------------------ | ---- | ------------------------------------------------- |
| 文件路径                                 | 层级   | 典型存放内容                                            |
| `%USERPROFILE%.claude\settings.json` | 全局   | 火山方舟网关地址、TOKEN、`skipWebFetchPreflight`、全局权限、超时、语言 |
| `项目/.claude/settings.json`           | 项目共享 | 团队统一约束、项目固定环境变量                                   |
| `项目/.claude/settings.local.json`     | 项目私有 | 本机临时密钥、个性化开关，不上 git                               |

> 核心规则：上层覆盖下层；中转网关、鉴权统一放在**全局 settings**，不要每个项目重复复制。

### 2）MCP 清单文件（只写 mcpServers）

|                             |        |                                     |
| --------------------------- | ------ | ----------------------------------- |
| 文件路径                        | 层级     | 使用场景                                |
| `%USERPROFILE%.claude.json` | 全局 MCP | 通用、跨项目复用的 MCP                       |
| `项目/.mcp.json`              | 项目 MCP | 仅当前仓库需要的工具（DB 脚本、项目专属 LSP、业务脚本 MCP） |
|                             |        |                                     |
|                             |        |                                     |

### 强制边界规则（写进指令给 AI）

1. ❌ 禁止把 `mcpServers` 写入 settings.json（新版不兼容）
    
2. ❌ 不要混用放置；策略和 MCP 清单文件彻底分离
    
3. 网关 / 鉴权环境变量**全部托管在全局 settings**，一处修改全项目生效
    

---




