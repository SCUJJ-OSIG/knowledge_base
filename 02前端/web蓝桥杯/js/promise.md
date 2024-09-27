# 二、步入正文，什么是Promise，能够解决什么问题？

我们知道，JavaScript的执行环境是单线程，所谓的单线程是指一个任务执行完成之后才可以执行下一个任务，如若某一个任务执行出错，会导致下一个任务无法执行。但是在JavaScript中也提供了一些异步模式。

以下是两段特别经典的异步模式：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
function　setTime(callback){
    setTimeout(()=>{
        callback();
        console.log("我被最后输出，惨那。");
    },0);
    console.log("异步执行代码。");
};
setTime(()=>{
    console.log("多会可以执行我呢？");
});

//异步执行代码。
//多会可以执行我呢？
//我被最后输出，惨那。
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
function getData(url,callback, errorCallback) {
  $.ajax({
    url: url,
    success: function (res) {
      //成功函数
      callback(res);
    },
    fail: function (res) {
      //失败函数
      errorCallback(res);
    }
  });
}

getData("../url/url",(res)=>{
    console.log("请求成功回调。");
},(res)=>{
    console.log("请求失败回调。");
})
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

上面的两段代码看起来貌似没有什么问题。

是的，并不存在什么问题。但是在需求的代码化中，这样的异步模式往往会出现嵌套的形式，那它的展现形式如下。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
setTime(()=>{
    setTime(()=>{
        setTime(()=>{
            setTime(()=>{

            });
        });
    });
    console.log("多会可以执行我呢？");
});
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
getData("../url/url",(res)=>{
    getData("../url/url",(res)=>{
        console.log("请求成功回调。");
    },(res)=>{
        console.log("请求失败回调。");
    })
    console.log("请求成功回调。");
},(res)=>{
    console.log("请求失败回调。");
})
```

### Promise


类似这样的层层嵌套，它的执行顺序就不好把握了，维护性以及可读性也就可想而知了。重要的是回调函数剥夺了我们使用 return 和 throw 这类关键字的能力。

1.说了这么多，我们的Promise该闪亮登场了✨，Promise 很好的解决以上全部问题，是异步编程的一种解决方案，它由社区最早提出和实现，ES6将其写进了语言标准，统一了用法，原生提供了 Promise 对象。

所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。

#### Promise对象有两个特点：

1】Promise对象的状态不受外界影响。Promise对象存在三种状态：pending（进行中）、fulfilled（已成功）和reject（已失败），只有异步操作的结果，可以决定是哪一种状态，任何其他操作都无法发变这个状态。

这也就是Promise这个名字的由来。他的英文意思就是“承诺”，表示通过其他手段无法改变。

2】一旦状态改变，就不会再变，任何时候都可以得到这个结果。

Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

Promise也有一些缺点。首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

### 2.基本用法：

ES6规定，Promise 对象是一个构造函数，用来生成Promise 实例。

下面的代码就是一个Promise 实例：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
var promise=new Promise(function(resolve,reject){
    //code
    if(/*异步操作*/){
        resolve();
    }else{
        reject();
    }
})
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

 Promise构造函数接受一个函数作为参数，该函数有两个参数分别是resolve和reject，它们也是函数。

resolve函数的作用是，将Promise 对象的状态从“未完成”（pending）==>“成功”（resolved），在异步操作成功时调用，并将异步操作结果，作为参数传递出去。

reject函数的作用是，将Promise 对象的状态从“未完成”（pending）==>“失败”（rejected），再异步操作失败时调用，并将操作报错的错误，作为参数传递出去。

`Promise`实例生成以后，可以用 `then`方法分别指定 `resolved`状态和 `rejected`状态的回调函数。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});

等同于

promise.then(
    value=>{
      // success
    },
    error=> {
      // failure
    }
);
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

`then`方法可以接受两个回调函数作为参数。第一个回调函数是 `Promise`对象的状态变为 `resolved`时调用，第二个回调函数是 `Promise`对象的状态变为 `rejected`时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受 `Promise`对象传出的值作为参数。

下面是一个 `Promise`对象的简单例子。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  });
}

timeout(100).then((value) => {
  console.log(value);
});

//done
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

上面代码中，`timeout`方法返回一个 `Promise`实例，表示一段时间以后才会发生的结果。过了指定的时间（`ms`参数）以后，`Promise`实例的状态变为 `resolved`，就会触发 `then`方法绑定的回调函数。

Promise 新建后就会立即执行。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
var promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

上面代码中，Promise 新建后立即执行，所以首先输出的是 `Promise`。然后，`then`方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以 `resolved`最后输出。

### 3.then用法：

前面说过，then方法的第一个参数是resolved状态的回调函数。第二个参数（可选）是rejected状态的回调函数。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
var promise=new Promies(function(resolve,reject){
   if(/*异步执行成功*/){
        resolve();
    }else{
        reject();
    }
})

promise().then(
    res=>{
        console.log(res);
    },error=>{
        console.log(error);
    }
)
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

因此可以采用链式写法，即then后在调用另一个then方法。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
promise()
    .then((res)=>{
        //code
        return res.a;
    })
    .then((res)=>{
        //code
        return res.b;
    })
    .then((res)=>{
        //code
        return res.c;
    }) 
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

上面的代码使用 `then`方法，依次指定了两个回调函数。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。

### 4.catch用法：

是用于指定发生错时的回调函数，即为Promise从未完成到失败的回调函数。

下面是这个例子。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
var promise = new Promise(function(resolve, reject) {
  reject();
});
promise.catch(function(error) {
  console.log(error);
});
// Error: test
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

另外，then方法指定的回调函数，在运行中抛出错误时，也会被catch方法捕获。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
var promise = new Promise(function(resolve, reject) {
  throw new Error('test');
});
promise.catch(function(error) {
  console.log(error);
});
// Error: test
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

上面代码中，`promise`抛出一个错误，就被 `catch`方法指定的回调函数捕获。

如果 Promise 状态已经变成 `resolved`，再抛出错误是无效的。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  throw new Error('test');
});
promise
  .then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
// ok
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

上面代码中，Promise 在 `resolve`语句后面，再抛出错误，不会被捕获，等于没有抛出。因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了。

Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 `catch`语句捕获。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

上面代码中，一共有三个 Promise 对象：一个由 `getJSON`产生，两个由 `then`产生。它们之中任何一个抛出的错误，都会被最后一个 `catch`捕获。

 一般来说，不要在 `then`方法里面定义 Reject 状态的回调函数（即 `then`的第二个参数），总是使用 `catch`方法。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
// bad
promise
  .then(function(data) {
    // success
  }, function(err) {
    // error
  });

// good
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  });
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

上面代码中，第二种写法要好于第一种写法，理由是第二种写法可以捕获前面 `then`方法执行中的错误，也更接近同步的写法（`try/catch`）。因此，建议总是使用 `catch`方法，而不使用 `then`方法的第二个参数。

5. all用法：提供了并行执行异步操作的能力，并且在所有异步操作完成后才执行回调函数 ==> 【谁跑的慢，以谁为准执行回调】。

看下面例子:

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
function runAsync1(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务1执行完成');
            resolve('随便什么数据1');
        }, 1000);
    });
    return p;          
}
function runAsync2(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务2执行完成');
            resolve('随便什么数据2');
        }, 2000);
    });
    return p;          
}
function runAsync3(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务3执行完成');
            resolve('随便什么数据3');
        }, 2000);
    });
    return p;          
}

Promise.all([runAsync1(),runAsync2(),runAsync3()]).then((res)=>{

}) 

//异步任务1执行完成
//异步任务2执行完成
//异步任务3执行完成
//["随便什么数据1","随便什么数据2","随便什么数据3"]
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

用Promise.all来执行，all接收一个数组作为参数，里面的值最终会返回Promise对象。这样三个异步操作的并行执行，等到它们都执行完后才会进入then里面。all会把三个异步操作的结果放到一个数组中传给then。也就是说有了all，你就可以并行执行多个异步操作，并且在一个回调函数中处理所有异步操作返回的数据。是不是炫酷吊炸天？有一个场景很适用这个，在素材比较多的应用，预先加载需要用到的各种资源，所有加载完后，我们在进行页面的初始化。

6.race用法：同样是并行异步操作，与all方法不同的是，率先完成异步操作的就立马执行回调函数 ==> 【谁跑的快，以谁为准执行回调】。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
function runAsync1(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务1执行完成');
            resolve('随便什么数据1');
        }, 1000);
    });
    return p;          
}
function runAsync2(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务2执行完成');
            resolve('随便什么数据2');
        }, 2000);
    });
    return p;          
}
function runAsync3(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务3执行完成');
            resolve('随便什么数据3');
        }, 2000);
    });
    return p;          
}

Promise.all([runAsync1(),runAsync2(),runAsync3()]).then((res)=>{

}) 

//异步任务1执行完成
//随便什么数据1
//异步任务2执行完成
//异步任务3执行完成
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

在then里面回调开始执行时，runAsync2()和runAsync3()并未停止，仍旧再执行，于是1秒后，输给了他们的结束标志。
