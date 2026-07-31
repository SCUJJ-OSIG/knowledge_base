---
date created: '2026-07-五 10:42:34'
date modified: '2026-07-31'
tags:
  - 技术/typescript/版本更新
  - 技术/前端/更新汇总
title: TypeScript 5.x → 6.0 → 7.0 全版本更新汇总帖
---

## 前言

TS5.x 是功能完善、兼容友好的稳定周期；TS6.0 是**JS 编译器最后一版过渡版本**，大量旧配置、语法标记废弃、默认行为全面收紧，为 7.0 底层 Go 重写铺路；TS7.0 基于 6.0 全部规则，废弃项直接硬报错，底层并行编译速度提升近 10 倍，新增稳定类型排序、Unicode 模板字面量推断、#/ 子路径导入等特性。 本文分三大块：5.x 全系列核心新特性、6.0 行为变更 / 废弃 / 新 API、7.0 继承 6.0 规则 + 独有更新，附带 Next 项目升级避坑要点。

## 一、TypeScript 5.x 全版本核心更新（5.0 ~ 5.9）

### 5.0 里程碑更新

1. **标准化 ES 装饰器** 原生支持 Stage3 官方装饰器，提供`ClassDecoratorContext`、`MethodDecoratorContext`，废弃旧实验性装饰器。

2. **const 泛型参数**

   ```ts
   function get<const T>(arr: T[]) {}
   get(["a", "b"]); // T 锁定字面量 ["a","b"]，不再宽化为string[]
   ```

3. `satisfies` 操作符 校验变量匹配类型但不改变推导结果：

   ```ts
   const data = { a: 1 } satisfies Record<string, number>;
   ```

4. 性能大幅优化，类型检查、增量编译提速

5. `--moduleResolution bundler` 正式推出，适配 Vite/Webpack/Next 打包器解析规则

### 5.1 函数返回类型自动推断增强

- 单分支 return undefined 函数无需手动标注`| undefined`

- 泛型函数多分支返回不同类型自动收敛

### 5.2 资源释放 `using` / `await using`

对标 ES 资源管理提案，自动执行 dispose：

```ts
using file = openFile();
await using conn = db.connect();
```

新增`Symbol.dispose`/`Symbol.asyncDispose`内置类型。

### 5.3 闭包保留类型缩小、`NoInfer`工具类型

- 循环 / 回调内变量缩小不丢失；

- `NoInfer<T>`阻止泛型参数从目标反向推导。

### 5.4 正则语法校验、对象分组 API 类型

- 校验正则无效转义字符；

- 内置`Object.groupBy`、`Map.groupBy`完整类型。

### 5.5 自动推导类型谓词、独立声明文件

- 自动识别`function isX(v): v is X`无需手动标注；

- `--isolatedDeclarations` 支持单文件生成 d.ts，适配打包工具。

### 5.6 ~ 5.9 小幅迭代

1. 5.8：标记`assert`导入语法废弃，推荐`with`；

2. 5.9：支持`import defer`延迟导入、`nodenext`适配 Node20 模块规则；

3. 整体无大规模破坏性变更，仅少量废弃警告，可平滑升级。

## 二、TypeScript 6.0：承上启下，大规模默认行为变更（重点）

### （一）全新默认配置（升级必改 tsconfig）

1. `"strict": true` 默认开启（5.x 默认 false）

2. `"module": "esnext"` 默认

3. `target` 默认使用当年稳定 ES 版本（es2025）

4. `"noUncheckedSideEffectImports": true` 默认，拦截无效副作用导入

5. `"libReplacement": false` 默认，提升编译速度

6. `rootDir` 默认值改为`./`（tsconfig 所在目录）

   1. 源码放`src`必须手动写`"rootDir": "./src"`，否则输出目录错乱

7. `types` 默认值变为`[]`，不再自动加载全部`@types/*`

   1. Node/React 项目必须显式配置`"types": ["node"]`，否则丢失`process`、全局测试 API

   2. 恢复旧行为：`"types": ["*"]`（不推荐，拖慢编译）

### （二）废弃配置 / 语法（6.0 警告，7.0 直接报错）

#### 1. tsconfig 编译选项废弃

1. `baseUrl` 彻底废弃

   1. 迁移方案：paths 路径直接写项目根完整前缀

      ```json
      // 旧
      "baseUrl": "./src",
      "paths": {"@/*": ["*"]}
      // 新
      "paths": {"@/*": ["./src/*"]}
      ```

2. `target: es5` 废弃，最低支持 ES2015

3. `downlevelIteration` 废弃（仅 ES5 生效，现已无用）

4. `moduleResolution: node/node10/classic` 废弃，仅允许`bundler`/`nodenext`

5. `module: amd/umd/systemjs/none` 废弃，仅支持`esnext`/`preserve`

6. `esModuleInterop`、`allowSyntheticDefaultImports` 禁止设为`false`，永久开启

7. `alwaysStrict` 禁止设为`false`，全部代码强制严格模式

8. `--outFile` 全局合并打包选项移除，改用 Vite/Rollup 等外部打包器

#### 2. 代码语法废弃

1. `module` 关键字用于命名空间报错，替换为`namespace`

   ```ts
   // 废弃
   module Utils {}
   // 正确
   namespace Utils {}
   // declare module "xxx" 模块声明不受影响
   ```

2. 导入`assert {}` 废弃，统一替换`with {}`

   ```ts
   // 报错
   import json from "./data.json" assert { type: "json" };
   // 正确
   import json from "./data.json" with { type: "json" };
   ```

3. `/// <reference no-default-lib />` 指令失效，改用`noLib`配置

#### 3. 命令行行为变更

tsconfig 存在时，命令行直接传入文件路径直接报错，必须通过`--ignoreConfig`强制绕过。

### （三）类型推理核心行为优化（重大逻辑改动）

#### 1. 无 this 函数降低上下文敏感度，推断更稳定

5.x 中**对象字面量方法写法**如果参数无类型、顺序靠后会推导`unknown`；6.0 自动检测函数是否使用`this`，未使用则优先参与泛型推导，不再报错。

```ts
// 5.x报错y:unknown；6.0正常识别T=number
callIt({
  consume(y) {
    return y.toFixed();
  },
  produce(x: number) {
    return x * 2;
  },
});
```

箭头函数无此问题，6.0 统一对齐行为。

#### 2. 新增`stableTypeOrdering` 稳定类型排序标志

- 旧版：联合类型、对象属性排序受文件解析顺序影响，d.ts 输出不稳定、偶发随机报错；

- 开启后：基于类型内容固定排序，对齐 TS7 行为；

- 代价：类型检查速度下降最高 25%，仅用于 6→7 迁移排查，不建议长期开启；

- TS7 强制永久开启，无法关闭。

### （四）ES 新标准内置类型支持

1. **es2025 target/lib** 上线

   1. 新增`RegExp.escape`；

   2. Promise.try、迭代器、Set 新方法移入 es2025，不再归属 esnext。

2. **Temporal API 完整内置类型**（Stage4 时间标准）

   ```ts
   Temporal.Now.instant().add({ hours: 24 });
   ```

3. Map/WeakMap `getOrInsert`、`getOrInsertComputed` 内置 upsert 方法 一键简化 “存在则取，不存在则插入” 逻辑。

4. lib.dom 整合：`dom.iterable`/`dom.asynciterable` 并入 dom，无需额外引入

   ```json
   // 5.x需要 ["dom","dom.iterable"]
   // 6.x仅需 ["dom"]
   ```

### （五）模块系统新特性

1. 支持 Node.js `#/*` 子路径导入（bundler/nodenext 解析模式生效）

   ```json
   // package.json
   "imports": {"#/*": "./dist/*"}
   // 代码
   import util from "#/utils"
   ```

2. 新增组合模式：`module: commonjs` + `moduleResolution: bundler`，适配老 CommonJS 项目向 ESM 迁移。

## 三、TypeScript 7.0：Go 底层重写，6.0 规则强制执行

### （一）核心底层变革

1. 编译器完全使用 Go 重写，并行类型检查，编译速度提升约 10 倍；

2. 完全兼容 TS6 类型检查逻辑，6.0 无报错代码 7.0 无需修改即可运行；

3. TS6 仅警告的废弃项，7.0 全部改为**硬编译错误**，无法通过`ignoreDeprecations`屏蔽。

### （二）默认行为完全继承 TS6，且部分规则锁死不可关闭

1. 强制永久开启：

   1. `stableTypeOrdering: true`（无法手动关闭，类型排序永久稳定，d.ts 输出固定）

   2. `strict: true`、`alwaysStrict: true`

   3. `esModuleInterop: true`、`allowSyntheticDefaultImports: true`

   4. `noUncheckedSideEffectImports: true`

2. 不可修改默认值：

   1. `module: esnext`、`rootDir: ./`、`types: []`

3. 所有 TS6 废弃配置 / 语法直接抛编译错误，无降级兼容。

### （三）独有新增行为与特性

#### 1. 模板字面量 Unicode 推断逻辑重构（破坏性变更）

旧版按 UTF-16 代理对拆分 emoji 等多字节字符；7.0 按完整 Unicode 码点整体识别：

```ts
type Split<S> = S extends `${infer H}${infer T}` ? [H, T] : never;
// TS6: Split<"😀a"> → ["\ud83d", "\ude00a"]
// TS7: Split<"😀a"> → ["😀", "a"]
```

原有依赖 UTF-16 拆分的字符串类型工具需要重构。

#### 2. 废弃标志统一报错逻辑

- `ignoreDeprecations` 标志失效，6.0 废弃语法无法屏蔽错误；

- `target: es5`、`baseUrl`、`moduleResolution: node`等配置出现直接终止编译。

### （四）迁移配套提示

1. 升级路线建议：5.x → 6.0（修复所有废弃警告）→ 7.0，一步到位升 7 会批量爆红；

2. Next 项目必须修改：

   1. 添加`rootDir: "./src"`、`types: ["node"]`；

   2. 删除`baseUrl`，补全 paths 根路径；

   3. 统一`assert`导入为`with`；

   4. `moduleResolution: bundler`保持不变。

## 四、5.x/ 6.0 / 7.0 关键差异速查表

|                    |                        |                       |                           |
| ------------------ | ---------------------- | --------------------- | ------------------------- |
| 维度               | TS5.x                  | TS6.0                 | TS7.0                     |
| strict 默认        | false                  | true                  | true，不可关闭            |
| rootDir 默认       | 自动推断源码根         | ./                    | ./                        |
| types 默认         | 自动加载全部 @types    | []                    | []                        |
| baseUrl            | 可用                   | 废弃（警告）          | 废弃（硬报错）            |
| stableTypeOrdering | 无此选项               | 可选开启（降速）      | 永久强制开启              |
| this-less 函数推断 | 方法顺序靠后易 unknown | 自动优化无报错        | 同 6.0                    |
| Unicode 模板推断   | UTF-16 代理对拆分      | UTF-16                | Unicode 完整码点          |
| 废弃项处理         | 仅警告                 | 警告，可屏蔽          | 直接编译报错              |
| 编译器底层         | JS 单线程              | JS 单线程（最后一版） | Go 多线程并行，提速 10 倍 |
| #/* 子路径导入     | 不支持                 | 支持                  | 支持                      |
| dom.iterable       | 需要手动引入           | 合并进 dom            | 合并进 dom                |

## 五、Next.js 项目从 5.x 直升 7.0 最简改造清单

1. tsconfig 必加配置

```json
"strict": true,
"rootDir": "./src",
"types": ["node"],
"moduleDetection": "auto",
"verbatimModuleSyntax": true
```

2. 删除所有`baseUrl`，paths 补全`./src/`前缀

3. 全局替换`assert {type:"json"}` → `with {type:"json"}`

4. 移除`module xxx {}`旧式命名空间，改为`namespace`

5. 升级依赖：`typescript@7`、`next≥14.2`、`@types/node`最新版

6. include 路径缩小至`./src/**/*`，避免根目录文件干扰 rootDir 推导

需要我把这份内容整理成**可直接发布的掘金 / 知乎 markdown 帖子**（精简口语化、分升级踩坑章节）吗？
