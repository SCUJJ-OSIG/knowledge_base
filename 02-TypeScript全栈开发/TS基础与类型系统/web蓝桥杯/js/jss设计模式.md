策略模式

```js

//将每个算法啊封装起来，策略模式属于对象行为模式，把使用算法的责任和算法的实现分隔开来
function calBonus(level,salary){
    if(level =="A"){
        return salary*4
    }
    if(level=="B"){
        return salary*3
    }
    if(level=="c"){
        return salary*2
    }
}

let strategry = {
    "A":(salary)=>{
        return salary*4
    },
    "B":(salary)=>{
        return salary*3
    },
    "C":(salary)=>{
        return salary*2
    }
}

function calBox2(level,salary){
    return strategy[level](salary)
}

eg：

let list =[{

    title :"",
    type:2
},
{

    title :"",
    type:3
},{

    title :"",
    type:1
}]

let obj = {
    1:{
        content:"审核中",
        className:"yellowitem"
    },
    2:{
        content:"已通过",
        className:"greenitem",

    },
    3:{
        content:"被驳回",
        className:"reditem"
    }
}




MediaQueryList.innerHTML = list.map(item =>{
    <li>
      <div>${item.title}</div>
      <div class="${obj[item.type].className}">
        ${obj[item.type].content}
        </div>  
      
            </li>
})

```


代理模式

```js

var star  ={
    name:"tiecui",
    workprice:10000
}


let proxy = new Proxy(star,{
    get (target,key ){
        if(key =="workPrice"){
            console.log("访问了")
        }
        return target[key]
      

    },
    set(target,key,value){
        if(key=="workprice"){
            console.log("设置了")
            if(value>1000){
                console.log("可以合作")
            }else{
                throw new Error("价钱不合适")
            }
        }
    
    }
})



```


观察者模式：

包含观察者目标和观察者

一旦观察目标改变，所有的观察者都被通知和更新。
