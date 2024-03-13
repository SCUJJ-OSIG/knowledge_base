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

>
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
