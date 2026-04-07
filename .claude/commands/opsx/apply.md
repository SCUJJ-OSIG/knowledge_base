---
name: "OPSX: Apply"
description: 从 OpenSpec 变更实施任务（实验性）
category: Workflow
tags: [workflow, artifacts, experimental]
---

从 OpenSpec 变更实施任务。

**输入**: 可选地指定变更名称（例如 `/opsx:apply add-auth`）。如果省略，检查是否可以从对话上下文中推断。如果模糊或含糊不清，必须提示可用的变更。

**步骤**

1. **选择变更**

   如果提供了名称，使用它。否则：
   - 如果用户提到了变更，从对话上下文中推断
   - 如果只有一个活动的变更存在，自动选择
   - 如果含糊不清，运行 `openspec list --json` 获取可用的变更，并使用 **AskUserQuestion 工具** 让用户选择

   始终宣布："使用变更：<name>" 以及如何覆盖（例如 `/opsx:apply <other>`）。

2. **检查状态以了解 schema**
   ```bash
   openspec status --change "<name>" --json
   ```
   解析 JSON 以了解：
   - `schemaName`: 正在使用的工作流（例如 "spec-driven"）
   - 哪个 artifact 包含任务（通常是 "tasks" 用于 spec-driven，其他情况检查状态）

3. **获取 apply 指令**

   ```bash
   openspec instructions apply --change "<name>" --json
   ```

   这将返回：
   - Context 文件路径（根据 schema 变化）
   - 进度（总数、已完成、剩余）
   - 带有状态的任务列表
   - 基于当前状态的动态指令

   **处理状态：**
   - 如果 `state: "blocked"`（缺少 artifacts）：显示消息，建议使用 `/opsx:continue`
   - 如果 `state: "all_done"`：祝贺，建议归档
   - 否则：继续实施

4. **读取 context 文件**

   读取 apply 指令输出中 `contextFiles` 列出的文件。
   文件取决于使用的 schema：
   - **spec-driven**: proposal、specs、design、tasks
   - 其他 schemas: 遵循 CLI 输出的 contextFiles

5. **显示当前进度**

   显示：
   - 使用的 schema
   - 进度："N/M 任务完成"
   - 剩余任务概述
   - 来自 CLI 的动态指令

6. **实施任务（循环直到完成或阻塞）**

   对于每个待处理任务：
   - 显示正在处理哪个任务
   - 进行所需的代码更改
   - 保持更改最小化和专注
   - 在 tasks 文件中标记任务完成：`- [ ]` → `- [x]`
   - 继续下一个任务

   **如果以下情况则暂停：**
   - 任务不清晰 → 请求澄清
   - 实施揭示设计问题 → 建议更新 artifacts
   - 遇到错误或阻塞 → 报告并等待指导
   - 用户中断

7. **完成或暂停时显示状态**

   显示：
   - 本次会议完成的任务
   - 总体进度："N/M 任务完成"
   - 如果全部完成：建议归档
   - 如果暂停：解释原因并等待指导

**实施期间的输出**

```
## 正在实施: <change-name> (schema: <schema-name>)

正在处理任务 3/7: <task description>
[...实施进行中...]
✓ 任务完成

正在处理任务 4/7: <task description>
[...实施进行中...]
✓ 任务完成
```

**完成时的输出**

```
## 实施完成

**变更:** <change-name>
**Schema:** <schema-name>
**进度:** 7/7 任务完成 ✓

### 本次会话完成
- [x] 任务 1
- [x] 任务 2
...

所有任务完成！您可以使用 `/opsx:archive` 归档此变更。
```

**暂停时的输出（遇到问题）**

```
## 实施暂停

**变更:** <change-name>
**Schema:** <schema-name>
**进度:** 4/7 任务完成

### 遇到的问题
<问题的描述>

**选项：**
1. <选项 1>
2. <选项 2>
3. 其他方法

您想做什么？
```

**护栏**
- 持续执行任务直到完成或阻塞
- 在开始之前始终读取 context 文件（来自 apply 指令输出）
- 如果任务含糊不清，在实施之前暂停并询问
- 如果实施揭示问题，暂停并建议更新 artifacts
- 保持代码更改最小化并局限于每个任务
- 在完成每个任务后立即更新任务复选框
- 在错误、阻塞或不清楚的需求时暂停 - 不要猜测
- 使用 CLI 输出的 contextFiles，不要假设特定的文件名

**灵活工作流集成**

此技能支持"对变更执行操作"模型：

- **可以随时调用**: 在所有 artifacts 完成之前（如果任务存在）、部分实施之后、与其他操作交错进行
- **允许 artifact 更新**: 如果实施揭示设计问题，建议更新 artifacts - 不受阶段锁定，灵活工作
