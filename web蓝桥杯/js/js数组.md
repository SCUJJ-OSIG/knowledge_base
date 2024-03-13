## 一、创建数组

### 1、使用数组字面量方法

var arr1 = [];     // 创建一个数组
var arr2 = [10];   // 创建一个数组长度为10的数组
var arr3 = ['a','b','c'];  // 创建一个包含3个字符串的数组

### 2、使用Array构造函数

无参构造

```js
var arr1 = new Array();   // 创建一个空数组
```

带参构造

如果只传一个数值参数，则表示创建一个初始长度为指定数组的空数组

```js
var arr2 = new Array(10);     // 创建一个数组长度为10的数组
```

如果传入一个非数值的参数或者参数大于1，则表示创建一个包含指定元素的数组

```js
var arr3 = new Array('a','b','c');     // 创建一个包含3个字符串的数组
```

### 3、Array.of方法创建数组(es6新增)

Array.of()方法会创建一个包含所有传入参数的数组，而不管参数的数量与类型

```js
let arr1 = Array.of(1,2);
console.log(arr1.length);   // 2let arr2 = Array.of(3);
console.log(arr2.length);   // 1
console.log(arr2[0]);   // 3

```

4、Array.from方法创建数组(es6新增)
在js中将非数组对象转换为真正的数组是非常麻烦的。在es6中，将可迭代对象或者类数组对象作为第一个参数传入，Array.from()就能返回一个数组

```js
function arga(...args){  // ...args剩余参数数组，由传递给函数的实际参数提供
     let arg = Array.from(args);
     console.log(arg);
}arga(arr1,26,from);     // [arr1,26,from]
```

## 二、数组方法

### 1.改变数组本身的方法

#### push，向数组的尾新增一个元素，可以添加一个或多个元素，返回值是改变后的该数组的length值

#### pop，从数组的最后删除一个元素，返回值是被删除的元素

```js
var arr1 = ['lily','lucy','Tom'];
var count = arr1.push('Jack','Sean');
console.log(count);   // 5
console.log(arr1);   // ['lily','lucy','Tom','Jack','Sean']
var item = arr1.pop();
console.log(item);   // Sean
console.log(arr1);   // ['lily','lucy','Tom','Jack']
```

#### unshift，向数组的头新增一个或更多元素，返回值是改变后的该数组的length值

#### shift，从数组的头部删除第一个元素，返回值是被删除的元素

```js
var arr1 = ['lily','lucy','Tom'];
var count = arr1.unshift('Jack','Sean');
console.log(count);   // 5
console.log(arr1);   // ['Jack','Sean','lily','lucy','Tom']
var item = arr1.shift();
console.log(item);   // Jack
console.log(arr1);   // [''Sean','lily','lucy','Tom']
```

#### splice(index, num, item1, item2, …)，

index是指定开始处理的索引位置，

num指定删除多少项，

从第三个元素开始都是新增的元素项。可以实现从指定的索引位置新增、删除、替换元素。返回值是被删除的元素组成的数组。

```js
//替换
var a=['a','b','c'];
var b=a.splice(1,1,'e','f');    //a=['a','e','f','c'],b=['b']
//删除
var arr1 = [1,3,5,7,9,11];
var arrRemoved = arr1.splice(0,2);
console.log(arr1);   // [5,7,9,11]
console.log(arrRemoved);   // [1,3]// 添加元素
var arr1 = [22,3,31,12];
arr1.splice(1,0,12,35);
console.log(arr1);   // [22,12,35,3,31,12]

```

#### sort，对数组排序，默认按照升序排列，可以传递函数类型的参数决定排序的方式用于对数组的元素进行排序。排序顺序可以是字母或数字，并按升序或降序，默认排序顺序为按字母升序

```js
var arr1 = ['a','d','c','b'];
console.log(arr1.sort());   // ['a','b','c','d']
function compare(value1,value2){
     if(value1 < value2){
          return -1;
     }else if(value1 > value2){
          return 1;
     }else{
          return 0;
     }
}var arr2 = [13,24,51,3];
console.log(arr2.sort(compare));   // [3,13,24,51]
```

// 如果需要通过比较函数产生降序排序的结果，只要交后比较函数返回的值即可

#### reverse，反转数组

```js
var arr1 = [13,24,51,3];
console.log(arr1.reverse());   // [3,51,24,13]
console.log(arr1);   // 3,51,24,13
```

#### reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。

```js
var arr1 = [1,2,3,4,5];
var sum = arr1.reduce((prev,cur,index,array) => {
     return prev + cur;
},10);   // 数组一开始加了一个初始值10，可以不设默认0
console.log(sum);   // 25
```

### 2. 不改变数组本身返回新数组的方法

concat，concat的参数，可以是单个/多个基本类型的值，也可以是数组。对原数组和参数拼接，返回拼接后形成的新数组。

```js
var arr1 = [1,3,5,7];
var arrCopy = arr1.concat(9,[11,13]);
console.log(arrCopy);   // [1,3,5,7,9,11,13]
console.log(arr1);   // 1,3,5,7
```

#### slice(startIndex, endIndex)，截取原数组的片段，前闭后开区间，包含startIndex索引的元素开始截取，一直到endIndex索引之前的那个元素

总结：炒菜，切巨型火腿肠，闭区间切，如果火腿尾部坏了，切了不要。

截取区间：[startIndex,endIndex)

```js
var arr1 = [1,3,5,7,9,11];
var arrCopy = arr1.slice(1);
var arrCopy2 = arr1.slice(1,4);
var arrCopy3 = arr1.slice(1,-2);   // 相当于arr1.slice(1,4);
var arrCopy4 = arr1.slice(-4,-1);   // 相当于arr1.slice(2,5);
console.log(arr1);   // 1,3,5,7,9,11
console.log(arrCopy);   // [3,5,7,9,11]
console.log(arrCopy2);   // [3,5,7]
console.log(arrCopy3);   // [3,5,7]
console.log(arrCopy4);   // [5,7,9]//如果不传入参数二，那么将从参数一的索引位置开始截取，一直到数组尾
var a=[1,2,3,4,5,6];
var b=a.slice(0,3);    //[1,2,3]
var c=a.slice(3);       //[4,5,6]
//如果两个参数中的任何一个是负数，array.length会和它们相加，试图让它们成为非负数，举例说明：
//当只传入一个参数，且是负数时，length会与参数相加，然后再截取
var a=[1,2,3,4,5,6];
var b=a.slice(-1);    //[6]
//当只传入一个参数，是负数时,并且参数的绝对值大于数组length时，会截取整个数组
var a=[1,2,3,4,5,6];
var b=a.slice(-6);    //[1,2,3,4,5,6]
var c=a.slice(-8);    //[1,2,3,4,5,6]
//当传入两个参数一正一负时，length也会先于负数相加后，再截取
var a=[1,2,3,4,5,6];
var b=a.slice(2,-3);    //[3]
//当传入一个参数，大于length时，将返回一个空数组
var a=[1,2,3,4,5,6];
var b=a.slice(6);　　//[]
```

### 3.循环遍历相关的方法

这些方法也可以在循环的过程中 间接的改变数组自身的元素

forEach((item, index) => {})方法，遍历数组的每个元素，参数为一个函数，参数函数的两个参数为数组项和对应的索引

forEach方法中的function回调有三个参数：

第一个参数是遍历的数组内容，

第二个参数是对应的数组索引，

第三个参数是数组本身

```js
var arr = [1,2,3,4];
var sum =0;
arr.forEach(function(value,index,array){ array[index] == value; //结果为true 
sum+=value; 
});console.log(sum); //结果为 10
```

#### includes()方法，es7新增，用来判断一个数组、字符串是否包含一个指定的值，使用===运算符来进行值比较，如果是返回true，否则false，参数有两个，第一个是(必填)需要查找的元素值，第二个是(可选)开始查找元素的位置.

```js
var arr1 = [22,3,31,12,58];
var includes = arr1.includes(31);
console.log(includes);   // true
var includes2 = arr1.includes(31,3);   // 从索引3开始查找31是否存在
console.log(includes2);   // false
```

#### map((item, index) => {})

方法，遍历数组的每个元素，参数为一个函数，参数函数的两个参数为数组项和对应的索引，根据参数函数的执行结果，把这些结果组成一个新数组返回。

会按照原始数组元素顺序依次处理元素。

```js
let array = [1, 2, 3, 4, 5];
let newArray = array.map((item) => {
    return item * item;
})
console.log(newArray)  // [1, 4, 9, 16, 25]
```

#### filter((item, index) => {})方法，遍历数组的每个元素，执行参数函数，将符合参数函数中定义条件的那些项留下，组成一个新数组返回

```js
const array = [14, 17, 18, 32, 33, 16, 40];
const newArr = array.filter(num => num > 14)
console.log(newArr);//打印 [17,18,32,33,16,40]
// 查找某个值-------------------------
const array = [14, 17, 18, 32, 33, 16, 40];
const newArr = array.filter(num => num == 14)
console.log(newArr);//打印 [14]
//返回大于某个值和小于某个值的元素
const array = [14, 17, 18, 32, 33, 16, 40];
const newArr = array.filter(num => num > 14 && num < 33)
console.log(newArr);//打印 [17, 18, 32, 16]
```

### find()和findIndex()

都接受两个参数：一个回调函数，一个可选值用于指定回调函数内部的this

该回调函数可接受3个参数：数组的某个元素、该元素对应的索引位置、数组本身，在回调函数第一次返回true时停止查找。

二者的区别是：find()方法返回匹配的值，而findIndex()方法返回匹配位置的索引

```js
let arr = [1,2,3,4,5];
let num = arr.find(item => item > 1);
console.log(num) // 2
let arr = [1,2,3,4,5];
let num = arr.findIndex(item => item > 1);
console.log(num) // 1

```

#### entries()、keys()和values()

es6新增 entries()、keys()和values()--用于遍历数组。它们都返回一个遍历器对象，可以用for...of循环进行遍历 区别是keys()是对键名的遍历、values()是对键值的遍历、entries()是对

键值对的遍历

```js
for(let index of [a,b].keys()){
     console.log(index);
}
// 0
// 1
for(let elem of [a,b].values()){
     console.log(elem);
}
// a
// b
for(let [index,elem] of [a,b].entries()){
     console.log(index,elem);
}
// 0 'a'
// 1 'b'
```

如果不使用for…of循环，可以手动调用遍历器对象的next方法，进行遍历

```js
let arr1 = [a,b,c];
let entries = arrr1.entries();
console.log(entries.next().value);   // [0,a]
console.log(entries.next().value);   // [1,b]
console.log(entries.next().value);   // [2,c]
```

indexOf()

indexof方法可以在字符串和数组上使用。
indexOf() 方法可返回某个指定的字符串值在字符串、数组中首次出现的位置。

```js
   arr = ['mfg', '2017', '2016'];  
console.log(arr.indexOf('mfg')); // 0
    console.log(arr.indexOf('m')); // -1
    console.log(arr.indexOf('2017'));// 1
    console.log(arr.indexOf(2017)); // -1，这里不会做隐式类型转换
```

some((item, index) => {})方法，循环数组，对每一项执行参数函数中的条件，有符合条件的项则立即返回true，不再继续遍历；如果全部遍历完还没有找到符合项则返回false

判断数组中是否存在满足条件的项，只要有一项满足条件，就会返回true。

```js
var arr1 = [1,2,3,4,5];
var arr2 = arr1.some(x => {
     return x < 3;
});
console.log(arr2);   // true
var arr3 = arr1.some(x => {
     return x < 1;
});
console.log(arr3);   // false
```

every((item, index) => {})，与some相反，every需要是数组中每一项都符合参数函数中的条件才返回true，如果遇见任何一项不符合立即返回false，也不再继续遍历后续项。

判断数组中每一项都是否满足条件，只有所有项都满足条件，才会返回true。

```js
var arr1 = [1,2,3,4,5];
var arr2 = arr1.every(x => {
     return x < 10;
});
console.log(arr2);   // true
var arr3 = arr1.every(x => {
     return x < 3;
});
console.log(arr3);   // false
```

# for-in 和 for-of的区别

，for-in 和 for-of 是for循环的两个最常用的变体；for-in 循环是一种迭代对象属性的方法。它可以用于[遍历对象](https://so.csdn.net/so/search?q=%E9%81%8D%E5%8E%86%E5%AF%B9%E8%B1%A1&spm=1001.2101.3001.7020)中的所有可枚举属性，包括从原型链继承的属性。通常，我们使用 for-in 循环来遍历对象的**键名**。

```js
const person = {
  name: 'John',
  age: 30,
  gender: 'male'
};
 
for (const key in person) {
  console.log(key, person[key]);
}

//name John
//age 30
//gender male
```

for-in 循环并不是按照对象属性在对象中的顺序迭代的。这是因为 JavaScript 中的对象属性没有固定的顺序。因此，我们在使用 for-in 循环迭代对象时，不能保证它们的顺序。

另外，由于 for-in 循环会遍历对象的原型链，因此可能会迭代到不是自身属性的属性。为了避免这种情况，我们可以使用 hasOwnProperty 方法来检查属性是否为对象自身的属性。

下面是一个使用 hasOwnProperty 的例子：

```js
const person = {
  name: 'John',
  age: 30,
  gender: 'male'
};
 
for (const key in person) {
  if (person.hasOwnProperty(key)) {
    console.log(key, person[key]);
  }
}


```

for-of 循环是一种迭代可迭代对象的方法。它可以用于遍历数组、字符串、Map、Set、TypedArray 等可迭代对象。通常，我们使用 for-of 循环来遍历数组或**字符串的值**。

```js
const arr = [1, 2, 3];
 
for (const value of arr) {
  console.log(value);
}


//1
//2
//3
```

for-of 循环不适用于迭代对象属性。如果我们尝试使用 for-of 循环迭代对象，将会抛出 TypeError 异常。

### 区别

1. 迭代对象的内容不同

for-in 循环迭代对象的是键名，而 for-of 循环迭代对象的是值。因此，for-in 循环适用于迭代对象的键名，而 for-of 循环适用于迭代对象的值。

2. 迭代对象的类型不同

for-in 循环适用于遍历对象，包括普通对象、数组、函数等，而 for-of 循环适用于遍历可迭代对象，包括数组、字符串、Map、Set、TypedArray 等。

3. 迭代对象的顺序不同

for-in 循环的迭代顺序是不确定的，因为对象的属性没有固定的顺序。而 for-of 循环的迭代顺序是确定的，因为可迭代对象的值是按照一定顺序排列的。

4. 迭代对象的原理不同

for-in 循环遍历对象时，会遍历对象的原型链，并且会包含从原型链继承的属性。而 for-of 循环遍历的对象是可迭代对象，它们的值是可枚举的。

#### 如何选择合适的循环方法

在选择使用 for-in 循环还是 for-of 循环时，我们需要考虑对象的类型以及我们需要迭代的内容。通常，如果我们需要迭代对象的键名，我们可以使用 for-in 循环；如果我们需要迭代对象的值，我们可以使用 for-of 循环。

另外，当我们需要遍历数组或字符串时，我们可以使用 for-of 循环，因为它可以提供更好的性能和可读性。相比之下，for-in 循环会遍历对象的原型链，会导致性能下降。

如果我们需要遍历一个对象，同时又需要过滤掉从原型链继承的属性，我们可以使用 hasOwnProperty 方法进行过滤。
