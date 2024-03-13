# 前端算法入门系列

------

[toc]



- 1.常用数组方法、 2.常用字符串方法、 3.常用循环方法&高阶函数、 4.常用正则表达式、 5.数学知识

  

------

## 介绍

此篇属于的第一篇，主要介绍常用的数组方法、字符串方法、遍历方法、高阶函数、正则表达式以及相关数学知识。

- [前端算法入门一：刷算法题常用的JS基础扫盲](https://juejin.cn/post/7087134135193436197)
- [前端算法入门二：时间空间复杂度&8大数据结构的JS实现](https://juejin.cn/post/7087286814230183943)
- [前端算法入门三：5大排序算法&2大搜索&4大算法思想](https://juejin.cn/post/7088725301974269960)
- [前端面试算法高频100题（附答案，分析思路，一题多解）](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fhovinghuang%2Ffe-agorithm-interview)

> 文章主要包含以下内容：
>
> - 数组常用方法
> - 字符串常用方法
> - 常用遍历方法&高阶函数
> - 常用正则表达式
> - 数学知识

## 一、数组常用方法

### 1.push()

在尾部追加，类似于压栈，原数组会变。

```js
const arr = [1, 2, 3]
arr.push(8)
console.log(arr) // [1, 2, 3, 8]
```

### 2.pop()

在尾部弹出，类似于出栈，原数组会变。数组的 push & pop 可以模拟常见数据结构之一：栈。

```js
const arr = [1, 2, 3]
const popVal = arr.pop()
console.log(popVal) // 3
console.log(arr) // [1, 2]

// 数组模拟常见数据结构之一：栈
const stack = [0, 1]
stack.push(2) // 压栈
console.log(stack) // [0, 1, 2]

const popValue = stack.pop() // 出栈
console.log(popValue) // 2
console.log(stack) // [0, 1]
```

### 3.unshift()

在头部压入数据，类似于入队，原数组会变。

```js
const arr = [1, 2, 3]
arr.unshift(0)
console.log(arr) // [0, 1, 2, 3]
```

### 4.shift()

在头部弹出数据，原数组会变。数组的 push（入队） & shift（出队） 可以模拟常见数据结构之一：队列。

```js
const arr = [1, 2, 3]
const shiftVal = arr.shift()
console.log(shiftVal) // 1
console.log(arr) // [2, 3]

// 数组模拟常见数据结构之一：队列
const queue = [0, 1]
queue.push(2) // 入队
console.log(queue) // [0, 1, 2]

const shiftValue = queue.shift() // 出队
console.log(shiftValue) // 0
console.log(queue) // [1, 2]
```

### 5.concat()

concat会在当前数组尾部拼接传入的数组，然后返回一个新数组，原数组不变。

```js
const arr = [1, 2, 3]
const arr2 = arr.concat([7, 8, 9])
console.log(arr) // [1, 2, 3]
console.log(arr2) // [1, 2, 3, 7, 8, 9]
```

### 6.indexOf()

在数组中寻找该值，找到则返回其下标，找不到则返回-1。

```js
const arr = [1, 2, 3]
console.log(arr.indexOf(2)) // 1
console.log(arr.indexOf(0)) // -1
```

### 7.includes()

在数组中寻找该值，找到则返回true，找不到则返回false。

```js
const arr = [1, 2, 3]
console.log(arr.includes(2)) // true
console.log(arr.includes(4)) // false
```

### 8.join()

将数组转化成字符串，并返回该字符串，不传值则默认逗号隔开，原数组不变。

```js
const arr = [1, 2, 3]
console.log(arr.join()) // ‘1, 2, 3’
console.log(arr) // [1, 2, 3]
```

### 9.reverse()

翻转原数组，并返回已完成翻转的数组，原数组改变。

```js
const arr = [1, 2, 3]
console.log(arr.reverse()) // [3, 2, 1]
console.log(arr) // [3, 2, 1]
```

### 10.slice(start，end)

从start 开始截取到end，但是不包括end

```js
const arr = [1, 2, 3, 4, 5]
console.log(arr.slice(1, 4)) // [2, 3, 4]
console.log(arr) // [1, 2, 3, 4, 5]
```

### 11.splice(start, deleteCount, item1, item2……)

- start参数 开始的位置
- deleteCount要截取的个数
- 后面的items为要添加的元素
- 如果deleteCount为0，则表示不删除元素，从start位置开始添加后面的几个元素到原始的数组里面。
- 返回值为由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组。
- 这个方法会改变原始数组，数组的长度会发生变化

```js
const arr3 = [1, 2, 3, 4, 5, 6, 7, "f1", "f2"];
const arr4 = arr3.splice(2, 3) // 删除第三个元素以后的三个数组元素(包含第三个元素)
console.log(arr4); // [3, 4, 5];
console.log(arr3); // [1, 2, 6, 7, "f1", "f2"]; 原始数组被改变

const arr5 = arr3.splice(2, 0, "wu", "leon"); 
// 从第2位开始删除0个元素，插入"wu","leon"
console.log(arr5); // [] 返回空数组
console.log(arr3); // [1, 2, "wu", "leon", 6, 7, "f1", "f2"]; 原始数组被改变

const arr6 = arr3.splice(2, 3, "xiao", "long");
// 从第 2 位开始删除 3 个元素，插入"xiao", "long"
console.log(arr6); // ["wu", "leon", 6]
console.log(arr3); //[ 1, 2, "xiao", "long", 7, "f1", "f2"]

const arr7 = arr3.splice(2); // 从第三个元素开始删除所有的元素
console.log(arr7);// ["xiao", "long", 7, "f1", "f2"]
console.log(arr3); // [1, 2]
```

### 12.sort()

- 对数组的元素进行排序，并返回数组。
- 默认排序顺序是在将元素转换为字符串，然后比较它们的UTF-16代码单元值序列时构建的。
- 由于它取决于具体实现，因此无法保证排序的时间和空间复杂性。 可参考 [MDN：Sort](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FArray%2Fsort)

```js
const arr = [1, 2, 3]
arr.sort((a, b) => b - a)
console.log(arr) // [3, 2, 1]
```

### 13.toString()

将数组转化成字符串，并返回该字符串，逗号隔开，原数组不变。

```js
const arr = [1, 2, 3, 4, 5]
console.log(arr.toString()) // ‘1, 2, 3, 4, 5’
console.log(arr) // [1, 2, 3, 4, 5]
```

## 二、字符串常用方法

### 1.charAt()

返回指定索引位置处的字符。类似于数组用中括号获取相应下标位置的数据。

```js
var str = 'abcdefg'
console.log(str.charAt(2)) // 输出 'c' 
console.log(str[2]) // 输出 'c'
```

### 2.concat()

类似数组的concat()，用来返回一个合并拼接两个或两个以上字符串。原字符串不变。

```js
const str1 = 'abcdefg'
const str2 = '1234567'
const str3 = str1.concat(str2)
console.log(str3) // 输出 'abcdefg1234567'
```

### 3.indexOf()、lastIndexOf()

indexOf,返回一个字符在字符串中首次出现的位置,lastIndexOf返回一个字符在字符串中最后一次出现的位置。

```js
const str = 'abcdcefcg'
console.log(str.indexOf('c')) // 输出 '2'
console.log(str.lastIndexOf('c')) // 输出 '7'
```

### 4.slice()

提取字符串的片断，并把提取的字符串作为新的字符串返回出来。原字符串不变。

```js
const str = 'abcdefg'
console.log(str.slice()) // 输出 'abcdefg', 不传递参数默认复制整个字符串
console.log(str.slice(1)) // 输出 'bcdefg',传递一个，则为提取的起点，然后到字符串结尾
console.log(str.slice(2, str.length-1)) // 输出'cdef',传递两个，为提取的起始点和结束点
```

### 5.split()

使用指定的分隔符将一个字符串拆分为多个子字符串数组并返回，原字符串不变。

```js
const str = 'A*B*C*D*E*F*G'
console.log(str.split('*')) // 输出 ["A", "B", "C", "D", "E", "F", "G"]
```

### 6.substr(), substring()

- 这两个方法的功能都是截取一个字符串的片段，并返回截取的字符串。
- substr和substring这两个方法不同的地方就在于参数二，substr的参数二是截取返回出来的这个字符串指定的长度，substring的参数二是截取返回这个字符串的结束点，并且不包含这个结束点。而它们的参数一，都是一样的功能，截取的起始位置。
- 注意事项：substr的参数二如果为0或者负数，则返回一个空字符串，如果未填入，则会截取到字符串的结尾去。substring的参数一和参数二为NAN或者负数，那么它将被替换为0。

```js
const str = 'ABCDEFGHIJKLMN'
console.log(str.substr(2))  // 输出 'CDEFGHIJKLMN'
console.log(str.substring(2)) // 输出 'CDEFGHIJKLMN'

console.log(str.substr(2, 9))  // 输出 'CDEFGHIJK'
console.log(str.substring(2, 9))  // 输出 'CDEFGHI'
```

### 7.match()

match()方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配，并返回一个包含该搜索结果的数组。