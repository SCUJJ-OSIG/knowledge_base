x

# 常用api

### +

```js
var c = 12;
var d = 13;
console.log(c + d);	//25
```

### concat()

```js

var i = 'My name is ';
var j = 'Jack';
document.write(i.concat(j))  //My name is Jack
```


### **.length**

JavaScript中通过"变量.length"的方法来获得字符串的长度。需要注意的是，空格也算是一个字符。

```js

var e = 'My name is Jack';
document.write(e.length);	//15
```

### []

JavaScript中通过“[]”可以获得字符串中的某个字符，例如获得第一个字符，可以使用“变量名[0]”的方法获得， **空格也算是一个字符** 。需要注意的是JS是基于零的索引，从零开始计算。

```js

var f = 'My name is Jack';
document.write(f[2]);	//空格 
```


### **indexOf()**

JavaScript中通过indexOf()方法来查找字符串的位置。indexOf()方法从字符串的开头开始查找，返回查找到的位置，找不到指定字符时，返回-1。

```js

var g = 'My name is Jack name';
document.write(g.indexOf('name'))	//3

```



### search(str:string|RegExp:string):number

search() 方法用于检索字符串中指定的子字符串，或检索与**正则表达式相匹配**的子字符串。**如果需要正则表达式，请使用 search（）。否则，indexOf（）会更快。**
参数：可以是一个字符串或者一个正则表达式。
返回值：stringObject 中第一个与 regexp 相匹配的子串的起始位置。没找到返回-1.

```js
var m = 'My name is Jack';
console.log(m.search('name'));	//3

```


### **toLowerCase()、toUpperCase()**

```js
var k = 'My name is Jack';
console.log(k.toUpperCase());	//MY NAME IS JACK
console.log(k.toLowerCase());	//my name is jack
```




### **replace(findStr:string,replace:string)**

JavaScript中通过replace()方法来**替换**指定的字符串。replace()方法第一个参数为查找的字符串，第二个参数为替换成的字符串。

```js
var h = 'My name is Jack';
console.log(h.replace('Jack','Losi'));	//My name is Losi

```



### **substring()**

substring() 方法用于提取字符串中介于两个指定下标之间的字符。
参数：要**截取**的字符串位置
返回值：一个新的字符串

```javascript
var n = 'My name is Jack';
console.log(n.substring(3,9));	//name i，substring(3,9)并不包括第9位


```


### split(str:string|RegExp:sting)

split() 方法用于把一个字符串 分割成 字符串数组。
参数：可以是一个字符串或者一个正则表达式。
返回值：

一个字符串数组。该数组是通过在 separator 指定的边界处将字符串 stringObject 分割成子串创建的。返回的数组中的字串不包括 separator 自身


如果什么参数都没有直接使用split()，那么把整个字符串作为数组的唯一一项


如果把空字符串 (“”) 用作 separator，那么 stringObject 中的每个字符之间都会被分割

如果字符串中根本没有可以匹配到参数的内容，也就是字符串中没有这个分隔符，那么把整个字符串作为数组的唯一一项。比如我字符串一个空格都没有，你非要用空格作为分隔符分割我，那我没办法了，我整个字符串送给你吧，不用割来割去了

```js
var l = 'abc:def:ghi';
console.log(l.split(':'));	//一个数组["abc", "def", "ghi"]
 
var str = "abcdefg";
console.log(str.split());	//["abcdefg"]
console.log(str.split(''));	//["a", "b", "c", "d", "e", "f", "g"]，表示用空气作为分隔符的意思
console.log(str.split(' '));//["abcdefg"]，表示用空格作为分隔符的意思
console.log(str.split('H'));//["abcdefg"]
```




### lastIndexOf()

lastIndexOf()方法可返回一个指定的字符串值最后出现的位置，在一个字符串中的指定位置从后向前搜索。

api:string.lastIndexOf(subtring:string,start:num):num

| 参数          | 描述                                   |
| ------------- | -------------------------------------- |
| *substring* | 必需。要搜索的字符串。                 |
| *start*     | 可选。开始的位置。默认值为字符串长度。 |


searchvalue必需。规定需检索的字符串值。fromindex可选的整数参数。规定在字符串中开始检索的位置（即字符串的下标）。它的合法取值是 0 到 stringObject.length - 1。如省略该参数，则将从字符串的最后一个字符处开始检索。

如果在 stringObject 中的 fromindex 位置之前存在 searchvalue，则返回的是出现的最后一个 searchvalue 的位置（从左到右）。

该方法将从尾到头地检索字符串 stringObject，看它是否含有子串 searchvalue。开始检索的位置在字符串的 fromindex 处或字符串的结尾（没有指定 fromindex 时）。如果找到一个 searchvalue，则返回 searchvalue 的第一个字符在 stringObject 中的位置。stringObject 中的字符位置是从 0 开始的。

注释：lastIndexOf() 方法对大小写敏感！

注释：如果要检索的字符串值没有出现，则该方法返回 -1。


```js
var mystr="Hello world!";
var index=mystr.lastIndexOf("llo");   //2
var index1=mystr.lastIndexOf("l");    //9
var index2=mystr.lastIndexOf("l",4);  //3，表示从Hello的o开始从右向左检索
var index3=mystr.lastIndexOf("l",3);  //3，表示从Hell第二个l开始从右向左检索（包括第二个l）
```


# js字符串操作函数



### 1、字符串转换

字符串转换是最基础的要求和工作，你可以将任何类型的数据都转换为字符串，你可以用下面三种方法的任何一种：


```js
var num=24;
var mystr=num.toString();    //"24"
```

你同样可以这么做：

```js
var num=24;
var mystr=String(num);    //"24"
```

或者，在简单点儿：

```js

var num=24;
var mystr="" + num;    //"24"
```



### 2、字符串分割

将字符串进行拆分返回一个新的数组，JavaScript就给我们提供了一个非常方便的函数：

```js
var mystr="qingchenghuwoguoxiansheng,woaishenghuo,woaiziji";
var arr1=mystr.split(",");    //["qingchenghuwoguoxiansheng","woaishenghuo","woaiziji"];
var arr2=mystr.split("");        //["q","i","n","g","c","h","e","n","g","h","u","w","o","g","u","o","x","i","a","n","s","h","e","n","g",",","w","o","a","i","s","h","e","n","g","h","u","o",",","w","o","a","i","z","i","j","i"];
```

split()的第二个参数，表示返回的字符串数组的最大长度

```js
var mystr="qingchenghuwoguoxiansheng,woaishenghuo,woaiziji";
var arr1=mystr.split(",",2); //["qingchenghuwoguoxiansheng","woaishenghuo"];
var arr2=mystr.split("",8); //["q","i","n","g","c","h","e","n"];
```



### 3、字符串替换

仅仅查找到字符串并不会是题目的停止，一般题目还经常会要求你去进行替换操作，那就继续看以下代码:

```
var mystr="wozaijinxingzifuchuantihuancaozuo,zifuchuantihuano";
var replaceStr=mystr.replace("zifuchuan"," ");    //wozaijinxing tihuancaozuo,zifuchuantihuano
var replaceStr=mystr.replace(/zifuchuan/," ");    //wozaijinxing tihuancaozuo,zifuchuantihuano
var replaceStr=mystr.replace(/zifuchuan/g," ");    //wozaijinxing tihuancaozuo, tihuano
```

默认只进行第一次匹配操作的替换，想要全局替换，需要置上正则全局标识g



### 4、获取字符串长度

获取字符串的长度经常会用到，方法很简单：

```js
var mystr="qingchenghuwoguoxiansheng,woaishenghuo,woaiziji";
var arrLength=mystr.length;    //47
```

### 5、查询子字符串

判断字符串内是否包含子串，不少开发者会使用for循环来判断，而忘记了JavaScript提供子串函数：

* indexOf()，该Of() 方法对大小写敏感。返回字符串中一个子串第一处出现的索引（从左到右搜索）。如果没有匹配项，返回 -1 。

```
var mystr="Hello world!";
var index=mystr.indexOf("llo");    //2
var index1=mystr.indexOf("l");    //2
var index2=mystr.indexOf("l",3);    //3
```

* lastIndexOf()，该方法对大小写敏感。返回字符串中一个子串最后一处出现的索引（从右到左搜索），如果没有匹配项，返回 -1 。

```
var mystr="Hello world!";
var index=mystr.lastIndexOf("llo");    //2
var index1=mystr.lastIndexOf("l");    //9
var index2=mystr.lastIndexOf("l",4);    //3
```

### 6、返回指定位置的字符或其字符编码值

查找给定位置的字符，可以使用如下函数：

```js
var mystr="Hello World!";
var index=mystr.charAt(7);    //o
```

同样，它的一个兄弟函数就是查找对应位置的字符编码值，如：

```js
var mystr="Hello World!";
var charCode=mystr. charCodeAt(7);    //111
```

7、 字符串匹配

可以直接通过字符串进行匹配，也可以通过正则进行匹配，可能需要你对正则表达式有一定的了解，先来看看match()函数：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```js
var mystr="hi,mynameisguoxiansheng6,33iswho?";
var matchStr=mystr.match("guo");    //guo
var matchStr1=mystr.match("Guo");    //null
var regexp1=/\d+/g;
var regexp2=/guo/g;
var regexp3=/guo/;
var matchStr2=mystr.match(regexp1);    //["6","33"]
var matchStr3=mystr.match(regexp2);    //["guo"]
var matchStr3=mystr.match(regexp3);    //["guo",index:11,input:"hi,mynameisguoxiansheng6,33iswho?"]
matchStr3.index    //11
matchStr3.input    //hi,mynameisguoxiansheng6,33iswho?
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

注意：1.此处使用字符串直接进行匹配，被匹配的字符串内包含要匹配的字符串时，返回所要匹配的字符串。

　　　2.如果使用正则匹配字符串时，如果正则表达式没有 g (全局标识)标志，返回与正则匹配相同的结果。而且返回的数组拥有一个额外的 input 属性，该属性包含原始字符串。另外，还拥有一个 index 属性，该属性表示匹配结果在被字符串中的索引（以0开始）。如果正则表达式包含 g 标志，则该方法返回匹配字符串的数组。

再来看看使用exec()函数：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```
var mystr="hi,mynameisguoxiansheng6,33iswho?";
var regexp1=/guo/g;
var matchStr=regexp1.exec(mystr);  //["guo"]
var regexp2=/guo/;
var matchStr1=regexp2.exec(mystr);    //["guo",index:11,input:"hi,mynameisguoxiansheng6,33iswho?"]
matchStr1.index    //11
matchStr1.input    //hi,mynameisguoxiansheng6,33iswho?
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

简单吧，仅仅是把正则和字符串换了个位置，即exec()函数是在正则上调用，传递字符串的参数。对于上面两个方法，匹配的结果都是返回第一个匹配成功的字符串，如果匹配失败则返回null。

再来看一个类似的函数search()：

```
var mystr = "hi,mynameisguoxiansheng6,33iswho?";
var regexp1 = /guo/;
var matchStr = mystr.search(regexp1);    //11
```

进行正则匹配查找。如果查找成功，返回字符串中匹配的索引值。否则返回 -1

### 8、字符串连接和拼接

#### 连接

可以将两个或多个字符串进行加法操作，同时可以使用JavaScript提供的concat函数：

先看加法操作进行字符串连接：

```
var mystr1="Hello";
var mystr2="world!";
var newStr=mystr1+" "+mystr2;    //Hello world!
```

是不是很简单呀，那继续看看concat函数吧：

```js

var mystr1="Hello";
var mystr2=" world,";
var mystr3="Hello";
var mystr4="guoxiansheng";
var newStr=mystr1.concat(mystr2+mystr3+" "+mystr4);    //Hello world,Hello guoxiansheng
```

concat()函数可以有多个参数，**传递多个字符串，拼接多个字符串。**

#### 拼接join（）

join()`是一个字符串方法，接受一个可迭代的对象(如列表)作为参数，将可迭代对象中的字符串元素拼接成一个字符串，并使用调用该方法的字符串作为分隔符。在`"“.join(res)`中，空字符串`”"`作为分隔符，即没有任何字符被插入到不同字符串之间。

举个例子，如下所示的代码片段中，我们可以将列表中的多个[字符串连接](https://so.csdn.net/so/search?q=%E5%AD%97%E7%AC%A6%E4%B8%B2%E8%BF%9E%E6%8E%A5&spm=1001.2101.3001.7020)成一个长字符串：

```python
res = ["this", "is", "a", "test"]
result_str = "".join(res)
print(result_str)
# 输出: "thisisatest"
1234
```

如果我们改用空格作为分隔符：

```python
res = ["this", "is", "a", "test"]
result_str = " ".join(res)  # 注意，这里的分隔符是空格，而不是空字符串
print(result_str)
# 输出: "this is a test"
```






### 9、字符串切割和提取

有三种可以从字符串中抽取和切割的方法：

第一种，slice()函数：

括号象限是取左不取右

值是取右不去左

```
var mystr="hello world!";
var sliceStr1=mystr.slice(-3);    //ld!
var sliceStr2=mystr.slice(-3,-1);    //ld
var sliceStr3=mystr.slice(3);    //lo world!
var sliceStr4=mystr.slice(3,7);    //lo w
```

第二种：substring()函数：

```
var mystr="hello world!";
var sliceStr1=mystr.substring(3);    //lo world!
var sliceStr2=mystr.substring(3,7);    //lo w
```

第三种：substr()函数：

```
var mystr="hello world!";
var sliceStr1=mystr.substr(3);    //lo world!
var sliceStr2=mystr.substr(3,7);    //lo wo
```

注：1.slice() 可以为负数，如果起始位置为负数，则从字符串最后一位向前找对应位数并且向后取结束位置，如果为正整数则从前往后取起始位置到结束位置。
　　2.substring()只能非负整数，截取起始结束位置同slice()函数一致。

　　3.substr()与第一、第二种函数不同，从起始位置开始截取，结束位置为第二个参数截取的字符串最大长度。

以上三种函数未填第二参数时，自动截取起始位置到字符串末尾。

### 10、字符串大小写转换

```
var mystr="Hello World!";
var lowCaseStr=mystr.toLowerCase();    //hello world!
var upCaseStr=mystr. toUpperCase();    //HELLO WORLD!
```

### 11、字符串去空格trim（）

trim方法用来删除字符串前后的空格

```
var mystr="     hello world      ";  
var trimStr=mystr.trim();    //hello world
```

常用的字符串操作

1、字符串去重

[   ![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```js
var str="aahhgggsssjjj";
function removeRepeat(msg){  
    var res=[];  
    var arr=msg.split("");  
    for(var i=0;i<arr.length;i++){  
        if(res.indexOf(arr[i])==-1){  
            res.push(arr[i]);  
        }  
    }  
    return res.join("");  
}  
removeRepeat(str);    //ahgsj
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

2、判断字符串中字符出现的次数

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0); "复制代码")

```js
/*  
    1.先实现字符串去重  
    2.然后对去重后的数组用for循环操作，分别与原始数组中各个值进行比较，如果相等则count++,循环结束将count保存在sum数组中，然后将count重置为0  
    3.这样一来去重后的数组中的元素在原数组中出现的次数与sum数组中的元素是一一对应的  
*/  
var str="aacccbbeeeddd";  
var sum=[];  
var res=[];  
var count=0;  
var arr=str.split("");  
for(var i=0;i<arr.length;i++){  
    if(res.indexOf(arr[i])==-1){  
        res.push(arr[i]);  
    }  
}  
for(var i=0;i<res.length;i++){  
    for(var j=0;j<arr.length;j++){  
        if(arr[j]==res[i]){  
            count++;  
        }  
    }  
    sum.push(count);  
    count=0;  
}  
console.log(res);    //["a", "c", "b", "e", "d"]  
for(var i=0;i<res.length;i++){  
    var str=(sum[i]%2==0)?"偶数":"奇数";  
    console.log(res[i]+"出现了"+sum[i]+"次");  
    console.log(res[i]+"出现了"+str+"次");  
}  
```
