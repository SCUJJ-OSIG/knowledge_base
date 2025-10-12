

# 一.异步代码的困境

1. ```js
   - function execCode(){
     setTimeout(()=>{},400)
   
   
   - }
   
   execCode()
   ```

2. ```js
   - function execCode(callback){
     setTimeout(()=>{},400)
   
       callback()
   - }
   
   execCode(()=>{
       console.log("外界监听")
   })
   ```

3. ```js
   - function execCode(counter,successcallback,failcallback){
     setTimeout(()=>{},400)
      if(){
           succusscallback()
           }
      else{
           failecallback()
           }
   
       total+=1;
       callback(total)
   - }
   
   execCode(100,(value)=>{
       console.log("外界监听",value)
   },(err)=>{console.log(err)})
   ```

# 二.promise解决异步处理



```js


 

function  execCode(count){
const promise = new promise((resolve,rejesct)=>{
   //立即执行   
setTimeout(()=>{
    if(){
    resolve()
}
        else{
    reject()
}
`    },3000)
 }
}

}
 
 const promiose = exceCode(100)


 

promise.then().catch()


 


 
 
 
 
```



原始的promise存在的问题

1. 我们需要自己设计回调函数，回调函数的名称，回调函数的使用

2. 对于不同的人、不同的框架设计出来的方案是不同的，必须去看鄙人的文档



```js
const promise = new promise((resolve, reject) => {
  resoleve("");
  reject("");
});
promise
  .then((res) => {
    console.log();
  })
  .catch((err) => {});

const promise = new promise(() => {
  resolve(0);
  reject();
});
promise.then().catch();

const promise = new promise(() => {
  reject();
  resolve();
});
promise.then().catch();

```



2.认识promise的作用



3.promise的基本使用



4.promise
