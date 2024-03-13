# this的4种绑定规则


### 1.默认绑定

默认绑定是多用于函数中的，就比如上述的函数的传参。规则也很简单： **函数在哪个词法作用域里生效，this就指向哪里的作用域，最终指向全局。**


```js

var a=1

function foo(){
    console.log(this.a);
}
foo()
```

`foo`函数在全局里被调用，`this`代指的是 **全局作用域**.全局又定义了一个值为1的 `a`变量。


*那如果一个函数在另一个函数体内调用呢* ？

```js
 function foo(){
     var a =2;
     this.bar()
 }
 function bar() {
     console.log(this.a); 
 }
 foo()

```

foo()全局调用，this代指 全局  而全局没有定义a，所以是 `undefined`。

this有一个硬性规则： **this无法访问一个词法作用域内部的内容** 。  this指向全局，不会去找foo（）中的a



### 2.隐式绑定

```js
//定义一个函数 且在一个对象中分别调用和引用
function foo(){
    console.log(this.a);
}
var obj = {
    a : 2,
    foo: foo, //引用（拥有）
    foo1:foo() //调用
}
obj.foo()
console.log(obj.foo1);

//2
//undefined
```

函数被一个对象所拥有（引用），且再被调用时  此时this会指向该对象


而隐式绑定中还有一个特殊情况：**隐式丢失**

```js
function foo(){
    console.log(this.name);
}
var obj = {
    name :'Alice',
    foo:foo
}
var say = obj.foo // 函数引用被赋值给变量 say()
say()

//undefined
```


正常情况下，`this` 应该绑定到 `obj`，输出"Alice"。然而，将 `name` 赋值给 `say` 变量后，`say` 在全局上下文中被调用，此时 `this` 的绑定丢失,指向了全局，输出了 undefined。这是因为在全局上下文中，`this` 默认指向 `window`（浏览器环境）或 `global`（Node.js 等环境），而全局对象上并没有 `name` 属性。



### 3.显示绑定

显示绑定中会用到三种内置的方法：**call**方法 , **apply**方法 , **bind**方法。



### 4.new绑定

当一个函数通过 `new` 关键字来调用时，称之为构造函数调用，

此时会创建一个新的对象，并将这个新对象绑定到函数调用中的 `this` 上。

下面是一个使用 `new` 绑定的简单例子：

```js
function Person(name) { 
    // 在使用 new 时，this 将指向新创建的对象 
    this.name = name; 
} 
var alice = new Person('Alice'); 
console.log(alice.name); // 输出 "Alice"

```

实际上：使用 `new` 关键字时，构造函数内部发生了以下几个步骤：

1. 创建一个新的空对象。
2. 将新对象的内部 `[[Prototype]]` 属性（指向构造函数的原型对象）设置为构造函数的 `prototype` 属性。
3. 将构造函数内部的 `this` 绑定到新创建的对象上。
4. 执行构造函数内部的代码，对新对象进行初始化操作。
5. 如果构造函数没有显式返回一个对象，则返回新创建的对象。

那么需要注意的是，`new` 绑定是优先级最高的，如果同时存在多种绑定规则，`new` 绑定会覆盖其他规则。



### this与箭头函数

**箭头函数没有自己的 `this` 绑定或者说它没有this属性，相当于this写在了箭头函数外部，它会继承父作用域中的 `this`。**
