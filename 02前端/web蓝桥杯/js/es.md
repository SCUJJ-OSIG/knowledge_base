const常量不能再修改，必须初始化

文件路径和地址

### 解构赋值

```js
let  res =  {
    code:200,
    data:{
        list：["aaa","bbb","ccc"]}
}

let  {data:{list:[x,y,z]},code:co,err ="没有错误"} =res
console.log(x,co,err)
```

```js
let  res =  {
    code:200,
    data:{
        list：["aaa","bbb","ccc"]}
}
function test ({ code ,data:{list}} ){
console.log(code,list)}
```

```js
let myname ="kervin"
let [x,y,z] = myname
console.log(x,y,z)
```

### symbol

表示独一无二的值，原生数据类型有：

undefined， null , string , Number , object symbol

```js
解决：

let obj={
    name:"tzd"
    getname(){
console.log(this.name)}
}

obj.name ="tiecui" //回覆盖
obj.getname()

let name =Symbol() //生成一个symbol类型数据

obj[name] = "teicui"






symbol的特征
//不能运算
//显式调用tostring（）
//3.隐式转化boolean

eg:
let Keys ={
    name:Symbol,
    age:symbol,
    localtion:symbol,
    test:symbol}
let obj={
    [Keys.name]:"tzd",
    [keys.age]:18,
    [keys.localtion]:"zejiang"
    [leys.test](){
    console.log('hhh')}
}

console.log(obj[keys.name])


symbol传参标记作用

symbol无法被for ... in 遍历
用object.getOwnProertySymbols(obj)来遍历

Reflect.ownKeys(obj).forEach(item=>{
    console.log(item,obj[item])
})

eg:
const VIDEO = Symbol();
const AUDIO = sybmol();
const IMAGE = symbol();

function play(type){
    switch(type){
        case VIEDEO:
        console.log("视频播放")
        case AUDIO:
        console.log("音频播放")
        case IMAGE:
        console.log("图片播放")
      }
}
play(VIDEO)
```

#### set结构

没有重复的值

```js
l
et s1 =  new Set([1,2,3,4,1])

console.log([...s1]) //帮你把数组去重

console.log(Array.from(s1) ) //帮你把数组去重



//add 添加元素
let s2 =new Set([1,2,3])
s2.add(1)


for (let i of s1){
}

//size
console.log(s1.size)

//has 判断有没有
console.log(s1.has(5))

//delete
s1.delete(5)

s1.clear() //清空


set的key和value是一致的



//entries()可以遍历数组，拿到key,value
let arr = [ "aa","bb","cc"]
for(let [index.item] of arr.entries()){
    console.log(index,item)}
 }

set除了去重数组
set 可以去重对象吗
let arr = [1,2,3，"keewin","keewin",{name:"kerwin"},{name:"kerwin"}]

面试：
 复杂类型去重
function uni(arr){

    let res = new Set()
    return arr.filter((item)=>{
    let id = JSON.Stringify(item)
    if(res.has(id)){
        return false}
    else{
        res.add(id)
    return true}
    }
)}
```

#### map结构

键值对结合，但是间范围键的范围不限于字符产，各种类型的结构都可以变成键

```js
let m2 = new Map()
m2.set({a:1},"dalian")


for (let i of m1.values()){
console.log(i)}
for(let [index,item] of m1.entries()){
console.log(index,item)}
```

#### proxy代理

```js
let obj={}
let proxy =new Proxy(obj,{
    get(targget,key){
    console.log("get",target[key})
    return target[key]

},    set(target,key,value){
    console.log("set",target,key,value)
    if(key =="data"){
    box.innerHtML =value
} 
    tatget[key] = value
}
})
```

### ES7

1.求幂运算符

```
console.log(3**)
```

2.数组的includes方法

```js
[1,2,NaN].includes(NaN) //true
[1,2,NaN].indexOf(NaN) //-1
let arr = []
```

### ES8

```js
let obj  ={    name:"tzd",
        age:100,
     }
```

matchAll

```js
 let str = `

<ul>
    <li>1111</li>
    <li>222</li>
    <li>3333</li>
</ul>
`;

      let reg = /<li>(?<content>.*)<\/li>/g;

      let iobj = str.matchAll(reg);

      console.log(iobj);
      // console.log(iobj.next())
      // console.log(iobj.next())

      for (let i of iobj) {
        console.log(i.groups.content);
      }
```

顶层对象Global

console.log(global)

空值合并运算符？？：给一个默认值

&&  == ?.  可选链操作符

```js
function getData(){
try{
    console.log(aaaa)
}catch{
    throw new Error("传入的参数不符合规则",{cause:"少传入了参数"})
}

}

try{
    getData()
}catch(err){

    console.log(err,err.couse1)}
```

私有属性用#；
