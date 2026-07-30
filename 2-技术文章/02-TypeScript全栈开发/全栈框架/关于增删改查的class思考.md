---
date created: '2025-11-五 17:47:22'
date modified: '2025-11-五 18:08:49'
tags:
  - 技术文章
  - TypeScript全栈开发
  - 全栈框架
series: 全栈框架
---
# 全是静态方法的class不要用class
最近使用biome时，报了一个错
```ts
**`Avoid classes that contain only static members.`**  
（避免只包含静态成员的类）
```
我感到很奇怪，为什么不推荐给class的每一个函数标记为static？用来写增删改查的函数为什么都要用class呢？我在使用的时候感觉用不上new呢?
我只是需要一个盒子装方法，方法之间能够共用一个函数

我先是搜索了class在ts里面的用法：发现关键信息，class在ts中 == 值+类型
原文如下：

>在 TypeScript 中，**`class` 同时具有两个身份**：

|身份|说明|存在于|
|---|---|---|
|**值（value）**|一个可调用的构造函数（JavaScript 函数）|运行时（Runtime）|
|**类型（type）**|一个描述实例结构的类型|编译期（TypeScript 类型系统）|
举个例子：

```ts
class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  greet() {
    return `Hi, ${this.name}`;
  }
}
```

编译成 JavaScript 后（运行时）：

```js
// 这是一个函数！
function User(name) {
  this.name = name;
}
User.prototype.greet = function() { return `Hi, ${this.name}`; };
```
而在 TypeScript 类型系统中：

```ts
// User 也是一个类型，表示“User 实例的结构”
const u: User = new User("Alice");
```


这里感觉好像懂了class，一直被java的class误导，java中，一切反正使用class定义！


## 对于全是静态方法的class为什么不用class...


当你写：

```
class MathUtils {
  static add(a: number, b: number) { return a + b; }
}
```

 在运行时（JavaScript）：

- 生成了一个函数 `MathUtils`（虽然你永远不会 `new MathUtils()`）
- 这个函数有一个静态属性 `add`
- **但这个函数本身毫无用处！**

```
// 编译后
function MathUtils() {} // ← 完全没用的空函数！
MathUtils.add = function(a, b) { return a + b; };
```

> 💥 **这就是“无意义的运行时开销”**：你多了一个永远不用的函数对象。

---

 在类型系统（TypeScript）：

- `MathUtils` 也被当作一个**类型**（表示“MathUtils 实例的类型”）
- 但因为你**从不实例化它**，这个类型永远用不到！

```
// 这行代码毫无意义，也不会有人写
const x: MathUtils = ???; // 无法创建实例！
```


# 那使用ES6如何组织代码呢？

```ts
// 
export const xxxservice = {
	 columns: getTableColumns(adsTable),
	 async getxxxxList(params: AdsModel["ListQueryInput"]) {
	 const xx = xxxservice.columns  //状态只能这样使用了
	 }
}
```


# 什么时候该用 `class`？

`class`:创建**可实例化的对象**，支持封装、继承、多态|

只有当你满足以下**至少一条**时：

- 你会用 `new MyClass()` 创建实例 ✅
- 你需要实例属性（`this.xxx`）✅
- 你需要继承（`extends`）✅
- 你需要多态（不同子类有不同行为）




##  总结：如何理解 TS 中的 `class`

| 角度       | 理解                                                     |
| -------- | ------------------------------------------------------ |
| **本质**   | `class` = 构造函数（值） + 实例类型（类型）                           |
| **运行时**  | 会生成一个 JavaScript 函数（即使你不用 `new`）                       |
| **类型系统** | 会引入一个类型（即使你不用它）                                        |
| **纯静态类** | 浪费运行时 + 浪费类型系统 + 违背设计初衷                                |
| **正确替代** | 用 ES 模块（`export function`）或普通对象（`const obj = { ... }`） |


这里我很想知道为什么java这么喜欢class?


