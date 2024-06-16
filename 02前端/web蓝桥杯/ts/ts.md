# 1.基础类型

```
npm install typescript -g

运行tsc 文件名

node js文件
```

```
nodejs 环境执行ts
npm i @types/node --save-dev （node环境支持的依赖必装）
npm i ts-node --g
```

注意，使用构造函数 `Boolean` 创造的对象**不是**布尔值：

```ts
let createdBoolean: boolean = new Boolean(1)
//这样会报错 应为事实上 
new Boolean() 返回的是一个 Boolean 对象
```

```ts
let booleand: boolean = true //可以直接使用布尔值
let booleand2: boolean = Boolean(1) //也可以通过函数返回布尔值
```

## 4.空值类型

JavaScript 没有空值（Void）的概念，在 [TypeScript](https://so.csdn.net/so/search?q=TypeScript&spm=1001.2101.3001.7020) 中，可以用 `void` 表示没有任何返回值的函数

#### 与 `void` 的区别是，`undefined` 和 `null` 是所有类型的子类型。也就是说 `undefined` 类型的变量，可以赋值给 string 类型的变量：

### Any 类型 和 unknown 顶级类型

3.弊端如果使用any 就失去了TS类型检测的作用

# 2.接口和对象类型

1. //必须与接口保持一致

定义对象与接口一致

```ts
interface Person {
    b:string,
    a:string
}
const person:Person  = {
    a:"213"
}
//报错 
//必须与接口保持一致
```

```ts
//重名interface  可以合并
interface A{name:string}
interface A{age:number}
var x:A={name:'xx',age:20}
//继承
interface A{
    name:string
}

interface B extends A{
    age:number
}

let obj:B = {
    age:18,
    name:"string"
}
```

#### 可选属性 使用?操作符

```ts
//可选属性的含义是该属性可以不存在
//所以说这样写也是没问题的
interface Person {
    b?:string,
    a:string
}

const person:Person  = {
    a:"213"
}
```

#### 任意属性 [propName: string]

```ts
//在这个例子当中我们看到接口中并没有定义C但是并没有报错
//应为我们定义了[propName: string]: any;
//允许添加新的任意属性
interface Person {
    b?:string,
    a:string,
    [propName: string]: any;
}

const person:Person  = {
    a:"213",
    c:"123"
}
```

### 只读属性 readonly

readonly 只读属性是不允许被赋值的只能读取

```ts
//这样写是会报错的
//应为a是只读的不允许重新赋值
interface Person {
    b?: string,
    readonly a: string,
    [propName: string]: any;
}

const person: Person = {
    a: "213",
    c: "123"
}

person.a = 123 //error
```

## 添加函数

```ts
interface Person {
    b?: string,
    readonly a: string,
    [propName: string]: any;
    cb:()=>void
}

const person: Person = {
    a: "213",
    c: "123",
    cb:()=>{
        console.log(123)
    }
}
```

# 数组类型

```ts
//类型加中括号
let arr:number[] = [123]
//这样会报错定义了数字类型出现字符串是不允许的
let arr:number[] = [1,2,3,'1']
//操作方法添加也是不允许的
let arr:number[] = [1,2,3,]
arr.unshift('1')


var arr: number[] = [1, 2, 3]; //数字类型的数组
var arr2: string[] = ["1", "2"]; //字符串类型的数组
var arr3: any[] = [1, "2", true]; //任意类型的数组
```

### 数组泛型

```ts
let arr:Array<number> = [1,2,3,4,5]
```

### 用接口表示数组

一般用来描述类数组

```ts
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
//表示：只要索引的类型是数字时，那么值的类型必须是数字。
```

### 多维数组

```ts
多维数组
```

```ts
let data:number[][] = [[1,2], [3,4]];
```

### arguments类数组

```ts
function Arr(...args:any): void {
    console.log(arguments)
    //错误的arguments 是类数组不能这样定义
    let arr:number[] = arguments
}
Arr(111, 222, 333)



function Arr(...args:any): void {
    console.log(arguments) 
    //ts内置对象IArguments 定义
    let arr:IArguments = arguments
}
Arr(111, 222, 333)

//其中 IArguments 是 TypeScript 中定义好了的类型，它实际上就是：
interface IArguments {
[index: number]: any;
length: number;
callee: Function;
}
```

## 联合类型

```ts
//联合类型 支持座机字符串
let myPhone: number | string  = '010-820'
 //函数使用联合类型、
const fn = (something:number | boolean):boolean => {
     return !!something
}
```

## 交叉类型

```ts
//多种类型的集合，联合对象将具有所联合类型的所有成员


interface People {
  age: number,
  height： number
}
interface Man{
  sex: string
}
const xiaoman = (man: People & Man) => {
  console.log(man.age)
  console.log(man.height)
  console.log(man.sex)
}
xiaoman({age: 18,height: 180,sex: 'male'});
//18
//180
//male
```

## 类型断言

```
语法：　　值   as  类型　　 或　　 <类型>值 
       value  as  string        <string>value
```

```ts
 interface A {
       run: string
}

interface B {
       build: string
}

const fn = (type: A | B): string => {
       return type.run//run error
}
//这样写是有警告的应为B的接口上面是没有定义run这个属性的



interface A {
       run: string
}

interface B {
       build: string
}

const fn = (type: A | B): string => {
       return (type as A).run
}
//可以使用类型断言来推断他传入的是A接口的值
```

## `as const`

是对字面值的 **断言** ，与const直接定义常量是有区别的

```ts
// 数组
let a1 = [10, 20] as const;
const a2 = [10, 20];

a1.unshift(30); // 错误，此时已经断言字面量为[10, 20],数据无法做任何修改
a2.unshift(30); // 通过，没有修改指针
//const a2 = [10, 20]; 这句代码只是表示 a2 是一个常量引用，即不能重新给 a2 赋值，但它所指向的数组本身还是可变的。因此可以调用 a2.unshift(30) 在原数组基础上添加元素。
```

## 类型断言是不具影响力的

在下面的例子中，将 something 断言为 boolean 虽然可以通过编译，但是并没有什么用 并不会影响结果, 因为编译过程中会删除类型断言

```ts
function toBoolean(something: any): boolean {
    return something as boolean;
}

toBoolean(1);
// 返回值为 1
//
```

固定大小的不同类型值的集合，我们需要使用元组。

## 元组就是数组的变种

 **元组（Tuple）是固定数量的不同类型的元素的组合** 。

元组与集合的不同之处在于，元组中的元素类型可以是不同的，而且数量固定。元组的好处在于可以把多个元素作为一个单元传递。如果一个方法需要返回多个值，可以把这多个值作为元组返回，而不需要创建额外的类来表示。

```ts
let arr:[number,string] = [1,'string']


let arr2: readonly [number,boolean,string,undefined] = [1,true,'sring',undefined]

//当赋值或访问一个已知索引的元素时，会得到正确的类型：
let arr:[number,string] = [1,'string']
arr[0].length //error  //数字是没有length 的
arr[1].length //success


//元组类型还可以支持自定义名称和变为可选的
let a:[x:number,y?:boolean] = [1]

//对于越界的元素他的类型被限制为 联合类型
let arr:[number,string] = [1,'string']

arr.push(true)//error  boolean的参数不能赋值给string|numbers的参数
```

## **应用场景 例如定义excel返回的数据**

```ts
let excel: [string, string, number, string][] = [
    ['title', 'name', 1, '123'],
    ['title', 'name', 1, '123'],
    ['title', 'name', 1, '123'],
    ['title', 'name', 1, '123'],
    ['title', 'name', 1, '123'],
]
```

# 枚举类型

## 通过enum关键字定义我们的枚举

### 1.数字枚举

```ts
 //红绿蓝 Red = 0 Green = 1 Blue= 2 
//分别代表红色0 绿色为1 蓝色为2
enum Types{
   Red,
   Green,
   BLue
}

//默认就是从0开始的 可以不写值
enum Types{
   Red = 0,
   Green = 1,
   BLue = 2
}

//增长枚举
enum Types{
   Red = 1,
   Green,
   BLue
// Red使用初始化为 1。 其余的成员会从 1开始自动增长。
}
```

### 2.字符串枚举

```ts
//字面量（literal）是用于表达源代码中一个固定值的表示法（notation）。

//在一个字符串枚举里，每个成员都必须用字符串字面量
enum Types{
   Red = 'red',
   Green = 'green',
   BLue = 'blue'
}
```

### 3.异构枚举

```
//枚举可以混合字符串和数字成员
enum Types{
   No = "No",
   Yes = 1,
}
```

### 4.接口枚举

```ts
 enum Types {
      yyds,
      dddd
   }
   interface A {
      red:Types.yyds
   }

   let obj:A = {
      red:Types.yyds
   }
```

## `5.const`枚举

```ts
//let  和 var 都是不允许 声明只能使用const
//const 声明的枚举会被编译成常量

//普通声明的枚举编译完后是个对象

const enum Types{
   No = "No",
   Yes = 1,
}
```

## 6.反向映射

## 类型别名

type 关键字（可以给一个类型定义一个名字）多用于复合类型

```ts
type str = string
let s:str = "我是小满"
console.log(s);

 //定义函数别名
type str = () => string
let s: str = () => "我是小满"
console.log(s);

// 定义联合类型别名
type str = string | number
let s: str = 123
let s2: str = '123'
console.log(s,s2);

//定义值的别名
type value = boolean | 0 | '213'
let s:value = true
//变量s的值  只能是上面value定义的值
```

**type 和 interface 还是一些区别的 虽然都可以定义类型**

> 1.interface可以继承  type 只能通过 & 交叉类型合并
> 
> 2.type 可以定义 联合类型 和 可以使用一些操作符 interface不行
> 
> 3.interface 遇到重名的会合并 type 不行

**type高级用法**

```ts
//这些 TypeScript 类型判断表达式都在利用三元条件运算符 (? :) 来检查类型兼容性，并返回一个代表兼容结果的布尔值类型的数字（1 或 0）。

1 extends number ? 1 : 0：
//在这个表达式中，1 是一个字面量类型，它当然属于 number 类型，所以这个表达式的计算结果是 1，意味着 1 扩展自 number 类型。
type a = 1 extends number ? 1 : 0 //1

type a = 1 extends Number ? 1 : 0 //1

type a = 1 extends Object ? 1 : 0 //1

type a = 1 extends any ? 1 : 0 //1

type a = 1 extends unknow ? 1 : 0 //1

type a = 1 extends never ? 1 : 0 //0
```

![1710061581975](image/ts/1710061581975.png)

# never类型

[TypeScript](https://so.csdn.net/so/search?q=TypeScript&spm=1001.2101.3001.7020) 将使用 never 类型来表示不应该存在的状态(很抽象是不是)

```ts
// 返回never的函数必须存在无法达到的终点

// 因为必定抛出异常，所以 error 将不会有返回值
function error(message: string): never {
    throw new Error(message);
}

// 因为存在死循环，所以 loop 将不会有返回值
function loop(): never {
    while (true) {
    }
}
```

### never 与 `void` 的差异

```ts
    //void类型只是没有返回值 但本身不会出错
    function Void():void {
        console.log();
    }

    //只会抛出异常没有返回值
    function Never():never {
    throw new Error('aaa')
    }
```

```ts
//差异2   当我们鼠标移上去的时候会发现 只有void和number    never在联合类型中会被直接移除

type A = void | number | never
```

#### never 类型的一个应用场景

```ts
,type A = '小满' | '大满' | '超大满' | "小小满"

function isXiaoMan(value:A) {
   switch (value) {
       case "小满":
           break 
       case "大满":
          break 
       case "超大满":
          break 
       default:
          //是用于场景兜底逻辑
          const error:never = value;
          console.log(error)
          return error
   }
}
isXiaoMan("lanq")
//小小满,同时error回显示红色，ts及时检查
```

## Symbol（没学完）

## 自ECMAScript 2015起，`symbol`成为了一种新的原生类型，就像 `number`和 `string`一样。

`symbol`类型的值是通过 `Symbol`构造函数创建的。

可以传递参做为唯一标识 只支持 string 和 number类型的参数

```ts
let sym1 = Symbol();
let sym2 = Symbol("key"); // 可选的字符串key
```

## Symbol的值是唯一的

```ts
const s1 = Symbol()
const s2 = Symbol()
// s1 === s2 =>false
```

## 用作对象属性的键

```ts
let sym = Symbol();

let obj = {
    [sym]: "value"
};

console.log(obj[sym]); // "value"
```

## 使用symbol定义的属性，是不能通过如下方式遍历拿到的

```ts
const symbol1 = Symbol('666')
const symbol2 = Symbol('777')
const obj1= {
   [symbol1]: '小满',
   [symbol2]: '二蛋',
   age: 19,
   sex: '女'
}
// 1 for in 遍历
for (const key in obj1) {
   // 注意在console看key,是不是没有遍历到symbol1
   console.log(key)
}
// 2 Object.keys 遍历
Object.keys(obj1)
console.log(Object.keys(obj1))
// 3 getOwnPropertyNames
console.log(Object.getOwnPropertyNames(obj1))
// 4 JSON.stringfy
console.log(JSON.stringify(obj1))


//age
//sex
//[ 'age', 'sex' ]
//[ 'age', 'sex' ]
//{"age":19,"sex":"女"}


//如何拿到
// 1 拿到具体的symbol 属性,对象中有几个就会拿到几个
Object.getOwnPropertySymbols(obj1)
console.log(Object.getOwnPropertySymbols(obj1))
// 2 es6 的 Reflect 拿到对象的所有属性
Reflect.ownKeys(obj1)
console.log(Reflect.ownKeys(obj1))

//[ Symbol(666), Symbol(777) ]
//[ 'age', 'sex', Symbol(666), Symbol(777) ]
```

## Symbol.iterator 迭代器 和 生成器 for of

支持遍历大部分类型迭代器 arr nodeList argumetns set map 等

# 泛型

```ts
function num (a:number,b:number) : Array<number> {
    return [a ,b];
}
num(1,2)
function str (a:string,b:string) : Array<string> {
    return [a ,b];
}
str('独孤','求败')

//使用泛型来优化

function Add<T>(a: T, b: T): Array<T>  {
    return [a,b]
}

Add<number>(1,2)
Add<string>('1','2')
//使用不同的泛型参数名，只要在数量上和使用方式上能对应上就可以。
function Sub<T,U>(a:T,b:U):Array<T|U> {
    const params:Array<T|U> = [a,b]
    return params
}


Sub<Boolean,number>(false,1)
```

### 定义泛型接口

```ts
interface MyInter<T>{
(arg:T):T
}
function  fn<T>(arg:T):T{
return arg
}
let result:MyInter<number> = fn

result(123)
```

### 对象字面量泛型

```ts
let foo: { <T>(arg: T): T }

foo = function <T>(arg:T):T {
   return arg
}

foo(123)
```

### 泛型约束

```ts
 function getLegnth<T>(arg:T) {
  return arg.length //类型T上没有属性length
}
//+类型约束  interface
interface Len {
   length:number
}

function getLegnth<T extends Len>(arg:T) {
  return arg.length
}

getLegnth<string>('123')
```

### 使用keyof 约束对象

首先定义了T类型并使用extends关键字继承object类型的子类型，然后使用keyof操作符获取T类型的所有键，它的返回 类型是联合 类型，最后利用extends关键字约束 K类型必须为keyof T联合类型的子类型

```ts
function prop<T, K extends keyof T>(obj: T, key: K) {
   return obj[key]
}


let o = { a: 1, b: 2, c: 3 }

prop(o, 'a') 
prop(o, 'd') //此时就会报错发现找不到
```

### 泛型类

```ts
class Sub<T>{
   attr: T[] = [];
   add (a:T):T[] {
      return [a]
   }
}

let s = new Sub<number>()
s.attr = [1,2,3]
s.add(123)

let str = new Sub<string>()
str.attr = ['1','2','3']
str.add('123')
```





## 构造函数new () => Error



您实际上想要存储的是构造函数（即 `new` 一个错误实例的能力）

在 TypeScript 中，`new () => Error` 这样的类型表示一个构造函数签名。它意味着这是一个可以使用 `new` 操作符来调用的函数，调用时不需要任何参数，并且它会返回一个 `Error` 类型的实例（或其子类型）。这种类型常用于表示类的构造函数，使得你可以安全地存储和使用这些构造函数来创建对象实例，而不仅仅是指向某个具体实例的引用。



export const errorMapping: Record<ErrorCode, new () => Error> = {
 [ErrorCode.NETWORK_ERROR]: NetworkError,
 [ErrorCode.BAD_REQUEST]: BadRequestError,
 [ErrorCode.UNAUTHORIZED]: UnauthorizedError,
 [ErrorCode.FORBIDDEN]: BadRequestError,
 [ErrorCode.NOT_FOUND]: NotFoundError,
 [ErrorCode.SERVER_ERROR]: ServerError,
};







### `T[]`

`T[]` 是 TypeScript 中用来表示泛型数组的一种语法。这里，`T` 是一个泛型类型参数，代表任何可能的类型。当你看到 `T[]`，它意味着我们定义了一个数组，数组中的每个元素都是类型 `T`。泛型数组允许你在不知道具体类型或者希望类型能够根据上下文变化时，灵活地处理数组。例如，如果 `T` 被具体化为 `string`，那么 `T[]` 就等同于 `string[]`，即一个字符串数组。如果 `T` 是 `number`，则 `T[]` 就是一个数字数组。

### `<T>`

尖括号 `<T>` 在 TypeScript 中用于声明泛型类型参数。当它出现在类、接口、函数或其他类型定义之前时，表示这个定义是泛型的，并且可以接受一个或多个类型参数。在这个尖括号内的 `T` 是一个占位符，代表用户可以指定的实际类型。使用泛型可以让你的代码更加灵活和可复用，因为你可以创建不依赖于特定数据类型的结构，而是让这些类型成为参数。

例如，在接口定义中：

typescript

`interface MyArray<T> {   data: T[];   add(item: T): void; }`

这里，`<T>` 声明了 `MyArray` 是一个泛型接口，它有一个 `data` 属性，类型为 `T[]`（即一个元素类型为 `T` 的数组），以及一个 `add` 方法，该方法接收一个 `T` 类型的参数。当你实例化这个接口时，你可以指定 `T` 为任何你想要的具体类型，如 `MyArray<number>` 或 `MyArray<string>`。

总之，`T[]` 表示一个元素类型为泛型 `T` 的数组，而 `<T>` 则是用来声明类型参数的语法，它们共同构成了 TypeScript 泛型的核心概念，增强了代码的灵活性和类型安全性。









 问题: ts中,当我发起请求.定一个返回的内型,我需要他是通用的,不可避免设置为可选,当返回值时,希望赋值给一个没有可选类型,的类型,这时候报错不能将类型“undefined”分配给类型“EBook[]” 怎么处理





当你遇到“不能将类型 'undefined' 分配给类型 'EBook[]'”这样的错误时，通常是因为你尝试将一个可能是 `undefined` 的值赋给一个不允许为 `undefined` 的变量。在 TypeScript 中，确保类型安全的一种方式是正确处理可能缺失的数据。针对你的问题，有几种策略可以采用：

### 1. 使用非空断言操作符 (!)

如果你确定操作之后的值不会是 `undefined` 或 `null`，可以使用非空断言操作符 `!` 来告诉 TypeScript 编译器忽略可能的 `undefined` 或 `null` 检查。

typescript

`const response: AxiosResponse<EBook[], any> = /* 发起请求 */; const ebooks: EBook[] = response.data!; // 使用非空断言操作符 !`

**注意**: 这种做法要求你对代码逻辑有绝对的信心，否则可能会导致运行时错误。

### 2. 初始化为空数组

如果可能返回 `undefined`，初始化变量为一个空数组，然后根据实际情况决定是否填充数据。

typescript

`let ebooks: EBook[] = []; const response: AxiosResponse<EBook[] | undefined, any> = /* 发起请求 */; if (response.data) {   ebooks = response.data; }`

### 3. 使用类型守卫

如果响应数据可能有多种情况，可以使用类型守卫来确保只有在数据存在时才进行赋值。

typescript

`const response: AxiosResponse<EBook[] | undefined, any> = /* 发起请求 */; if (response.data !== undefined) {   const ebooks: EBook[] = response.data;   // 继续处理 ebooks }`

### 4. 默认值

在 Axios 请求的配置中，可以为 `.data` 设置一个默认值，以防它为 `undefined`。

typescript

`const response: AxiosResponse<EBook[], EBook[]> = axios.get(/* URL */, {   responseType: 'json', // 或其他配置   transformResponse: [(data) => (data ? JSON.parse(data) : [])], // 处理数据，确保不是 undefined }); const ebooks: EBook[] = response.data;`







在服务器返回的数据取出data,他有很多种类型可能,我需要再发起请求时,就传入返回的类型,方便我取值 ,我该怎么做

为了在发起请求时传入预期的返回类型，并根据不同的类型安全地取值，你可以采用泛型和类型守卫的方式来处理。下面是一个基于 TypeScript 的示例，展示了如何设计一个函数来处理不同类型的服务器响应，并在调用时指定预期的类型。

### 步骤 1: 定义泛型函数处理响应

首先，定义一个泛型函数来处理API响应，这个函数会接受一个类型参数`T`，表示预期的返回数据类型。

typescript

``async function fetchWithExpectedType<T>(url: string): Promise<T> {   const response = await fetch(url);   if (!response.ok) {     throw new Error(`HTTP error! Status: ${response.status}`);   }   return response.json() as Promise<T>; }``

### 步骤 2: 定义不同类型的数据模型

假设你的服务器可能会返回几种不同的数据结构，你需要为每种可能的返回类型定义一个接口或类型。

typescript

`interface User {   id: number;   username: string; } interface Product {   productId: number;   productName: string;   price: number; } // 根据实际情况定义更多类型...`

### 步骤 3: 调用函数时指定类型

当你调用`fetchWithExpectedType`函数时，明确指定你期望的返回类型。

typescript

`(async () => {   try {     // 示例1: 获取用户信息     const userData = await fetchWithExpectedType<User>('api/users/1');     console.log(userData.username); // 类型安全访问username属性     // 示例2: 获取产品详情     const productData = await fetchWithExpectedType<Product>('api/products/123');     console.log(productData.productName); // 类型安全访问productName属性   } catch (error) {     console.error('Fetch error:', error);   } })();`













pinia异步获取数据 ，怎样一加载，每次刷新，数据就会替代源数据，那种设计方法好， 请求写在pinia里，还是请后后把数据放在pinia







在Pinia中处理异步数据获取，通常推荐使用Actions来封装这些操作，使得状态管理更加清晰和可维护。下面是一种设计模式，可以帮助你在应用加载或刷新时自动获取并更新数据，确保数据能够替代源数据。

### 设计建议

1. **将数据请求逻辑放在Pinia store中**：这样做的好处是可以集中管理状态和与之相关的异步操作，提高代码的可复用性和可维护性。

2. **使用`actions`进行异步操作**：Pinia的store支持定义`actions`来处理异步逻辑，完成数据的获取和更新。

3. **利用Vue的生命周期钩子或路由守卫触发数据获取**：可以在Vue组件的`mounted`钩子或者使用Vue Router的全局守卫来确保每次页面加载或刷新时自动调用store中的action来获取数据。

### 示例代码

#### Pinia Store 示例

js

`// stores/yourDataStore.js import { defineStore } from 'pinia'; import { ref } from 'vue'; import axios from 'axios'; export const useYourDataStore = defineStore('yourData', () => {   const data = ref([]);   async function fetchData() {     try {       const response = await axios.get('/api/your-data-endpoint');       data.value = response.data; // 更新状态     } catch (error) {       console.error('Error fetching data:', error);     }   }   return { data, fetchData }; });`

#### Vue组件中使用

vue

`<template>   <div>     <ul>       <li v-for="item in yourData" :key="item.id">{{ item.name }}</li>     </ul>   </div> </template> <script setup> import { onMounted } from 'vue'; import { useYourDataStore } from '@/stores/yourDataStore'; const yourDataStore = useYourDataStore(); onMounted(() => {   yourDataStore.fetchData(); }); </script>`

### 路由守卫自动触发

如果你希望在每次进入特定路由时自动加载数据，可以使用Vue Router的全局守卫或路由元字段结合导航守卫。

js

`// router/index.js import { createRouter, createWebHistory } from 'vue-router'; import YourPage from '@/views/YourPage.vue'; import yourDataStore from '@/stores/yourDataStore'; const routes = [   {     path: '/your-page',     component: YourPage,     beforeEnter: (to, from, next) => {       yourDataStore.fetchData().then(() => next());     },   },   // ...其他路由 ]; const router = createRouter({   history: createWebHistory(),   routes, }); export default router;`





修复泛型，我是这样想的，在api层，写一个泛型，在store数据处理这里的异步传入目标返回的类型



从pinia中取值， 只要不解构是不是都是响应式的？





是的，从Pinia store 中获取的值只要不解构（即不使用展开操作符`...`将其转为普通对象或数组），它们都会保持响应式。Pinia 使用 Vue 的响应式系统来创建 store 中的状态，这意味着当你直接访问 store 中的某个状态（例如 `useEbooksStore().ebooks`），它会返回一个响应式引用。当你修改这个引用的值时，所有依赖于此值的组件将会自动更新。







pinia如何设计才最优雅，仓库是存值，api异步获取的值，存在pinia，现在我需要修改异步的值在使用，我是在把修改的代码放在pinia还是用的代码文件里面？？？









在Pinia的设计实践中，保持数据流的清晰和职责分离是非常重要的。对于您的情况，通常推荐将业务逻辑和数据处理尽量靠近数据存储本身，也就是Pinia store中。这样做的好处是，可以确保数据的变更逻辑集中管理，易于维护和理解。以下是推荐的做法：

### 1. 在Pinia Store中处理数据修改

如果修改异步获取的值涉及到一定的业务逻辑，那么最好直接在Pinia store中处理。这样做的好处是，所有的数据相关逻辑都集中在一处，便于管理和跟踪。

#### 示例代码

typescript

`// ebooks.store.ts import { defineStore } from 'pinia'; import { useApi } from '@/api'; import { BookListParam, EBook } from '@/views/type'; export const useEbooksStore = defineStore('ebooks', () {   // 状态   const ebooks = ref<EBook[]>([]);      // 异步获取数据   async function fetchEbooks(params: BookListParam) {     const response = await useApi().booklist(params);     ebooks.value = response.list.map(book => ({       ...book, // 假设这里有对原始数据的一些处理逻辑       customField: 'Custom Value', // 添加自定义字段     }));   }      // 提供修改数据的方法   function updateEbook(bookId: number, updateData: Partial<EBook>) {     const bookToUpdate = ebooks.value.find(book => book.id === bookId);     if (bookToUpdate) {       Object.assign(bookToUpdate, updateData);     }   }   return { ebooks, fetchEbooks, updateEbook }; });`

### 2. 在组件中使用修改后的值

组件只需关注如何展示数据和触发数据的获取与更新，具体的业务逻辑和数据处理则委托给store处理。

#### 示例代码

typescript

`// SomeComponent.vue import { defineComponent } from 'vue'; import { useEbooksStore } from './ebooks.store'; export default defineComponent({   setup() {     const ebooksStore = useEbooksStore();          // 获取数据     const { fetchEbooks } = ebooksStore;     fetchEbooks(someParams);     // 更新数据     const updateEbook = (id: number, newData: Partial<EBook>) => {       ebooksStore.updateEbook(id, newData);     };     return { ebooks: ebooksStore.ebooks, updateEbook };   }, });`

### 总结

- **数据获取与基础处理**：在Pinia store中完成，包括异步获取数据和对数据的基本处理或转换。
- **业务逻辑修改**：同样推荐在Pinia store中实现，这样可以集中管理数据变更逻辑，保持组件的纯净性。
- **组件层面**：负责数据的展示和触发store中的动作，尽量减少在组件内部直接修改数据的操作，保持组件的轻量级和可复用性。

这样的设计模式使得代码结构清晰，易于维护，也符合Vue和Pinia推荐的最佳实践。













**# Pinia 中异步操作和视图更新的深入剖析：避免空值读取和数据不一致

vue.js

2024-03-08 05:47:11

**Pinia 中异步操作和视图更新的深入理解**

**导言**

在现代前端开发中，状态管理库如 Pinia 发挥着至关重要的作用，使我们能够轻松地管理和更新应用程序状态。然而，当处理异步操作时，更新视图可能会变得棘手。本文将深入探讨 Pinia 中异步操作和视图更新之间的关系，并提供最佳实践以解决常见问题。

**异步操作与视图更新**

Pinia 采用响应式系统，这意味着它会自动检测状态的变化并相应地更新视图。然而，异步操作不会立即更新视图。在异步操作完成后，Pinia 会发出一个通知，促使视图进行更新。

**常见问题：空值读取**

一个常见的错误是试图在异步操作完成后立即访问状态。由于异步操作尚未完成，这会导致读取空值或过时值。为了解决这个问题，我们需要在异步操作完成后再更新视图。

**解决方案**

**方法 1：延迟更新**

一种方法是使用 `setTimeout` 或 `await` 在异步操作完成后延迟更新视图。例如：

```
const SetBmuTemperatureList = async () => {
  const res = await TempGetService(bmu_id.value);
  setTimeout(() => { // 延迟更新，确保异步操作完成
    BmuTemperatureList.value = res.data.temperature;
  }, 100); // 可以根据实际情况调整延迟时间
}
```

**方法 2：Reactivity 优化**

另一个解决方案是将异步操作的结果定义为一个计算属性。计算属性会在每次访问时自动重新计算，确保子组件始终获取最新值。

```
const BmuTemperatureList = computed(() => {
  return GetBmuTemperatureList() // 异步操作函数
})
```

**最佳实践**

以下是一些最佳实践，可帮助你在 Pinia 中管理异步操作和视图更新：

- **使用 reactivity 优化：** 尽可能将异步操作的结果定义为计算属性。
- **延迟更新：** 仅在异步操作完成后再更新视图。
- **使用状态管理库：** Pinia 等状态管理库可以简化异步操作的管理，并确保视图与应用程序状态保持同步。
- **监控网络请求：** 使用 `Network Inspector` 等工具监控网络请求的延迟，并相应地调整更新机制。
- **避免 DOM 操作：** 尽量在组件的 `setup` 或 `mounted` 生命周期钩子中处理异步操作，而不是在渲染函数中直接进行 DOM 操作。

**结论**

管理 Pinia 中的异步操作和视图更新对于创建响应式、健壮的前端应用程序至关重要。通过理解 Pinia 的响应式系统并应用最佳实践，我们可以避免空值读取和过时值，并确保我们的应用程序状态与视图始终保持一致。

**常见问题解答**

1. **为什么 Pinia 不立即更新视图？**  
   异步操作完成后，Pinia 会发出一个通知来触发视图更新。
2. **如何处理空值读取？**  
   通过延迟更新或使用计算属性，我们可以在异步操作完成后再读取状态。
3. **什么是 reactivity 优化？**  
   将异步操作的结果定义为计算属性，以确保每次访问时都能获取最新值。
4. **如何监控网络请求？**  
   使用 `Network Inspector` 等工具来监控网络请求延迟，并调整更新机制以确保及时更新视图。
5. **为什么避免在渲染函数中进行 DOM 操作？**  
   在渲染函数中进行 DOM 操作可能会导致视图更新不一致。最好在组件的 `setup` 或 `mounted` 生命周期钩子中处理异步操作。**
