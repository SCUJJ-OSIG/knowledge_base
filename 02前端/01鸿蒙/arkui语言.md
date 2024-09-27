# 一:概念

ArkTs在ts语言上拓展了声明试UI 状态管理等相应的能力,他就是ts的拓展

会js和ts或者react的人会更容易上手

个人认为他的优点和缺点是

优点:布局的代码和逻辑代码卸载一起,编写的时候方便,缺点:耦合度搞,布局代码和逻辑代码写在一起 不方便以后维护

语法的模板图

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCE08f440d9e45e2b6c983f1306f0a7769c/114)

- 装饰器

@Component 表示这是个自定义组件；

@Entry 则表示这是个入口组件； 

@State 表示组件中的状态变量，此状态变化会引起 UI 变更。

- 自定义组件

可复用的 UI 单元，可组合其它组件，如上述被 @Component 装饰的 struct Hello。

- UI 描述

声明式的方式来描述 UI 的结构，如上述 build() 方法内部的代码块。

- 内置组件

框架中默认内置的基础和布局组件，可直接被开发者调用，比如示例中的 Column、Text、Divider、Button。

- 事件方法

用于添加组件对事件的响应逻辑，统一通过事件方法进行设置，如跟随在Button后面的onClick()。

- 属性方法

用于组件属性的配置，统一通过属性方法进行设置，如fontSize()、width()、height()、color() 等，可通过链式调用的方式设置多项属性。

# 二 :新建页面,

 这个也是需要配置的,类似微信小程序和uniapp一样的

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCE22e6b68cbef13dcacba5b50c07d1e5e7/134)

## 2.1注意控制页面第一次进来显示那个也页面的 需要进行配置的

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCEbdc3dd161a8993e7cf343622d3bed1a7/584)

# 三:学习常用的组件

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCE6b57e43a766bf00e8ecb8b1b92212815/136)

## 1.图片的组件使用

﻿[文档中心](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-basic-components-image-0000001428061728-V3)﻿

第一种方式使用:访问我们的网络图片,但是先要确保这个网络图片不存在防盗链,不然是无法访问的

本地图片文件路径 不能 出现 - 短横线连接的

```js
// 里面存放图片网络路径 还有就是在后面设置宽度和高度 预览的时候是不需要配置权限 但是如果是模拟器是要配置权限的`




Image('https://img0.baidu.com/it/u=31047287,2024457381&fm=253&fmt=auto&app=138&f=JPEG?w=513&h=500')
  .width(150)
  .height(150)
```

注意要配置权限问题

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCE3c3b223d2ea9740cc0a4f2cc23294c8a/149)

## 第二种方式使用:本地路径

```ts
 // 本地路径
  // 访问resources里面base的media的图片 用法
  // $r('app.media.图片名字')  前面是固定的,只要更换图片名字即可,不需要加图片格式,例如.png

  Image($r('app.media.icon'))
    .width(150)
    .height(150)

//   访问resources里面的rawfile的文件  注意要写全名字和后缀的情况
  Image($rawfile('qiao.png'))
    .width(150)
    .height(150)
}
```

## 第三种PixeMap格式的,可以加载像素图片,常用于图片编辑

```ts
Image(pixelMapObject)
```

其他常用的属性[文档中心](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-basic-components-image-0000001428061728-V3)﻿

比较常见的

```ts
alt 占位符就是网络图片没那么快加载的时候 先使用这个图片
   Image("https://www.example.com/xxx.png")// 直接加载网络地址，请填写一个具体的网络图片地址
        .alt($r('app.media.icon'))// 使用alt，在网络图片加载成功前使用占位图
        .width(100)
        .height(100)

interpolation设置图片的插值效果，即减轻低清晰度图片在放大显示时出现的锯齿问题。里面是他的参数
Image($r('app.media.icon'))
  .width(150)
  .height(150).interpolation(ImageInterpolation.High)



  别的常见示例
  加载别的类型图片
@Entry
@Component
struct ImageExample1 {
  build() {
    Column() {
      Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Start }) {
        Row() {
          // 加载png格式图片
          Image($r('app.media.ic_camera_master_ai_leaf'))
            .width(110).height(110).margin(15)
            .overlay('png', { align: Alignment.Bottom, offset: { x: 0, y: 20 } })
          // 加载gif格式图片
          Image($r('app.media.loading'))
            .width(110).height(110).margin(15)
            .overlay('gif', { align: Alignment.Bottom, offset: { x: 0, y: 20 } })
        }
        Row() {
          // 加载svg格式图片
          Image($r('app.media.ic_camera_master_ai_clouded'))
            .width(110).height(110).margin(15)
            .overlay('svg', { align: Alignment.Bottom, offset: { x: 0, y: 20 } })
          // 加载jpg格式图片
          Image($r('app.media.ic_public_favor_filled'))
            .width(110).height(110).margin(15)
            .overlay('jpg', { align: Alignment.Bottom, offset: { x: 0, y: 20 } })
        }
      }
    }.height(320).width(360).padding({ right: 10, top: 10 })
  }
}
```

## 2.文本显示（Text/Span）的使用

﻿[文档中心](https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/arkts-common-components-text-display-0000001504880745-V3)﻿

### 第一种使用方式 就是直接添加

`Text``(``'我是一段文本'``)`

### 第二种方式是读取文件的内容进行展示

```ts
// 引用Resource资源
// 资源引用类型可以通过$r创建Resource类型对象，文件位置为/resources 目录下的


//  $r('app.string.变化的值')  前面都是固定的,后面的是变化的
// 他们找值的时候是根据语言去找的  例如 如果是zh-CN 会去优先找 zh_CN目录下的element/string.json
// 如果是en-US  就会去优先找en_US 下面的 element/string.json
// 如果两个都找不到的 会去base/element/string.json下面找

// 里面的文件格式是这样的

// {
//   "string": [
//   {
//     "name": "module_desc",
//     "value": "靓仔"
//   },
//   {
//     "name": "EntryAbility_desc",
//     "value": "description"
//   },
//   {
//     "name": "EntryAbility_label",
//     "value": "label"
//   }
//   ]
// }
//他会找上面的 name为module_desc 的对象 内容的value  显示 "靓仔" 两个字
//  注意添加在上面的 结构添加的新的属性的时候 如果报错  base/zh_CN /en_US 添加一下试试情况
Text($r('app.string.module_desc'))
```

添加子组件﻿﻿﻿

[Span](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-basic-components-span-0000001478181409-V3)只能作为Text组件的子组件显示文本内容。可以在一个Text内添加多个Span来显示一段信息，例如产品说明书、承诺书等。

如果写了Span之后 会覆盖Text的文字的

```ts
Text("王者"){
  Span("靓仔")
  Span("刚满18岁")
}
```

## 3.TextInput的使用

```ts
// text是存放信息的
TextInput({text:"我是输入框"})
// 提示信息placeholder  type是规定我们输入框的值类型  他有 Normal 默认 Password密码  Email邮箱  Number数字 PhoneNumber 电话号码模式
// onChange 输入框的值变化的时候 就会执行的方法
TextInput({text:"我是输入框",placeholder:"我是提示信息"}).type(InputType.PhoneNumber).onChange(()=>{
  console.log('this.controller',this)
})
```

## 4.按钮的Button的使用

```ts
// 第一个参数是存放什么值来的(可写可不写),第二个是规定这个按钮的类型 type里面有比较多的值 ButtonType.Capsule 胶囊型按钮
//  ButtonType.Circle 圆形按钮   ButtonType.Normal 普通按钮（默认不带圆角）
// stateEffect设定是否开启按钮的效果
// onClick点击事件
Button("靓仔",{type:ButtonType.Capsule,stateEffect:false}).onClick(() => {
  console.log('ButtonType.Normal')
})
```

5.滑块Slider的用法

```ts
//   滑块组件的
  Slider({
    max:100,//最大值
    min:0,//最小值
    step:2,//设置Slider滑动步长
    value:50,//当前滑块显示的区域
    style:SliderStyle.OutSet, //SliderStyle.OutSet显示滑块在滑轨  SliderStyle.InSet
    direction:Axis.Horizontal,  //设置滑动条滑动方向为水平Axis.Horizontal或Axis.Vertical竖直方向。
    reverse:false //滑动条取值范围是否反向
  })
    .blockColor('red') //设置滑块颜色
    .trackColor('#000000')  //设置滑轨的背景颜色
    .selectedColor('green') //设置滑轨的已滑动部分颜色。
    .showTips(true)  //设置滑动时是否显示百分比气泡提示。
    .trackThickness(20)//设置滑轨的粗细
    .onChange(value=>{ //滑块滚动的时候触发的
      console.log("value",value);
    })
```

## 6.Column容器沿垂直方向布局的容器。

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCE69b69ddb692a2139152d1167a4c37909/338)

默认代码的效果情况

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCE2ec541480a8409bb1d83762897a1e163/551)

space的作用 加上去会变成上面第二个图

```ts
@Entry
@Component
struct Index {
  build() {
    Row() {
      // 父盒子
      Column({space:10}) {   //Column({space:10})  里面 的Space 控制里面子盒子之间的间隙
        // 子盒子第一个
        Column().width('50%').height(40).backgroundColor(Color.Blue)
        // 子盒子第二个
        Column().width('50%').height(40).backgroundColor(Color.Green)
        // 子盒子第三个
        Column().width('50%').height(40).backgroundColor(Color.Red)
      }
      .width('100%').backgroundColor(Color.Pink).height(200)
    }
    .height('100%')
  }
}
```

### alignItems的的使用方式 控制 它们在水平方向的位置 默认的时候他们是在中间的

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCE532b672d93b1fa88a4f4ae89051e8192/556)

```ts
@Entry
@Component
struct Index {
  build() {
    Row() {
      // 父盒子
      Column({ space: 10 }) { //Column({space:10})  里面 的Space 控制里面子盒子之间的间隙
        // 子盒子第一个
        Column().width('50%').height(40).backgroundColor(Color.Blue)
        // 子盒子第二个
        Column().width('50%').height(40).backgroundColor(Color.Green)
        // 子盒子第三个
        Column().width('50%').height(40).backgroundColor(Color.Red)
      }
      .width('100%').backgroundColor(Color.Pink).height(200)
      // .alignItems(HorizontalAlign.Center)  //默认情况的时候再中间 第一张图
      // .alignItems(HorizontalAlign.Start)   //靠左边了   //第二张图
      .alignItems(HorizontalAlign.End) //靠右边去了   //第三张图
    }
    .height('100%')
  }
}
```

### 控制垂直方向的

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCEcf42a9408b04b764ada7f8dc3a559804/559)

```ts
@Entry
@Component
struct Index {
  build() {
    Row() {
      // 父盒子
      Column({ space: 10 }) { //Column({space:10})  里面 的Space 控制里面子盒子之间的间隙
        // 子盒子第一个
        Column().width('50%').height(40).backgroundColor(Color.Blue)
        // 子盒子第二个
        Column().width('50%').height(40).backgroundColor(Color.Green)
        // 子盒子第三个
        Column().width('50%').height(40).backgroundColor(Color.Red)
      }
      .width('100%')
      .backgroundColor(Color.Pink)
      .height(200)
      // .justifyContent(FlexAlign.Start) //默认情况下 垂直方向  顶部开始
      // .justifyContent(FlexAlign.End)    //垂直方向  底部开始
      // .justifyContent(FlexAlign.SpaceBetween) // 两边靠边,然后剩余的空间平分作为间隙
      // .justifyContent(FlexAlign.SpaceAround) //  剩余空间分配 底部和顶部是1  中间都是2
      // .justifyContent(FlexAlign.SpaceEvenly)  // 顶部和底部是1 中间也是1
    }
      .height('100%')
  }
}
```

## 7.Row容器沿水平方向布局容器

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCE4b38c8020b0bf20e81365ee5cf528946/341)

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCE7b1a6a45452d1c8e756c0c00c83e1dac/564)

```ts
@Entry
@Component
struct Index {
  build() {
    Row() {
      // 父盒子   space控制子盒子之间的间隙
        Row({ space: 5 }) {
          // 子盒子
          Row().width('30%').height(50).backgroundColor(0xAFEEEE)
          // 子盒子
          Row().width('30%').height(50).backgroundColor(0x00FFFF)
        }.width('90%').height(107).border({ width: 1 })
        // .alignItems(VerticalAlign.Center)   //控制他们垂直的位置  默认就是在中间
        .alignItems(VerticalAlign.Top)   //控制他们垂直的位置 顶部
      // .alignItems(VerticalAlign.Bottom)   //控制他们垂直的位置 底部
    }
      .height('100%')
  }
}
```

### justifyContent

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCE0c75702b9c8b9f35624e6efe925fd394/569)

```ts
@Entry
@Component
struct Index {
  build() {
    Row() {
      // 父盒子   space控制子盒子之间的间隙
        Row({ space: 5 }) {
          // 子盒子
          Row().width('30%').height(50).backgroundColor(0xAFEEEE)
          // 子盒子
          Row().width('30%').height(50).backgroundColor(0x00FFFF)
        }.width('90%').height(107).border({ width: 1 })
       // .justifyContent(FlexAlign.Start)   //默认值FlexAlign.Start  在左边
      // .justifyContent(FlexAlign.End)   //FlexAlign.End  在最右边边
      // .justifyContent(FlexAlign.Center)   //FlexAlign.Center  在最中间
      // .justifyContent(FlexAlign.SpaceBetween)  // 两边靠 剩余空间平分到盒子的间隙中
      // .justifyContent(FlexAlign.SpaceAround)  // 左边+右边 =2  中间 = 2
      .justifyContent(FlexAlign.SpaceEvenly)  // 左边=2 右边=2  中间 = 2
    }
      .height('100%')
  }
}
```

6/7的总结使用

```ts
属性就两个                解释                   参数
justifyContent  设置子元素在主轴方向的对齐方式     FlexAlign
alignItems      设置子元素在交叉轴的对齐方式       (注意他们两个是不一样的)  Row的是VerticalAlign
                                                                        Column容器使用HorizonAlign
```

## 8.Flex

﻿[文档中心](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-container-flex-0000001427902472-V3)﻿

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCE72c2886c344632bd178bd0bcc7d69125/580)

以弹性方式布局子组件的容器组件

Flex组件在渲染时存在二次布局过程，因此在对性能有严格要求的场景下建议使用[Column](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-container-column-0000001478341157-V3)、[Row](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-container-row-0000001478061717-V3)代替

```ts
@Entry
@Component
struct Index {
  build() {
    Row() {
      Column(){
        // 注意一下 alignItems和 wrap一起使用可能会不生效
        Flex({
          direction: FlexDirection.Column, //控制主轴方向 Row是默认  还有一个值是 Column
          justifyContent:FlexAlign.SpaceEvenly, //主轴上的对齐格式  剩下的值查看官网
          alignItems:ItemAlign.Center, // 交叉轴的对齐方式
          // wrap:FlexWrap.Wrap   //是否允许换行
        }) { // 子组件在容器主轴上行布局
          Text('1').width('23%').height(50).backgroundColor(0xF5DEB3)
          Text('2').width('23%').height(50).backgroundColor(0xD2B48C)
          Text('3').width('23%').height(50).backgroundColor(0xF5DEB3)
          Text('4').width('23%').height(50).backgroundColor(0xD2B48C)
          Text('5').width('23%').height(50).backgroundColor(0xF5DEB3)
          Text('6').width('23%').height(50).backgroundColor(0xD2B48C)
        }
        .height(270)
        .width('100%')
        .padding(10)
        .backgroundColor(0xAFEEEE)
      }
    }
      .height('100%')
  }
}
```

## 9.组件的事件才一些特性

内部的一些事件对象打印的时候没法看到,可以在官网观看

﻿[文档中心](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-universal-events-click-0000001477981153-V3)﻿

```ts
注意:点击事件的是ClickEvent  别的事件不太一样的  需要去观看官方文档   这个值可以获取点击的一些信息  例如点击的位置  点击元素的宽度和高度之类的
Button("变化").onClick((e:ClickEvent)=>{
  console.log('e',e)
  this.bol = !this.bol;
})
```

注意触摸事件的类型 [文档中心](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-appendix-enums-0000001478061741-V3#ZH-CN_TOPIC_0000001574248789__touchtype)﻿

里面有看他类型是 触摸的类型情况 例如 手指点击按下时候触发还是松开的时候触发的

当然还有一些键盘之间之类 键盘的code值之类的 每次都不太一样 需要观看官网

﻿[文档中心](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-universal-events-key-0000001427744780-V3)﻿

10.配置tabbar的组件Tabs

﻿[文档中心](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-container-tabs-0000001478181433-V3#ZH-CN_TOPIC_0000001523488806__%E5%AD%90%E7%BB%84%E4%BB%B6)﻿

注意需要配合他的子组件 TabContent 一起使用 注意TabContent还有一个tabBar属性

代码结构示范

```ts
@Entry
@Component
struct Index {

  @State cIndex:number = 0;
  // tabbar的内容之类的操作


  //定义他每个标签页 的图片和文字
  @Builder  bar(index,url,urlActive,text){

  Flex({
    direction:FlexDirection.Column,
    alignItems:ItemAlign.Center,
    justifyContent:FlexAlign.Center
  }){
    // 三目运算符去判断
    Image(this.cIndex==index?urlActive:url).width(26).width(26)
    Text(text).fontSize(12).fontColor(this.cIndex==index?Color.Red:Color.Gray)
  }
}


  build() {
    // 组件使用  //barPosition属性控制他显示在头部还是顶部位置
    // index 表示显示的第几个容器
    Tabs({barPosition:BarPosition.End,index:0}){

    //   第一个要显示的内容   TabContent放置页面显示的内容   tabBar放置显示的图片和文职
      TabContent(){
        Text('第一个页面')
      }
      .tabBar(this.bar(0,$r('app.media.home'),$r('app.media.homeActive'),'首页'))

      // 第二个要显示的内容
      TabContent(){
        Text('第二个页面')
      }
      .tabBar(this.bar(1,$r('app.media.my'),$r('app.media.myActive'),'我的'))

    }
    .onChange((index)=>{
    //   这个事件是我们需要的操作  index就是点击的下标
      console.log('index',index)

      this.cIndex = index
    })

  }
}
```

11.web组件,显示别的网络的网页

﻿[文档中心](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-basic-components-web-0000001477981205-V3)﻿

注意需要配置权限

必须在手机模拟器上观看 预览无法显示的

四:ArkTs语言声明变量

```ts
//TODO 数字
let number1:number = 65;
```

2.字符串

```ts
//TODO 字符串
let str:string = "只有双引号或者单引号包起来的都是叫字符串"
```

3.联合类型

```ts
//TODO 联合类型
// 意思就是他这个变量可以声明多个类型的
let objectType:string | number | boolean
objectType = true;
objectType = 6666;
objectType = "靓仔";
```

4.数组

            

```ts
//TODO 数组
// 定义里面全是字符串的数组
let arr:Array<string> = ['iii','csgo2','bbb'];
let arr2:string[] = ['iii','csgo2','bbb'];
```

5.枚举

            

```ts
//TODO 枚举
enum Boy {red,blue,yellow}

let color:Boy = Boy.red
```

6.元组

      `

```ts
//TODO 元组  数组里面每个类型要一一对应

let name:[number,string];
name = [22,"888"]
```

7.未知类型

           

```ts
//TODO 未知类型 unKnown 可以定义任何一种类型
let testType:unknown = 8;

testType = "我改成字符串"
```

8.无返回值类型

```ts
//TODO 无返回值类型  void
function  fn(params):void {}
```

9.空类型

        

```ts
//TODO 空类型   null
let box:null = null;
```

10.未定义类型

```ts
//TODO 未定义类型   undefined
let box1:undefined = undefined;
```

# 五:this访问的变量

this访问值的时候只会找内部声明的, 不写this的时候访问外部的变量

```ts
let message:string = "我是外部的变量"

@Entry
@Component
struct Index {

  // 内部定义的变量 不需要加let 等声明
  @State message: string = '我是内部的变量';
  controller: TextInputController = new TextInputController()
  build() {
    Row() {
      // 这里去访问内部的变量
      Text(this.message)
      // 这里回去访问外部的变量
      Text(message)
    }
    .height('100%')
  }
}
```

# 六:if来控制元素的显示和隐藏

```ts
@Entry
@Component
struct Index {
  // 定义一个布尔值来控制元素的显示和隐藏
  @State bol:boolean = true;
  controller: TextInputController = new TextInputController()
  build() {
    Row() {

     //  通过条件来判断显示和隐藏
     if(this.bol){
        Text("bol为true")
     }else {
       Text("bol为false")
     }

    //   一个点击事件去切换bol的值

      Button("切换").onClick(()=>{
        this.bol = !this.bol
      })
    }
    .height('100%')
  }
}
```

# 七:自定义组件规则的总结

```ts
必修使用@Component修饰 才能识别是一个组件
@Entry 修饰了应用执行的入口组件
在build的方法里面必须有一个 根容器  例如:Row Column 组件
注意就是自定义组件的build方法中,必修只能有一个  根组件(只有一个标签然后再包住别的标签)
```

1.内部自定的案例

        ·

```ts
@Entry
@Component
struct ItemComponent {
  build() {
    Row() {
      Column() {
        Text("菜谱选择").fontSize(50).fontWeight(FontWeight.Bold)

        //   直接引入下面的组件
        ItemActin();
        ItemActin({ value: "荷兰豆炒牛嗨定律来嘛" });
      }.width('100%')
    }.height("100%")
  }
}


//自定义组件  在内部中调用的

@Component
struct ItemActin {
  //   在自定义组件中的任何成员都是私有化的
  value: string = "辣椒炒牛肉" //默认的菜谱,当使用端不传递的时候就用默认的,有传递的时候就是用传递的

  @State isOk: boolean = false;

  build() {
    Row() {
      Image(this.isOk ? $r('app.media.todo_ok') : $r('app.media.todo_default'))
        .width(20)
        .height(20)
        .margin(16)

      Text(this.value)
        .decoration({ type: this.isOk ? TextDecorationType.LineThrough : TextDecorationType.None })
    }.backgroundColor('orange')
    .borderRadius(25)
    .margin({
      top: 20,
      left: 20,
      right: 20
    }).onClick(() => {
      this.isOk = !this.isOk
    })
  }
}
```

导入外部的操作

```ts
// 导出的方式
@Component
export  default  struct  TodoItem {
  build(){

  }
}

//在别的文件引入
import TodoItem from 'xxxxx文件路径'
```

# 八.@Builder装饰器的用法

```ts
@Entry
@Component
struct ItemComponent {
  //   在自定义组件中的任何成员都是私有化的
  value: string = "辣椒炒牛肉" //默认的菜谱,当使用端不传递的时候就用默认的,有传递的时候就是用传递的

  @State isOk: boolean = false;

  build() {
    Row() {
      Column() {
        Text("菜谱选择").fontSize(50).fontWeight(FontWeight.Bold)

        //   直接使用他
        ItemActin("荷兰豆炒瘦肉")
        ItemActin("番茄炒鸡蛋")
      }.width('100%')
    }.height("100%")
  }
}


//自定义组件  在内部中调用的
// value 加了 ?表示可写  可不写
@Builder function ItemActin(value: string) {

  Row() {
    Image(this.isOk ? $r('app.media.todo_ok') : $r('app.media.todo_default'))
      .width(20)
      .height(20)
      .margin(16)

    Text(value)
      .decoration({ type: this.isOk ? TextDecorationType.LineThrough : TextDecorationType.None })
  }.backgroundColor('orange')
  .borderRadius(25)
  .margin({
    top: 20,
    left: 20,
    right: 20
  }).onClick(() => {
    this.isOk = !this.isOk
  })

}
```

# 九.公共样式的抽离@styles

总结:不能传递参数 外部内部都有样式 优先使用内部的 (就近原则) 外部需要写function 内部不需要

```ts
@Entry
@Component
struct ItemComponent {

  // 内部的任何方法不需要 function

  // @Styles 内部通用的样式 进行抽离起来形成一个函数
  // 注意这个内部函数不能传递参数 不然会报错  同时只能存储大家都可以用的样式
  @Styles commonStyle(){
    // 点出来的属性都是通用的属性  不能点出来就不是
    .width(200)
    .height(200)
    .backgroundColor('red')
  }

  build() {
    Row() {
      Column() {
        // 通用的样式都是在后续直接加上这个函数
        Text("我是测试").commonStyle()
      }
    }
  }
}


// 外部的公共样式 需要加function  
@Styles function commonStyle() {

  .width(200)
  .height(200)
  .backgroundColor('blue')

}
```

# 十.@Extend装饰器：定义扩展组件样式

- 和@Styles不同，@Extend仅支持定义在全局，不支持在组件内部定义。

- 和@Styles不同，@Extend支持封装指定的组件的私有属性和私有事件和预定义相同组件的@Extend的方法。

@Extend可以传递参数 也可以传递函数进来

```ts
@Entry
@Component
struct Index {
  build() {
    Row() {

      // 使用我们的 fn()  可以传递参数的
      Text("参数参数").fn('blue', 33).thing(52, () => {
        console.log('666')
      })

      // 可以放置要执行的代码作为函数传递过去
      Text("点击").thing(52, () => {
        console.log('666')
      })

    }
    .height('100%')
  }
}
// 可以支持Text的私有化属性   fn是自定义的
@Extend(Text) function fn(value, size) {
  //   放置写的样式属性或者事件
  .fontColor(value)
  .fontSize(size)
}

// 也可以传递函数  然后通过点击事件传递过去   method是传递的函数
@Extend(Text) function thing(size, method) {
  .fontSize(size)
  .onClick(() => {
    // 调用这个函数

    method()
  })
}
```

# 十一.多态样式stateStyles

设置组件不同状态下的样式,例如点击,按下,无状态,禁用,获取焦点状态等等的样式情况

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCEb47bf6a6ae6c58838a9d22d456c83f52/433)

```ts
使用方式
@Entry
@Component
struct Index {
  @State message: string = 'Hello World'

  build() {
    Row() {
      Column() {
        Button(this.message).fontSize(50).fontColor('red').stateStyles({
          // 正常时候的样式情况
          normal:{
            .backgroundColor('blue')
          },
          //获取焦点的时候
          focused:{
            .backgroundColor("green")
          },
          //鼠标按下时候的颜色
          pressed:{ 
            .backgroundColor('red')
          }
        })
      }
      .width('100%')
    }
    .height('100%')
  }
}
```

# 十二.单向传递数据

@Prop 定义 单向数据通道 如果无法专递对象的形式 可以采用那个json字符串的形式传递

使用方式

```ts
@Entry
@Component
struct Index {
  @State message: string = '传给子组件的'

  build() {
    Row() {
      Column() {
        Button(this.message).onClick(()=>{
          this.message = this.message==='传给子组件的'? "我被修改了" :"传给子组件的"
        })

      //   子组件
        ItemIndex({value:this.message})
      }
      .width('100%')
    }
    .height('100%')
  }
}

//定义的组件
@Component
struct ItemIndex {
//   接收用户传递的值  用@Prop定义后  这个值 父亲那边修改   这边组件会自动变化的
//   如果是子组件去修改这个值,父亲组件不会受到影响
  @Prop value:string;

  build(){
    Button(this.value)
  }
}
```

# 十三:@Link装饰器：父子双向同步

父子组件都可以去修改这个值,修改的值还是同步的

但是有限定条件

@Link装饰器不能在@Entry装饰的自定义组件中使用。

            

```ts
@Entry
@Component
struct Index {
  @State message: string = '传给子组件的'

  build() {
    Row() {
      Column() {
        Button(this.message).onClick(()=>{
          this.message = this.message==='传给子组件的'? "我被修改了" :"传给子组件的"
        })

      //   子组件  注意传值的时候this.要改成$
        ItemIndex({value:$message})
      }
      .width('100%')
    }
    .height('100%')
  }
}


@Component
struct ItemIndex {

  @Link value:string;

  build(){
    Button(this.value).onClick(()=>{
      this.value = this.value==='传给子组件的'? "我被修改了" :"传给子组件的"
    })
  }
}
```

# 十四:@Provide装饰器和@Consume装饰器：与后代组件双向同步

简单的意思来说就是 正常写法 是 爷爷组件 传值给父亲组件 再传给孙子组件 这样一级级传递 但是这样的方式我们写法很麻烦 简单几层还好说 如果是比较多层传递和修改比较麻烦

可以使这两个装饰器来去操控 直接从爷爷组件传值到孙子组件, 这样省略了一步;

打个比方一样,就好比农民买水果得经过收购商,再到分销商,再到商店 再到顾客手里, 这样收费会贵很多

如果用了装饰器,农民直接发到顾客 这样便宜很多一样

写法

```ts
@Entry
@Component
struct Index {
  // 这个是跨级传递的变量 () 是别名的意思 要和@ 的别名一直即可      如果没写别名,那么变量名字要一样
  @Provide('provide_study') message: string = '爷爷传递给孙子的'


  build() {
    Row() {
      Column() {
        Button(this.message).onClick(()=>{
          this.message = this.message==='爷爷传递给孙子的'? "我被修改了" :"爷爷传递给孙子的"
        })


        fatherIndex()
      }
      .width('100%')
    }
    .height('100%')
  }
}


@Component
// 父亲组件
struct fatherIndex {

  build(){
    sunIndex()
  }
}

@Component
  // 孙子组件
struct sunIndex {
  // 接收爷爷传递的值
  @Consume('provide_study') beautiful:string;
  build(){
    Button('孙子:'+this.beautiful).onClick(()=>{
      this.beautiful = "我是孙子那边修改的"
    })
  }
}
```

# 十五:@Watch装饰器：状态变量更改通知

就是以前的watch,监听某个数据的变化进而执行某个函数

用法示例

注意事项:装饰器的顺序 建议@State、@Prop、@Link等装饰器在@Watch装饰器之前。

然后不能监听常量

不建议在执行的函数里面再次修监听的数据,因为这样容易陷入死循环

```ts
@Entry
@Component
struct Index {
  // 中间的小托号就是放置要执行的函数名字  后续是监听的变量情况
  @State @Watch('changeFn') count:number=6;

  // 当count值变化的时候  这个函数就会被执行的
  changeFn(){
    console.log("this.count",this.count)

  }


  build() {
    Row() {
      Column() {
        Button(`${this.count}`).onClick(()=>{
          this.count++;
        })
      }
      .width('100%')
    }
    .height('100%')
  }
}
```

# 十六:循环渲染ForEach的用法

其实和vue的for一样的作用

```ts
接口介绍
ForEach(
  arr: Array,       //要循环的值  类型都是数组
  itemGenerator: (item: any, index?: number) => void,   //要执行的函数情况  item表示数组里面的每个值  index表示数组的索引
  keyGenerator?: (item: any, index?: number) => string
  //生成函数 生成key作用来的  建议要写的
)
```

示例

```ts
@Entry
@Component
struct Index {

  @State arr:String[] = ['奥特曼','苍蝇头','老夫子',"疾风剑豪","疾风剑豪"];


  @State shopArr:object[] = [
    {
      id:1,
      name:"华为遥遥邻先",
      price:7999
    },
    {
      id:2,
      name:"小米14",
      price:2999
    },
    {
      id:3,
      name:"苹果15",
      price:19999
    }
  ]


  build() {
    Row() {
      Column() {

      //   根据arr进行循环渲染     第二个参数是要循环的组件结构
        ForEach(this.arr,(item,index)=>{
          Text(item+index)
        },(item)=>{  //生成函数  用自身作为key值
          return item
        })


        // 另外一种写法  用id 作为key值
        ForEach(this.shopArr,(item,index)=>{
          Text(item.name)
        },(item)=>{
          return item.id
        })


      }
      .width('100%')
    }
    .height('100%')
  }
}
```

# 十七:生命周期

## onPageShow

onPageShow?(): void

页面每次显示时触发一次，包括路由过程、应用进入前台等场景，仅@Entry装饰的自定义组件生效。

## onPageHide

onPageHide?(): void

页面每次隐藏时触发一次，包括路由过程、应用进入后台等场景，仅@Entry装饰的自定义组件生效。

## onBackPress

onBackPress?(): void

当用户点击返回按钮时触发，仅@Entry装饰的自定义组件生效。

```ts
@Entry
@Component
struct Index {

  build() {
    Row() {
      Column() {

        Text("生命周期")

      }
      .width('100%')
    }
    .height('100%')
  }

//   被@Entry 装饰的组件的生命周期
  // 页面每次显示的时候 被触发
  onPageShow(){
    console.log('页面每次进来就执行')
  }

  //页面每次隐藏的时候  被触发
  onPageHide(){
    console.log('页面隐藏的时候执行')
  }

  //当用户点击返回按钮时触发
  onBackPress(){
    console.log("当用户点击返回按钮时触发")
  }


}
```

# 十八:子组件的生命周期

aboutToAppear﻿﻿

aboutToAppear?(): void

aboutToAppear函数在创建自定义组件的新实例后，在执行其build()函数之前执行。允许在aboutToAppear函数中改变状态变量，更改将在后续执行build()函数中生效。

aboutToDisappear﻿﻿

aboutToDisappear?(): void

aboutToDisappear函数在自定义组件析构销毁之前执行。不允许在aboutToDisappear函数中改变状态变量，特别是@Link变量的修改可能会导致应用程序行为不稳定。

代码示例

```ts
@Entry
@Component
struct Index {

  @State bol:boolean = false;

  build() {
    Row() {
      Column() {

        Text("生命周期查看子组件的生命周期");

        Button("变化").onClick(()=>{
          this.bol = !this.bol;
        })
        // 通过变量的展示  渲染组件  观看生命周期情况
        if(this.bol){
          Test()
        }

      }
      .width('100%')
    }
    .height('100%')
  }


}


@Component
struct Test {
  build(){
    Text('我是子组件的')
  }
  // 在build函数之前执行,可以在里面修改变量
  aboutToAppear(){
    console.log("我在build之前执行")
  }

  // 不允许在aboutToDisappear函数中改变状态变量 例如 @Link
  aboutToDisappear(){
    console.log("组件析构销毁之前执行")
  }
}
```

# 十九:应用级变量的状态管理

类似全局变量 可以给多个页面方便 就类似之前的微信小程序的 globalData 不过这个在真机调试才可以显示取出的变量 不然显示undefined

﻿[文档中心](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/arkts-state-management-0000001504151156-V3)﻿

# 二十:网络请求

```ts
// 第一步配置权限问题 在module.json5  网络请求的权限
// "requestPermissions": [
// {
//   "name": "ohos.permission.INTERNET"
// }
// ]

// 第二部:导入http库

import  http from '@ohos.net.http'


@Entry
@Component
struct Index {


  aboutToAppear(){
    console.log("我执行了")
  //   第三步:获取http请求的对象
    let httpRequestObj = http.createHttp();

  //   第四步:  三个参数 第一个是路径  第二是个对象 包含 方法 请求头和参数等等
  //    第三个是回调函数 第一个参数是错误的信息 第二个是返回回来的值
    httpRequestObj.request('https://apis.netstart.cn/xpc/home/recommend',{
      method:http.RequestMethod.GET   //控制是GET还是POST
    //   
    },(erroeCode,data)=>{
      if(!erroeCode){
        console.log("请求成功")
        console.info('data',JSON.stringify(data,null,2))

      }else {
        console.log("请求失败")
      }
    })

  }


  build() {

   Row(){
   //   web组件

    Button('点击测试').onClick(()=>{

    })
   }

  }
}
```

如果要进行封装之类的 promise 可以按照这样的 格式去操作

```ts
let promise = httpRequest.request("EXAMPLE_URL", {
    method: http.RequestMethod.GET,
    connectTimeout: 60000,
    readTimeout: 60000,
    header: {
        'Content-Type': 'application/json'
    }
});
promise.then((data) => {
    console.info('Result:' + data.result);
    console.info('code:' + data.responseCode);
    console.info('header:' + JSON.stringify(data.header));
    console.info('cookies:' + data.cookies); // 8+
    console.info('header.Content-Type:' + data.header['Content-Type']);
    console.info('header.Status-Line:' + data.header['Status-Line']);
}).catch((err) => {
    console.info('error:' + JSON.stringify(err));
});
```

二十一:第三方库的使用

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCEef46949da7246f4c09c47a6abce5b046/611)

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCE34a5be9ebd84223537cdfb1a1691ea9d/613)

![](https://note.youdao.com/yws/public/resource/45615e67074781d8ed6e365fd4a8d895/xmlnote/WEBbe06a562b7c61b55073bc05abb92975e/WEBRESOURCE55b95447d0363da6bea44104ba0c166d/615)
