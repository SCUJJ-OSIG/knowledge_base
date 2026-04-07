---
name: "OPSX: Propose"
description: 提议一个新的变更 - 创建它并在一步中生成所有 artifacts
category: Workflow
tags: [workflow, artifacts, experimental]
---

提议一个新的变更 - 在一步中创建变更并生成所有 artifacts。

我将创建一个带有 artifacts 的变更：
- proposal.md（是什么和为什么）
- design.md（如何做）
- tasks.md（实施步骤）

当准备好实施时，运行 /opsx:apply

---

**输入**：`/opsx:propose` 之后的参数是变更名称（kebab-case），或者是对用户想要构建的内容的描述。

**步骤**

1. **如果没有提供输入，询问他们想要构建什么**

   使用 **AskUserQuestion 工具**（开放式，无预设选项）询问：
   > "您想要处理什么变更？描述您想要构建或修复的内容。"

   从他们的描述中，派生一个 kebab-case 名称（例如，"add user authentication" → `add-user-auth`）。

   **重要**：如果不知道用户想要构建什么，不要继续。

2. **创建变更目录**
   ```bash
   openspec new change "<name>"
   ```
   这将在 `openspec/changes/<name>/` 处创建一个带有 `.openspec.yaml` 的脚手架变更。

3. **获取 artifact 构建顺序**
   ```bash
   openspec status --change "<name>" --json
   ```
   解析 JSON 以获取：
   - `applyRequires`：实施前需要的 artifact ID 数组（例如 `["tasks"]`）
   - `artifacts`：所有 artifacts 的列表及其状态和依赖关系

4. **按顺序创建 artifacts 直到准备 apply**

   使用 **TodoWrite 工具**跟踪 artifacts 的进度。

   按依赖顺序循环遍历 artifacts（首先是没有待处理依赖的 artifacts）：

   a. **对于每个 `ready`（依赖满足）的 artifact**：
      - 获取指令：
        ```bash
        openspec instructions <artifact-id> --change "<name>" --json
        ```
      - 指令 JSON 包括：
        - `context`：项目背景（对您的约束 - 不要包含在输出中）
        - `rules`：artifact 特定规则（对您的约束 - 不要包含在输出中）
        - `template`：用于输出文件的结构
        - `instruction`：针对此 artifact 类型的 schema 特定指导
        - `outputPath`：写入 artifact 的位置
        - `dependencies`：为上下文读取的已完成 artifacts
      - 读取任何已完成的依赖文件以获取上下文
      - 使用 `template` 作为结构创建 artifact 文件
      - 应用 `context` 和 `rules` 作为约束 - 但不要将它们复制到文件中
      - 显示简要进度："已创建 <artifact-id>"

   b. **继续直到所有 `applyRequires` artifacts 完成**
      - 创建每个 artifact 后，重新运行 `openspec status --change "<name>" --json`
      - 检查 `applyRequires` 中的每个 artifact ID 是否在 artifacts 数组中具有 `status: "done"`
      - 当所有 `applyRequires` artifacts 完成时停止

   c. **如果 artifact 需要用户输入**（上下文不清楚）：
      - 使用 **AskUserQuestion 工具** 澄清
      - 然后继续创建

5. **显示最终状态**
   ```bash
   openspec status --change "<name>"
   ```

**输出**

完成所有 artifacts 后，总结：
- 变更名称和位置
- 创建的 artifacts 列表及简要描述
- 准备就绪："所有 artifacts 已创建！准备好实施。"
- 提示："运行 `/opsx:apply` 开始实施。"

**Artifact 创建指南**

- 遵循每个 artifact 类型的 `openspec instructions` 中的 `instruction` 字段
- schema 定义了每个 artifact 应该包含什么 - 遵循它
- 在创建新的 artifacts 之前读取依赖 artifacts
- 使用 `template` 作为输出文件的结构 - 填充其部分
- **重要**：`context` 和 `rules` 是对您的约束，不是文件的内容
  - 不要将 `<context>`、`<rules>`、`<project_context>` 块复制到 artifact 中
  - 这些指导您编写的内容，但绝不应出现在输出中

**护栏**
- 创建实施所需的所有 artifacts（由 schema 的 `apply.requires` 定义）
- 在创建新 artifact 之前始终读取依赖 artifacts
- 如果上下文严重不清楚，询问用户 - 但宁愿做出合理的决定以保持势头
- 如果存在该名称的变更，询问用户是否想要继续它或创建一个新的
- 在继续下一个之前验证每个 artifact 文件写入后是否存在