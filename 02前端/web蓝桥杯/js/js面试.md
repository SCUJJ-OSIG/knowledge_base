

1.自己实现unshift

```js
let arr =[1,2,3]

// arr.myUnShift(3,4,5)


Array.prototype.myUnShift = function(){
    const len = arguments.length;
    for(let i =this.length-1;i>=0;i--){
        const element = arguments[i]
        this.splice(0,0,element);
    }
    return this.length
}

console.log(arr.myUnShift(3,4,5),arr)
```
