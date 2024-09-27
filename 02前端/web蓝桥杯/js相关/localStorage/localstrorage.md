webStorage是是[HTML5](https://so.csdn.net/so/search?q=HTML5&spm=1001.2101.3001.7020)新出的标签，是本地存储的解决方案之一，有localStorage和sessionStorage两种方法。

1.sessionStorage(临时存储)：在浏览器打开期间存在包括页面重载

2.localstorage（长期存储）：关闭浏览器之后和数据依旧会一直存在

  

因而前端做数据存储，跨页面传值，[localStorage](https://so.csdn.net/so/search?q=localStorage&spm=1001.2101.3001.7020)是一个很好的方式，**以键值对的方式存储**，**也方便取值赋值**，下面说一说使用方法和一些常见的使用技巧。
1、设置值(存值)共有3种方式，localStorage相当于window对象下面的一个属性，所以有**[]**和**.**调用，但也具有自身的**setItem方法**



```js
localStorage["name"]= "mickle";      // []方法
localStorage.name = "mickle";        //.方法
localStorage.setItem('name','mickle');    // setItem自身方法

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190911181438730.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMzE4OTgz,size_16,color_FFFFFF,t_70)
2、取值：自身的方法是getItem

```js
localStorage["name"];       // []方法
localStorage.name;          //.方法
localStorage.getItem('name');    // getItem方法取值

```



3、改变值的方式（就是相当于给对应的key重新赋值，就会把原来的值覆盖掉）

```
localStorage['name'] = 'Lucy';                 // []方法
localStorage.name = 'Lucy';                   //.方法
localStorage.setItem('name','Lucy');         // setItem自身方法

```





4、移除某一个值：可以通过对象**删除属性的关键字delete**，也可用**自身的方法removeItem**

```
delete localStorage['name'];
delete localStorage.name;
localStorage.removeItem('name');     //removeItem 自身方法


```





5、获取所有的key

```ja
localStorage["name"]= "mickle"; 
    for(var i =0; i<localStorage.length;i++){
        console.log(localStorage.key(i));        //name   为key
    }
    
    
    for(var key in localStorage){
     console.log(key);    // name  length  key  getItem  setItem   removeItem  clear  共有7个
}


```

6、获取所有的值

```
localStorage.valueOf();    //取出所有值

```





7、清除所有的值：clear

```
localStorage.clear();

```



判断是否具有某个key，hasOwnProperty方法

```
localStorage.hasOwnProperty('name');   //true 或 false

```



9、注意事项：

```
1.localStorage特定于页面的协议，不是同一域名，不能访问。
2.有长度限制，5M左右，不同浏览器大小会有不同。
3.生命周期是永久的，但是数据实际是存在浏览器的文件夹下，可能卸载浏览器就会删除。
4.浏览器可以设置是否可以访问数据，如果设置不允许会访问失败。
5.兼容IE8以上浏览器
6.只能存储字符串类型，需要转成字符串存储。

```





