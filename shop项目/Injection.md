---
date created: 2026-01-五 21:47:31
date modified: 2026-01-六 09:08:49
---

以下是为你设计的**五阶段开发路线图**，帮助你一步步实现这个代码喷涂 MCP 工具。

---

### 第一阶段：基础设施与 MCP 协议对接

    
2. **定义 Context 结构**：实现 `get_business_context` 工具。
    
    - **核心逻辑**：使用 `ts-morph` 扫描 `table.schema.ts` 和 `relations.schema.ts`。
        
    - **返回给 AI**：不仅仅是表名，要返回一个包含 `columns` (name, type) 和 `relations` (with entity, type: one/many) 的结构化 JSON。
        
3. **模板发现机制**：实现 `list_templates` 工具。
    
    - **核心逻辑**：遍历 `autogen/templates` 目录，返回文件名清单（如 `list`, `tree`, `move`）以及每个模板顶部的“使用说明”注释。
        

### 第二阶段：SyncInstruction 引擎开发（核心注入逻辑）

这是最硬核的部分，你需要实现一个能理解 JSON 指令并操作 AST 的“执行器”。

1. **注入器基类**：基于你已有的 `pipeline.ts` 和 `ast-utils.ts`，构建一个 `InstructionExecutor`。
    
2. **实现“哨兵”定位**：
    
    - **Service 层**：定位类中带有 `/** @generated */` 的方法。如果 JSON 中有新方法，则调用 `classDec.addMethod`。
        
    - **Controller 层**：解析 Elysia 链式调用。核心是寻找 `PropertyAccessExpression`（如 `.get`），检查其 `getLeadingCommentRanges()` 是否包含 `// @generated`。
        
3. **模板填充算法**：
    
    - 开发一个简单的占位符替换引擎，将 JSON 中的 `meta` 信息（如 `relations`, `logic`）填充到 `.t.t` 模板文件中，生成最终的 TS 代码字符串。
        

### 第三阶段：多路径同步与 MCP 工具联调

让 AI 的指令可以横跨多个后端和前端项目。

1. **实现 `execute_sync(instruction)` MCP 工具**：
    
    - 接收你设计的 `SyncInstruction` JSON。
        
    - **读取配置**：从 `autogen.config.ts` 读取 `outputs` 路径。
        
    - **瀑布流执行**：
        
        - 先执行 Contract 同步。
            
        - 拿着 Service 的 Meta 信息更新 Service 文件。
            
        - **感应更新**：扫描更新后的 Service 方法，自动生成/更新 Controller 路由。
            
        - 最后扫描 Controller 路由，生成 Frontend Hooks。
            
2. **反馈机制**：工具执行完后，收集所有被修改文件的 `Diff` 片段，构造一个 `ExecutionReport` 返回给 AI。
    

### 第四阶段：AI 审核与微调（闭环）

让 AI 能够修正自己的错误。

1. **实现 `read_file_content` 工具**：允许 AI 查看生成后的代码细节。
    
2. **实现 `fix_instruction` 工具**：
    
    - 如果 AI 发现生成的代码逻辑有误（例如漏了一个参数），它可以发送一个增量指令。
        
    - 引擎定位到同一方法，再次通过 AST 替换其内容。
        

### 第五阶段：工程化与 AI 提示词（Prompt）优化

让 AI 像资深架构师一样思考。

1. **编写系统提示词 (System Prompt)**：
    
    - 告知 AI 这是一个“瀑布流感应架构”。
        
    - 告知命名规范：文件 `kebab-case`，类 `PascalCase`，变量 `camelCase`。
        
    - 强制要求 AI 在生成指令前必须先 `get_business_context`。
        
2. **自动化索引更新**：集成 `index.task.ts` 和 `router.task.ts`，让 AI 的同步指令执行完后，所有的 `import` 和路由注册都能自动完成。
    

---

### 💡 落地建议：从“最小可行性”开始

你可以按照以下顺序进行测试：

1. **MVP 1**：实现 `get_business_context`。让 AI 能正确说出你数据库里有多少张表、什么关系。
    
2. **MVP 2**：实现单层同步（只同步 Service）。验证 `/** @generated */` 标记是否会被准确识别和替换。
    
3. **MVP 3**：实现 Controller 感应。这是最爽的一步，验证“写 Service，自动出 API”。
    

