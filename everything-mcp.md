---
date created: 2026-08-Su 17:46:46
date modified: 2026-08-Su 17:46:51
---
总体判断

你的感觉是对的 —— 这个仓库的工程投入和它的实际功能严重不成比例，而且投入的地方全在外围，核心功能带着一个致命 bug 没人发现。

核心问题：42 次提交，没人测过它能不能用

提交类型分布很刺眼：

┌───────────────────────────────────┬──────┐
│               类型                │ 次数 │
├───────────────────────────────────┼──────┤
│ chore / chore(deps) / chore(sbom) │ 15   │
├───────────────────────────────────┼──────┤
│ ci                                │ 7    │
├───────────────────────────────────┼──────┤
│ docs / docs(skill)                │ 7    │
├───────────────────────────────────┼──────┤
│ fix（真正碰核心逻辑）             │ 2    │
└───────────────────────────────────┴──────┘

index.js 一共只被改过 5 次，其中 3 次全是围绕"怎么找到 es.exe"这一件事（硬编码 → 配置化 → 绝对路径）。没有一次提交碰过查询是怎么传给 e 到的那个让所有多词查询静默失效的 bug。

更讽刺的是 CI：

- run: npm run typecheck --if-present
- run: npm run lint --if-present
- run: npm test --if-present
- run: npm run build --if-present

而 package.json 里 "scripts": {} —— 完全是空的。所以这套跑在 ubuntu + windows 双矩阵、带 SHA 锁定、带 concurrency 取消、带最小权限声明的 CI，四个步骤因为 --if-present 全部跳过，实际上什么都没做。它是一个装饰品。有 CI 徽章的安心感，零验证能力。

这就是为什么那个 bug 能活到今天：没有一行测试，而唯一的"测试"是人肉在 Everything GUI 里打字 —— 而 GUI 恰好会自己分词，完美掩盖了 argv 层的 bug。

比例失衡

┌──────────────────────┬─────────────────────────────────────────┐
│         项目         │                  规模                   │
├──────────────────────┼────────────────────
│ 实际逻辑（index.js） │ 319 行，其中约 100 行是工具 schema 声明 │
├──────────────────────┼─────────────────────────────────────────┤
│ 文档                 │ 912 行（README 358 行独占鳌头）         │
├──────────────────────┼─────────────────────────────────────────┤
│ bundle/index.mjs     │ 34228 行                                │
├──────────────────────┼────────────────────
│ sbom.json            │ 178 KB                                  │
└──────────────────────┴─────────────────────────────────────────┘

   59 CHANGELOG.md
   29 skills/everything/SKILL.md
   26 skills/everything/README.md
  158 docs/superpowers/plans/2026-07-06-companion-skills.md
   84 docs/superpowers/specs/2026-07-06-companion-skill-design.md
  912 total

● Bash(cd /l/Documents/GitHub/everything-mcp && echo "=== 提交历史规模 ===" && git log --oneline | wc -l && echo && echo "=== 提交类型分布 ===" && git log --pretty=%s | sed 's/:.*//' | sort | uniq -c | sort -rn && echo && echo "=== index.js 是否被实质改过 ===" && git log --oneline -- index.js | wc -l && git log --oneline -- index.js | head -20)
=== 提交历史规模 ===
42

=== 提交类型分布 ===
      8 chore
      7 ci
      6 docs
      6 chore(deps)
      2 fix
      1 settings
      1 release
      1 fix(security)
      1 fix(deps)
      1 feat(skill)
      1 docs(skill)
      1 chore(sbom)
      1 add es.exe

      1 Add Claude Code plugin packaging
      1 Add CHANGELOG.md

=== index.js 是否被实质改过 ===
5
ca8b457 fix(security): resolve es.exe to an absolute path, never a bare filename
35882f8 fix: make es.exe path config-driven instead of hardcoded
5a48969 fix: exit on stdin EOF to avoid orphan accumulation
cd80327 Fix es.exe path and add Claude Code configuration
6980a79 Initial commit: Everything MCP Server v1.0.0
Shell cwd was reset to C:\Users\boer\Desktop

这些数字讲了一个很清楚的故事。我的评价：

总体判断

你的感觉是对的 —— 这个仓库的工程投入和它的实际功能严重不成比例，而且投入的地方全在外围，核心功能带着一个致命 bug 没人发现。

┐
│               类型                │ 次数 │
├───────────────────────────────────┼──────┤
│ chore / chore(deps) / chore(sbom) │ 15   │
├───────────────────────────────────┼──────┤
│ ci                                │ 7    │
├───────────────────────────────────┼──────┤
│ docs / docs(skill)                │ 7    │
├───────────────────────────────────┼──────┤
│ fix（真正碰核心逻辑）             │ 2    │
└───────────────────────────────────┴──────┘

index.js 一共只被改过 5 次，其中 3 次全是围绕"怎么找到 es.exe"这一件事（硬编码 → 配置化 → 绝对路径）。没有一次提交碰过查询是怎么传给 es.exe 的 —— 也就是我们刚才定位到的那个让所有多词查询静默失效的 bug。

更讽刺的是 CI：

- run: npm run typecheck --if-present
- run: npm run lint --if-present
- run: npm test --if-present
- run: npm run build --if-present

而 package.json 里 "scripts": {} —— 完全是空的。所以这套跑在 ubuntu + windows 双矩阵、带 SHA 锁定、带 concurrency 取消、带最小权限声明的 CI，四个步骤因为 --if-present 全部跳过，实际上什么都没做。它是一个装饰品。有 CI 徽章的安心感，零验证能力。

工具 schema 声明 │
├──────────────────────┼─────────────────────────────────────────┤
│ 文档                 │ 912 行（README 358 行独占鳌头）         │
├──────────────────────┼─────────────────────────────────────────┤
│ bundle/index.mjs     │ 34228 行                                │
├──────────────────────┼─────────────────────────────────────────┤
│ sbom.json            │ 178 KB                                  │
└──────────────────────┴─────────────────────────────────────────┘

一个包装 es.exe 的 CLI wrapper，真正的业务逻辑大概 100 行，却配了：AGENTS.md、CLAUDE.md、MEMORY.md、TODO.md、CHANGELOG.md、docs/superpowers/plans/、docs/superpowers/specs/（一份 158 行的"companion skills 计划"和 84 行的"设计规格"）、一个 178KB 的 SBOM、一个 Dependabot 自动合并流水线。

SBOM 和 Dependabot 自动合并用在一个只有 @modelcontextprotocol/sdk 一个生产依赖的项目上 —— 这是给有几百个传递依赖的企业级服务准备的工具。这里是拿供应链安全的重型机械去守一扇没有墙的门。

具体技术问题

138KB 的第三方 PE 二进制进版本库。这有几个问题：分发 voidtools 的二进制有许可问题；无法验证完整性（没有 checksum）；而且 resolveEsPath() 压根不去找 bin/ 目录 —— 它探测 Program Files、WinGet、scoop，唯独不看仓库自带的这个。所以这个二进制既有风险又没被用上。

3. 错误处理把"无结果"和"真失败"混为一谈

if (code !== 0 && code !== 1) { reject(...) }
// ...
text: result.stdout || "No results found",

code 1 被当成"无结果"放过去了，然后只要 stdout 为空就回一句 "No results found"。stderr
被完全丢弃。所以语法错误、索引未就绪、Everyt全部对调用方呈现为"没找到文件"。我们排查了半小时才定位到 bug，很大程度就是因为这个：它一直在说"No results
found"，而不是告诉我们查询有问题。

4. parentPath 是个陷阱
它映射到 es.exe -parent-path，语义是"只匹配直接子项，不递归"。但 schema 里写的是 "Search only within this parent path" —— 读起来像递归限定目录。这个描述性错误直接误导了我（和我的记忆文件），我一开始就是用它去限定目录才踩空的。

- resolveEsPath() 的安全考量是对的 —— 注释里明确解释了为什么不能 spawn 裸文件名（Windows 的 CreateProcess 会先搜当前目录，二进制植入风险）。这个意识很专业。
- stdin EOF 退出处理 —— 防止 /reload-plugins 后留下孤儿进程，这是踩过坑才会写的代码。
- CI 里 actions 用 SHA 锁定而非 tag —— 正确做法。
- 注释质量普遍不错，会解释"为什么"而不只是"做什么"。

结论

这是一个典型的**「脚手架驱动开发」**样本：所有能自动化生成、能从模板抄、能让仓库看起来专业的东西都齐了（CI、SBOM、Dependabot、多份 AI 指令文档、changelog、plugin 打包），但唯一不能自动生成的东西 —— 验证核心功能真的能工作 —— 完全缺失。

结果就是一个 319 行的 wrapper，外面裹着一层 含空格的查询都静默失效，而且这个 bug 从

优先级建议，按投入产出排序：

1. 修 splitQuery + 加真实测试，并在 package.json 里填上 "test" 让 CI 真的跑起来 —— 这一步就把 CI 从装饰品变成保障
2. 把 stderr 透传出来，区分"无结果"和"查询失败"
3. 修正 parentPath 的描述，或者干脆改成用 path: 拼进 query
4. 删掉 bin/es.exe（或者让 resolveEsPath 真的用它并加校验）
5. 砍掉 SBOM / Dependabot 自动合并这类与项目规模不匹配的重型配置

我已经把工作区还原到原始状态了（git status 干净，分支 fix/split-query-into-argv 还在但没有改动）。要不要我按上面 1–3 项做一版 PR？那三项加起来能把这个项目从"看着专业但不能用"变成"朴素但可靠"。

result: 评审完 everything-mcp：核心 bug 是 index.js:249 把整个查询塞成单个 argv，es.exe 不二次分词导致所有多词/排除查询静默返回空；仓库 42 次提交中 15 次 chore、7 次 ci、仅 2 次碰核心逻辑，CI 因 package.json 的 scripts 为空而四步全跳过形同装饰，912 行文档 + 178KB SBOM 包裹 319 行逻辑，比例严重失衡；工作区已还原未做修改。