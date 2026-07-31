---
date created: '2026-05-六 20:54:30'
date modified: '2026-07-31'
tags:
  - 技术/全栈/elysia
  - 技术/全栈/nextjs
  - 技术/踩坑记录
title: Next + Elysia 踩坑记录
---

在next项目里面使用elysia，我在使用rpc 的时候，类型推断太慢了，好卡，不想用了。
全栈还不成熟，目前依旧只能搞前后端分离的全栈。

其中使用了monorepo，把数据库 使用dirzzle写的schema放在了packages/contract里面，后端引用这个包，属于源码软链接，没有打包。好像这个类型需要从shcema推断走，类型巨大，导致在前端使用类型时候，巨卡

放弃next 或者nuxt + elysia 吧， 特别是使用dirzzle 采用从数据库类型推断到server层的方式。

·
