所有权解决的问题 管理 heap 数量

跟踪代码的哪些部分正字啊使用 heap 的那些数据，

最小化 heapp 上的重复数据量

rust 内存通过一个所有权系统来管理,其中包含一组编译器在编译时检查的规则,

当程序运行时,所有权特殊性不会减慢程序的运行速度.因为把内存管理相关的工作提前到了编译时

理解编译时

heap 堆,内存组织性差一些.操作系统在 heap 里找到一块足够大的空间,把他标记为在用,并返回一个指针,也就是这个空间的地址.

指针大小是固定的.可以吧指针放在 stack 上/

访问 heap 数据,有一个指针跳转的环节,因此比 stack 慢很多.

所有权规则,

每个值都有一个变量,这个变量是钙质的所有者.

每个值只能有一个所有者,

当所有者超出作用域,该值删除

string 类型

字符串字面量:程序手写的那些字符串值,他们是不可变的.

第二种字符串类型:Strring :在 heap 上分配.能够存储在编译时未知数量的文本.

为什么 String 类型的值可以修改,而字符串字面值不能修改

字符串字面值,在编译时就知道他的内容,其文本内容直接被硬解码到最终的可执行文件里 - 速度快高效因为其不可变性.

当 s1 = string::from("ss"), s2=s1 时. 将 s1 的数据结构.指针,长度,内存复制(浅拷贝)给 s2,但为了保护内存安全,让 s1 失效(总的来说,叫 move),防止二次释放,s1,s2 离开作用域时.rust 自动调用 drop 函数,将变量使用的 heap 内存释放.

rust 的一个设计原则:rust 不会自动创建数据的深拷贝.

如果一个类型实现了 copy 这个 trait,那么旧的变量在赋值后任然可用 :copy trait 用于

一些拥有 copy trait 的类型, 所有的整数类型,boool ,char, 浮点类型,tuple:(i32,i32) 是 (i32,strign) 不是

任何需要分配内存,或某种资源的都不是 copy

在语义上,将值传递给函数和把值赋给变量是类似的 (将值传递给函数将发生 move 或复制)

函数在返回值的过程中同样也会发生所有权的转移,

把一个值赋给其他变量是就会发生移动

当一个包含 heap 数据的变量离开作用域时,他的值就会被 drop 函数清理,除非数据的所有权移动到另一个变量上了

如何让函数使用某个值,但不获取其所有权

rust 有个特性叫引用

String,&表示引用, 本质就是指向 string 数据结构的的地址

把引用作为函数参数的这个行为 叫做借用

不可以修改借用的变量,和默认一样,引用不可变

可变引用,&mut 有一个重要的限制,在特定作用域,对某一块数据,只能有一个可变的引用.

好处是可以在编译时防止数据竞争

一下三种行为会发生数据竞争

两个或多个指针同时访问同一个数据. 至少有一个指针用于写入数据,没有使用任何机制来同步对数据的访问

不可以同时拥有一个可变引用和一个不可变引用

多个不变的引用是可以的

悬空引用,

## 4.3 切片

不持有所有权的数据类型--》 切片

一道题:编写一个函数,他接受字符串作为参数,返回他在啊这个字符串里找到的第一个单词,如果函数没找到任何空格,那么整个字符串就返回.

```rust
fn main(){
    let  s = String::from("hello  world");
    let word_index =first_word(&s);
    print!("{}",word_index)
}

fn first_word(s:&String) ->usize{
  let bytes =s.as_bytes();
    for(i,&item)in bytes.iter().enumerate(){
        if item==b' '{
            return i;
        }
    };
    s.len()
}
```

字符串切片是指向字符串中一部分内容的引用 0

字符串字面值其实就是切片 &str ,不可变的

fn first_world(s:&String)->&Str{}有经验的 rust 开发者会采用&str 作为参数类型,这样可以同时接受 String 和&str 类型的参数'

fn first_world(s:&str)->&str{}

5.struct

### 什么是 struct

结构体,自定义的数据结构

为相关连的值命名,打包=>有意的组合

### 定义 struct

### 实例化 struct

为每个字段指定具体值

无需按声明的顺序进行指定

方法和函数的不同之处:

方法是在 struct(enum trait 对象)的上下文中定义

第一个参数是 self,表示方法被调用的 struct 实例

### d 定义方法

方法的第一个参数可以是&self

### 关联函数:

可以在 impl 块里定义不把 self 作为第一个参数的函数,他们叫关联函数

关联函数通常用于构造器

::关联函数.模块创建的命名空间

### 枚举:允许我们列举所有可能的值来定义一个类型

定义枚举:

enum IpAddr{

v4,v6

}

let four = ipAddr::v4

将数据附加贷枚举的变体中

```
 struct Rectangle{
    width:u32,
    length:u32,



}
impl Rectangle{
    fn area(&self)->u32{
        self.width * self.length
    }
    fn can_hold(&self , other:&Rectangle) ->bool{
        self.width > other.width && self.length > other.length
    }

}



fn main(){

    let rect =Rectangle{
        width:30,
        length:50,
    };

    let rect3 =Rectangle{
        width:34,
        length:56,
    };
    println!("{}",rect.can_hold(&rect3));

    print!("{}",rect.area())
}


```

```
use std::collections::HashMap;
fn main(){
    let mut scores =HashMap::new();
    scores.insert(String::from("blue"), 10);
    let e = scores.entry(String::from("yellow"));
    print!("{:?}",scores);
    e.or_insert(50)

}
```

```
use std::collections::HashMap;
fn main(){
    let text ="hello world wonderful world";
    let mut map = HashMap::new();
    for word in text.split_whitespace(){
        let count = map.entry(word).or_insert(0);
        *count +=1;

    }
    print!("{:#?}",map);
}
```

```
use std::fs::File;

fn main (){
    let f = File::open("hello.txt");
    let f = match f{
        Ok(File)=>File,
        Err(error)=>{
            panic!("error opening file {:?}",error);
        }
    };
}
```

```

use std::fs::File;
fn  main() {

    let f = File::open("hello");
    let f = match f{
        Ok(file) =>file,
        Err(error)=>{
            panic!("error opening file {:?}",error)
        }
    };
// 相等

    // let f = File::open("hello.txt").unwrap();
    //let f  =File::open("hello.txt").expect("无法打开文件")
}
```

```
use std::fs::File;
use std::io::{Read, self};

fn  read_username_from_file() ->Result<String,io::Error>{
    let mut f =File::open("hello.txt")?;

    // let  f =File::open("hello.txt");
    // let mut f = match f {
    //     Ok(file)=>file,
    //     Err(e)=>return Err(e),
    // };


    let mut s =String::new();
    f.read_to_string(&mut s)?;
    Ok(s)
    // let mut s =String::new();
    // match f.read_to_string(&mut s){
    //     Ok(_) =>Ok(s),
    //     Err(e)=>Err(e),
    // }

}

fn main() {
    let result = read_username_from_file();
}
```

trait 下 内容
