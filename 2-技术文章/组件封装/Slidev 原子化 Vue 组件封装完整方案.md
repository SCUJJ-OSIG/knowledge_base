---
date created: '2026-06-三 15:14:53'
date modified: '2026-07-31'
tags:
  - 技术/前端/vue
  - 技术/组件封装/slidv
  - 技术/前端/css
title: Slidev 原子化 Vue 组件封装完整方案
---

## 前言

Slidev 基于 Markdown + Vue 开发幻灯片，原生支持 Vue 组件、UnoCSS、主题变量，非常适合**原子化组件体系**搭建。本方案摒弃大而全的业务复合组件，遵循「最小颗粒、自由组合、无状态、适配幻灯片主题」原则，所有演示视图均通过基础原子组件拼接而成，兼顾复用性、演示美观度与开发效率，全程贴合Slidev原生能力，不引入额外第三方UI库。

---

## 一、Slidev 原子组件核心设计思想

### 1. 原子化最小颗粒原则（核心）

不开发任何一体化复合组件，只拆分**不可再分的单一视觉单元**，复杂演示效果全部依赖组件嵌套组合实现，彻底降低维护成本：

- **基础布局原子**：Flex、Grid、Box（仅负责布局、容器包裹，无任何内容逻辑）
    
- **文本内容原子**：Text、CodeBlock、Divider（仅负责文字、代码、分割线展示）
    
- **基础视觉原子**：Img、Icon、Badge（仅负责图标、图片、标签展示）
    
- **交互原子**：Button（仅负责点击交互，无内置弹窗/路由等复杂逻辑）
    
- **轻度复合原子**：Card（仅整合布局+容器，依旧支持自由嵌套所有原子）
    

**禁止设计**：弹窗卡片+按钮+说明文本一体化组件；**推荐写法**：`<Card><Flex><Badge/><Button/></Flex></Card>`自由拼接

### 2. Slidev 场景专属强制约束

1. **主题自适应**：全部使用Slidev内置CSS主题变量，绝不写死黑白固定色值，一键切换明暗主题无需改组件代码
    
2. **缩放适配**：统一使用rem/em相对单位，完美适配投影大屏、笔记本、小尺寸显示器三种演示场景
    
3. **Markdown兼容**：组件可直接内嵌在Slidev vue代码块中，和原生markdown语法无缝混用
    
4. **极致轻量化**：仅依赖Vue3内置API+Slidev自带UnoCSS，零额外UI库依赖，不增加幻灯片打包体积
    
5. **样式隔离**：所有组件开启scoped，避免组件样式污染全局幻灯片页面
    
6. **无状态优先**：90%原子组件为纯展示组件，不维护内部响应式状态，状态统一交由幻灯片页面管理
    

### 3. 原子组件封装四大通用原则

1. **属性透传最大化**：全部容器组件开启$attrs透传，原生class、style、鼠标事件无需重复声明props
    
2. **单向无状态设计**：纯展示组件零内部状态；交互组件仅抛出click等原生事件，不封装业务逻辑
    
3. **插槽分层设计**：基础布局组件仅保留默认插槽；卡片等轻度复合组件补充header/footer具名插槽
    
4. **Props极简设计**：仅保留高频开关类props，尺寸、颜色、间距全部交给UnoCSS class控制，减少冗余配置
    

---

## 二、Slidev原子组件封装标准化技巧（可直接复用）

### 1. 所有原子组件统一基础模板（标准骨架）

以最常用的容器原子 **AtomBox.vue** 为例，全项目原子组件统一该结构，保证开发规范一致：

```vue
<template>
  <div
    :class="[
      'atom-box',
      // 合并外部UnoCSS样式类
      $attrs.class,
      // props内置样式开关
      {
        'atom-box-bordered': bordered,
        'atom-box-shadow': shadow
      }
    ]"
    // 透传所有原生属性、事件、行内样式
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
// 关闭自动属性继承，避免根节点挂载多余属性，样式互不干扰
defineOptions({
  inheritAttrs: false
})

// 仅保留高频刚需props，其余样式全部交给外部UnoCSS
const props = withDefaults(defineProps<{
  bordered?: boolean
  shadow?: boolean
  padding?: string
}>(), {
  bordered: false,
  shadow: false,
  padding: '1rem'
})
</script>

<style scoped>
.atom-box {
  /* 直接复用Slidev全局主题变量，自动适配明暗模式 */
  background: var(--slidev-slide-bg);
  color: var(--slidev-text);
  border-radius: 0.5rem;
  padding: v-bind(props.padding);
  transition: all 0.2s ease;
}
.atom-box-bordered {
  border: 1px solid var(--slidev-border);
}
.atom-box-shadow {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
</style>
```

### 2. Props设计红线（原子组件千万不要做的事）

#### ❌ 禁止操作

- 不新增大量color、width、height、margin等样式props，Slidev UnoCSS一行class即可实现，冗余且不灵活
    
- 不接收接口请求参数、列表数据、业务枚举等业务数据，原子只做视图，数据逻辑放在幻灯片页面
    
- 不内置动画、页面跳转、弹窗等复杂逻辑，保证原子单一职责
    

#### ✅ 仅允许保留的props

- 开关类：bordered、shadow、disabled、rounded
    
- 布局快捷类：padding、gap、align
    
- 语义类型类：按钮/标签的type（primary/success/danger）
    

### 3. $attrs透传核心用法（组合式组件必备）

所有布局原子（Flex/Grid/Box/Card）强制开启透传，解决二次封装属性重复定义痛点：

1. `inheritAttrs: false`：关闭Vue默认根节点自动继承，防止多余属性污染DOM
    
2. 手动合并外部class：保证**外部UnoCSS样式优先级高于组件内置样式**，覆盖更灵活
    
3. 原生事件透传：@click、@mouseenter等事件无需手动emit，直接透传到根节点
    

原子组合示例：

```vue
<AtomFlex gap="2rem" class="justify-center items-center flex-wrap">
  <AtomBox bordered shadow class="w-48 h-32 bg-teal-5 dark:bg-teal-900/20">
    <AtomText type="primary">模块A</AtomText>
  </AtomBox>
  <AtomBox bordered shadow class="w-48 h-32 bg-orange-5 dark:bg-orange-900/20">
    <AtomText type="danger">模块B</AtomText>
  </AtomBox>
</AtomFlex>
```

### 4. 交互原子统一事件规范（Button专属）

纯展示原子无任何事件；仅按钮类交互原子抛出原生点击事件，不封装额外逻辑：

```ts
const emit = defineEmits(['click'])
const handleClick = (e: MouseEvent) => emit('click', e)
```

幻灯片页面直接使用，兼容Slidev原生翻页API：

```vue
<AtomBtn type="primary" @click="$slidev.nav.next()">下一页</AtomBtn>
```

### 5. 插槽分层规范（适配自由组合场景）

1. **布局原子（Flex/Grid/Box）**：仅保留默认插槽，支持无限嵌套任意子原子
    
2. **轻度复合原子（Card）**：默认插槽+header/footer具名插槽，可按需隐藏头尾，依旧支持全原子嵌套
    

AtomCard卡片组件精简源码：

```vue
<template>
  <AtomBox :bordered="bordered" :shadow="shadow" v-bind="$attrs">
    <div v-if="$slots.header" class="card-header pb-3 border-b border-[var(--slidev-border)]">
      <slot name="header" />
    </div>
    <div class="card-body py-3">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer pt-3 border-t border-[var(--slidev-border)]">
      <slot name="footer" />
    </div>
  </AtomBox>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  bordered?: boolean
  shadow?: boolean
}>(), {
  bordered: true,
  shadow: true
})
</script>
```

### 6. Slidev专属主题样式适配要点

#### 全局可用Slidev原生CSS变量（直接复制使用）

```css
/* 文本色系 */
--slidev-text: #333;
--slidev-text-light: #666;
--slidev-text-muted: #999;
/* 主题主色 */
--slidev-theme-primary: #5d93ff;
/* 背景与边框 */
--slidev-slide-bg: #ffffff;
--slidev-border: #e5e7eb;
/* 暗黑模式自动切换，无需手动处理 */
```

#### 样式强制规范

- 禁止写死#fff/#000固定色值，暗黑模式下会直接显示异常
    
- 修改组件内部子元素必须使用`:deep()`深度选择器，不污染全局幻灯片
    
- 布局、颜色、间距优先用UnoCSS，组件内部css只写固定过渡、结构样式
    
- 全局统一rem单位，适配幻灯片缩放演示
    

### 7. 无状态设计核心优势

所有基础原子**零内部响应式状态**：

- AtomText/AtomBox/AtomFlex：纯DOM展示，无ref/reactive
    
- 页面交互状态、显隐控制、动态文本全部托管在slide幻灯片页面
    

优势：组件可随意拖拽、调换顺序、嵌套拆分，不会出现内部状态错乱，完美适配幻灯片灵活排版的需求

### 8. Slidev全局自动注册（无需页面手动导入）

在项目 `setup/main.ts` 批量全局注册原子组件，所有markdown幻灯片页面可直接使用标签，无需import：

```ts
import type { App } from 'vue'
// 批量引入所有原子组件
import AtomBox from '../components/atoms/AtomBox.vue'
import AtomFlex from '../components/atoms/AtomFlex.vue'
import AtomText from '../components/atoms/AtomText.vue'
import AtomBtn from '../components/atoms/AtomBtn.vue'
import AtomCard from '../components/atoms/AtomCard.vue'
import AtomBadge from '../components/atoms/AtomBadge.vue'
import AtomDivider from '../components/atoms/AtomDivider.vue'

export default function setup(app: App) {
  const atomComponents = {
    AtomBox, AtomFlex, AtomText, AtomBtn, AtomCard, AtomBadge, AtomDivider
  }
  // 全局批量注册
  Object.entries(atomComponents).forEach(([name, component]) => {
    app.component(name, component)
  })
}
```

### 9. 核心答疑：有$attrs属性透传后，组件到底该管什么？（解决你的核心困惑）

**你的核心疑问复盘**：既然所有DOM原生属性、样式、宽高、边距都可以通过$attrs透传 + UnoCSS class直接控制，那原子组件还需要定义props吗？原生div上千个属性，我们到底哪些该管、哪些完全不用管？

#### ✅ 核心结论（一句话定边界）

**所有「视觉样式、布局尺寸、原生DOM属性」一律不管，全部交给外部透传+UnoCSS**； **组件只管：自带业务形态开关、内置交互逻辑、组件独有的语义配置**。

#### 一、完全不用管（100%交给$attrs + class，组件禁止写对应props）

以下所有属性，和普通原生div一模一样，直接透传即可，组件**一行props都不要写**：

- **尺寸类**：width / height / min-width / max-height 所有宽高
    
- **间距类**：margin / padding / gap（全部用UnoCSS p-4 m-2替代）
    
- **颜色类**：color / background / border-color / shadow 所有色系
    
- **布局类**：flex相关、align、justify、定位top/left
    
- **原生DOM事件**：@click / @mouseover / @mouseleave 全部原生鼠标事件
    
- **原生DOM属性**：title / id / data-* / aria-* 无障碍属性
    
- **字体样式**：font-size / font-weight / line-height
    

**原因**：这些都是纯表现层样式，Slidev自带UnoCSS可以一秒覆盖，组件写props属于多余冗余，改样式还要改组件源码，违背原子化自由组合初衷。

#### 二、必须组件内部接管（必须写props，不能丢给外部class）

这类配置是**组件独有的固定形态开关**，不属于通用div样式，不能用class随意覆盖，必须内置props统一管控：

1. **容器形态开关（Box/Card专属）**：bordered 是否自带边框、shadow 是否自带阴影 👉 属于组件默认标配形态，不是临时样式，全局卡片统一开启/关闭，不需要每次页面都写 border 类名
    
2. **交互状态开关（Button/输入类专属）**：disabled 禁用状态 👉 禁用是行为逻辑，不是样式，UnoCSS无法精准控制组件内部交互禁用，必须props接管
    
3. **组件语义类型（Button/Badge专属）**：type 主题类型 primary / success / danger 👉 绑定Slidev全局主题色，统一项目视觉规范，禁止页面随意写死颜色
    
4. **组件内置固定默认值**：组件兜底padding、默认圆角 👉 给组件开箱即用的默认外观，页面不写任何class也能正常展示，不用空白无样式
    

#### 三、直观对比：原子组件props边界示例（AtomBox）

```ts

// ✅ 正确：只保留组件独有形态开关
const props = withDefaults(defineProps<{
  bordered?: boolean // 组件专属：是否自带边框
  shadow?: boolean   // 组件专属：是否自带阴影
}>(), {
  bordered: false,
  shadow: false
})

// ❌ 错误：绝对不要写下面这些props，全部交给$attrs和class
// width?: string
// height?: string
// padding?: string
// margin?: string
// bgColor?: string
```

#### 四、最终使用体感（彻底贴合你的疑惑）

1. 用户想要改大小、边距、颜色、定位 → 直接加class，不用改组件、不用传props
    
2. 用户想要开启组件自带阴影/边框、禁用按钮、切换主题色 → 传内置props统一控制
    
3. 所有原生div能支持的属性、事件 → 全部自动透传，开箱即用
    

#### 五、终极准则（以后封装直接照着判断）

- ✅ **能用class一键修改的 = 全部不写props**
    
- ✅ **关乎组件基础形态、交互行为、全局规范的 = 必须写props**
    
- ✅ **所有原生div属性 = 全部交给$attrs透传，组件永远不用接管**
    

---

## 三、Slidev原子组件标准目录结构

遵循原子-分子-有机体三层架构，结构清晰，适配幻灯片项目迭代：

```plaintext
./slidev-project
├── components/
│   ├── atoms/          # 第一层：最小原子组件（核心，无状态、纯视图）
│   │   ├── AtomBox.vue        # 容器盒子
│   │   ├── AtomFlex.vue       # 弹性布局
│   │   ├── AtomGrid.vue       # 网格布局
│   │   ├── AtomText.vue       # 文本
│   │   ├── AtomBadge.vue      # 角标标签
│   │   ├── AtomBtn.vue        # 按钮
│   │   ├── AtomIcon.vue       # 图标
│   │   ├── AtomDivider.vue    # 分割线
│   │   └── AtomImg.vue        # 图片
│   ├── molecules/      # 第二层：分子组件（高频原子固定组合，可选）
│   │   ├── InfoCard.vue       # 信息卡片（Box+Text+Badge固定组合）
│   │   └── ActionGroup.vue    # 按钮操作组
│   └── organisms/     # 第三层：有机体组件（幻灯片整块内容模块）
│       └── ComparePanel.vue   # 左右对比面板
├── setup/
│   └── main.ts         # 全局组件注册入口
└── slides/             # 幻灯片页面：只做组件组合，不写基础样式与布局
```

---

## 四、实战演示：幻灯片页面完整组合案例

### 演示效果：左右双卡片方案对比页

```md
---
layout: default
title: 原子组件组合实战演示
---

# 原子化组件自由组合演示

<AtomFlex gap="4rem" class="justify-center items-center mt-12 flex-wrap">
  <!-- 左侧推荐方案卡片 -->
  <AtomCard bordered shadow class="w-96">
    <template #header>
      <AtomFlex justify-between items-center>
        <AtomText font-bold class="text-xl">方案A：轻量化架构</AtomText>
        <AtomBadge type="success">推荐</AtomBadge>
      </AtomFlex>
    </template>
    <AtomText class="text-[var(--slidev-text-light)] leading-relaxed">
      体积更小、上手简单、维护成本低，适合小型演示项目、快速落地场景
    </AtomText>
    <template #footer>
      <AtomFlex justify-end>
        <AtomBtn type="primary" @click="$slidev.nav.next()">查看详情</AtomBtn>
      </AtomFlex>
    </template>
  </AtomCard>

  <!-- 右侧备选方案卡片 -->
  <AtomCard bordered shadow class="w-96">
    <template #header>
      <AtomFlex justify-between items-center>
        <AtomText font-bold class="text-xl">方案B：完整架构</AtomText>
        <AtomBadge type="default">备选</AtomBadge>
      </AtomFlex>
    </template>
    <AtomText class="text-[var(--slidev-text-light)] leading-relaxed">
      功能完备、扩展性强、支持复杂交互，适合大型幻灯片、系列化演示文稿
    </AtomText>
    <template #footer>
      <AtomFlex justify-end>
        <AtomBtn type="default">查看详情</AtomBtn>
      </AtomFlex>
    </template>
  </AtomCard>
</AtomFlex>
```

### 该写法核心优势

1. 无需修改任何组件源码，增减样式直接加UnoCSS class
    
2. 删除、调换、拆分任意模块都不会报错，组件完全解耦
    
3. 明暗模式一键切换，所有组件自动适配主题色
    
4. 代码语义清晰，一眼看懂页面布局结构
    

---

## 五、Slidev原子组件封装完整避坑清单（补充完整版）

1. **禁止原子内部写死宽高、颜色、边距**：所有固定样式会导致主题切换、页面缩放时样式崩坏，统一交给UnoCSS和主题变量
    
2. **禁止多根节点组件**：所有原子组件必须保证单根DOM节点，否则$attrs透传、样式绑定全部失效
    
3. **不要滥用具名插槽**：布局类原子只保留默认插槽，只有卡片、弹窗这类复合容器才增加头尾插槽，避免过度设计
    
4. **禁止组件内部维护页面状态**：比如页面显隐、动态文本，状态全部放在幻灯片页面，原子保持纯展示
    
5. **scoped样式必须开启**：幻灯片页面全局样式极易冲突，所有组件强制开启scoped，修改内部元素使用:deep()
    
6. **避免组件内置动画时长**：统一使用UnoCSS内置动画类，全局动画时长保持统一，演示视觉更统一
    
7. **暗黑模式务必兼容**：不要只适配亮色模式，搭配dark:前缀UnoCSS类，一键切换无视觉bug
    
8. **不封装Slidev原生能力**：页面翻页、目录、演讲者模式等原生API直接在页面调用，不要封装进组件内部
    

---

## 六、落地建议与迭代规范

1. **第一阶段**：先完成atoms层所有基础原子开发，保证布局、文本、按钮基础能力可用
    
2. **第二阶段**：提炼页面高频组合，抽少量molecules分子组件，减少页面重复代码
    
3. **第三阶段**：针对固定幻灯片模块，开发少量organisms有机体组件，提升页面开发速度
    
4. **永远遵循**：能组合就不新增组件，能用class控制就不加props，保持组件极简
