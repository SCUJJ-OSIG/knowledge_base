/*
 * @Author: PoRi 1960825664@qq.com
 * @Date: 2024-03-24 15:04:26
 * @LastEditors: PoRi 1960825664@qq.com
 * @LastEditTime: 2024-03-27 10:41:23
 * @FilePath: \知识库\web蓝桥杯\js\es.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

//es6
Promise  比回调函数更加强大啊

generator
let pro  =new Promise(function(resolve,reject)=>{
    setTimeout(()=>{
        resolve()
    },1000)
})

pro.then((res)=>{
    console.log("奖金",res)
}).catch(
    (err)=>{
        console.log("没有",err)
    }
)


function ajax(url){
return new Promise((resolve,reject)=>{
    let xhr =new XMLHttpRequest()
    xhr.open("get",url,true)
    xhr.send()
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4){
            if(xhr.status>=200&&xhr.status<300){
                resolve()
            }else{
                reject()
            }
        }
    }
})


}



ajax("1.json").then(res =>{
    console.log(res)
}).catch(err=>{
    console.log(err)
})


function *gen(){
    let res =yield "aaa"
    console.log("第一个请求的结果"+res)
    let res2 = yield "bbb"

}

function AutoRun(gen){
    let g = gen()
    function next(data){
        let res =g.next(data);
        if(res.done) return
        res.value.then(function (data){
            next(data)
        })
    }
    next()
}







//对象扩展
let obj ={
    name:"tzd",
    age:100
}
console.log(object.keys)
console.log(Object.values(obj))
console.log(Object.entries(obj))



//对象快速转化为map
let m = new Map(["a",1],["b",2])
let M = new Map(Object.entries(obj))
console.log(m)
console.log(Object.getOwnPropertyDescriptors(obj))


 
let obj1={
    name:"tzd",
    location:{
        provice:"辽宁"
        ,city:"大连"
    },
    get city(){
        return this.location.city
    },
    set city(value){
        this.location.city=value
    },

    get name(){
        console.log("nameget")
    },

    set name(value){
        console.log("nameset")
    }
}

//object.assign浅拷贝
//留三落四的复制

//getOwnpropertyDescriptors()深拷贝
let obj2 ={}
object.getOwnPropertyDescriptors(obj)
Object.defineProperties(obj2,Object.getOwnPropertyDescriptors(obj))


//3.字符串填充
padStart(),padEnd()
//方法可以使得字符串达到固定长度，有两参数，字符串目标长度和填充内容
console.log(str.padStart(10,"x"))
console.log(str.padEnd(10,"xx"))

let list = []
for(let i =1;i<13;i++){
    //转化字符串
    list.push(String(i).padStart(2,"0" ))
    // list.push(i +" ").padStart(2,"0" )
}


///ES9
//对象的剩余参数rest 与扩展运算符spread
let obj3 = {
    name:"tzd",
    age:13,
    location:"ss"

}
let {name,...Other} = obj
console(name,Other)







function ajax(options){
    defualtoptions = {
        async:true
    }
    options = {...defualtoptions,...options}

}
ajax({
    URL:'/api',
    methods:get
})



//正则表达式
let str  = "今天是2022-22-10"
let reg =/(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/
console.log(reg.exec(str))



//3.promise.finnally

function ajax(){

    return new Promise((resolve,reject)=>{
        resolve("data-1111")
    })

}

 ajax().then((data )=>{
    console.log(data)
 }).catch(err=>{
    console.log("err",err)
 }).finnally((data)=>{
    console.log("finnaly",data)
 })


 //4, 异步遍历器

 function fn(){
    yield 111
    yield 222
 }

 const syncI = fn();



 let arr = [1,2,3]
 let i = arr[Symbol.iterator]()
 console.log(i.next())
 console.log(i.nest())
 console.log(i.nest())


 for (let i of arr){
    console.log(i)
 }



 async function *gen(){
    yield timer(1000)
    yield timer(2000)
    yield timer(3000)
 }
 async function test(){
    let g = gen()
    let arr =[g.next(),g.nest(),g.next()]

    for await( let item of arr){
        console.log("start-"+Data.now())
        console.log(item)
        console.log("end-"+Date.now())
    }
 }



 //ES10
   
 //1.object.fromEntries 允许你将数组转化为对象
 用处1：
 let m = new Map()
 m.set("name","tiecui")
 m.set("age",13)
 console.log(Object.fromEntries(m))

 用处2：
 let str = "name=xiaoming&age=18 "
 let searchParams = new URLSearchParams(str)
 console.log(Object.fromEntries(searchParams))

 用处3：
 let obj4 ={
    "a" :["a1","a2","a3"],
    "b":["b1","b2"],
    "c":["c1"]
 }
 let myarr = [Object.entries(obj4)]
 let mynew  = myarr.map(([key,value])=>{
    [key,value.length]
 })

 console.log(Object.fromEntries(mynew))


 2.trimStar()
 trimEnd()



//  3. symbol对象 description
let s1 = Symbol("name")
console.log(s1.description)



//4.数组的flat 和flatMap


//5.try catch


//Es11
Promise.allSettled()
// 返回一个在所有给定的promisr都已经fulfilled或rejected的promisr，
// 并带有一个对象那个数组，每个对象都代表peomisr结果。


import.meta 
// 会返回一个对象，有一个url属性，返回当前模块的url路径，只能在模块内使用

export * as obj from "module"
// 无损的的继承模块在新增属性





let reg = /<li>(.*)<\/li>/g

let reg2  = /<li>(?content.*)<\/li>/g


let match = null
let list = []
while (match =reg.exec(str)){
    list.push(match.groups.content)
}
console.log(list)





// let list =[{

//     title :"",
//     type:2
// },
// {

//     title :"",
//     type:3
// },{

//     title :"",
//     type:1
// }]

// let obj = {
//     1:{
//         content:"审核中",
//         className:"yellowitem"
//     },
//     2:{
//         content:"已通过",
//         className:"greenitem",

//     },
//     3:{
//         content:"被驳回",
//         className:"reditem"
//     }
// }




// MediaQueryList.innerHTML = list.map(item =>{
//     <li>
//       <div>${item.title}</div>
//       <div class="${obj[item.type].className}">
//         ${obj[item.type].content}
//         </div>  
        
//             </li>
// })



// var star  ={
//     name:"tiecui",
//     workprice:10000
// }


// let proxy = new Proxy(star,{
//     get (target,key ){
//         if(key =="workPrice"){
//             console.log("访问了")
//         }
//         return target[key]
        

//     },
//     set(target,key,value){
//         if(key=="workprice"){
//             console.log("设置了")
//             if(value>1000){
//                 console.log("可以合作")
//             }else{
//                 throw new Error("价钱不合适")
//             }
//         }
      
//     }
// })





class Subject {

    constructor(){
        this.Observer = []
    }

    add(Observer){
        this.Observer.push(Observer)
    }

    notify(){
        this.observer.forEach((item) => {
            console.log(item)
            item.update()
        });
    }
    remove(observer){
        this.Observer =this.Observer.filter(item =>{
            item!==observer
        })
    }
}


class Observer{
        constructor(name){
            this.name = name 
        }
    update(){
        console.log("update",this.name)
    }
}



const subject =  new Subject()
const observer1 = new Observer("tzd")

subject.add(observer1)




