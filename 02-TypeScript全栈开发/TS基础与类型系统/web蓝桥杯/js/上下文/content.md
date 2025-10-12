执行环境

执行环境（执行上下文） 是js

每个执行环境都有一个与之关联的虚拟对象（上下文）

执行环境中定义的所有变量和函数都保存在这个执行上下文对象中，供解析器在处理数据时使用


全局预处理


1.通过var 生命的全局变量添加为window属性，置为undefined

2.使用function 关键字声明的全局函数添加为window的方法，值为函数体。


解释性：边编译边执行   

编译型：先进行编译处理，后运行


JavaScript有谁来解释：V8

解释以后谁来执行，结果如何处理，渲染到页面



![1710206210251](image/content/1710206210251.png)

parse：转义

ast：抽象语法树

ignition：编译器

bytecode：字节码

deoptimization：优化    内联缓存技术


turbofan

optimized code：最佳代码


![1710206573507](image/content/1710206573507.png)


variableDeclarator 变量声明符

variable变量


```js
Program{
  type:"Program"
  body:[
    variableDeclaration{
        type:"variableDeclarator"
        declarator:[
          variableDeclaration:{
             type:"variableDeclarator"
             id:Identifier{
                type:"identifier"
                name:"a"
            }
         init:Literal=$node{
            type:'Literal'
            value:''heyi
            raw:"heyi"
        }
    }
   ]
}
]
     kind:"let"

 }

```



js 是单线程


先执行同步代码，在执行微任务，在宏任务

![1710210114725](image/content/1710210114725.png)

垃圾回收机制：

引用计数：，缺点明显

标记清除

标记清除压缩

cheney，是母亲用在V8新生代垃圾回收
