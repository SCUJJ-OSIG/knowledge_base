---
date created: 2026-08-Tu 09:49:50
date modified: 2026-08-Tu 09:54:51
---



## 文档目标

1. 将 `options: Option[]` 数组配置 → `options: Record<string, OptionConfig>` 对象配置，消除 `as const` 元组痛点
    
2. 参考 Elysia 实现**链式泛型累积**：`addCommand` 返回携带新增命令类型的全新 `Cerebro` 泛型实例
    
3. 新增 `defineCommand` 工厂函数，自动推导 `execute(ctx)` 内 `args` / `options` 类型
    
4. 统一参数 API：废弃 `argument` 单参数，统一使用 `arguments` 对象（对齐 boune）
    
5. 保持运行时兼容，上层只改动类型层 + 配置结构，核心解析逻辑少量适配
    

> 重要前置结论： **链式泛型仅负责顶层命令集合类型收集（命令名校验）；execute 上下文推导必须依靠** **`defineCommand`****，二者互补，不能互相替代。**

## 一、破坏性变更清单（Breaking Changes）

1. ❌ 删除旧结构
    

```ts
// 废弃
{
  argument: { name: "xxx", ... },
  options: [ { name: "loud", alias: "l", type: Boolean } ]
}
```

2. ✅ 新标准命令配置
    

```ts
{
  name: "greet",
  description?: string,
  // 统一 arguments 对象，不再区分 argument / arguments
  arguments: {
    username: { type: String, required: true, description: "用户名" }
  },
  // 对象形式 options key = option name
  options: {
    loud: { alias: "l", type: Boolean, description: "大声输出" }
  },
  execute: (ctx) => {}
}
```

## 二、完整类型源码（可直接并入库源码）

### 2.1 基础类型定义 `types.ts`

```typescript
/**
 * JS构造类型映射为TS原生类型
 */
type MapConstructorToType<T> =
  T extends typeof String ? string :
  T extends typeof Boolean ? boolean :
  T extends typeof Number ? number :
  T extends typeof BigInt ? bigint :
  unknown;

/**
 * 参数配置
 */
export interface ArgumentConfig {
  type: typeof String | typeof Boolean | typeof Number;
  required?: boolean;
  description?: string;
}

/**
 * 选项配置
 */
export interface OptionConfig {
  alias?: string;
  type: typeof String | typeof Boolean | typeof Number;
  description?: string;
  default?: unknown;
}

/**
 * 标准命令配置结构（新结构，对象options）
 */
export interface CommandShape {
  name: string;
  description?: string;
  arguments?: Record<string, ArgumentConfig>;
  options?: Record<string, OptionConfig>;
  execute: (context: CommandContext) => Promise<void> | void;
}

/**
 * 上下文基础类型（运行时原生结构）
 */
export interface CommandContext {
  args: Record<string, unknown>;
  options: Record<string, unknown>;
}

/**
 * 条件类型：根据命令配置推断 args / options 精确类型
 */
export type InferCommandShape<T extends CommandShape> = {
  args: {
    [K in keyof T["arguments"]]:
      T["arguments"][K]["required"] extends true
        ? MapConstructorToType<T["arguments"][K]["type"]>
        : MapConstructorToType<T["arguments"][K]["type"]> | undefined
  };
  options: {
    [K in keyof T["options"]]?: MapConstructorToType<T["options"][K]["type"]>
  };
};

/**
 * 工厂函数：defineCommand，实现execute上下文自动推导
 */
export function defineCommand<const T extends Omit<CommandShape, "execute">>(
  config: T & {
    execute: (ctx: InferCommandShape<T>) => Promise<void> | void;
  }
): T & {
  execute: (ctx: InferCommandShape<T>) => Promise<void> | void;
} {
  return config;
}
```

### 2.2 改造 Cerebro 主类（Elysia 链式泛型累积）`cerebro.ts`

```typescript
import type { CommandShape, InferCommandShape } from "./types";

/**
 * 泛型参数 Commands：命令名字 → 命令推断类型映射
 */
export class Cerebro<const Commands = {}> {
  readonly #internalCommands: CommandShape[];

  constructor(commands: CommandShape[] = []) {
    this.#internalCommands = [...commands];
  }

  /**
   * 核心改造：模仿Elysia链式，不返回this，返回全新泛型实例
   */
  addCommand<const Cmd extends CommandShape>(
    command: Cmd
  ): Cerebro<
    Commands & Record<Cmd["name"], InferCommandShape<Cmd>>
  > {
    const nextCommands = [...this.#internalCommands, command];
    // 新建实例，承载合并后的泛型
    return new Cerebro(nextCommands);
  }

  /**
   * 执行入口，可选增强：命令名类型校验
   */
  run(argv?: string[]): Promise<void> {
    // 原有解析逻辑，遍历 #internalCommands
    // 【运行时适配点】
    // 原解析器读取 options 数组，需要修改解析代码：
    // 遍历 Object.entries(options) 转成内部数组结构兼容解析逻辑
    return this.#executeParser(argv);
  }

  #executeParser(argv?: string[]): Promise<void> {
    // 原有库内置参数解析逻辑，此处省略
    throw new Error("implement parser");
  }

  /**
   * 获取原始命令列表（供内部解析器使用）
   */
  get commands(): CommandShape[] {
    return this.#internalCommands;
  }
}
```

## 三、使用示例（改造后对外 API）

```typescript
import { Cerebro, defineCommand } from "@visulima/cerebro";

// 1. 使用 defineCommand 自动推导 execute 上下文
const greet = defineCommand({
  name: "greet",
  description: "打招呼命令",
  arguments: {
    username: {
      type: String,
      required: true,
      description: "目标用户名",
    },
  },
  options: {
    loud: {
      alias: "l",
      type: Boolean,
      description: "是否大写输出",
    },
  },
  execute(ctx) {
    // ✅ 全自动类型推导！
    console.log(ctx.args.username); // string
    console.log(ctx.options.loud); // boolean | undefined
  },
});

// 2. Elysia风格链式调用，持续累积命令类型
const cli = new Cerebro()
  .addCommand(greet);

// cli 类型：Cerebro<{ greet: { args: { username:string }, options: { loud?: boolean } } }>

// cli.run(["greet", "Tom", "--l"]);
await cli.run();
```

## 四、运行时代码适配改动说明（重要！）

> **类型层改造完成后，必须修改参数解析运行时代码** 原来解析器预期：`options: OptionConfig[]` 现在用户传入：`options: Record<string, OptionConfig>`

在命令解析入口，增加一层转换：

```typescript
// 伪代码，在框架内部解析时执行
function normalizeCommand(cmd: CommandShape) {
  const optionEntries = Object.entries(cmd.options ?? {});
  // 对象 → 内部数组，兼容原有解析逻辑
  const optionsArray = optionEntries.map(([name, opt]) => ({
    name,
    ...opt,
  }));

  return {
    ...cmd,
    options: optionsArray,
  };
}
```

优势： ✅ 对外暴露优雅对象配置 ✅ 内部继续复用原有 argv 解析逻辑，最小改动

## 五、三大核心能力原理复盘（写入文档）

### 5.1 对象替代数组收益

- `keyof T["options"]` 直接提取选项名称，不需要遍历元组
    
- 用户不再强制书写 `as const`
    
- 配置可读性更高，对齐 boune
    

### 5.2 Elysia 式链式泛型收益

```ts
new Cerebro()                // Cerebro<{}>
  .addCommand(greet)         // Cerebro<{ greet: ... }>
  .addCommand(buildCommand);  // Cerebro<{ greet: ...; build: ... }>
```

未来可扩展：

```ts
// 类型安全调用，错误命令名直接TS报错
cli.runTyped("greet", { args: { username: "test" } });
```

### 5.3 defineCommand 为什么能解决 execute 推导

1. `defineCommand<const T>` 捕获完整命令配置字面量
    
2. `InferCommandShape<T>` 静态计算 args、options 类型
    
3. 直接约束 execute 回调参数类型
    
4. **推导作用域独立，不依赖外层 Cerebro 实例**
    

> 关键限制再次强调： 单纯改造 `Cerebro` 链式泛型，**无法实现 execute 内部类型推导**； `addCommand` 只是收纳容器，必须搭配 `defineCommand`。

## 六、对比原版 @visulima/cerebro 优劣

### ✅ 改进点

1. 移除 options 数组，消除 `as const` 负担
    
2. 废弃 `argument`/`arguments` 两套 API，降低混淆
    
3. execute 自动推导，不再手动声明接口
    
4. 链式调用类型持续累积，支持类型安全命令调用
    
5. API 风格贴近 Elysia，开发者学习成本更低
    

### ⚠️ 存在限制

1. **破坏性变更**：现有项目旧数组格式命令全部需要迁移
    
2. 动态运行时构造命令（插件动态注册）无法享受静态类型推导（和 boune 一致取舍）
    
3. 每次 `addCommand` 新建 Cerebro 实例，极端大量命令场景产生微小内存开销（Elysia 同样取舍，工程上可忽略）
    

## 七、迁移指南（给现有使用者）

### 旧写法（废弃）

```ts
cli.addCommand({
  name: "greet",
  argument: { name: "username", type: String, required: true },
  options: [
    { name: "loud", alias: "l", type: Boolean },
  ],
  execute: (ctx) => {
    // ctx.args / options unknown，需要手动标注
  },
});
```

### 新写法（推荐）

```ts
const greet = defineCommand({
  name: "greet",
  arguments: {
    username: { type: String, required: true },
  },
  options: {
    loud: { alias: "l", type: Boolean },
  },
  execute(ctx) {
    // 自动类型
  },
});
cli.addCommand(greet);
```

## 八、可选后续增强规划（文档拓展项）

1. 实现 `cli.runTyped<CommandName>(name, input)` 类型安全调用
    
2. 支持子命令 `subcommands` 配套泛型推导
    
3. 增加类型层面校验：禁止重复命令名称
    
4. 提供兼容层，临时兼容旧数组 options 格式（平滑迁移）
    