---
date created: '2025-12-日 15:24:23'
date modified: '2026-07-31'
tags:
  - 技术/前端/javascript
  - 技术/前端/循环
  - 技术/typescript
title: for...of 与 for...in
---
在 TypeScript（以及 JavaScript）中，`for...in` 和 `for...of` 是两种不同的遍历语法，它们的用途、行为和适用场景有显著区别。下面详细说明它们的用法、差异以及各自的适用对象。

---

## 🔹 1. `for...in`

### ✅ 用途：
- 遍历**对象的可枚举属性名（key）**，包括数组的**索引（字符串形式）**。
- 主要用于**遍历对象的键（keys）**。

### 📌 语法：
```ts
for (let key in obj) {
  // key 是属性名（string 类型）
}
```

### 🧪 示例：

#### 遍历对象：
```ts
const person = { name: "Alice", age: 30 };
for (let key in person) {
  console.log(key, person[key]); 
  // 输出: "name" "Alice"
  //       "age" 30
}
```

#### 遍历数组（⚠️ 不推荐）：
```ts
const arr = [10, 20, 30];
for (let index in arr) {
  console.log(index, typeof index); // "0" "string", "1" "string", ...
  console.log(arr[index]);          // 10, 20, 30
}
```
> ❗注意：`index` 是 **字符串类型**（如 `"0"`），不是数字！且会遍历**所有可枚举属性**（包括手动添加的属性）：

```ts
arr.customProp = "hello";
for (let i in arr) {
  console.log(i); // "0", "1", "2", "customProp" ← 意外！
}
```

### ⚠️ 注意事项：
- 遍历的是**可枚举的自有属性 + 原型链上的可枚举属性**（建议用 `hasOwnProperty` 过滤）：
  ```ts
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 安全使用
    }
  }
  ```
- **不适用于数组的常规遍历**（容易出错）。

---

## 🔹 2. `for...of`

### ✅ 用途：
- 遍历**可迭代对象（iterable）的值（value）**。
- 支持：`Array`, `String`, `Map`, `Set`, `TypedArray`, `arguments` 等。

### 📌 语法：
```ts
for (let value of iterable) {
  // value 是元素值
}
```

### 🧪 示例：

#### 遍历数组（✅ 推荐）：
```ts
const arr = [10, 20, 30];
for (let value of arr) {
  console.log(value); // 10, 20, 30 （number 类型）
}
```

#### 遍历字符串：
```ts
for (let char of "hi") {
  console.log(char); // "h", "i"
}
```

#### 遍历 Set / Map：
```ts
const set = new Set([1, 2, 3]);
for (let val of set) {
  console.log(val); // 1, 2, 3
}

const map = new Map([["a", 1], ["b", 2]]);
for (let [key, val] of map) {
  console.log(key, val); // "a" 1, "b" 2
}
```

### ✅ 优点：
- 直接获取**值**，类型安全（TS 中推断准确）。
- 不会遍历非索引属性（如 `customProp`）。
- 支持 `break`, `continue`, `return`。
- **是遍历数组的首选方式之一**（与 `forEach`、`map` 等函数式方法并列）。

---

## 🔸 对比总结

| 特性 | `for...in` | `for...of` |
|------|------------|------------|
| 遍历内容 | **属性名（key）** | **值（value）** |
| 适用对象 | 普通对象、数组（不推荐） | 可迭代对象（Array, String, Set, Map...） |
| 数组索引类型 | `string`（如 `"0"`） | `number`（实际值） |
| 是否包含原型/自定义属性 | ✅ 是（需过滤） | ❌ 否 |
| 是否支持 break/continue | ✅ | ✅ |
| TypeScript 类型推断 | 较弱（key 为 `string`） | 强（value 为具体类型） |
| 推荐用于数组？ | ❌ 否 | ✅ 是 |

---

## ✅ 最佳实践建议

- **遍历数组** → 用 `for...of` 或数组方法（`.forEach`, `.map` 等）。
- **遍历对象的键值对** → 用 `Object.keys()`, `Object.entries()` + `for...of`：
  ```ts
  const obj = { a: 1, b: 2 };
  for (const [key, value] of Object.entries(obj)) {
    console.log(key, value);
  }
  ```
- **避免用 `for...in` 遍历数组**，除非你明确知道自己在做什么。

---

## 💡 补充：其他遍历数组的方法（TypeScript 友好）

```ts
const arr = [1, 2, 3];

// 1. for...of（推荐）
for (const item of arr) { }

// 2. 传统 for（性能最优，需索引时用）
for (let i = 0; i < arr.length; i++) { }

// 3. 函数式方法
arr.forEach(item => { });
arr.map(item => item * 2);
```

---

如有具体场景（如遍历对象、类数组等），欢迎进一步提问！
