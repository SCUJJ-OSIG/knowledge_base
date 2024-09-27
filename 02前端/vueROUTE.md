在Vue 3中，尤其是使用Composition API（包括`setup()`函数）时，路由跳转的方式略有变化，主要是因为直接访问`this.$router`不再可行。你需要通过`useRouter` composible来获取路由实例。以下是Vue 3中使用Composition API进行路由跳转的方式：

### 1. 使用`useRouter`获取路由实例

首先，你需要在`setup()`函数中导入并使用`useRouter`来获取路由实例。

```js
<script setup> 

import { useRouter } from 'vue-router; 

const router = useRouter(); 

</script>
```

### 2. 基本跳转

一旦有了路由实例，就可以使用它来进行各种跳转操作。

#### 推入新记录到历史堆栈

`router.push('/home');`

#### 替换当前历史记录

`router.replace('/home');`

#### 命名路由跳转

`router.push({ name: 'home' });`

#### 带参数的跳转

```js
router.push({ name: 'user', params: { userId: 1 } }); 

router.push({ path: `/user/${userId}` });
```

#### 带查询参数或哈希的跳转

```js
router.push({ path: '/search', query: { q: 'Vue 3' } });

 router.push({ path: '/home', hash: '#sectionB' });
```

### 3. 使用`useRoute`获取当前路由信息

有时在跳转前可能需要根据当前路由信息做判断，可以使用`useRoute`。

```js
import { useRoute } from 'vue-router'; 

const route = useRoute();
```

### 4. 组合式函数封装跳转逻辑

你还可以将跳转逻辑封装成可复用的组合式函数。

```js
<script setup> 

import { useRouter } from 'vue-router';

 const router = useRouter(); 

function goToHome() {   router.push('/home'); }

</script> 
```

<template>   <button @click="goToHome">去首页</button> </template>`

### 5. 在模板中使用事件处理进行跳转

尽管不直接涉及`setup()`，但在模板中触发跳转也是常见做法。

```js
<template>   

<button @click="router.push('/about')">关于</button> </template> 

<script setup> 

import { useRouter } from 'vue-router'; 

const router = useRouter(); </script>
```
